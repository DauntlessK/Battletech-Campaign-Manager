import fs from "fs/promises";
import path from "path";
import { findCatalogItemById, getUnitCatalog, type UnitCatalogItem } from "./unitCatalogService";
import type { CriticalSlot, Unit } from "../types/unit";

const UNIT_DETAIL_DIR = path.resolve(
  process.cwd(),
  "server",
  "data",
  "generated",
  "unitDetails",
  "meks"
);

export async function getTestMekUnit(): Promise<Unit> {
  const units = await getUnitCatalog("meks");
  const catalogItem = units.find((unit) => unit.detailPath) ?? units[0];

  if (!catalogItem) {
    throw new Error("No unit catalog rows are available.");
  }

  const unit = await getUnitDefinitionById(catalogItem.id);

  if (!unit) {
    throw new Error(`No generated JSON detail found for test unit ${catalogItem.id}.`);
  }

  return unit;
}

export async function getAllUnitDefinitions() {
  return getUnitCatalog("meks");
}

export async function getUnitDefinitionById(id: string): Promise<Unit | null> {
  const catalogItem = await findCatalogItemById(id);

  if (!catalogItem) {
    return null;
  }

  const detail = await loadUnitDetailJson(catalogItem);

  if (!detail) {
    console.warn(
      `[unitLibraryService] No generated unit detail JSON found for ${id}; MTF fallback is disabled.`
    );
    return null;
  }

  return mapDetailJsonToUnit(detail, catalogItem);
}

async function loadUnitDetailJson(catalogItem: UnitCatalogItem): Promise<UnitDetailJson | null> {
  const candidatePaths = buildUnitDetailPathCandidates(catalogItem);

  for (const candidatePath of candidatePaths) {
    try {
      const jsonText = await fs.readFile(candidatePath, "utf-8");
      return JSON.parse(jsonText) as UnitDetailJson;
    } catch (error: any) {
      if (error?.code !== "ENOENT") {
        console.warn(
          `[unitLibraryService] Failed to load unit detail JSON for ${catalogItem.id} from ${candidatePath}:`,
          error
        );
      }
    }
  }

  return null;
}

function buildUnitDetailPathCandidates(catalogItem: UnitCatalogItem): string[] {
  const candidates = new Set<string>();

  if (catalogItem.detailPath) {
    candidates.add(path.resolve(process.cwd(), catalogItem.detailPath));
  }

  const baseNames = [
    catalogItem.id,
    catalogItem.name,
    `${catalogItem.chassis} ${catalogItem.model}`,
    catalogItem.fileName?.replace(/\.mtf$/i, ""),
  ];

  for (const baseName of baseNames) {
    const slug = slugForFileName(baseName);
    if (slug) {
      candidates.add(path.join(UNIT_DETAIL_DIR, `${slug}.json`));
    }
  }

  return Array.from(candidates);
}

function slugForFileName(value: string | undefined): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\.mtf$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface UnitDetailJson {
  catalog?: Record<string, any>;
  mtf?: {
    sourcePath?: string;
    rawFields?: Record<string, any>;
  };
  fluff?: Record<string, any>;
  weapons?: Array<any>;
  locations?: Record<string, any>;
  warnings?: Array<any>;
}

