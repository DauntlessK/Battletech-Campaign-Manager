import crypto from "crypto";
import { loadStore, saveStore } from "./storageService";
import { clearNotificationsForUserByPayload, createNotification } from "./notificationService";
import type {
  Campaign,
  CampaignParticipant,
  CampaignSettings,
  CampaignType,
  ResourceBalance,
  ObjectiveControlType,
} from "../types/models";

function publicParticipantUser(user: { id: string; displayName: string; friendCode: string } | undefined) {
  return {
    id: user?.id ?? "unknown",
    displayName: user?.displayName ?? "Unknown Commander",
    friendCode: user?.friendCode ?? "—",
  };
}

function isFriendInStore(store: any, userAId: string, userBId: string): boolean {
  return (store.friendRequests ?? []).some(
    (request: any) =>
      request.status === "Accepted" &&
      ((request.requesterId === userAId && request.recipientId === userBId) ||
        (request.requesterId === userBId && request.recipientId === userAId)),
  );
}

const VALID_CAMPAIGN_TYPES: CampaignType[] = ["Chaos", "Advanced", "Conquest"];
const VALID_ERAS = [
  "Star League",
  "Succession Wars",
  "Clan Invasion",
  "Civil War",
  "Jihad",
  "Republic",
  "Dark Age",
  "IlClan",
];
const VALID_RULES_LEVELS = ["Introductory", "Standard", "Advanced"];
const VALID_OBJECTIVE_CONTROL_TYPES = ["Binary", "Percentage"];

function toPositiveNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toNonNegativeNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function clampInteger(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
): number {
  const parsed = Math.floor(toPositiveNumber(value, fallback));
  return Math.min(max, Math.max(min, parsed));
}


function getRulesRank(value?: string) {
  if (!value || value === "All" || value === "Any" || value === "Unknown") return null;
  const normalized = value.toLowerCase();
  const order = ["introductory", "standard", "advanced", "experimental", "unofficial"];
  const index = order.findIndex((entry) => normalized.includes(entry));
  return index >= 0 ? index : null;
}

function getEraRank(value?: string) {
  if (!value || value === "All" || value === "Any" || value === "Unknown") return null;
  const normalized = value.toLowerCase();
  if (normalized.includes("succession war")) return 2;
  if (normalized.includes("republic")) return 6;
  const eraOrder = ["age of war", "star league", "clan invasion", "civil war", "jihad", "dark age", "ilclan"];
  const index = eraOrder.findIndex((era) => normalized.includes(era));
  if (index < 0) return null;
  return index >= 2 ? index + 1 : index;
}

function forceCurrentBV(forceId: string, fallback: unknown, forceUnits: { forceId: string; currentBV?: number; snapshot?: { totalBV?: number } }[]) {
  const rosterBV = forceUnits
    .filter((forceUnit) => forceUnit.forceId === forceId)
    .reduce((total, forceUnit) => total + Number(forceUnit.currentBV ?? forceUnit.snapshot?.totalBV ?? 0), 0);
  return rosterBV > 0 ? rosterBV : Number(fallback ?? 0);
}

function normalizeStartingResources(
  settings: Partial<CampaignSettings>,
  type: CampaignType,
): ResourceBalance {
  const resources = settings.startingResources ?? {};

  if (type === "Chaos") {
    return {
      Warchest: toNonNegativeNumber(resources.Warchest, 1000),
    };
  }

  return {
    CBills: toNonNegativeNumber(resources.CBills, 5_000_000),
  };
}

