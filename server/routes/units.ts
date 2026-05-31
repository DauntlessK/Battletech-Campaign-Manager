import express from "express";
import {
  getAllUnitDefinitions,
  getUnitDefinitionById,
  getTestMekUnit,
} from "../services/unitLibraryService";

const router = express.Router();

/**
 * Temporary test route:
 * Confirms that one generated JSON Mek detail can be loaded and returned as JSON.
 */
router.get("/test/mek", async (_req, res) => {
  try {
    const unit = await getTestMekUnit();
    res.json(unit);
  } catch (error) {
    console.error("[routes/units] Failed to create test Mek:", error);

    res.status(500).json({
      error: "Failed to create test Mek",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * Main units list route.
 */
router.get("/", async (_req, res) => {
  try {
    const units = await getAllUnitDefinitions();
    res.json(units);
  } catch (error) {
    console.error("[routes/units] Failed to load unit definitions:", error);

    res.status(500).json({
      error: "Failed to load unit definitions",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * Main single-unit route.
 *
 * Example:
 * /api/units/as7-d
 */
router.get("/:id", async (req, res) => {
  try {
    const unit = await getUnitDefinitionById(req.params.id);

    if (!unit) {
      return res.status(404).json({
        error: "Generated unit detail JSON not found",
        id: req.params.id,
      });
    }

    res.json(unit);
  } catch (error) {
    console.error("[routes/units] Failed to load unit definition:", error);

    res.status(500).json({
      error: "Failed to load unit definition",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
