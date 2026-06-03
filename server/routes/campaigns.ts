import express from "express";
import { requireAuth, RequestWithUser } from "../middleware/authMiddleware";
import {
  beginCampaign,
  createCampaign,
  getCampaignById,
  inviteFriendToCampaign,
  inviteParticipant,
  isUserParticipant,
  listCampaignsForUser,
  respondToInvitation,
  setCampaignForce,
  uninviteCampaignParticipant,
  updateCampaign,
} from "../services/campaignService";

const router = express.Router();

router.post("/", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const { name, description, settings } = req.body;
    if (!name || !settings) return res.status(400).json({ error: "Name and settings are required." });

    const campaign = await createCampaign(user.id, name, description, settings);
    res.status(201).json(campaign);
  } catch (error) {
    console.error("[routes/campaigns] Create campaign failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const campaigns = await listCampaignsForUser(user.id);
    res.json(campaigns);
  } catch (error) {
    console.error("[routes/campaigns] List campaigns failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.patch("/:id", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const campaign = await updateCampaign(req.params.id, user.id, req.body ?? {});
    res.json(campaign);
  } catch (error) {
    console.error("[routes/campaigns] Update campaign failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});


router.post("/:id/begin", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const campaign = await beginCampaign(req.params.id, user.id);
    res.json(campaign);
  } catch (error) {
    console.error("[routes/campaigns] Begin campaign failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.patch("/:id/force", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const { forceId } = req.body ?? {};
    const campaign = await setCampaignForce(req.params.id, user.id, forceId || null);
    res.json(campaign);
  } catch (error) {
    console.error("[routes/campaigns] Set campaign force failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/:id", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const campaign = await getCampaignById(req.params.id, user.id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found." });
    // Very small access control: ensure the requesting user is an accepted participant
    // For MVP we require membership to view private campaign details.
    const allowed = await isUserParticipant(campaign.id, user.id);
    if (!allowed) return res.status(403).json({ error: "Access denied. You must be a campaign participant to view details." });

    res.json(campaign);
  } catch (error) {
    console.error("[routes/campaigns] Get campaign failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});


router.post("/:id/invite-friend", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const { friendUserId } = req.body ?? {};
    if (!friendUserId) return res.status(400).json({ error: "friendUserId is required." });

    const campaign = await inviteFriendToCampaign(req.params.id, user.id, String(friendUserId));
    res.status(201).json(campaign);
  } catch (error) {
    console.error("[routes/campaigns] Invite friend failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.post("/:id/uninvite", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const { participantUserId } = req.body ?? {};
    if (!participantUserId) return res.status(400).json({ error: "participantUserId is required." });

    const campaign = await uninviteCampaignParticipant(req.params.id, user.id, String(participantUserId));
    res.json(campaign);
  } catch (error) {
    console.error("[routes/campaigns] Uninvite failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.post("/:id/invite", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required to invite." });

    const participant = await inviteParticipant(req.params.id, user.id, userId);
    res.status(201).json(participant);
  } catch (error) {
    console.error("[routes/campaigns] Invite failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.post("/:id/respond", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const { accept } = req.body;
    if (accept === undefined) return res.status(400).json({ error: "accept (true|false) is required." });

    const campaign = await respondToInvitation(req.params.id, user.id, Boolean(accept));
    res.json(campaign);
  } catch (error) {
    console.error("[routes/campaigns] Respond to invite failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
