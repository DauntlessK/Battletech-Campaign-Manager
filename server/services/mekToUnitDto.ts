import type { Unit, UnitLocation, UnitWeapon, CriticalSlot } from "../types/unit";

// Replace this with your real Mek type import once we know the exact export.
// Example:
// import type { Mek } from "../../src/files/mek";

type AnyMek = any;

const LOCATION_ORDER = [
  "Head",
  "Center Torso",
  "Right Torso",
  "Left Torso",
  "Right Arm",
  "Left Arm",
  "Right Leg",
  "Left Leg",
];

const LOCATION_IDS: Record<string, string> = {
  "Head": "head",
  "Center Torso": "ct",
  "Right Torso": "rt",
  "Left Torso": "lt",
  "Right Arm": "ra",
  "Left Arm": "la",
  "Right Leg": "rl",
  "Left Leg": "ll",
};

export function mekToUnitDto(mek: AnyMek, sourceFile?: string): Unit {
  const tonnage = Number(mek.mass ?? 0);
  const walk = Number(mek.walkMP ?? 0);
  const jump = Number(mek.jumpMP ?? 0);
  const run = Math.ceil(walk * 1.5);

  return {
    id: createUnitId(mek.chassis, mek.model, sourceFile),
    name: mek.chassis || "Unknown Chassis",
    model: mek.model || "Unknown Model",
    chassis: mek.chassis || "Unknown",

    type: "BattleMech",
    techBase: mapTechBase(mek.tech_base ?? mek.techBase ?? ""),
    era: mek.year > 0 ? String(mek.year) : "Unknown",
    year: Number(mek.year ?? 0),

    tonnage,
    weightClass: getWeightClass(tonnage),

    costCBills: 0,
    rulesLevel: mapRulesLevel(String(mek.rules_level ?? "")),

    walk,
    run,
    jump,

    heatSinks: Number(mek.heatSinks ?? 0),

    armor: totalArmor(mek),
    structure: totalStructure(mek),

    offensiveBV: 0,
    defensiveBV: 0,
    totalBV: Number(mek.bv ?? 0),

    role: mek.role || "Unknown",
    engine: mek.engine || "Unknown",
    gyro: mek.gyro || "Standard",
    cockpit: "Standard",

    sourceFile,

    clanName: readString(mek, ["clanName", "clan_name", "getClanName"]) || undefined,
    mulId: readString(mek, ["mulId", "mulID", "mul_id", "getMulId", "getMULId"]) || undefined,
    sourceBook: readString(mek, ["sourceBook", "source", "sourceFile", "getSourceBook", "getSource"]) || undefined,

    overview: readString(mek, ["overview", "getOverview"]) || undefined,
    capabilities: readString(mek, ["capabilities", "getCapabilities"]) || undefined,
    deployment: readString(mek, ["deployment", "getDeployment"]) || undefined,
    history: readString(mek, ["history", "getHistory"]) || undefined,

    quirks: readStringArray(mek, ["quirks", "designQuirks", "getQuirks", "getDesignQuirks"]),

    manufacturer: readString(mek, ["manufacturer", "manufacturers", "getManufacturer"]) || undefined,
    factory: readString(mek, ["factory", "factories", "getFactory"]) || undefined,
    myomer: readString(mek, ["myomer", "myomerType", "getMyomer"]) || undefined,
    armorType: readString(mek, ["armorType", "armor_type", "getArmorType"]) || undefined,
    structureType: readString(mek, ["structureType", "structure_type", "internalStructureType", "getStructureType"]) || undefined,
    heatSinkType: readString(mek, ["heatSinkType", "heat_sink_type", "sinkType", "getHeatSinkType"]) || "Single",

    weapons: mapWeapons(mek),
    locations: mapLocations(mek),
  };
}

