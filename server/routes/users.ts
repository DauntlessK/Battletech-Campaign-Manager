import express from "express";
import { requireAuth, RequestWithUser } from "../middleware/authMiddleware";
import { sanitizeUser, updateUserProfile } from "../services/authService";
import { clearNotificationsForUser, listNotificationsForUser } from "../services/notificationService";
import { listPendingInvitesForUser } from "../services/campaignService";
import { createFriendRequestByCode, listFriendRequestsForUser, listFriendsForUser, respondToFriendRequest } from "../services/friendService";

const router = express.Router();

router.get("/me", requireAuth, async (req: RequestWithUser, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Authentication required." });
  }

  res.json(sanitizeUser(user));
});

router.patch("/me", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const { displayName, password } = req.body;
    if (displayName === undefined && password === undefined) {
      return res.status(400).json({ error: "No profile fields provided." });
    }

    const updated = await updateUserProfile(user.id, { displayName, password });
    res.json(sanitizeUser(updated));
  } catch (error) {
    console.error("[routes/users] Update profile failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});


router.get("/me/friends", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const friends = await listFriendsForUser(user.id);
    res.json(friends);
  } catch (error) {
    console.error("[routes/users] List friends failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/me/friend-requests", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const requests = await listFriendRequestsForUser(user.id);
    res.json(requests);
  } catch (error) {
    console.error("[routes/users] List friend requests failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.post("/me/friend-requests", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const { friendCode } = req.body ?? {};
    if (!friendCode) return res.status(400).json({ error: "friendCode is required." });

    const request = await createFriendRequestByCode(user.id, String(friendCode));
    res.status(201).json(request);
  } catch (error) {
    console.error("[routes/users] Create friend request failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.post("/me/friend-requests/:id/respond", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const { accept } = req.body ?? {};
    if (accept === undefined) return res.status(400).json({ error: "accept is required." });

    const request = await respondToFriendRequest(user.id, req.params.id, Boolean(accept));
    res.json(request);
  } catch (error) {
    console.error("[routes/users] Respond to friend request failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/me/invites", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const invites = await listPendingInvitesForUser(user.id);
    res.json(invites);
  } catch (error) {
    console.error("[routes/users] List invites failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});


router.post("/me/notifications/clear", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    await clearNotificationsForUser(user.id);
    res.json([]);
  } catch (error) {
    console.error("[routes/users] Clear notifications failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/me/notifications", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const notes = await listNotificationsForUser(user.id);
    res.json(notes);
  } catch (error) {
    console.error("[routes/users] List notifications failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