function normalizeCampaignSettings(
  rawSettings: Partial<CampaignSettings>,
): CampaignSettings {
  const type = VALID_CAMPAIGN_TYPES.includes(rawSettings.type as CampaignType)
    ? (rawSettings.type as CampaignType)
    : "Chaos";
  const era = VALID_ERAS.includes(String(rawSettings.era))
    ? String(rawSettings.era)
    : "Star League";
  const rulesLevel = VALID_RULES_LEVELS.includes(String(rawSettings.rulesLevel))
    ? String(rawSettings.rulesLevel)
    : "Standard";
  const requestedObjectiveControlType = VALID_OBJECTIVE_CONTROL_TYPES.includes(
    String(rawSettings.objectiveControlType),
  )
    ? String(rawSettings.objectiveControlType)
    : "Binary";

  const forceBVLimit = toPositiveNumber(rawSettings.forceBVLimit, 15000);
  const requestedMaxPlayers = clampInteger(rawSettings.maxPlayers, 2, 2, 10);
  const maxPlayers = type === "Conquest" ? 2 : requestedMaxPlayers > 2 ? 10 : 2;
  const maxTurnsAhead =
    maxPlayers > 2
      ? Math.max(
          1,
          Math.floor(
            toPositiveNumber(
              rawSettings.maxTurnsAhead ?? rawSettings.maxTurns,
              1,
            ),
          ),
        )
      : undefined;
  const objectiveControlType: ObjectiveControlType =
    (maxPlayers > 2 ? "Percentage" : requestedObjectiveControlType) as ObjectiveControlType;
  const combatTeamRules =
    type === "Conquest" || Boolean(rawSettings.combatTeamRules);

  return {
    type,
    era,
    rulesLevel,
    forceBVLimit,
    maxPlayers,
    maxTurnsAhead,
    maxTurns: maxTurnsAhead,
    combatTeamRules,
    combatTeamCount: combatTeamRules
      ? Math.max(
          1,
          Math.floor(toPositiveNumber(rawSettings.combatTeamCount, 3)),
        )
      : undefined,
    combatTeamBVLimit: combatTeamRules
      ? toPositiveNumber(
          rawSettings.combatTeamBVLimit,
          Math.max(1, Math.floor(forceBVLimit / 3)),
        )
      : undefined,
    combatTeamSize: combatTeamRules
      ? Math.max(1, Math.floor(toPositiveNumber(rawSettings.combatTeamSize, 4)))
      : undefined,
    objectiveControlType,
    salariesEnabled: type !== "Chaos" && Boolean(rawSettings.salariesEnabled),
    startingResources: normalizeStartingResources(rawSettings, type),
  };
}

export async function createCampaign(
  ownerId: string,
  name: string,
  description: string | undefined,
  settings: Partial<CampaignSettings>,
): Promise<Campaign> {
  const cleanName = name.trim();
  if (!cleanName) throw new Error("Campaign name is required.");

  const store = await loadStore();
  const now = new Date().toISOString();

  const campaign: Campaign = {
    id: crypto.randomUUID(),
    ownerId,
    name: cleanName,
    description: description?.trim() || undefined,
    status: "Setup",
    settings: normalizeCampaignSettings(settings),
    createdAt: now,
    updatedAt: now,
  };

  store.campaigns.push(campaign);

  const participant: CampaignParticipant = {
    id: crypto.randomUUID(),
    campaignId: campaign.id,
    userId: ownerId,
    role: "Owner",
    status: "Accepted",
    invitedById: ownerId,
    invitedAt: now,
    joinedAt: now,
  };

  store.campaignParticipants.push(participant);

  await saveStore(store);

  return campaign;
}

function withUserCampaignState(campaign: Campaign, userId: string, storeOrParticipants: any): Campaign {
  const participants: CampaignParticipant[] = Array.isArray(storeOrParticipants)
    ? storeOrParticipants
    : storeOrParticipants.campaignParticipants;
  const participant = participants.find(
    (entry) =>
      entry.campaignId === campaign.id &&
      entry.userId === userId &&
      entry.status === "Accepted",
  );
  const campaignParticipants = participants
    .filter((entry) => entry.campaignId === campaign.id && entry.status !== "Removed")
    .map((entry) => {
      const participantUser = Array.isArray(storeOrParticipants)
        ? undefined
        : storeOrParticipants.users.find((user: any) => user.id === entry.userId);
      const participantForce = Array.isArray(storeOrParticipants)
        ? undefined
        : storeOrParticipants.forces.find((force: any) => force.id === entry.forceId);
      const forceUnits = Array.isArray(storeOrParticipants) ? [] : storeOrParticipants.forceUnits ?? [];
      const forceBV = participantForce
        ? forceCurrentBV(participantForce.id, participantForce.totalBV, forceUnits)
        : undefined;
      return {
        ...entry,
        user: publicParticipantUser(participantUser),
        force: participantForce
          ? {
              id: participantForce.id,
              name: participantForce.name,
              totalBV: forceBV,
              faction: participantForce.faction,
            }
          : undefined,
      };
    });
  return {
    ...campaign,
    assignedForceId: participant?.forceId,
    participants: campaignParticipants,
  } as Campaign;
}