function mapDetailJsonToUnit(detail: UnitDetailJson, catalogItem: UnitCatalogItem): Unit {
  const catalog = detail.catalog ?? {};
  const fluff = detail.fluff ?? {};
  const rawFields = detail.mtf?.rawFields ?? {};
  const weapons = Array.isArray(detail.weapons) ? detail.weapons : [];
  const locations = detail.locations ?? {};

  return {
    id: catalogItem.id,
    name: catalog.name ?? catalogItem.name,
    model: catalog.model ?? catalogItem.model,
    chassis: catalog.chassis ?? catalogItem.chassis,
    type: "BattleMech",
    techBase: catalog.techBase ?? catalogItem.techBase,
    era: String(catalog.era ?? catalogItem.era ?? "Unknown"),
    year: Number(catalog.year ?? catalogItem.year ?? 0),
    tonnage: Number(catalog.tonnage ?? catalogItem.tonnage ?? 0),
    weightClass: (catalog.weightClass ?? catalogItem.weightClass ?? "Unknown") as Unit["weightClass"],
    costCBills: Number(catalog.costCBills ?? catalogItem.costCBills ?? 0),
    rulesLevel: (catalog.rulesLevel ?? catalogItem.rulesLevel ?? "Unknown") as Unit["rulesLevel"],
    walk: Number(catalog.walkMP ?? catalog.walk ?? catalogItem.walk ?? 0),
    run: Number(catalog.runMP ?? catalog.run ?? catalogItem.run ?? 0),
    jump: Number(catalog.jumpMP ?? catalog.jump ?? catalogItem.jump ?? 0),
    heatSinks: Number(catalog.heatSinkCount ?? catalog.heatSinks ?? catalogItem.heatSinks ?? 0),
    heatSinkType: catalog.heatSinkType ?? catalogItem.heatSinkType,
    armor: getTotalArmor(locations),
    structure: getTotalStructure(locations),
    offensiveBV: 0,
    defensiveBV: 0,
    totalBV: Number(catalog.totalBV ?? catalog.bv ?? catalogItem.totalBV ?? 0),
    role: catalog.role ?? catalogItem.role ?? "Unknown",
    engine: catalog.engine ?? catalog.engineType ?? catalogItem.engine ?? catalogItem.engineType ?? "Unknown",
    engineRating: catalog.engineRating ?? catalogItem.engineRating,
    engineType: catalog.engineType ?? catalogItem.engineType ?? catalogItem.engine,
    gyro: catalog.gyroType ?? catalog.gyro ?? catalogItem.gyro ?? "Unknown",
    cockpit: catalog.cockpitType ?? catalog.cockpit ?? "Standard",
    sourceFile: catalog.source ?? catalogItem.fileName,
    fileName: catalog.fileName ?? catalogItem.fileName,
    relativePath: catalog.relativePath ?? catalogItem.relativePath,
    detailSource: "json",
    clanName: undefined,
    mulId: catalog.mulId ?? catalogItem.mulId,
    sourceBook: catalog.source ?? undefined,
    overview: fluff.overview,
    capabilities: fluff.capabilities,
    deployment: fluff.deployment,
    history: fluff.history,
    quirks: normalizeQuirks(fluff.quirks ?? catalog.quirks ?? rawFields.quirks ?? rawFields.quirk),
    manufacturer: fluff.manufacturer ?? rawFields.manufacturer,
    factory: fluff.primaryFactory ?? fluff.factory ?? rawFields.primaryFactory ?? rawFields.factory,
    primaryFactory: fluff.primaryFactory ?? fluff.factory ?? rawFields.primaryFactory ?? rawFields.factory,
    systemManufacturers: normalizeSystemManufacturers(fluff.systemManufacturer ?? fluff.systemManufacturers ?? rawFields.systemManufacturer),
    myomer: fluff.myomer,
    armorType: catalog.armorType ?? catalogItem.armorType,
    structureType: catalog.structureType ?? catalogItem.structureType,
    weapons: mapDetailWeapons(weapons, locations),
    locations: mapDetailLocations(locations),
    warnings: normalizeUnitWarnings(detail.warnings),
  };
}

function normalizeQuirks(value: unknown): string[] {
  const rawValues = Array.isArray(value) ? value : String(value ?? "").split(/[,;|]/g);

  return rawValues
    .map((quirk) => String(quirk ?? "").trim())
    .filter(Boolean)
    .map(formatQuirkName);
}

function formatQuirkName(value: string): string {
  const specialWords: Record<string, string> = {
    is: "IS",
    clan: "Clan",
    c3: "C3",
    lrm: "LRM",
    srm: "SRM",
  };

  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w+\b/g, (word) => specialWords[word.toLowerCase()] ?? word.charAt(0).toUpperCase() + word.slice(1));
}

