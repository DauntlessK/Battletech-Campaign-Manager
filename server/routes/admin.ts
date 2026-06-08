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

  const defaultControl = equalControlForCampaign(store, campaign);

  store.battles = store.battles.filter((battle) => battle.campaignId !== campaignId);
  store.notifications = store.notifications?.filter(
    (note) => note.payload?.campaignId !== campaignId && note.payload?.battleId == null,
  );

  campaign.turnNumber = 1;
  campaign.updatedAt = new Date().toISOString();
  campaign.planetaryControl = defaultControl;
  campaign.settings = {
    ...campaign.settings,
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
          updatedAt: new Date().toISOString(),
        }
      : objective,
  );

  const campaignForceIds = new Set(
    store.forces
      .filter((force) => force.campaignId === campaignId && force.origin === "CampaignCopy")
      .map((force) => force.id),
  );

  store.forceUnits = store.forceUnits.map((forceUnit) => {
    if (!campaignForceIds.has(forceUnit.forceId)) return forceUnit;
    const assignedPilot = forceUnit.assignedPilotId
      ? store.pilots?.find((pilot) => pilot.id === forceUnit.assignedPilotId)
      : undefined;
    if (assignedPilot) {
      assignedPilot.wounds = 0;
      assignedPilot.status = "Assigned";
      assignedPilot.isAlive = true;
      assignedPilot.isCaptured = false;
      assignedPilot.updatedAt = new Date().toISOString();
    }
    return {
      ...forceUnit,
      status: "Available",
      currentBV: forceUnit.snapshot?.totalBV ?? forceUnit.currentBV,
      damageDescription: undefined,
      isDestroyed: false,
    };
  });

  return campaign;
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