export async function getCampaignById(id: string, userId?: string): Promise<Campaign | null> {
  const store = await loadStore();
  const campaign = store.campaigns.find((c) => c.id === id) ?? null;
  if (!campaign) return null;
  return userId ? withUserCampaignState(campaign, userId, store) : campaign;
}

export async function listCampaignsForUser(
  userId: string,
): Promise<Campaign[]> {
  const store = await loadStore();
  const myParticipantCampaignIds = new Set(
    store.campaignParticipants
      .filter((p) => p.userId === userId && p.status === "Accepted")
      .map((p) => p.campaignId),
  );

  return store.campaigns
    .filter((c) => myParticipantCampaignIds.has(c.id))
    .map((campaign) => withUserCampaignState(campaign, userId, store));
}

export async function updateCampaign(
  campaignId: string,
  userId: string,
  updates: { name?: string; description?: string; settings?: Partial<CampaignSettings> },
): Promise<Campaign> {
  const store = await loadStore();
  const campaign = store.campaigns.find((candidate) => candidate.id === campaignId);
  if (!campaign) throw new Error("Campaign not found.");
  if (campaign.ownerId !== userId) throw new Error("Only the campaign owner can edit campaign setup.");

  const participant = store.campaignParticipants.find(
    (entry) => entry.campaignId === campaignId && entry.userId === userId && entry.status === "Accepted",
  );
  if (participant?.forceId) {
    throw new Error("Campaign setup is locked while a force is committed. Uncommit the force before changing setup details.");
  }

  if (typeof updates.name === "string") {
    const cleanName = updates.name.trim();
    if (!cleanName) throw new Error("Campaign name is required.");
    campaign.name = cleanName;
  }
  if ("description" in updates) {
    campaign.description = updates.description?.trim() || undefined;
  }
  if (updates.settings) {
    campaign.settings = normalizeCampaignSettings({ ...campaign.settings, ...updates.settings });
  }
  campaign.updatedAt = new Date().toISOString();

  await saveStore(store);
  return withUserCampaignState(campaign, userId, store);
}

