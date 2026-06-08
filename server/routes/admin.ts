import crypto from "crypto";
import { Router } from "express";
import { loadStore, saveStore } from "../services/storageService";
import type { Campaign, CampaignParticipant, StoreData, UserAccount } from "../types/models";

const router = Router();

const HASH_ALGORITHM = "sha512";
const HASH_ITERATIONS = 120000;
const HASH_KEYLEN = 64;

function createSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password: string, salt: string): string {
  const hash = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_ALGORITHM);
  return `${salt}$${hash.toString("hex")}`;
}

function sanitizeAdminUser(user: UserAccount) {
  return {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    friendCode: user.friendCode,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

const isDevAdminEnabled = () =>
  process.env.BTCM_DEV_ADMIN === "true" || process.env.NODE_ENV !== "production";

router.use((_req, res, next) => {
  if (!isDevAdminEnabled()) {
    res.status(404).json({ error: "Dev admin routes are disabled." });
    return;
  }
  next();
});

function acceptedParticipantsForCampaign(
  store: StoreData,
  campaign: Campaign,
): CampaignParticipant[] {
  const participants = store.campaignParticipants.filter(
    (participant) =>
      participant.campaignId === campaign.id &&
      ["Accepted", "Owner", "Joined"].includes(String(participant.status)),
  );

  const hasOwner = participants.some((participant) => participant.userId === campaign.ownerId);
  if (!hasOwner) {
    const ownerParticipant = store.campaignParticipants.find(
      (participant) =>
        participant.campaignId === campaign.id && participant.userId === campaign.ownerId,
    );
    if (ownerParticipant) {
      participants.unshift(ownerParticipant);
    }
  }

  return participants.length > 0
    ? participants
    : [
        {
          id: `dev-owner-${campaign.id}`,
          campaignId: campaign.id,
          userId: campaign.ownerId,
          role: "Owner",
          status: "Accepted",
          invitedById: campaign.ownerId,
          invitedAt: new Date().toISOString(),
          joinedAt: new Date().toISOString(),
        },
      ];
}

function equalControlForCampaign(store: StoreData, campaign: Campaign) {
  const participants = acceptedParticipantsForCampaign(store, campaign);
  const playerIds = participants.map((participant) => participant.userId);
  const share = playerIds.length > 0 ? 100 / playerIds.length : 100;
  return playerIds.map((userId) => ({
    userId,
    percentage: Number(share.toFixed(4)),
  }));
}

function resetCampaignProgress(store: StoreData, campaignId: string) {
  const campaign = store.campaigns.find((entry) => entry.id === campaignId);
  if (!campaign) {
    throw new Error("Campaign not found.");
  }

  const now = new Date().toISOString();
  const participants = acceptedParticipantsForCampaign(store, campaign);
  const defaultControl = equalControlForCampaign(store, campaign);
  const campaignForces = store.forces.filter(
    (force) => force.campaignId === campaignId && force.origin === "CampaignCopy",
  );
  const campaignForceIds = new Set(campaignForces.map((force) => force.id));
  const oldCampaignUnitIds = new Set(
    store.forceUnits
      .filter((forceUnit) => campaignForceIds.has(forceUnit.forceId))
      .map((forceUnit) => forceUnit.id),
  );
  const oldDamageIds = new Set(
    (store.unitDamage ?? [])
      .filter((damage) => oldCampaignUnitIds.has(damage.forceUnitId))
      .map((damage) => damage.id),
  );

  // Remove all mutable campaign state. Campaign forces themselves retain their IDs so
  // participant.forceId references remain stable, but their rosters are rebuilt below.
  store.battles = store.battles.filter((battle) => battle.campaignId !== campaignId);
  store.notifications = (store.notifications ?? []).filter(
    (note) => note.payload?.campaignId !== campaignId,
  );
  store.resourceTransactions = store.resourceTransactions.filter(
    (transaction) => transaction.campaignId !== campaignId,
  );
  store.resourceAccounts = store.resourceAccounts.filter(
    (account) => account.campaignId !== campaignId,
  );
  store.pilots = (store.pilots ?? []).filter(
    (pilot) => pilot.campaignId !== campaignId && !campaignForceIds.has(pilot.forceId ?? ""),
  );
  store.forceUnits = store.forceUnits.filter(
    (forceUnit) => !campaignForceIds.has(forceUnit.forceId),
  );
  store.unitDamage = (store.unitDamage ?? []).filter(
    (damage) => damage.campaignId !== campaignId && !oldCampaignUnitIds.has(damage.forceUnitId),
  );
  store.unitLocationDamage = (store.unitLocationDamage ?? []).filter(
    (damage) =>
      !oldCampaignUnitIds.has(damage.forceUnitId) && !oldDamageIds.has(damage.unitDamageId),
  );
  store.unitEquipmentDamage = (store.unitEquipmentDamage ?? []).filter(
    (damage) =>
      !oldCampaignUnitIds.has(damage.forceUnitId) && !oldDamageIds.has(damage.unitDamageId),
  );
  store.unitAmmoState = (store.unitAmmoState ?? []).filter(
    (ammo) => !oldCampaignUnitIds.has(ammo.forceUnitId),
  );
  store.repairOrders = (store.repairOrders ?? []).filter(
    (order) =>
      order.campaignId !== campaignId &&
      !oldCampaignUnitIds.has(order.forceUnitId) &&
      !oldDamageIds.has(order.unitDamageId),
  );

  // Rebuild each campaign-copy force from its untouched source force.
  for (const campaignForce of campaignForces) {
    const original = campaignForce.originalForceId
      ? store.forces.find((force) => force.id === campaignForce.originalForceId)
      : undefined;
    if (!original) {
      throw new Error(
        `Cannot reset ${campaignForce.name}: original force ${campaignForce.originalForceId ?? "is missing"}.`,
      );
    }

    const originalUnits = store.forceUnits
      .filter((unit) => unit.forceId === original.id)
      .sort(
        (a, b) =>
          (a.teamNumber ?? 1) - (b.teamNumber ?? 1) ||
          (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      );

    const rebuiltUnits = originalUnits.map((originalUnit, index) => {
      const newUnitId = crypto.randomUUID();
      const sourcePilot = (store.pilots ?? []).find(
        (pilot) =>
          pilot.id === originalUnit.assignedPilotId ||
          pilot.assignedUnitId === originalUnit.id,
      );
      const assignedPilotId = sourcePilot ? crypto.randomUUID() : undefined;

      if (sourcePilot && assignedPilotId) {
        store.pilots ??= [];
        store.pilots.push({
          ...sourcePilot,
          id: assignedPilotId,
          ownerId: campaignForce.ownerId,
          campaignId,
          forceId: campaignForce.id,
          assignedUnitId: newUnitId,
          status: "Assigned",
          wounds: 0,
          kills: 0,
          experience: 0,
          isAlive: true,
          isCaptured: false,
          createdAt: now,
          updatedAt: now,
        });
      }

      return {
        ...originalUnit,
        id: newUnitId,
        forceId: campaignForce.id,
        assignedPilotId,
        currentBV: Number(originalUnit.snapshot?.totalBV ?? originalUnit.currentBV ?? 0),
        status: "Available" as const,
        kills: 0,
        damageDescription: undefined,
        isDestroyed: false,
        teamNumber: originalUnit.teamNumber ?? 1,
        sortOrder: originalUnit.sortOrder ?? index,
        pilot: undefined,
        currentDamage: undefined,
        damageOverlay: undefined,
      };
    });

    store.forceUnits.push(...rebuiltUnits);
    campaignForce.unitIds = rebuiltUnits.map((unit) => unit.baseUnitId);
    campaignForce.totalBV = rebuiltUnits.reduce(
      (total, unit) => total + Number(unit.snapshot?.totalBV ?? unit.currentBV ?? 0),
      0,
    );
    campaignForce.startingBV = campaignForce.totalBV;
    campaignForce.status = "Assigned";
    campaignForce.updatedAt = now;
  }

  // Restore campaign resources for every accepted participant.
  const startingResources = campaign.settings.startingResources ?? {};
  for (const participant of participants) {
    store.resourceAccounts.push({
      id: crypto.randomUUID(),
      campaignId,
      userId: participant.userId,
      balances: { ...startingResources },
      lastUpdatedAt: now,
    });
    participant.currentTurn = 1;
  }

  campaign.turnNumber = 1;
  campaign.updatedAt = now;
  if (campaign.status === "Active") campaign.startDate = now;
  campaign.planetaryControl = defaultControl;
  campaign.settings = {
    ...campaign.settings,
    currentTurn: 1,
    planetaryControl: defaultControl,
    objectives: campaign.settings.objectives?.map((objective) => ({
      ...objective,
      currentControl: defaultControl,
    })),
  };

  store.objectives = store.objectives.map((objective) =>
    objective.campaignId === campaignId
      ? {
          ...objective,
          currentOwnerId: undefined,
          currentControl: defaultControl,
          updatedAt: now,
        }
      : objective,
  );

  return campaign;
}

function auditCampaignState(store: StoreData, campaignId: string) {
  const campaign = store.campaigns.find((entry) => entry.id === campaignId);
  if (!campaign) throw new Error("Campaign not found.");

  const forces = store.forces.filter((force) => force.campaignId === campaignId);
  const forceIds = new Set(forces.map((force) => force.id));
  const units = store.forceUnits.filter((unit) => forceIds.has(unit.forceId));
  const unitIds = new Set(units.map((unit) => unit.id));
  const pilots = (store.pilots ?? []).filter(
    (pilot) => pilot.campaignId === campaignId || forceIds.has(pilot.forceId ?? ""),
  );
  const damages = (store.unitDamage ?? []).filter(
    (damage) => damage.campaignId === campaignId || unitIds.has(damage.forceUnitId),
  );
  const damageIds = new Set(damages.map((damage) => damage.id));
  const orders = (store.repairOrders ?? []).filter(
    (order) => order.campaignId === campaignId || unitIds.has(order.forceUnitId),
  );

  const issues: string[] = [];
  for (const participant of store.campaignParticipants.filter((p) => p.campaignId === campaignId)) {
    if (participant.forceId && !forceIds.has(participant.forceId)) {
      issues.push(`Participant ${participant.userId} references missing force ${participant.forceId}.`);
    }
  }
  for (const unit of units) {
    if (unit.assignedPilotId && !(store.pilots ?? []).some((pilot) => pilot.id === unit.assignedPilotId)) {
      issues.push(`Unit ${unit.id} references missing pilot ${unit.assignedPilotId}.`);
    }
  }
  for (const pilot of pilots) {
    if (pilot.assignedUnitId && !unitIds.has(pilot.assignedUnitId)) {
      issues.push(`Pilot ${pilot.id} references missing campaign unit ${pilot.assignedUnitId}.`);
    }
  }
  for (const damage of damages) {
    if (!unitIds.has(damage.forceUnitId)) {
      issues.push(`Damage ${damage.id} references missing unit ${damage.forceUnitId}.`);
    }
  }
  for (const row of store.unitLocationDamage ?? []) {
    if (damageIds.has(row.unitDamageId) && !unitIds.has(row.forceUnitId)) {
      issues.push(`Location damage ${row.id} references missing unit ${row.forceUnitId}.`);
    }
  }
  for (const order of orders) {
    if (!unitIds.has(order.forceUnitId)) {
      issues.push(`Repair order ${order.id} references missing unit ${order.forceUnitId}.`);
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    counts: {
      forces: forces.length,
      units: units.length,
      pilots: pilots.length,
      damageRecords: damages.length,
      repairOrders: orders.length,
      battles: store.battles.filter((battle) => battle.campaignId === campaignId).length,
      resourceAccounts: store.resourceAccounts.filter((account) => account.campaignId === campaignId).length,
      resourceTransactions: store.resourceTransactions.filter((tx) => tx.campaignId === campaignId).length,
    },
  };
}

function deleteCampaignCascade(store: StoreData, campaignId: string) {
  const campaign = store.campaigns.find((entry) => entry.id === campaignId);
  if (!campaign) {
    throw new Error("Campaign not found.");
  }

  const campaignForceIds = new Set(
    store.forces
      .filter((force) => force.campaignId === campaignId)
      .map((force) => force.id),
  );

  store.campaigns = store.campaigns.filter((entry) => entry.id !== campaignId);
  store.campaignParticipants = store.campaignParticipants.filter(
    (participant) => participant.campaignId !== campaignId,
  );
  store.battles = store.battles.filter((battle) => battle.campaignId !== campaignId);
  store.objectives = store.objectives.filter((objective) => objective.campaignId !== campaignId);
  store.resourceAccounts = store.resourceAccounts.filter(
    (account) => account.campaignId !== campaignId,
  );
  store.resourceTransactions = store.resourceTransactions.filter(
    (transaction) => transaction.campaignId !== campaignId,
  );
  store.forces = store.forces.filter((force) => force.campaignId !== campaignId);
  store.forceUnits = store.forceUnits.filter(
    (forceUnit) => !campaignForceIds.has(forceUnit.forceId),
  );
  store.notifications = store.notifications?.filter(
    (note) => note.payload?.campaignId !== campaignId,
  );

  return campaign;
}

router.get("/overview", async (_req, res) => {
  const store = await loadStore();
  res.json({
    users: store.users.map(sanitizeAdminUser),
    campaigns: store.campaigns,
    battles: store.battles,
    forces: store.forces.map((force) => ({
      ...force,
      forceUnits: store.forceUnits.filter((forceUnit) => forceUnit.forceId === force.id),
    })),
  });
});

router.post("/campaigns/:campaignId/reset", async (req, res) => {
  try {
    const store = await loadStore();
    const campaign = resetCampaignProgress(store, req.params.campaignId);
    await saveStore(store);
    res.json({ ok: true, campaign });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error ? error.message : "Unable to reset campaign.",
    });
  }
});

router.get("/campaigns/:campaignId/audit", async (req, res) => {
  try {
    const store = await loadStore();
    res.json(auditCampaignState(store, req.params.campaignId));
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error ? error.message : "Unable to audit campaign.",
    });
  }
});