function readStringArray(source: any, keys: string[]): string[] {
  for (const key of keys) {
    const value = readValue(source, key);

    if (Array.isArray(value)) {
      return value.map((item) => String(item)).filter(Boolean);
    }

    if (value instanceof Set) {
      return Array.from(value).map((item) => String(item)).filter(Boolean);
    }

    if (value instanceof Map) {
      return Array.from(value.values()).map((item) => String(item)).filter(Boolean);
    }

    if (typeof value === "string" && value.trim()) {
      return value
        .split(/[;,]/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function totalArmor(mek: AnyMek): number {
  return Object.values(mek.locations ?? {}).reduce((sum: number, location: any) => {
    return (
      sum +
      Number(location?.armor?.max ?? 0) +
      Number(location?.rearArmor?.max ?? 0)
    );
  }, 0);
}

function totalStructure(mek: AnyMek): number {
  return Object.values(mek.locations ?? {}).reduce((sum: number, location: any) => {
    return sum + Number(location?.structure?.max ?? 0);
  }, 0);
}

function mapLocations(mek: AnyMek): UnitLocation[] {
  const locationMap: Array<{
    key: string;
    id: string;
    name: string;
  }> = [
    { key: "head", id: "head", name: "Head" },
    { key: "centerTorso", id: "ct", name: "Center Torso" },
    { key: "leftTorso", id: "lt", name: "Left Torso" },
    { key: "rightTorso", id: "rt", name: "Right Torso" },
    { key: "leftArm", id: "la", name: "Left Arm" },
    { key: "rightArm", id: "ra", name: "Right Arm" },
    { key: "leftLeg", id: "ll", name: "Left Leg" },
    { key: "rightLeg", id: "rl", name: "Right Leg" },
  ];

  return locationMap.map(({ key, id, name }) => {
    const location = mek.locations?.[key];

    return {
      id,
      name,
      armor: Number(location?.armor?.max ?? location?.armor?.current ?? 0),
      rearArmor: location?.rearArmor
        ? Number(location.rearArmor.max ?? location.rearArmor.current ?? 0)
        : undefined,
      structure: Number(location?.structure?.max ?? location?.structure?.current ?? 0),
      slots: mapCriticalSlots(location?.slots ?? []),
    };
  });
}

function mapCriticalSlots(rawSlots: string[]): CriticalSlot[] {
  return rawSlots.map((item, index) => {
    const cleanItem = item && item !== "-Empty-" ? item : "Empty";

    return {
      slot: index + 1,
      item: cleanItem,
      type: slotType(cleanItem),
    };
  });
}

function mapWeapons(mek: AnyMek): UnitWeapon[] {
  const weaponEntries = Object.values(mek.weapons ?? {}) as any[];

  return weaponEntries.map((entry: any, index: number): UnitWeapon => {
    const weaponData = entry.data ?? {};
    const name = weaponData.name ?? entry.weapon ?? "Unknown Weapon";

    return {
      id: `${slug(entry.weaponId ?? name)}-${index + 1}`,
      name,
      location: normalizeDisplayLocation(entry.location ?? "Unknown"),
      damage: weaponData.damage ?? "—",
      heat: Number(weaponData.heat ?? 0),
      range: readWeaponRange(weaponData),
      slots: Number(
        weaponData.critSlots ??
        weaponData.slots ??
        weaponData.criticalSlots ??
        1
      ),
      ammo: weaponData.ammo?.ammoType ?? undefined,
      shots: weaponData.ammo?.shotsPerTon ?? weaponData.ammoPerTon ?? (isEnergyWeapon(name) ? "∞" : 0),
    };
  });
}

function readWeaponRange(weaponData: any): string {
  const range = weaponData.range;

  if (typeof range === "string") {
    return range;
  }

  if (range && typeof range === "object") {
    const short = range.short ?? 0;
    const medium = range.medium ?? 0;
    const long = range.long ?? 0;
    return `${short} / ${medium} / ${long}`;
  }

  const short = weaponData.short ?? weaponData.shortRange ?? 0;
  const medium = weaponData.medium ?? weaponData.mediumRange ?? 0;
  const long = weaponData.long ?? weaponData.longRange ?? 0;

  if (short || medium || long) {
    return `${short} / ${medium} / ${long}`;
  }

  return "—";
}

function normalizeDisplayLocation(location: string): string {
  const normalized = location.toLowerCase().replace(/\s+/g, " ").trim();

  const map: Record<string, string> = {
    head: "Head",
    "center torso": "Center Torso",
    ct: "Center Torso",
    "left torso": "Left Torso",
    lt: "Left Torso",
    "right torso": "Right Torso",
    rt: "Right Torso",
    "left arm": "Left Arm",
    la: "Left Arm",
    "right arm": "Right Arm",
    ra: "Right Arm",
    "left leg": "Left Leg",
    ll: "Left Leg",
    "right leg": "Right Leg",
    rl: "Right Leg",
  };

  return map[normalized] ?? location;
}

function getCriticalSlots(mek: AnyMek, locationName: string): CriticalSlot[] {
  const rawSlots =
    callMaybe(mek, "getCriticalSlots", locationName) ??
    callMaybe(mek, "getSlotsForLocation", locationName) ??
    mek.locations?.[locationName]?.slots ??
    mek.locations?.find?.((loc: any) => loc.name === locationName)?.slots ??
    [];

  return rawSlots.map((slot: any, index: number): CriticalSlot => {
    const item = typeof slot === "string" ? slot : slot?.item ?? slot?.name ?? "Empty";

    return {
      slot: typeof slot === "object" && slot?.slot ? slot.slot : index + 1,
      item,
      type: slotType(item),
    };
  });
}

function getLocationArmor(mek: AnyMek, locationName: string): number {
  return (
    callMaybe(mek, "getArmor", locationName) ??
    callMaybe(mek, "getLocationArmor", locationName) ??
    mek.armor?.[locationName] ??
    mek.locations?.[locationName]?.armor ??
    0
  );
}

function getRearArmor(mek: AnyMek, locationName: string): number | undefined {
  if (!["Center Torso", "Right Torso", "Left Torso"].includes(locationName)) {
    return undefined;
  }

  return (
    callMaybe(mek, "getRearArmor", locationName) ??
    callMaybe(mek, "getLocationRearArmor", locationName) ??
    mek.rearArmor?.[locationName] ??
    mek.locations?.[locationName]?.rearArmor ??
    0
  );
}

function getLocationStructure(mek: AnyMek, locationName: string): number {
  return (
    callMaybe(mek, "getStructure", locationName) ??
    callMaybe(mek, "getLocationStructure", locationName) ??
    mek.structure?.[locationName] ??
    mek.locations?.[locationName]?.structure ??
    0
  );
}

function getShotsForWeapon(mek: AnyMek, weapon: AnyMek): number | "∞" {
  const name = readString(weapon, ["name", "getName"]) || "";

  if (isEnergyWeapon(name)) {
    return "∞";
  }

  return (
    readNumber(weapon, ["shots", "ammoShots", "getShots"], NaN) ||
    callMaybe(mek, "getShotsForWeapon", name) ||
    0
  );
}

function readRange(weapon: AnyMek): string {
  const range = readString(weapon, ["range", "getRange"]);
  if (range) return range;

  const short = readNumber(weapon, ["short", "shortRange"], 0);
  const medium = readNumber(weapon, ["medium", "mediumRange"], 0);
  const long = readNumber(weapon, ["long", "longRange"], 0);

  if (short || medium || long) {
    return `${short} / ${medium} / ${long}`;
  }

  return "—";
}

function slotType(item: string): CriticalSlot["type"] {
  const lower = item.toLowerCase();

  if (lower === "empty") return "empty";
  if (lower.includes("ammo")) return "ammo";
  if (["engine", "gyro", "cockpit", "life support", "sensors"].some((part) => lower.includes(part))) return "engine";
  if (["shoulder", "upper", "lower", "hand", "hip", "foot"].some((part) => lower.includes(part))) return "structure";
  if (isWeaponName(lower)) return "weapon";

  return "equipment";
}

function isWeaponName(name: string): boolean {
  const lower = name.toLowerCase();
  return ["laser", "ac/", "rifle", "lrm", "srm", "machine gun", "ppc", "gauss"].some((part) => lower.includes(part));
}

function isEnergyWeapon(name: string): boolean {
  const lower = name.toLowerCase();
  return ["laser", "ppc", "flamer"].some((part) => lower.includes(part));
}

function getWeightClass(tonnage: number): Unit["weightClass"] {
  if (tonnage <= 35) return "Light";
  if (tonnage <= 55) return "Medium";
  if (tonnage <= 75) return "Heavy";
  return "Assault";
}

function mapTechBase(value: string): Unit["techBase"] {
  const lower = value.toLowerCase();

  if (lower.includes("clan")) return "Clan";
  if (lower.includes("mixed")) return "Mixed";

  return "Inner Sphere";
}

function mapRulesLevel(value: string): Unit["rulesLevel"] {
  const lower = value.toLowerCase();

  if (lower.includes("experimental")) return "Experimental";
  if (lower.includes("advanced")) return "Advanced";
  if (lower.includes("standard")) return "Standard";

  return "Introductory";
}

function createUnitId(chassis: string, model: string, sourceFile?: string): string {
  return slug(`${model || chassis || sourceFile || "unit"}`);
}

function slug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\.mtf$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readString(source: any, keys: string[]): string {
  for (const key of keys) {
    const value = readValue(source, key);
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }

  return "";
}

function readNumber(source: any, keys: string[], fallback: number): number {
  for (const key of keys) {
    const value = readValue(source, key);
    const num = Number(value);

    if (Number.isFinite(num)) return num;
  }

  return fallback;
}

function readNumberOrString(source: any, keys: string[], fallback: number | string): number | string {
  for (const key of keys) {
    const value = readValue(source, key);

    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return fallback;
}

function readValue(source: any, key: string): unknown {
  if (!source) return undefined;

  if (typeof source[key] === "function") {
    return source[key]();
  }

  return source[key];
}

function callMaybe(source: any, methodName: string, ...args: any[]): any {
  if (!source || typeof source[methodName] !== "function") return undefined;
  return source[methodName](...args);
}