function normalizeSystemManufacturers(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .map(([key, manufacturer]) => [formatSystemManufacturerLabel(key), String(manufacturer ?? "").trim()])
      .filter(([, manufacturer]) => Boolean(manufacturer))
  );
}

function formatSystemManufacturerLabel(value: string): string {
  const labels: Record<string, string> = {
    chassis: "Chassis",
    engine: "Engine",
    armor: "Armor",
    communications: "Communications",
    targeting: "Targeting",
    jumpjet: "Jump Jets",
    myomer: "Myomer",
  };

  const normalized = value.trim().toLowerCase();
  return labels[normalized] ?? value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
}

function normalizeUnitWarnings(warnings: UnitDetailJson["warnings"]): Unit["warnings"] {
  if (!Array.isArray(warnings)) return [];
  return warnings
    .map((warning) => {
      if (typeof warning === "string") return warning;
      if (warning && typeof warning === "object") {
        return {
          severity: typeof warning.severity === "string" ? warning.severity : undefined,
          code: typeof warning.code === "string" ? warning.code : undefined,
          field: typeof warning.field === "string" ? warning.field : undefined,
          message: typeof warning.message === "string" ? warning.message : String(warning.message ?? "").trim() || undefined,
        };
      }
      return String(warning ?? "").trim();
    })
    .filter((warning) => {
      if (typeof warning === "string") return warning.length > 0;
      return Boolean(warning.message || warning.code || warning.field || warning.severity);
    });
}

function mapDetailWeapons(weapons: any[], locations: UnitDetailJson["locations"]): Unit["weapons"] {
  const ammoTotals = getAmmoShotTotals(locations);

  return weapons.map((weapon, index) => {
    const name = weapon.displayName ?? weapon.referenceName ?? weapon.name ?? "Unknown Weapon";
    const damage = weapon.definition?.damage ?? weapon.damage ?? "—";
    const heat = Number(weapon.definition?.heat ?? weapon.heat ?? 0);
    const slots = Number(
      weapon.definition?.critSlots ?? weapon.definition?.spaceSlots ?? weapon.slots ?? 1
    );
    const ammoId = getWeaponAmmoId(weapon);

    return {
      id: `${slugForWeaponId(weapon.referenceId ?? weapon.name ?? name)}-${index + 1}`,
      name,
      location: normalizeDisplayLocation(weapon.location ?? "Unknown"),
      damage,
      heat,
      range: formatWeaponRange(weapon.definition?.range ?? weapon.range ?? "—"),
      slots: Math.max(1, slots),
      ammo: ammoId,
      shots: getWeaponShotDisplay(name, ammoId, ammoTotals),
    };
  });
}

function getWeaponShotDisplay(
  weaponName: string,
  ammoId: string | undefined,
  ammoTotals: Record<string, number>,
): number | "∞" {
  if (!ammoId) {
    return isEnergyWeapon(weaponName) ? "∞" : 0;
  }

  return ammoTotals[normalizeAmmoKey(ammoId)] ?? 0;
}

function getWeaponAmmoId(weapon: any): string | undefined {
  const explicitAmmoId =
    weapon.definition?.ammo?.ammoId ??
    weapon.definition?.ammo?.id ??
    weapon.definition?.ammo?.ammoType ??
    weapon.ammoId ??
    weapon.ammo;

  if (!explicitAmmoId) return undefined;

  return String(explicitAmmoId);
}

function getAmmoShotTotals(locations: UnitDetailJson["locations"]): Record<string, number> {
  const totals: Record<string, number> = {};

  for (const location of Object.values(locations ?? {})) {
    const slots = Array.isArray(location?.slots) ? location.slots : [];

    for (const slot of slots) {
      if (slot?.type !== "ammo") continue;

      const ammoId = getAmmoSlotId(slot);
      if (!ammoId) continue;

      const shots = getAmmoSlotShots(slot);
      if (!Number.isFinite(shots) || shots <= 0) continue;

      totals[ammoId] = (totals[ammoId] ?? 0) + shots;
    }
  }

  return totals;
}

