import express from "express";
import { sampleUnits } from "../data/sampleUnits";

const router = express.Router();

router.get("/", (req, res) => {
  const listItems = sampleUnits.map((unit) => ({
    id: unit.id,
    name: unit.name,
    model: unit.model,
    chassis: unit.chassis,
    type: unit.type,
    techBase: unit.techBase,
    era: unit.era,
    year: unit.year,
    tonnage: unit.tonnage,
    weightClass: unit.weightClass,
    costCBills: unit.costCBills,
    rulesLevel: unit.rulesLevel,
    totalBV: unit.totalBV,
    role: unit.role,
  }));

  res.json(listItems);
});

router.get("/:id", (req, res) => {
  const unit = sampleUnits.find((unit) => unit.id === req.params.id);

  if (!unit) {
    return res.status(404).json({
      error: "Unit not found",
      id: req.params.id,
    });
  }

  res.json(unit);
});

export default router;