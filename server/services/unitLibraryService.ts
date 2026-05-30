import fs from "fs/promises";
import path from "path";
import { Mek } from "../../src/files/Mek";
import { unitType } from "../../src/constants/enums";
import { installServerUnitFetch, setForcedMtfPath } from "./serverUnitFetch";
import { findCatalogItemById, getUnitCatalog, type UnitCatalogItem } from "./unitCatalogService";
import { mekToUnitDto } from "./mekToUnitDto";
import type { Unit } from "../types/unit";

export async function getTestMekUnit(): Promise<Unit> {
  installServerUnitFetch();

  const mek = await new Mek(
    unitType.Mek,
    null,
    null,
    "Atlas",
    "AS7-D"
  ).ready();

  return {
    ...mekToUnitDto(mek, "Atlas AS7-D.mtf"),
    detailSource: "mtf",
  };
}

export async function getAllUnitDefinitions() {
  return getUnitCatalog("meks");
}

export async function getUnitDefinitionById(id: string): Promise<Unit | null> {
  const catalogItem = await findCatalogItemById(id);

  if (!catalogItem) {
    return null;
  }

  if (catalogItem.detailPath) {
    try {
      const jsonText = await fs.readFile(path.resolve(process.cwd(), catalogItem.detailPath), "utf-8");
      const detail = JSON.parse(jsonText) as UnitDetailJson;
      return mapDetailJsonToUnit(detail, catalogItem);
    } catch (error) {
      console.warn(`[unitLibraryService] Failed to load unit detail JSON for ${id}:`, error);
    }
  }

  installServerUnitFetch();

  if (!catalogItem.relativePath) {
    return null;
  }

  try {
    setForcedMtfPath(catalogItem.relativePath);

    const mek = await new Mek(
      unitType.Mek,
      null,
      null,
      catalogItem.chassis,
      catalogItem.model
    ).ready();

      return {
        ...mekToUnitDto(mek, catalogItem.relativePath),
        detailSource: "mtf",
      };
  } finally {
    setForcedMtfPath(null);
  }
}
interface UnitDetailJson {
  catalog?: Record<string, any>;
  mtf?: {
    sourcePath?: string;
  };
  weapons?: Array<any>;
  locations?: Record<string, any>;
}

function mapDetailJsonToUnit(detail: UnitDetailJson, catalogItem: UnitCatalogItem): Unit {
  const catalog = detail.catalog ?? {};
  const mtf = detail.mtf ?? {};
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
    walk: Number(catalog.walkMP ?? catalogItem.walk ?? 0),
    run: Number(catalog.runMP ?? catalogItem.run ?? 0),
    jump: Number(catalog.jumpMP ?? catalogItem.jump ?? 0),
    heatSinks: Number(catalog.heatSinkCount ?? catalogItem.heatSinks ?? 0),
    heatSinkType: catalog.heatSinkType ?? catalogItem.heatSinkType,
    armor: getTotalArmor(locations),
    structure: getTotalStructure(locations),
    offensiveBV: 0,
    defensiveBV: 0,
    totalBV: Number(catalog.totalBV ?? catalog.bv ?? catalogItem.totalBV ?? 0),
    role: catalog.role ?? catalogItem.role ?? "Unknown",
    engine: catalog.engineType ?? catalog.engine ?? catalogItem.engine ?? "Unknown",
    gyro: catalog.gyroType ?? catalog.gyro ?? catalogItem.gyro ?? "Unknown",
    cockpit: catalog.cockpitType ?? "Standard",
    sourceFile: mtf.sourcePath ?? catalogItem.relativePath,
    fileName: catalog.fileName ?? catalogItem.fileName,
    relativePath: catalog.relativePath ?? catalogItem.relativePath,
    detailSource: "json",
    clanName: undefined,
    mulId: catalog.mulId ?? catalogItem.mulId,
    sourceBook: catalog.source ?? undefined,
    overview: undefined,
    capabilities: undefined,
    deployment: undefined,
    history: undefined,
    quirks: undefined,
    manufacturer: undefined,
    factory: undefined,
    myomer: undefined,
    armorType: catalog.armorType ?? catalogItem.armorType,
    structureType: catalog.structureType ?? catalogItem.structureType,
    weapons: mapDetailWeapons(weapons),
    locations: mapDetailLocations(locations),
  };
}

function mapDetailWeapons(weapons: any[]): Unit["weapons"] {
  return weapons.map((weapon, index) => {
    const name = weapon.displayName ?? weapon.referenceName ?? weapon.name ?? "Unknown Weapon";
    const damage = weapon.definition?.damage ?? weapon.damage ?? "—";
    const heat = Number(weapon.definition?.heat ?? weapon.heat ?? 0);
    const slots = Number(
      weapon.definition?.critSlots ?? weapon.definition?.spaceSlots ?? weapon.slots ?? 1
    );

    return {
      id: `${slugForWeaponId(weapon.referenceId ?? weapon.name ?? name)}-${index + 1}`,
      name,
      location: normalizeDisplayLocation(weapon.location ?? "Unknown"),
      damage,
      heat,
      range: formatWeaponRange(weapon.definition?.range ?? weapon.range ?? "—"),
      slots: Math.max(1, slots),
      ammo: weapon.definition?.ammo?.ammoId ?? weapon.definition?.ammo?.ammoType,
      shots: weapon.definition?.ammo ? weapon.definition?.ammo.shotsPerTon ?? weapon.definition?.ammoPerTon ?? "∞" : isEnergyWeapon(name) ? "∞" : 0,
    };
  });
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

  return "�";
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
  return /laser|pulse laser|gauss|flamer|particle projection|ppc/i.test(name);
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
    return sum + Number(location.armor ?? 0);
  }, 0);
}

function getTotalStructure(locations: Record<string, any>): number {
  return Object.values(locations).reduce((sum: number, location: any) => {
    return sum + Number(location.structure ?? 0);
  }, 0);
}
