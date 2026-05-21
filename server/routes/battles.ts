import express from "express";
import { requireAuth, RequestWithUser } from "../middleware/authMiddleware";
import {
  createBattle,
  getBattleById,
  listBattlesForCampaign,
  updateBattle,
  confirmBattle,
  deleteBattle,
} from "../services/battleService";

const router = express.Router();

router.post("/campaigns/:campaignId/battles", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user!;
    const campaignId = req.params.campaignId;
    const battle = await createBattle(campaignId, user.id, req.body);
    res.status(201).json(battle);
  } catch (error) {
    console.error("[routes/battles] create failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/campaigns/:campaignId/battles", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const campaignId = req.params.campaignId;
    const list = await listBattlesForCampaign(campaignId);
    res.json(list);
  } catch (error) {
    console.error("[routes/battles] list failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/:id", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const b = await getBattleById(req.params.id);
    if (!b) return res.status(404).json({ error: "Not found" });
    res.json(b);
  } catch (error) {
    console.error("[routes/battles] get failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.patch("/:id", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const updated = await updateBattle(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("[routes/battles] update failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.post("/:id/confirm", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const confirmed = await confirmBattle(req.params.id);
    res.json(confirmed);
  } catch (error) {
    console.error("[routes/battles] confirm failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.delete("/:id", requireAuth, async (req: RequestWithUser, res) => {
  try {
    await deleteBattle(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("[routes/battles] delete failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
