import crypto from "crypto";
import { loadStore, saveStore } from "./storageService";
import { createNotification } from "./notificationService";
import type { Campaign, CampaignParticipant, CampaignSettings } from "../types/models";

export async function createCampaign(
  ownerId: string,
  name: string,
  description: string | undefined,
  settings: CampaignSettings
): Promise<Campaign> {
  const store = await loadStore();

  const campaign: Campaign = {
    id: crypto.randomUUID(),
    ownerId,
    name,
    description,
    status: "Setup",
    settings,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.campaigns.push(campaign);

  const participant: CampaignParticipant = {
    id: crypto.randomUUID(),
    campaignId: campaign.id,
    userId: ownerId,
    role: "Owner",
    status: "Accepted",
    invitedById: ownerId,
    invitedAt: new Date().toISOString(),
    joinedAt: new Date().toISOString(),
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
  // Join campaign basic data
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

  // Create a notification for the invited user
  try {
    await createNotification(userId, "campaign.invite", { campaignId, invitedById: inviterId });
  } catch (e) {
    console.error("Failed to create invite notification:", e);
  }

  return participant;
}
