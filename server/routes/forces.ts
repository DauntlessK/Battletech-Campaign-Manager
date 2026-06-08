import express from "express";
import { requireAuth, RequestWithUser } from "../middleware/authMiddleware";
import {
  createForce,
  listForcesForUser,
  assignForceToCampaign,
  getForceById,
  addUnitToForce,
  updateForce,
  deleteForce,
  updateForceUnit,
  repairChaosForceUnit,
  quoteForceUnitDisposition,
  disposeForceUnit,
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

router.patch("/:id", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const force = await updateForce(req.params.id, user.id, {
      name: typeof req.body.name === "string" ? req.body.name : undefined,
      description: typeof req.body.description === "string" ? req.body.description : undefined,
      forceUnits: Array.isArray(req.body.forceUnits) ? req.body.forceUnits : undefined,
    });
    res.json(force);
  } catch (error) {
    console.error("[routes/forces] Update force failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.delete("/:id", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });
    await deleteForce(req.params.id, user.id);
    res.status(204).send();
  } catch (error) {
    console.error("[routes/forces] Delete force failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.post("/:id/units", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const baseUnitId = req.body.baseUnitId;
    if (!baseUnitId) return res.status(400).json({ error: "baseUnitId is required." });

    const force = await addUnitToForce(req.params.id, baseUnitId, user.id, typeof req.body.teamNumber === "number" ? req.body.teamNumber : undefined);
    res.status(201).json(force);
  } catch (error) {
    console.error("[routes/forces] Add unit failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.patch("/:id/units/:forceUnitId", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });

    const force = await updateForceUnit(req.params.id, req.params.forceUnitId, user.id, {
      teamNumber: typeof req.body.teamNumber === "number" ? req.body.teamNumber : undefined,
      sortOrder: typeof req.body.sortOrder === "number" ? req.body.sortOrder : undefined,
      pilotName: typeof req.body.pilotName === "string" ? req.body.pilotName : undefined,
      gunnery: typeof req.body.gunnery === "number" ? req.body.gunnery : undefined,
      piloting: typeof req.body.piloting === "number" ? req.body.piloting : undefined,
    });
    res.json(force);
  } catch (error) {
    console.error("[routes/forces] Update force unit failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.post("/:id/units/:forceUnitId/chaos-repair", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });
    const campaignId = typeof req.body.campaignId === "string" ? req.body.campaignId : "";
    if (!campaignId) return res.status(400).json({ error: "campaignId is required." });
    const result = await repairChaosForceUnit(req.params.id, req.params.forceUnitId, campaignId, user.id);
    res.json(result);
  } catch (error) {
    console.error("[routes/forces] Chaos repair failed:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
  }
});


router.post("/:id/units/:forceUnitId/disposition", requireAuth, async (req: RequestWithUser, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Authentication required." });
    const campaignId = typeof req.body.campaignId === "string" ? req.body.campaignId : "";
    const action = req.body.action === "salvage" ? "salvage" : req.body.action === "sell" ? "sell" : null;
    if (!campaignId || !action) return res.status(400).json({ error: "campaignId and a valid action are required." });
    const result = req.body.preview
      ? await quoteForceUnitDisposition(req.params.id, req.params.forceUnitId, campaignId, user.id, action)
      : await disposeForceUnit(req.params.id, req.params.forceUnitId, campaignId, user.id, action);
    res.json(result);
  } catch (error) {
    console.error("[routes/forces] Unit disposition failed:", error);
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
