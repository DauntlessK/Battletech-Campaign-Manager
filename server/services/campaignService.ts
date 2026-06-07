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


const CAMPAIGN_PLAYER_COLORS = [
  "#ef4444", // red
  "#2563eb", // blue
  "#f59e0b", // amber
  "#22c55e", // green
  "#a855f7", // purple
  "#f97316", // orange
  "#ec4899", // pink
  "#14b8a6", // teal
  "#eab308", // yellow
  "#06b6d4", // cyan
  "#f4f4f5", // white
];

function assignParticipantColor(store: any, campaignId: string, participant: any) {
  if (participant.color && CAMPAIGN_PLAYER_COLORS.includes(participant.color)) return;
  const used = new Set(
    (store.campaignParticipants ?? [])
      .filter((entry: any) => entry.campaignId === campaignId && entry.id !== participant.id && entry.color)
      .map((entry: any) => entry.color),
  );
  const available = CAMPAIGN_PLAYER_COLORS.filter((color) => !used.has(color));
  const pool = available.length ? available : CAMPAIGN_PLAYER_COLORS;
  participant.color = pool[Math.floor(Math.random() * pool.length)];
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
const ERA_YEAR_RANGES: Record<string, { min: number; max: number }> = {
  "Star League": { min: 2571, max: 2780 },
  "Succession Wars": { min: 2781, max: 3049 },
  "Clan Invasion": { min: 3050, max: 3061 },
  "Civil War": { min: 3062, max: 3067 },
  Jihad: { min: 3068, max: 3085 },
  Republic: { min: 3086, max: 3130 },
  "Dark Age": { min: 3131, max: 3150 },
  IlClan: { min: 3151, max: 3999 },
};

function normalizeCampaignFluff(raw: any, era: string) {
  const source = raw ?? {};
  const planet = String(source.planet ?? "").trim();
  const conflictDescription = String(source.conflictDescription ?? "").trim();
  const range = ERA_YEAR_RANGES[era];
  const parsedYear = Math.floor(Number(source.year));
  const year = Number.isFinite(parsedYear) && range && parsedYear >= range.min && parsedYear <= range.max
    ? parsedYear
    : undefined;
  const fluff: { year?: number; planet?: string; conflictDescription?: string } = {};
  if (year) fluff.year = year;
  if (planet) fluff.planet = planet;
  if (conflictDescription) fluff.conflictDescription = conflictDescription;
  return Object.keys(fluff).length ? fluff : undefined;
}

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


const OBJECTIVE_TYPES = [
  "Factory",
  "Depot",
  "Comms Array",
  "Small City",
  "Large City",
  "Fort Holding",
  "Repair Facility",
  "Space Port",
  "Medical Facility",
];

function toBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeVictoryConditions(raw: any, type: CampaignType, objectiveControlType: ObjectiveControlType) {
  const source = raw ?? {};
  const isBinaryControl = objectiveControlType === "Binary";
  const keyObjectivesEnabled = isBinaryControl ? false : toBoolean(source.keyObjectivesEnabled, false);
  return {
    capitulationBVEnabled: true,
    capitulationBVPercent: clampInteger(source.capitulationBVPercent, 10, 1, 100),
    capitulationResourcesEnabled: true,
    capitulationResourcesPercent: clampInteger(source.capitulationResourcesPercent, 10, 1, 100),
    dominationEnabled: isBinaryControl ? false : toBoolean(source.dominationEnabled, true),
    dominationControlPercent: clampInteger(source.dominationControlPercent, 70, 1, 100),
    keyObjectivesEnabled,
    turnsElapsedEnabled: toBoolean(source.turnsElapsedEnabled, false),
    turnsElapsed: clampInteger(source.turnsElapsed, type === "Conquest" ? 25 : 10, 1, 999),
    mapControlEnabled: type === "Conquest" ? toBoolean(source.mapControlEnabled, false) : false,
    mapControlPercent: type === "Conquest" ? clampInteger(source.mapControlPercent, 75, 1, 100) : undefined,
  };
}

function normalizeCampaignObjectives(raw: any) {
  const objectives = Array.isArray(raw) ? raw : [];
  return objectives.slice(0, 20).map((objective: any, index: number) => {
    const type = OBJECTIVE_TYPES.includes(String(objective?.type))
      ? String(objective.type)
      : OBJECTIVE_TYPES[index % OBJECTIVE_TYPES.length];
    return {
      id: String(objective?.id || crypto.randomUUID()),
      name: String(objective?.name || `${type} ${index + 1}`).trim(),
      type,
      isKey: Boolean(objective?.isKey),
    };
  });
}

function normalizeCampaignSettings(
  rawSettings: Partial<CampaignSettings>,
): CampaignSettings {
  const type = VALID_CAMPAIGN_TYPES.includes(rawSettings.type as CampaignType)
    ? (rawSettings.type as CampaignType)
    : "Advanced";
  const era = VALID_ERAS.includes(String(rawSettings.era))
    ? String(rawSettings.era)
    : "";
  const rulesLevel = VALID_RULES_LEVELS.includes(String(rawSettings.rulesLevel))
    ? String(rawSettings.rulesLevel)
    : "Standard";
  const requestedObjectiveControlType = VALID_OBJECTIVE_CONTROL_TYPES.includes(
    String(rawSettings.objectiveControlType),
  )
    ? String(rawSettings.objectiveControlType)
    : "Percentage";

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
              4,
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
    victoryConditions: normalizeVictoryConditions(rawSettings.victoryConditions, type, objectiveControlType),
    victoryConditionsReviewed: Boolean(rawSettings.victoryConditionsReviewed),
    objectives: normalizeCampaignObjectives(rawSettings.objectives),
    fluff: normalizeCampaignFluff(rawSettings.fluff, era),
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
  if (!settings.era) throw new Error("Campaign era is required.");

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
  assignParticipantColor(store, campaign.id, participant);

  store.campaignParticipants.push(participant);

  await saveStore(store);

  return campaign;
}

function campaignTurnState(campaignId: string, store: any) {
  const acceptedUserIds = (store.campaignParticipants ?? [])
    .filter((entry: any) => entry.campaignId === campaignId && entry.status === "Accepted")
    .map((entry: any) => entry.userId);
  const completedCounts = new Map<string, number>(acceptedUserIds.map((id: string) => [id, 0]));

  for (const battle of store.battles ?? []) {
    if (battle.campaignId !== campaignId || battle.status !== "Complete") continue;
    const involved = new Set<string>();
    for (const log of battle.battleLogs ?? []) {
      if (completedCounts.has(log.userId)) involved.add(log.userId);
    }
    if (!involved.size) {
      if (completedCounts.has(battle.submittedByUserId)) involved.add(battle.submittedByUserId);
      if (completedCounts.has(battle.defendingUserId)) involved.add(battle.defendingUserId);
    }
    for (const participantUserId of involved) {
      completedCounts.set(participantUserId, (completedCounts.get(participantUserId) ?? 0) + 1);
    }
  }

  const playerTurns = new Map<string, number>();
  for (const participantUserId of acceptedUserIds) {
    playerTurns.set(participantUserId, (completedCounts.get(participantUserId) ?? 0) + 1);
  }
  const campaignTurn = playerTurns.size
    ? Math.max(1, Math.floor([...playerTurns.values()].reduce((sum, turn) => sum + turn, 0) / playerTurns.size))
    : 1;
  return { playerTurns, campaignTurn };
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
  const turnState = Array.isArray(storeOrParticipants)
    ? null
    : campaignTurnState(campaign.id, storeOrParticipants);
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
        currentTurn: turnState?.playerTurns.get(entry.userId) ?? 1,
        user: publicParticipantUser(participantUser),
        force: participantForce
          ? {
              id: participantForce.id,
              name: participantForce.name,
              totalBV: forceBV,
              startingBV: participantForce.startingBV ?? participantForce.totalBV ?? forceBV,
              faction: participantForce.faction,
            }
          : undefined,
      };
    });
  return {
    ...campaign,
    turnNumber: turnState?.campaignTurn ?? campaign.turnNumber ?? 1,
    settings: {
      ...(campaign.settings ?? {}),
      currentTurn: turnState?.campaignTurn ?? campaign.settings?.currentTurn ?? campaign.turnNumber ?? 1,
    },
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
  const settingsKeys = updates.settings ? Object.keys(updates.settings) : [];
  const objectiveOnlySettingsUpdate =
    settingsKeys.length > 0 &&
    settingsKeys.every((key) => key === "victoryConditions" || key === "victoryConditionsReviewed" || key === "objectives" || key === "fluff");
  const restrictedSetupUpdate =
    !objectiveOnlySettingsUpdate &&
    (typeof updates.name === "string" || "description" in updates || settingsKeys.length > 0);
  if (participant?.forceId && restrictedSetupUpdate) {
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

export async function updateCampaignPlayerColors(
  campaignId: string,
  userId: string,
  colors: Record<string, string>,
): Promise<Campaign> {
  const store = await loadStore();
  const campaign = store.campaigns.find((candidate) => candidate.id === campaignId);
  if (!campaign) throw new Error("Campaign not found.");
  if (campaign.ownerId !== userId) {
    throw new Error("Only the campaign owner can change player colors.");
  }
  if (!colors || typeof colors !== "object" || Array.isArray(colors)) {
    throw new Error("Player colors are required.");
  }

  const acceptedParticipants = store.campaignParticipants.filter(
    (participant) =>
      participant.campaignId === campaignId && participant.status === "Accepted",
  );
  const acceptedIds = new Set(acceptedParticipants.map((participant) => participant.userId));
  const chosenColors = new Set<string>();

  for (const [participantUserId, color] of Object.entries(colors)) {
    if (!acceptedIds.has(participantUserId)) continue;
    if (!CAMPAIGN_PLAYER_COLORS.includes(color)) {
      throw new Error("Choose one of the supported campaign player colors.");
    }
    if (chosenColors.has(color)) {
      throw new Error("Each campaign player must have a different color.");
    }
    chosenColors.add(color);
  }

  for (const participant of acceptedParticipants) {
    const color = colors[participant.userId];
    if (color) participant.color = color;
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
    assignParticipantColor(store, campaignId, existing);
  } else {
    const participant: CampaignParticipant = {
      id: crypto.randomUUID(),
      campaignId,
      userId: friendUserId,
      role: "Participant",
      status: "Pending",
      invitedById: inviterId,
      invitedAt: now,
    };
    assignParticipantColor(store, campaignId, participant);
    store.campaignParticipants.push(participant);
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


function copyCommittedForcesToCampaignInStore(store: any, campaign: Campaign) {
  const acceptedParticipants = store.campaignParticipants.filter(
    (participant: any) => participant.campaignId === campaign.id && participant.status === "Accepted",
  );

  for (const participant of acceptedParticipants) {
    if (!participant.forceId) throw new Error("Every accepted player must assign a force before the campaign can begin.");
    const existingForce = store.forces.find((force: any) => force.id === participant.forceId);
    if (!existingForce) throw new Error("Committed force not found.");
    if (existingForce.origin === "CampaignCopy" && existingForce.campaignId === campaign.id) continue;

    const startingBV = forceCurrentBV(existingForce.id, existingForce.totalBV, store.forceUnits);
    const copiedForce = {
      ...existingForce,
      id: crypto.randomUUID(),
      campaignId: campaign.id,
      originalForceId: existingForce.id,
      origin: "CampaignCopy",
      startingBV,
      totalBV: startingBV,
      status: "Assigned",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const originalUnits = store.forceUnits.filter((unit: any) => unit.forceId === existingForce.id);
    const copiedUnits = originalUnits.map((unit: any) => ({
      ...unit,
      id: crypto.randomUUID(),
      forceId: copiedForce.id,
      pilot: unit.pilot ?? { gunnery: 4, piloting: 5 },
    }));
    copiedForce.unitIds = copiedUnits
      .sort((a: any, b: any) => (a.teamNumber ?? 1) - (b.teamNumber ?? 1) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((unit: any) => unit.baseUnitId);
    store.forces.push(copiedForce);
    store.forceUnits.push(...copiedUnits);
    participant.forceId = copiedForce.id;
  }
}

function campaignPlayersReady(campaign: Campaign, store: any) {
  const accepted = store.campaignParticipants.filter((participant: any) => participant.campaignId === campaign.id && participant.status === "Accepted");
  const maxPlayers = Number(campaign.settings?.maxPlayers ?? 2);
  const countReady = maxPlayers > 2 ? accepted.length >= 3 && accepted.length <= 10 : accepted.length === 2;
  const forcesReady = accepted.every((participant: any) => Boolean(participant.forceId));
  return countReady && forcesReady;
}

function campaignObjectivesReady(campaign: Campaign) {
  const victory = campaign.settings?.victoryConditions;
  const objectives = campaign.settings?.objectives ?? [];
  if (!victory || !campaign.settings?.victoryConditionsReviewed) return false;
  if (objectives.length < 2) return false;
  if (victory.keyObjectivesEnabled && !objectives.some((objective: any) => objective.isKey)) return false;
  return true;
}

export async function beginCampaign(campaignId: string, userId: string): Promise<Campaign> {
  const store = await loadStore();
  const campaign = store.campaigns.find((candidate) => candidate.id === campaignId);
  if (!campaign) throw new Error("Campaign not found.");
  if (campaign.ownerId !== userId) throw new Error("Only the campaign owner can begin the campaign.");
  if (campaign.status !== "Setup") throw new Error("Only setup campaigns can be begun.");
  if (!campaignObjectivesReady(campaign)) throw new Error("Objectives and victory conditions must be configured before beginning the campaign.");
  if (!campaignPlayersReady(campaign, store)) throw new Error("Player count and assigned forces must be complete before beginning the campaign.");

  copyCommittedForcesToCampaignInStore(store, campaign);
  campaign.status = "Active";
  campaign.startDate = new Date().toISOString();
  campaign.updatedAt = campaign.startDate;
  await saveStore(store);
  return withUserCampaignState(campaign, userId, store);
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
    assignParticipantColor(store, campaignId, participant);
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
  assignParticipantColor(store, campaignId, participant);

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
