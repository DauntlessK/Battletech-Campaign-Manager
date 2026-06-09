import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import { loadStore } from "../services/storageService";

const router = Router();

router.use(requireAuth);

router.get("/", async (_req, res) => {
  try {
    const store = await loadStore();
    const saved = store.systemSettings?.find((entry) => entry.id === "global");

    res.json({
      id: "global",
      repairEstimateMultiplier: Math.max(
        1,
        Number(saved?.repairEstimateMultiplier ?? 1.5),
      ),
      unitsPerTechnician: Math.max(
        0.1,
        Number(saved?.unitsPerTechnician ?? 2),
      ),
      defaultTurnLengthDays: Math.max(
        1,
        Math.floor(Number(saved?.defaultTurnLengthDays ?? 5)),
      ),
      workDayMinutes: Math.max(
        1,
        Math.floor(Number(saved?.workDayMinutes ?? 480)),
      ),
      requisitionsPerTurn: Math.max(
        0,
        Math.floor(Number(saved?.requisitionsPerTurn ?? 10)),
      ),
      techExperience: ["Green", "Regular", "Veteran", "Elite"].includes(
        String(saved?.techExperience),
      )
        ? saved?.techExperience
        : "Regular",
      updatedAt: saved?.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error
          ? error.message
          : "Unable to load system settings.",
    });
  }
});

export default router;