export async function setCampaignForce(
  campaignId: string,
  userId: string,
  forceId: string | null,
): Promise<Campaign> {
  const store = await loadStore();
  const campaign = store.campaigns.find((candidate) => candidate.id === campaignId);
  if (!campaign) throw new Error("Campaign not found.");

  const participant = store.campaignParticipants.find(
    (entry) => entry.campaignId === campaignId && entry.userId === userId && entry.status === "Accepted",
  );
  if (!participant) throw new Error("You must be an accepted campaign participant to assign a force.");

  if (forceId) {
    const force = store.forces.find((candidate) => candidate.id === forceId && candidate.ownerId === userId && candidate.status !== "Deleted");
    if (!force) throw new Error("Force not found or not available for assignment.");

    const reasons: string[] = [];
    const forceBV = forceCurrentBV(force.id, force.totalBV, store.forceUnits);
    const campaignBVLimit = Number(campaign.settings.forceBVLimit ?? 0);
    if (campaignBVLimit > 0 && forceBV > campaignBVLimit) {
      reasons.push(`Force BV exceeds the campaign limit by ${(forceBV - campaignBVLimit).toLocaleString()} BV.`);
    }

    const campaignRulesRank = getRulesRank(campaign.settings.rulesLevel);
    const forceRulesRank = getRulesRank(force.rulesLevel);
    if (campaignRulesRank !== null && forceRulesRank !== null && forceRulesRank > campaignRulesRank) {
      reasons.push(`${force.rulesLevel} force rules are above the campaign's ${campaign.settings.rulesLevel} limit.`);
    }

    const campaignEraRank = getEraRank(campaign.settings.era);
    const forceEraRank = getEraRank(force.era);
    if (campaignEraRank !== null && forceEraRank !== null && forceEraRank > campaignEraRank) {
      reasons.push(`${force.era} force era is later than the campaign's ${campaign.settings.era} era.`);
    }

    if (campaign.settings.type === "Conquest") {
      if (!force.forConquest) reasons.push("Conquest campaigns require a conquest-enabled force.");
      const campaignTeamCount = Number(campaign.settings.combatTeamCount ?? 0);
      const forceTeamCount = Number(force.combatTeamCount ?? 0);
      if (campaignTeamCount > 0 && forceTeamCount > campaignTeamCount) {
        reasons.push(`Force uses ${forceTeamCount} combat teams; campaign allows ${campaignTeamCount}.`);
      }
      const campaignTeamBV = Number(campaign.settings.combatTeamBVLimit ?? 0);
      const forceTeamBV = Number(force.combatTeamBV ?? 0);
      if (campaignTeamBV > 0 && forceTeamBV > campaignTeamBV) {
        reasons.push(`Force combat team BV limit exceeds the campaign's ${campaignTeamBV.toLocaleString()} BV limit.`);
      }
    }

    if (reasons.length) throw new Error(reasons.join(" "));
    participant.forceId = forceId;
  } else {
    participant.forceId = undefined;
  }

  campaign.updatedAt = new Date().toISOString();
  await saveStore(store);
  return withUserCampaignState(campaign, userId, store);
}

export async function inviteFriendToCampaign(
  campaignId: string,
  inviterId: string,
  friendUserId: string,
): Promise<Campaign> {
  const store = await loadStore();
  const campaign = store.campaigns.find((candidate) => candidate.id === campaignId);
  if (!campaign) throw new Error("Campaign not found.");
  if (campaign.ownerId !== inviterId) throw new Error("Only the campaign owner can invite players during setup.");
  if (friendUserId === inviterId) throw new Error("You are already the campaign owner.");
  const friend = store.users.find((candidate) => candidate.id === friendUserId);
  if (!friend) throw new Error("Friend not found.");
  if (!isFriendInStore(store, inviterId, friendUserId)) throw new Error("You can only invite active friends to a campaign.");

  const existing = store.campaignParticipants.find(
    (participant) => participant.campaignId === campaignId && participant.userId === friendUserId,
  );
  const now = new Date().toISOString();
  if (existing) {
    if (existing.status === "Accepted" || existing.status === "Pending") {
      return withUserCampaignState(campaign, inviterId, store);
    }
    existing.status = "Pending";
    existing.role = "Participant";
    existing.invitedById = inviterId;
    existing.invitedAt = now;
    existing.leftAt = undefined;
  } else {
    store.campaignParticipants.push({
      id: crypto.randomUUID(),
      campaignId,
      userId: friendUserId,
      role: "Participant",
      status: "Pending",
      invitedById: inviterId,
      invitedAt: now,
    });
  }

  campaign.updatedAt = now;
  await saveStore(store);
  const inviter = store.users.find((candidate) => candidate.id === inviterId);
  await createNotification(friendUserId, "campaign.invite", {
    campaignId,
    campaignName: campaign.name,
    invitedById: inviterId,
    invitedByName: inviter?.displayName ?? "Campaign owner",
  });
  return withUserCampaignState(campaign, inviterId, store);
}

