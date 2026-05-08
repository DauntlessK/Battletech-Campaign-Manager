import express from "express";
import {
  getAllUnitDefinitions,
  getUnitDefinitionById,
  getTestMekUnit,
} from "../services/unitLibraryService";
import { getMtfIndex, findMtfByChassisModel } from "../services/mtfIndex";

const router = express.Router();

/**
 * Temporary test route:
 * Confirms that one hardcoded Mek can be constructed, parsed, mapped to Unit DTO,
 * and returned as JSON.
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
 * Temporary test route:
 * Confirms that the backend can scan src/data/units/meks and build an MTF index.
 */
router.get("/test/mtf-index", async (_req, res) => {
  try {
    const index = await getMtfIndex();

    res.json({
      count: index.size,
      firstTwenty: Array.from(index.values()).slice(0, 20),
    });
  } catch (error) {
    console.error("[routes/units] Failed to build MTF index:", error);

    res.status(500).json({
      error: "Failed to build MTF index",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * Temporary test route:
 * Confirms that a chassis/model pair can resolve to an actual .mtf file.
 *
 * Example:
 * /api/units/test/mtf-lookup/Atlas/AS7-D
 */
router.get("/test/mtf-lookup/:chassis/:model", async (req, res) => {
  try {
    const record = await findMtfByChassisModel(
      req.params.chassis,
      req.params.model
    );

    if (!record) {
      return res.status(404).json({
        error: "MTF not found",
        chassis: req.params.chassis,
        model: req.params.model,
      });
    }

    res.json(record);
  } catch (error) {
    console.error("[routes/units] Failed to lookup MTF:", error);

    res.status(500).json({
      error: "Failed to lookup MTF",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * Main units list route.
 *
 * Currently returns the curated STARTER_MEKS list from unitLibraryService.
 * Later this can return lightweight index/search records instead of full Unit DTOs.
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
        error: "Unit not found",
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