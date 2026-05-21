import express from "express";
import { requireAuth, RequestWithUser } from "../middleware/authMiddleware";
import { createObjective, getObjectiveById, listObjectivesForCampaign, updateObjective, deleteObjective } from "../services/objectiveService";

const router = express.Router();

router.post("/campaigns/:campaignId/objectives", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const campaignId = req.params.campaignId;
    const obj = await createObjective(campaignId, req.body);
    res.status(201).json(obj);
  } catch (error) {
    console.error("[routes/objectives] create failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/campaigns/:campaignId/objectives", requireAuth, async (_req: RequestWithUser, res) => {
  try {
    const campaignId = _req.params.campaignId;
    const list = await listObjectivesForCampaign(campaignId);
    res.json(list);
  } catch (error) {
    console.error("[routes/objectives] list failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/:id", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const o = await getObjectiveById(req.params.id);
    if (!o) return res.status(404).json({ error: "Not found" });
    res.json(o);
  } catch (error) {
    console.error("[routes/objectives] get failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.patch("/:id", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const updated = await updateObjective(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error("[routes/objectives] update failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.delete("/:id", requireAuth, async (req: RequestWithUser, res) => {
  try {
    await deleteObjective(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("[routes/objectives] delete failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
