import type { Unit } from "../types/app";

export function normalizeCatalogUnit(unit: Unit): Unit {
  return {
    ...unit,
    name: unit.name || unit.chassis,
    type: unit.type || unit.unitType || "BattleMech",
    totalBV: Number(unit.totalBV ?? unit.bv ?? 0),
    costCBills: Number(unit.costCBills ?? 0),
    tonnage: Number(unit.tonnage ?? 0),
    year: Number(unit.year ?? 0),
    walk: Number(unit.walk ?? 0),
    run: Number(unit.run ?? 0),
    jump: Number(unit.jump ?? 0),
    heatSinks: Number(unit.heatSinks ?? 0),
    heatSinkType: unit.heatSinkType || "Single",
    role: unit.role || "Unknown",
    engine: unit.engine || "Unknown",
    gyro: unit.gyro || "Standard",
    cockpit: unit.cockpit || "Standard",
    era: normalizeEra(unit.era, Number(unit.year ?? 0)),
    techBase: unit.techBase || "Unknown",
    rulesLevel: normalizeRulesLevel(unit.rulesLevel),
    weightClass: unit.weightClass || weightClassFromTonnage(Number(unit.tonnage ?? 0)),
    weapons: unit.weapons ?? [],
    locations: unit.locations ?? [],
    quirks: unit.quirks ?? [],
    manufacturer: unit.manufacturer,
    factory: unit.factory,
    primaryFactory: unit.primaryFactory ?? unit.factory,
    systemManufacturers: unit.systemManufacturers ?? {},
    warnings: normalizeUnitWarnings(unit.warnings),
  };
}

export function normalizeRulesLevel(value: string | number | undefined) {
  const raw = String(value ?? "").trim();
  const lower = raw.toLowerCase();

  if (!raw) return "Unknown";
  if (["1", "intro", "introductory"].includes(lower)) return "Introductory";
  if (["2", "standard"].includes(lower)) return "Standard";
  if (["3", "advanced"].includes(lower)) return "Advanced";
  if (["4", "experimental"].includes(lower)) return "Experimental";
  if (["5", "unofficial"].includes(lower)) return "Unofficial";

  return raw;
}

export function normalizeEra(value: string | undefined, year: number) {
  const raw = String(value ?? "").trim();
  const lower = raw.toLowerCase();

  if (lower === "star league") return "Star League";
  if (lower === "succession wars") return "Succession Wars";
  if (lower === "clan invasion") return "Clan Invasion";
  if (lower === "civil war") return "Civil War";
  if (lower === "jihad") return "Jihad";
  if (lower === "republic") return "Republic";
  if (lower === "dark age") return "Dark Age";
  if (["ilclan", "ilclan era", "dark age / ilclan"].includes(lower)) return "IlClan";

  return eraFromYear(year);
}

export function eraFromYear(year: number) {
  if (!Number.isFinite(year) || year <= 0) return "";
  if (year <= 2780) return "Star League";
  if (year <= 3049) return "Succession Wars";
  if (year <= 3061) return "Clan Invasion";
  if (year <= 3067) return "Civil War";
  if (year <= 3080) return "Jihad";
  if (year <= 3130) return "Republic";
  if (year <= 3150) return "Dark Age";
  return "IlClan";
}

export function weightClassFromTonnage(tonnage: number) {
  if (!Number.isFinite(tonnage) || tonnage <= 0) return "";
  if (tonnage <= 35) return "Light";
  if (tonnage <= 55) return "Medium";
  if (tonnage <= 75) return "Heavy";
  return "Assault";
}


function normalizeUnitWarnings(value: Unit["warnings"]): Unit["warnings"] {
  if (!Array.isArray(value)) return [];
  return value;
}
