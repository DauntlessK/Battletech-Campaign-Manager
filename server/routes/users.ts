import express from "express";
import { requireAuth, RequestWithUser } from "../middleware/authMiddleware";
import { sanitizeUser, updateUserProfile } from "../services/authService";
import { listNotificationsForUser } from "../services/notificationService";
import { listPendingInvitesForUser } from "../services/campaignService";

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
