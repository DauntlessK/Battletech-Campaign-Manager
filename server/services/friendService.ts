import crypto from "crypto";
import { loadStore, saveStore } from "./storageService";
import { clearNotificationsForUserByPayload, createNotification } from "./notificationService";
import type { FriendRequest, UserAccount } from "../types/models";

type PublicFriendUser = {
  id: string;
  displayName: string;
  friendCode: string;
};

function publicFriendUser(user: UserAccount | undefined): PublicFriendUser {
  return {
    id: user?.id ?? "unknown",
    displayName: user?.displayName ?? "Unknown Commander",
    friendCode: user?.friendCode ?? "—",
  };
}

function requestWithUsers(request: FriendRequest, users: UserAccount[]) {
  return {
    ...request,
    requester: publicFriendUser(users.find((user) => user.id === request.requesterId)),
    recipient: publicFriendUser(users.find((user) => user.id === request.recipientId)),
  };
}

export async function listFriendsForUser(userId: string) {
  const store = await loadStore();
  const requests = store.friendRequests ?? [];
  return requests
    .filter((request) => request.status === "Accepted" && (request.requesterId === userId || request.recipientId === userId))
    .map((request) => {
      const friendUserId = request.requesterId === userId ? request.recipientId : request.requesterId;
      const friend = store.users.find((candidate) => candidate.id === friendUserId);
      return {
        id: request.id,
        friendUserId,
        displayName: friend?.displayName ?? "Unknown Commander",
        friendCode: friend?.friendCode ?? "—",
        createdAt: request.respondedAt ?? request.updatedAt ?? request.createdAt,
      };
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export async function listFriendRequestsForUser(userId: string) {
  const store = await loadStore();
  const requests = store.friendRequests ?? [];
  return requests
    .filter((request) => request.status === "Pending" && (request.requesterId === userId || request.recipientId === userId))
    .map((request) => requestWithUsers(request, store.users))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createFriendRequestByCode(requesterId: string, rawFriendCode: string) {
  const friendCode = rawFriendCode.trim().toUpperCase();
  if (!friendCode) throw new Error("Friend code is required.");

  const store = await loadStore();
  store.friendRequests = store.friendRequests ?? [];

  const requester = store.users.find((user) => user.id === requesterId);
  if (!requester) throw new Error("Requester not found.");

  const recipient = store.users.find((user) => user.friendCode.toUpperCase() === friendCode);
  if (!recipient) throw new Error("No commander was found with that friend code.");
  if (recipient.id === requesterId) throw new Error("You cannot send a friend request to yourself.");

  const existing = store.friendRequests.find(
    (request) =>
      (request.requesterId === requesterId && request.recipientId === recipient.id) ||
      (request.requesterId === recipient.id && request.recipientId === requesterId),
  );

  if (existing) {
    if (existing.status === "Accepted") return requestWithUsers(existing, store.users);
    if (existing.status === "Pending") return requestWithUsers(existing, store.users);
    existing.requesterId = requesterId;
    existing.recipientId = recipient.id;
    existing.status = "Pending";
    existing.updatedAt = new Date().toISOString();
    existing.respondedAt = undefined;
    await saveStore(store);
    await createNotification(recipient.id, "friend.request", {
      requestId: existing.id,
      requesterId,
      requesterName: requester.displayName,
    });
    return requestWithUsers(existing, store.users);
  }

  const now = new Date().toISOString();
  const request: FriendRequest = {
    id: crypto.randomUUID(),
    requesterId,
    recipientId: recipient.id,
    status: "Pending",
    createdAt: now,
    updatedAt: now,
  };

  store.friendRequests.push(request);
  await saveStore(store);
  await createNotification(recipient.id, "friend.request", {
    requestId: request.id,
    requesterId,
    requesterName: requester.displayName,
  });

  return requestWithUsers(request, store.users);
}

export async function respondToFriendRequest(userId: string, requestId: string, accept: boolean) {
  const store = await loadStore();
  store.friendRequests = store.friendRequests ?? [];

  const request = store.friendRequests.find((candidate) => candidate.id === requestId);
  if (!request) throw new Error("Friend request not found.");
  if (request.recipientId !== userId) throw new Error("Only the invited commander can respond to this friend request.");
  if (request.status !== "Pending") throw new Error("This friend request is no longer pending.");

  const now = new Date().toISOString();
  request.status = accept ? "Accepted" : "Declined";
  request.updatedAt = now;
  request.respondedAt = now;
  await saveStore(store);
  await clearNotificationsForUserByPayload(userId, { type: "friend.request", payload: { requestId: request.id } });

  const recipient = store.users.find((user) => user.id === userId);
  await createNotification(request.requesterId, accept ? "friend.accepted" : "friend.declined", {
    requestId: request.id,
    friendUserId: userId,
    friendName: recipient?.displayName ?? "Commander",
  });

  return requestWithUsers(request, store.users);
}

export async function areUsersFriends(userAId: string, userBId: string): Promise<boolean> {
  const store = await loadStore();
  const requests = store.friendRequests ?? [];
  return requests.some(
    (request) =>
      request.status === "Accepted" &&
      ((request.requesterId === userAId && request.recipientId === userBId) ||
        (request.requesterId === userBId && request.recipientId === userAId)),
  );
}
