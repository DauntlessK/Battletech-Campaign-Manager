import crypto from "crypto";
import { loadStore, saveStore } from "./storageService";
import { createNotification } from "./notificationService";
import type { Campaign, CampaignParticipant, CampaignSettings, CampaignType, ResourceBalance } from "../types/models";

const VALID_CAMPAIGN_TYPES: CampaignType[] = ["Chaos", "Advanced", "Conquest"];
const VALID_ERAS = ["Star League", "Early Succession Wars", "Late Succession Wars", "Clan Invasion"];
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

function normalizeStartingResources(settings: Partial<CampaignSettings>, type: CampaignType): ResourceBalance {
  const resources = settings.startingResources ?? {};

  if (type === "Chaos") {
    return {
      Warchest: toNonNegativeNumber(resources.Warchest, 1000),
    };
  }

  if (type === "Advanced") {
    return {
      CBills: toNonNegativeNumber(resources.CBills, 5_000_000),
      RepairPoints: toNonNegativeNumber(resources.RepairPoints, 100),
      Time: toNonNegativeNumber(resources.Time, 0),
    };
  }

  return {
    CBills: toNonNegativeNumber(resources.CBills, 5_000_000),
    RepairPoints: toNonNegativeNumber(resources.RepairPoints, 100),
    Time: toNonNegativeNumber(resources.Time, 0),
    Salvage: toNonNegativeNumber(resources.Salvage, 0),
  };
}

function normalizeCampaignSettings(rawSettings: Partial<CampaignSettings>): CampaignSettings {
  const type = VALID_CAMPAIGN_TYPES.includes(rawSettings.type as CampaignType) ? (rawSettings.type as CampaignType) : "Chaos";
  const era = VALID_ERAS.includes(String(rawSettings.era)) ? String(rawSettings.era) : "Star League";
  const rulesLevel = VALID_RULES_LEVELS.includes(String(rawSettings.rulesLevel)) ? String(rawSettings.rulesLevel) : "Standard";
  const objectiveControlType = VALID_OBJECTIVE_CONTROL_TYPES.includes(String(rawSettings.objectiveControlType))
    ? String(rawSettings.objectiveControlType)
    : type === "Conquest"
      ? "Percentage"
      : "Binary";

  const forceBVLimit = toPositiveNumber(rawSettings.forceBVLimit, 15000);
  const maxPlayers = Math.max(1, Math.floor(toPositiveNumber(rawSettings.maxPlayers, 4)));
  const maxTurnsAhead = Math.max(1, Math.floor(toPositiveNumber(rawSettings.maxTurnsAhead ?? rawSettings.maxTurns, 1)));
  const combatTeamRules = type === "Conquest" || Boolean(rawSettings.combatTeamRules);

  return {
    type,
    scoringMethod: rawSettings.scoringMethod || (type === "Chaos" ? "Warchest Points" : type === "Conquest" ? "Objective Control" : "Victory Points"),
    era,
    rulesLevel,
    forceBVLimit,
    factionRestriction: rawSettings.factionRestriction?.trim() || undefined,
    maxPlayers,
    maxTurnsAhead,
    maxTurns: maxTurnsAhead,
    combatTeamRules,
    combatTeamBVLimit: combatTeamRules ? toPositiveNumber(rawSettings.combatTeamBVLimit, Math.max(1, Math.floor(forceBVLimit / 3))) : undefined,
    combatTeamSize: combatTeamRules ? Math.max(1, Math.floor(toPositiveNumber(rawSettings.combatTeamSize, 4))) : undefined,
    objectiveControlType,
    salariesEnabled: type !== "Chaos" && Boolean(rawSettings.salariesEnabled),
    startingResources: normalizeStartingResources(rawSettings, type),
    victoryConditions: Array.isArray(rawSettings.victoryConditions)
      ? rawSettings.victoryConditions.map((condition) => String(condition).trim()).filter(Boolean)
      : [],
  };
}

export async function createCampaign(
  ownerId: string,
  name: string,
  description: string | undefined,
  settings: Partial<CampaignSettings>
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

export async function getCampaignById(id: string): Promise<Campaign | null> {
  const store = await loadStore();
  return store.campaigns.find((c) => c.id === id) ?? null;
}

export async function listCampaignsForUser(userId: string): Promise<Campaign[]> {
  const store = await loadStore();
  const myParticipantCampaignIds = new Set(
    store.campaignParticipants.filter((p) => p.userId === userId && p.status === "Accepted").map((p) => p.campaignId)
  );

  return store.campaigns.filter((c) => myParticipantCampaignIds.has(c.id));
}

export async function isUserParticipant(campaignId: string, userId: string): Promise<boolean> {
  const store = await loadStore();
  const participant = store.campaignParticipants.find((p) => p.campaignId === campaignId && p.userId === userId && p.status === "Accepted");
  return !!participant;
}

export async function respondToInvitation(
  campaignId: string,
  userId: string,
  accept: boolean,
  forceId?: string
): Promise<CampaignParticipant> {
  const store = await loadStore();
  const participant = store.campaignParticipants.find((p) => p.campaignId === campaignId && p.userId === userId);
  if (!participant) throw new Error("Invitation not found for this user and campaign.");

  if (accept) {
    participant.status = "Accepted";
    participant.joinedAt = new Date().toISOString();
    if (forceId) participant.forceId = forceId;
  } else {
    participant.status = "Declined";
    participant.leftAt = new Date().toISOString();
  }

  await saveStore(store);
  return participant;
}

export async function listPendingInvitesForUser(userId: string) {
  const store = await loadStore();
  const pending = store.campaignParticipants.filter((p) => p.userId === userId && p.status === "Pending");
  return pending.map((p) => {
    const campaign = store.campaigns.find((c) => c.id === p.campaignId);
    return {
      participant: p,
      campaign: campaign
        ? { id: campaign.id, name: campaign.name, ownerId: campaign.ownerId, status: campaign.status }
        : { id: p.campaignId },
    };
  });
}

export async function inviteParticipant(campaignId: string, inviterId: string, userId: string) {
  const store = await loadStore();
  const campaign = store.campaigns.find((c) => c.id === campaignId);
  if (!campaign) throw new Error("Campaign not found");

  const existing = store.campaignParticipants.find((p) => p.campaignId === campaignId && p.userId === userId);
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
    await createNotification(userId, "campaign.invite", { campaignId, invitedById: inviterId });
  } catch (e) {
    console.error("Failed to create invite notification:", e);
  }

  return participant;
}