export async function uninviteCampaignParticipant(
  campaignId: string,
  requesterId: string,
  participantUserId: string,
): Promise<Campaign> {
  const store = await loadStore();
  const campaign = store.campaigns.find((candidate) => candidate.id === campaignId);
  if (!campaign) throw new Error("Campaign not found.");
  if (campaign.ownerId !== requesterId) throw new Error("Only the campaign owner can remove campaign invites during setup.");
  if (participantUserId === requesterId) throw new Error("The campaign owner cannot be uninvited.");

  const participant = store.campaignParticipants.find(
    (candidate) => candidate.campaignId === campaignId && candidate.userId === participantUserId,
  );
  if (!participant) throw new Error("Campaign participant not found.");

  participant.status = "Removed";
  participant.leftAt = new Date().toISOString();
  campaign.updatedAt = participant.leftAt;
  await saveStore(store);
  await clearNotificationsForUserByPayload(participantUserId, { type: "campaign.invite", payload: { campaignId } });
  await createNotification(participantUserId, "campaign.uninvite", {
    campaignId,
    campaignName: campaign.name,
  });
  return withUserCampaignState(campaign, requesterId, store);
}

export async function isUserParticipant(
  campaignId: string,
  userId: string,
): Promise<boolean> {
  const store = await loadStore();
  const participant = store.campaignParticipants.find(
    (p) =>
      p.campaignId === campaignId &&
      p.userId === userId &&
      p.status === "Accepted",
  );
  return !!participant;
}

export async function respondToInvitation(
  campaignId: string,
  userId: string,
  accept: boolean,
): Promise<Campaign> {
  const store = await loadStore();
  const campaign = store.campaigns.find((candidate) => candidate.id === campaignId);
  if (!campaign) throw new Error("Campaign not found.");

  const participant = store.campaignParticipants.find(
    (p) => p.campaignId === campaignId && p.userId === userId,
  );
  if (!participant) {
    throw new Error("Invitation not found for this user and campaign.");
  }
  if (participant.status !== "Pending") {
    throw new Error("This invitation is no longer pending.");
  }

  const now = new Date().toISOString();
  if (accept) {
    participant.status = "Accepted";
    participant.joinedAt = now;
  } else {
    participant.status = "Declined";
    participant.leftAt = now;
  }

  campaign.updatedAt = now;
  await saveStore(store);
  await clearNotificationsForUserByPayload(userId, { type: "campaign.invite", payload: { campaignId } });
  return withUserCampaignState(campaign, userId, store);
}

export async function listPendingInvitesForUser(userId: string) {
  const store = await loadStore();
  const pending = store.campaignParticipants.filter(
    (p) => p.userId === userId && p.status === "Pending",
  );
  return pending.map((p) => {
    const campaign = store.campaigns.find((c) => c.id === p.campaignId);
    const inviter = store.users.find((candidate) => candidate.id === p.invitedById);
    return {
      participant: p,
      campaign: campaign
        ? {
            id: campaign.id,
            name: campaign.name,
            description: campaign.description,
            ownerId: campaign.ownerId,
            status: campaign.status,
            settings: campaign.settings,
          }
        : { id: p.campaignId },
      inviter: inviter
        ? {
            id: inviter.id,
            displayName: inviter.displayName,
            friendCode: inviter.friendCode,
          }
        : undefined,
    };
  });
}

export async function inviteParticipant(
  campaignId: string,
  inviterId: string,
  userId: string,
) {
  const store = await loadStore();
  const campaign = store.campaigns.find((c) => c.id === campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const existing = store.campaignParticipants.find(
    (p) => p.campaignId === campaignId && p.userId === userId,
  );
  if (existing) {
    return existing;
  }

  const participant: CampaignParticipant = {
    id: crypto.randomUUID(),
    campaignId,
    userId,
    role: "Participant",
    status: "Pending",
    invitedById: inviterId,
    invitedAt: new Date().toISOString(),
  };

  store.campaignParticipants.push(participant);
  await saveStore(store);

  try {
    await createNotification(userId, "campaign.invite", {
      campaignId,
      invitedById: inviterId,
    });
  } catch (e) {
    console.error("Failed to create invite notification:", e);
  }

  return participant;
}