router.delete("/campaigns/:campaignId", async (req, res) => {
  try {
    const store = await loadStore();
    const campaign = deleteCampaignCascade(store, req.params.campaignId);
    await saveStore(store);
    res.json({ ok: true, campaignId: campaign.id });
  } catch (error) {
    res.status(404).json({
      error: error instanceof Error ? error.message : "Unable to delete campaign.",
    });
  }
});

router.delete("/battles/:battleId", async (req, res) => {
  try {
    const store = await loadStore();
    const battle = store.battles.find((entry) => entry.id === req.params.battleId);
    if (!battle) {
      res.status(404).json({ error: "Battle not found." });
      return;
    }

    store.battles = store.battles.filter((entry) => entry.id !== req.params.battleId);
    store.notifications = store.notifications?.filter(
      (note) => note.payload?.battleId !== req.params.battleId,
    );
    await saveStore(store);
    res.json({ ok: true, battleId: battle.id });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to delete battle.",
    });
  }
});

router.delete("/forces/:forceId", async (req, res) => {
  try {
    const store = await loadStore();
    const force = store.forces.find((entry) => entry.id === req.params.forceId);
    if (!force) {
      res.status(404).json({ error: "Force not found." });
      return;
    }

    store.forces = store.forces.filter((entry) => entry.id !== req.params.forceId);
    store.forceUnits = store.forceUnits.filter((entry) => entry.forceId !== req.params.forceId);
    store.campaignParticipants = store.campaignParticipants.map((participant) =>
      participant.forceId === req.params.forceId
        ? { ...participant, forceId: undefined }
        : participant,
    );
    await saveStore(store);
    res.json({ ok: true, forceId: force.id });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to delete force.",
    });
  }
});

router.post("/users/:userId/reset-password", async (req, res) => {
  try {
    const password = String(req.body?.password ?? "");
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters." });
      return;
    }

    const store = await loadStore();
    const user = store.users.find((entry) => entry.id === req.params.userId);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    user.passwordHash = hashPassword(password, createSalt());
    user.updatedAt = new Date().toISOString();
    store.authTokens = store.authTokens.filter((token) => token.userId !== user.id);
    await saveStore(store);
    res.json({ ok: true, user: sanitizeAdminUser(user) });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to reset password.",
    });
  }
});

export default router;
