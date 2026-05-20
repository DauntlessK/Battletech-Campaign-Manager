import crypto from "crypto";
import { loadStore, saveStore } from "./storageService";
import type { Notification } from "../types/models";
import { sendInviteEmail } from "./emailService";

export async function createNotification(userId: string, type: string, payload?: Record<string, any>): Promise<Notification> {
  const store = await loadStore();
  const note: Notification = {
    id: crypto.randomUUID(),
    userId,
    type,
    payload: payload ?? {},
    read: false,
    createdAt: new Date().toISOString(),
  };

  store.notifications = store.notifications ?? [];
  store.notifications.push(note);
  await saveStore(store);
  // For now also log to console as a simple "email" hook
  console.log(`[notification] created: ${note.id} -> ${userId} (${type})`);
  // If this is a campaign invite, attempt to send an email to the user
  try {
    if (type === "campaign.invite") {
      const user = store.users.find((u) => u.id === userId);
      const campaignId = payload?.campaignId as string | undefined;
      const campaign = campaignId ? store.campaigns.find((c) => c.id === campaignId) : undefined;
      if (user && campaign) {
        await sendInviteEmail(user.email, user.displayName, campaign, undefined);
      }
    }
  } catch (e) {
    console.error("Failed to send email for notification:", e);
  }

  return note;
}

export async function listNotificationsForUser(userId: string) {
  const store = await loadStore();
  return (store.notifications ?? []).filter((n) => n.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function markNotificationRead(notificationId: string, userId: string) {
  const store = await loadStore();
  store.notifications = store.notifications ?? [];
  const n = store.notifications.find((x) => x.id === notificationId && x.userId === userId);
  if (!n) throw new Error("Notification not found");
  n.read = true;
  await saveStore(store);
  return n;
}
