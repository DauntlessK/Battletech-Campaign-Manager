import express from "express";
import { requireAuth, RequestWithUser } from "../middleware/authMiddleware";
import {
  createForce,
  listForcesForUser,
  assignForceToCampaign,
  getForceById,
  addUnitToForce,
} from "../services/forceService";

const router = express.Router();

router.post("/", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const {
      name,
      unitIds,
      description,
      era,
      rulesLevel,
      totalBV,
      faction,
      forConquest,
      combatTeamCount,
      combatTeamBV,
    } = req.body;

    if (!name) return res.status(400).json({ error: "Force name is required." });

    const force = await createForce(
      user.id,
      name,
      unitIds ?? [],
      description,
      era,
      rulesLevel,
      typeof totalBV === "number" ? totalBV : undefined,
      typeof faction === "string" ? faction : undefined,
      typeof forConquest === "boolean" ? forConquest : undefined,
      typeof combatTeamCount === "number" ? combatTeamCount : undefined,
      typeof combatTeamBV === "number" ? combatTeamBV : undefined
    );
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

router.get("/:id", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const force = await getForceById(req.params.id);
    if (!force || force.ownerId !== user.id) {
      return res.status(404).json({ error: "Force not found." });
    }

    res.json(force);
  } catch (error) {
    console.error("[routes/forces] Get force failed:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.post("/:id/units", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const baseUnitId = req.body.baseUnitId;
    if (!baseUnitId) return res.status(400).json({ error: "baseUnitId is required." });

    const forceUnit = await addUnitToForce(req.params.id, baseUnitId, user.id);
    res.status(201).json(forceUnit);
  } catch (error) {
    console.error("[routes/forces] Add unit failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
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
