import express from "express";
import { requireAuth, RequestWithUser } from "../middleware/authMiddleware";
import { createForce, listForcesForUser, assignForceToCampaign } from "../services/forceService";

const router = express.Router();

router.post("/", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const { name, unitIds, description } = req.body;
    if (!name) return res.status(400).json({ error: "Force name is required." });

    const force = await createForce(user.id, name, unitIds ?? [], description);
    res.status(201).json(force);
  } catch (error) {
    console.error("[routes/forces] Create force failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const forces = await listForcesForUser(user.id);
    res.json(forces);
  } catch (error) {
    console.error("[routes/forces] List forces failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.post("/:id/assign", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const forceId = req.params.id;
    const { campaignId } = req.body;
    if (!campaignId) return res.status(400).json({ error: "campaignId is required." });

    const copy = await assignForceToCampaign(forceId, campaignId, user.id);
    res.status(201).json(copy);
  } catch (error) {
    console.error("[routes/forces] Assign force failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