function getAmmoSlotId(slot: any): string | undefined {
  const ammoId =
    slot.ammoRef ??
    slot.referenceId ??
    slot.normalizedId ??
    slot.normalized;

  const normalized = normalizeAmmoKey(ammoId);
  return normalized || undefined;
}

function getAmmoSlotShots(slot: any): number {
  const rawShots =
    slot.shotsPerTon ??
    slot.shots ??
    slot.definition?.shotsPerTon ??
    slot.definition?.shots;

  if (typeof rawShots === "string" && rawShots.toUpperCase() === "OS") return 1;

  const shots = Number(rawShots);
  return Number.isFinite(shots) ? shots : 0;
}

function normalizeAmmoKey(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/^is\s+/i, "is_")
    .replace(/^clan\s+/i, "clan_")
    .replace(/\bammo\b/i, "ammo")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function formatWeaponRange(range: any): string {
  if (typeof range === "string") {
    return range;
  }

  if (range && typeof range === "object") {
    const short = range.short ?? range.min ?? 0;
    const medium = range.medium ?? range.mediumRange ?? 0;
    const long = range.long ?? range.longRange ?? 0;

    if (short || medium || long) {
      return `${short} / ${medium} / ${long}`;
    }
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

function slugForWeaponId(value: string): string {
  return String(value ?? "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isEnergyWeapon(name: string): boolean {
  return /laser|pulse laser|flamer|particle projection|ppc/i.test(name);
}

function mapDetailLocations(locations: Record<string, any>): Unit["locations"] {
  const orderedLocations = Object.values(locations).sort((a: any, b: any) => {
    const order = [
      "Head",
      "Center Torso",
      "Right Torso",
      "Left Torso",
      "Right Arm",
      "Left Arm",
      "Right Leg",
      "Left Leg",
    ];

    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  return orderedLocations.map((location: any) => ({
    id: normalizeLocationId(location.key ?? location.name ?? "unknown-location"),
    name: location.name ?? "Unknown",
    armor: Number(location.armor ?? 0),
    rearArmor: location.rearArmor !== undefined ? Number(location.rearArmor) : undefined,
    structure: Number(location.structure ?? 0),
    slots: Array.isArray(location.slots)
      ? location.slots.map((slot: any, index: number) => ({
          slot: slot.slotIndex ?? index + 1,
          item: slot.displayName ?? slot.referenceName ?? slot.raw ?? "Empty",
          type: mapDetailSlotType(slot),
        }))
      : [],
  }));
}

function normalizeLocationId(value: string): string {
  const normalized = String(value).toLowerCase().replace(/[^a-z0-9]+/g, "");

  const map: Record<string, string> = {
    head: "head",
    centertorso: "ct",
    lefttorso: "lt",
    righttorso: "rt",
    leftarm: "la",
    rightarm: "ra",
    leftleg: "ll",
    rightleg: "rl",
    ct: "ct",
    lt: "lt",
    rt: "rt",
    la: "la",
    ra: "ra",
    ll: "ll",
    rl: "rl",
  };

  return map[normalized] ?? slugForWeaponId(value);
}

function mapDetailSlotType(slot: any): CriticalSlot["type"] {
  if (!slot || slot.type === "empty") return "empty";
  if (slot.type === "weapon") return "weapon";
  if (slot.type === "ammo") return "ammo";
  if (slot.type === "system") {
    const label = String(slot.displayName ?? slot.referenceName ?? slot.raw ?? "").toLowerCase();
    if (label.includes("engine")) return "engine";
    if (label.includes("structure") || label.includes("armor")) return "structure";
    return "equipment";
  }
  return "equipment";
}

function getTotalArmor(locations: Record<string, any>): number {
  return Object.values(locations).reduce((sum: number, location: any) => {
    return sum + Number(location.armor ?? 0) + Number(location.rearArmor ?? 0);
  }, 0);
}

function getTotalStructure(locations: Record<string, any>): number {
  return Object.values(locations).reduce((sum: number, location: any) => {
    return sum + Number(location.structure ?? 0);
  }, 0);
}
