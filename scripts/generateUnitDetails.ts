import fs from "fs/promises";
import path from "path";
import { WEAPONS, AMMO } from "../src/data/weapons";
import { COMPONENTS } from "../src/data/components";

type CsvRow = Record<string, string>;

type CliOptions = {
  unitIndexPath: string;
  outputDir: string;
  unitQuery: string | null;
  chassisQuery: string | null;
  unitIds: string[];
  randomCount: number;
  randomSeed: string;
  embedDefinitions: boolean;
  pretty: boolean;
};

type MtfKeyValue = {
  key: string;
  value: string;
};

type WeaponDefinition = Record<string, any>;
type ComponentDefinition = Record<string, any>;
type AmmoDefinition = Record<string, any>;
type DefinitionSource = "weapon" | "component" | "ammo";

type AvailabilityByEra = {
  starLeague: string;
  successionWars: string;
  clanInvasion: string;
  darkAge?: string;
  introduced?: string;
  extinct?: string;
  reintroduced?: string;
};

type DetailLocationSlot = {
  slotIndex: number;
  raw: string;
  normalized: string;
  isRearFacing?: boolean;
  type: "empty" | "weapon" | "ammo" | "equipment" | "system";
  displayName: string;
  referenceId: string;
  referenceName: string;
  referenceSource: DefinitionSource | "";
  weaponRef?: string;
  ammoRef?: string;
  techRating?: string;
  availability?: AvailabilityByEra;
  cost?: any;
};

type DetailLocation = {
  key: MekLocationKey;
  name: string;
  armor: number;
  rearArmor?: number;
  slotCapacity: number;
  slots: DetailLocationSlot[];
};

type DetailWeapon = {
  ref: string;
  index: number;
  name: string;
  location: string;
  isRearFacing?: boolean;
  quantityIndex: number;
  referenceId: string;
  referenceName: string;
  referenceSource: DefinitionSource | "";
  displayName: string;
  definition?: WeaponDefinition;
};

type UnitDetailJson = {
  schemaVersion: 1;
  generatedAt: string;
  catalog: Record<string, string>;
  mtf: {
    fileName: string;
    relativePath: string;
    sourcePath: string;
    rawFields: Record<string, string>;
  };
  fluff: Record<string, any>;
  weapons: DetailWeapon[];
  locations: Partial<Record<MekLocationKey, DetailLocation>>;
  warnings: string[];
};

type MekLocationKey =
  | "head"
  | "centerTorso"
  | "leftTorso"
  | "rightTorso"
  | "leftArm"
  | "rightArm"
  | "leftLeg"
  | "rightLeg"
  | "frontLeftLeg"
  | "frontRightLeg"
  | "rearLeftLeg"
  | "rearRightLeg";

type LocationDefinition = {
  key: MekLocationKey;
  mtfName: string;
  armorKeys: string[];
  rearArmorKeys?: string[];
};

const UNITS_ROOT = path.resolve(process.cwd(), "src", "data", "units");
const DEFAULT_UNIT_INDEX_PATH = path.resolve(process.cwd(), "server", "data", "generated", "unitIndex", "meks.csv");
const DEFAULT_OUTPUT_DIR = path.resolve(process.cwd(), "server", "data", "generated", "unitDetails", "meks");

const LOCATION_DEFS: LocationDefinition[] = [
  { key: "head", mtfName: "Head", armorKeys: ["HD armor", "Head armor"] },
  { key: "centerTorso", mtfName: "Center Torso", armorKeys: ["CT armor", "Center Torso armor"], rearArmorKeys: ["RTC armor", "CTR armor", "Center Torso Rear armor"] },
  { key: "leftTorso", mtfName: "Left Torso", armorKeys: ["LT armor", "Left Torso armor"], rearArmorKeys: ["RTL armor", "LTR armor", "Left Torso Rear armor"] },
  { key: "rightTorso", mtfName: "Right Torso", armorKeys: ["RT armor", "Right Torso armor"], rearArmorKeys: ["RTR armor", "RTRL armor", "Right Torso Rear armor"] },
  { key: "leftArm", mtfName: "Left Arm", armorKeys: ["LA armor", "Left Arm armor"] },
  { key: "rightArm", mtfName: "Right Arm", armorKeys: ["RA armor", "Right Arm armor"] },
  { key: "leftLeg", mtfName: "Left Leg", armorKeys: ["LL armor", "Left Leg armor"] },
  { key: "rightLeg", mtfName: "Right Leg", armorKeys: ["RL armor", "Right Leg armor"] },
  { key: "frontLeftLeg", mtfName: "Front Left Leg", armorKeys: ["FLL armor", "Front Left Leg armor"] },
  { key: "frontRightLeg", mtfName: "Front Right Leg", armorKeys: ["FRL armor", "Front Right Leg armor"] },
  { key: "rearLeftLeg", mtfName: "Rear Left Leg", armorKeys: ["RLL armor", "Rear Left Leg armor"] },
  { key: "rearRightLeg", mtfName: "Rear Right Leg", armorKeys: ["RRL armor", "Rear Right Leg armor"] },
];

const CATALOG_FIELDS_TO_OMIT = new Set(["weaponCount", "weaponSummary"]);

async function main(): Promise<void> {
  const options = getCliOptions();
  const csvText = await fs.readFile(options.unitIndexPath, "utf-8");
  const rows = parseCsv(csvText);
  let selectedRows = rows.filter((row) => row.unitType === "meks" && matchesUnitSelection(row, options));
  selectedRows = applyRandomSelection(selectedRows, options);
  const manifest: Array<Record<string, string>> = [];

  await fs.mkdir(options.outputDir, { recursive: true });
  const usedOutputFileNames = new Set<string>();

  if (selectedRows.length === 0) {
    console.warn("[generateUnitDetails] No units matched the requested filter.");
    if (options.unitQuery) console.warn(`[generateUnitDetails] unit query: ${options.unitQuery}`);
    if (options.chassisQuery) console.warn(`[generateUnitDetails] chassis query: ${options.chassisQuery}`);
    if (options.unitIds.length) console.warn(`[generateUnitDetails] explicit ids: ${options.unitIds.join(", ")}`);
    if (options.randomCount > 0) console.warn(`[generateUnitDetails] random sample: ${options.randomCount} seed=${options.randomSeed}`);
  }

  for (const [index, row] of selectedRows.entries()) {
    const detail = await buildUnitDetail(row, options);
    const outputFileName = getUniqueDetailFileName(row, index + 1, usedOutputFileNames);
    const outputPath = path.join(options.outputDir, outputFileName);
    const json = JSON.stringify(detail, null, options.pretty ? 2 : 0);

    await fs.writeFile(outputPath, `${json}\n`, "utf-8");

    if (detail.warnings.length > 0) {
      console.warn(`[generateUnitDetails][warnings] ${detail.catalog.name}: ${detail.warnings.length}`);
      for (const warning of detail.warnings.slice(0, 20)) {
        console.warn(`  - ${warning}`);
      }
      if (detail.warnings.length > 20) {
        console.warn(`  - ... ${detail.warnings.length - 20} more`);
      }
    }

    manifest.push({
      id: row.id,
      name: row.name,
      chassis: row.chassis,
      model: row.model,
      mulId: row.mulId || "",
      relativePath: row.relativePath,
      detailPath: path.relative(process.cwd(), outputPath).replace(/\\/g, "/"),
    });

    if ((index + 1) % 250 === 0) {
      console.log(`[generateUnitDetails] wrote ${index + 1}/${selectedRows.length}`);
    }
  }

  await fs.writeFile(path.join(options.outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf-8");

  console.log(`[generateUnitDetails] input rows: ${rows.length}`);
  if (options.unitQuery) console.log(`[generateUnitDetails] unit query: ${options.unitQuery}`);
  if (options.chassisQuery) console.log(`[generateUnitDetails] chassis query: ${options.chassisQuery}`);
  if (options.unitIds.length) console.log(`[generateUnitDetails] explicit ids: ${options.unitIds.join(", ")}`);
  if (options.randomCount > 0) console.log(`[generateUnitDetails] random sample: ${options.randomCount} seed=${options.randomSeed}`);
  console.log(`[generateUnitDetails] generated details: ${selectedRows.length}`);
  console.log(`[generateUnitDetails] output: ${options.outputDir}`);
}

async function buildUnitDetail(row: CsvRow, options: CliOptions): Promise<UnitDetailJson> {
  const mtfPath = path.resolve(UNITS_ROOT, row.relativePath);
  const content = await fs.readFile(mtfPath, "utf-8");
  const lines = content.split(/\r?\n/);
  const keyValues = parseAllKeyValues(lines);
  const rawFields = Object.fromEntries(
    keyValues
      .filter((field) => !shouldOmitFromRawFields(field.key))
      .map((field) => [field.key, field.value])
  );

  const warnings: string[] = [];
  const weapons = buildWeapons(lines, row.techBase, options.embedDefinitions, row.name, warnings);
  const weaponSlotRefMap = buildWeaponSlotRefMap(weapons);
  const locations = buildLocations(lines, keyValues, row.techBase, options.embedDefinitions, row.name, warnings, weaponSlotRefMap, weapons);

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    catalog: getCatalogPayload(row),
    mtf: {
      fileName: row.fileName,
      relativePath: row.relativePath,
      sourcePath: path.relative(process.cwd(), mtfPath).replace(/\\/g, "/"),
      rawFields,
    },
    fluff: parseFluffSections(lines),
    weapons,
    locations,
    warnings,
  };
}

function getCatalogPayload(row: CsvRow): Record<string, string> {
  return Object.fromEntries(Object.entries(row).filter(([key]) => !CATALOG_FIELDS_TO_OMIT.has(key)));
}

function isQuadMekConfig(config: string, slotSections: Map<MekLocationKey, string[]>): boolean {
  const normalizedConfig = normalizeLookupText(config);
  return normalizedConfig.includes("quad") || slotSections.has("frontLeftLeg") || slotSections.has("frontRightLeg") || slotSections.has("rearLeftLeg") || slotSections.has("rearRightLeg");
}

function getApplicableLocationDefs(isQuad: boolean): LocationDefinition[] {
  const bipedOnly = new Set<MekLocationKey>(["leftArm", "rightArm", "leftLeg", "rightLeg"]);
  const quadOnly = new Set<MekLocationKey>(["frontLeftLeg", "frontRightLeg", "rearLeftLeg", "rearRightLeg"]);
  return LOCATION_DEFS.filter((definition) => isQuad ? !bipedOnly.has(definition.key) : !quadOnly.has(definition.key));
}

function locationSupportsRearArmor(locationKey: MekLocationKey): boolean {
  return locationKey === "centerTorso" || locationKey === "leftTorso" || locationKey === "rightTorso";
}

function getLocationSlotCapacity(locationKey: MekLocationKey): number {
  return locationKey === "head" ? 6 : 12;
}

function trimSlotsToPhysicalCapacity(locationKey: MekLocationKey, slots: string[]): string[] {
  return slots.slice(0, getLocationSlotCapacity(locationKey));
}

function buildLocations(
  lines: string[],
  keyValues: MtfKeyValue[],
  techBase: string,
  embedDefinitions: boolean,
  unitName: string,
  warnings: string[],
  weaponSlotRefMap: Map<string, string>,
  weapons: DetailWeapon[]
): Partial<Record<MekLocationKey, DetailLocation>> {
  const slotSections = parseLocationSlotSections(lines);
  const config = getFieldValue(keyValues, "config");
  const isQuad = isQuadMekConfig(config, slotSections);
  const result: Partial<Record<MekLocationKey, DetailLocation>> = {};

  for (const definition of getApplicableLocationDefs(isQuad)) {
    const rawSlots = trimSlotsToPhysicalCapacity(definition.key, slotSections.get(definition.key) ?? []);
    const location: DetailLocation = {
      key: definition.key,
      name: definition.mtfName,
      armor: getFirstNumberField(keyValues, definition.armorKeys),
      slotCapacity: getLocationSlotCapacity(definition.key),
      slots: rawSlots.map((slot, index) =>
        buildLocationSlot(slot, index + 1, techBase, embedDefinitions, unitName, definition.mtfName, warnings, weaponSlotRefMap, weapons)
      ),
    };

    if (locationSupportsRearArmor(definition.key)) {
      location.rearArmor = getFirstNumberField(keyValues, definition.rearArmorKeys ?? []);
    }

    result[definition.key] = location;
  }

  return result;
}

function buildLocationSlot(
  rawSlot: string,
  slotIndex: number,
  techBase: string,
  embedDefinitions: boolean,
  unitName: string,
  locationName: string,
  warnings: string[],
  weaponSlotRefMap: Map<string, string>,
  weapons: DetailWeapon[]
): DetailLocationSlot {
  const normalized = normalizeLookupText(rawSlot);
  const rawType = classifyRawSlotForDetail(rawSlot);

  if (rawType === "ammo") {
    const ammo = resolveAmmoDefinition(rawSlot, techBase);
    const weaponRef = findWeaponRefForAmmoSlot(ammo, weapons);

    return {
      slotIndex,
      raw: rawSlot,
      normalized,
      type: "ammo",
      displayName: ammo?.name ?? stripSlotAnnotations(rawSlot),
      referenceId: ammo?.id ?? "",
      referenceName: ammo?.name ?? "",
      referenceSource: ammo ? "ammo" : "",
      ...(ammo ? { ammoRef: ammo.id } : {}),
      ...(weaponRef ? { weaponRef } : {}),
      ...(ammo?.bv !== undefined ? { bv: ammo.bv } as any : {}),
      ...(ammo?.costPerTon !== undefined ? { costPerTon: ammo.costPerTon } as any : {}),
      ...(ammo?.shotsPerTon !== undefined ? { shotsPerTon: ammo.shotsPerTon } as any : {}),
    } as DetailLocationSlot;
  }

  const resolved = resolveDefinition(rawSlot, techBase);
  const type = classifySlot(rawSlot, resolved);
  const isRearFacing = isRearFacingText(rawSlot);
  const baseDisplayName = resolved?.definition?.name ? String(resolved.definition.name) : getFallbackSlotDisplayName(rawSlot, type);
  const displayName = withRearFacingSuffix(baseDisplayName, isRearFacing);
  const weaponRef = findWeaponRefForSlot(rawSlot, locationName, resolved, weaponSlotRefMap);

  if (!resolved && shouldWarnForUnresolvedSlot(rawSlot, type)) {
    warnings.push(`Unresolved slot: ${unitName} ${locationName} slot ${slotIndex}: "${rawSlot}"`);
  }

  if (type === "weapon" && !weaponRef) {
    warnings.push(`Weapon slot not linked to mounted weapon: ${unitName} ${locationName} slot ${slotIndex}: "${rawSlot}"`);
  }

  return {
    slotIndex,
    raw: rawSlot,
    normalized,
    ...(isRearFacing ? { isRearFacing: true } : {}),
    type,
    displayName,
    referenceId: resolved?.definition?.id ?? "",
    referenceName: resolved?.definition?.name ?? "",
    referenceSource: resolved?.source ?? "",
    ...(weaponRef ? { weaponRef } : {}),
    ...(resolved?.source === "component" ? getCompactComponentDetails(resolved.definition) : {}),
  };
}

function buildWeapons(
  lines: string[],
  techBase: string,
  embedDefinitions: boolean,
  unitName: string,
  warnings: string[]
): DetailWeapon[] {
  const weaponLines = parseWeaponsSection(lines);
  const quantityByNameLocation = new Map<string, number>();

  if (weaponLines.length === 0) {
    warnings.push(`No Weapons section entries parsed for ${unitName}`);
  }

  return weaponLines.map((line, index) => {
    const parsed = parseWeaponLine(line);
    const resolved = resolveWeaponDefinition(parsed.name, techBase);
    if (!resolved) warnings.push(`Unresolved weapon: ${unitName}: "${parsed.name}" (${parsed.location})`);

    const key = `${normalizeLookupText(parsed.name)}|${normalizeLookupText(parsed.location)}`;
    const quantityIndex = (quantityByNameLocation.get(key) ?? 0) + 1;
    quantityByNameLocation.set(key, quantityIndex);

    return {
      ref: `weapon-${index + 1}`,
      index: index + 1,
      name: parsed.name,
      location: parsed.location,
      ...(parsed.isRearFacing ? { isRearFacing: true } : {}),
      quantityIndex,
      referenceId: resolved?.id ?? "",
      referenceName: resolved?.name ?? "",
      referenceSource: resolved ? "weapon" : "",
      displayName: withRearFacingSuffix(resolved?.name ?? parsed.name, parsed.isRearFacing),
      ...(embedDefinitions && resolved ? { definition: normalizeDefinitionForJson(resolved) } : {}),
    };
  });
}

function buildWeaponSlotRefMap(weapons: DetailWeapon[]): Map<string, string> {
  const map = new Map<string, string>();
  const fallbackByWeaponName = new Map<string, Set<string>>();

  for (const weapon of weapons) {
    const locationKey = normalizeLookupText(weapon.location);
    const nameKeys = [
      weapon.name,
      weapon.displayName,
      weapon.referenceName,
      weapon.referenceId,
      stripTechPrefixFromNormalizedText(normalizeLookupText(weapon.referenceId)),
      ...(Array.isArray(weapon.definition?.altNames) ? weapon.definition.altNames : []),
    ].filter(Boolean).map((value) => normalizeLookupText(String(value)));

    for (const nameKey of new Set(nameKeys)) {
      if (!nameKey) continue;
      map.set(`${locationKey}|${nameKey}`, weapon.ref);

      const existing = fallbackByWeaponName.get(nameKey) ?? new Set<string>();
      existing.add(weapon.ref);
      fallbackByWeaponName.set(nameKey, existing);
    }
  }

  for (const [nameKey, refs] of fallbackByWeaponName.entries()) {
    if (refs.size === 1) {
      map.set(`*|${nameKey}`, [...refs][0]);
    }
  }

  return map;
}

function findWeaponRefForSlot(
  rawSlot: string,
  locationName: string,
  resolved: { source: DefinitionSource; definition: WeaponDefinition } | null,
  weaponSlotRefMap: Map<string, string>
): string {
  if (resolved?.source !== "weapon") return "";

  const locationKey = normalizeLookupText(locationName);
  const keys = [
    rawSlot,
    stripSlotAnnotations(rawSlot),
    resolved.definition.id,
    resolved.definition.name,
    ...(Array.isArray(resolved.definition.altNames) ? resolved.definition.altNames : []),
  ].filter(Boolean).map((value) => normalizeLookupText(String(value)));

  for (const key of keys) {
    const locationMatch = weaponSlotRefMap.get(`${locationKey}|${key}`);
    if (locationMatch) return locationMatch;
  }

  for (const key of keys) {
    const fallbackMatch = weaponSlotRefMap.get(`*|${key}`);
    if (fallbackMatch) return fallbackMatch;
  }

  return "";
}

function parseAllKeyValues(lines: string[]): MtfKeyValue[] {
  return lines.map(parseKeyValueLine).filter((value): value is MtfKeyValue => Boolean(value));
}

function parseKeyValueLine(line: string): MtfKeyValue | null {
  const match = line.match(/^\s*([^:#][^:=]*?)\s*[:=]\s*(.*?)\s*$/);
  if (!match) return null;
  return { key: match[1].trim(), value: match[2].trim() };
}

function parseLocationSlotSections(lines: string[]): Map<MekLocationKey, string[]> {
  const sections = new Map<MekLocationKey, string[]>();
  let currentLocation: MekLocationKey | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const locationKey = normalizeLocationHeader(line);
    if (locationKey) {
      currentLocation = locationKey;
      if (!sections.has(currentLocation)) sections.set(currentLocation, []);
      continue;
    }

    if (isNonLocationSectionHeader(line) || isTopLevelMtfFieldBoundary(line)) {
      currentLocation = null;
      continue;
    }

    if (currentLocation) sections.get(currentLocation)?.push(line);
  }

  return sections;
}

function parseWeaponsSection(lines: string[]): string[] {
  const weaponLines: string[] = [];
  let inWeapons = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^weapons\s*:\s*\d*\s*$/i.test(line) || /^weapons\s*$/i.test(line)) {
      inWeapons = true;
      continue;
    }

    if (inWeapons && (normalizeLocationHeader(line) || isNonLocationSectionHeader(line) || isTopLevelMtfFieldBoundary(line))) {
      break;
    }

    if (inWeapons) weaponLines.push(line);
  }

  return weaponLines;
}

function parseWeaponLine(line: string): { name: string; location: string; isRearFacing: boolean } {
  const parts = line.split(",").map((part) => part.trim());
  const name = parts[0] ?? "";
  const location = parts.slice(1).join(", ") || "";
  const isRearFacing = isRearFacingText(line);

  return {
    name: stripSlotAnnotations(name),
    location: location.replace(/\(R\)/gi, "").trim(),
    isRearFacing,
  };
}

function parseFluffSections(lines: string[]): Record<string, any> {
  const sections = new Map<string, string[]>();
  const manufacturerValues: string[] = [];
  const primaryFactoryValues: string[] = [];
  const systemManufacturers: Record<string, string> = {};
  let currentSection: string | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const parsed = parseKeyValueLine(line);

    if (parsed) {
      const key = normalizeMtfKey(parsed.key);

      if (key === "manufacturer") {
        manufacturerValues.push(parsed.value);
        currentSection = null;
        continue;
      }

      if (key === "primaryfactory") {
        primaryFactoryValues.push(parsed.value);
        currentSection = null;
        continue;
      }

      if (key === "systemmanufacturer") {
        const parsedSystemManufacturer = parseSystemManufacturerValue(parsed.value);
        if (parsedSystemManufacturer) {
          systemManufacturers[parsedSystemManufacturer.system] = parsedSystemManufacturer.manufacturer;
        }
        currentSection = null;
        continue;
      }

      const inlineFluffHeader = normalizeFluffSectionHeader(parsed.key);
      if (inlineFluffHeader) {
        sections.set(inlineFluffHeader, [parsed.value]);
        currentSection = inlineFluffHeader;
        continue;
      }
    }

    const header = normalizeFluffSectionHeader(line);
    if (header) {
      currentSection = header;
      if (!sections.has(currentSection)) sections.set(currentSection, []);
      continue;
    }

    if (currentSection && isHardSectionBoundary(line)) {
      currentSection = null;
      continue;
    }

    if (currentSection) {
      sections.get(currentSection)?.push(line);
    }
  }

  const fluff: Record<string, any> = Object.fromEntries(
    [...sections.entries()]
      .map(([section, sectionLines]) => [section, sectionLines.join("\n").trim()])
      .filter(([, value]) => Boolean(value))
  );

  if (manufacturerValues.length > 0) fluff.manufacturer = manufacturerValues.join(",");
  if (primaryFactoryValues.length > 0) fluff.primaryFactory = primaryFactoryValues.join(",");
  if (Object.keys(systemManufacturers).length > 0) fluff.systemManufacturer = systemManufacturers;

  return fluff;
}

function parseSystemManufacturerValue(value: string): { system: string; manufacturer: string } | null {
  const match = String(value ?? "").match(/^\s*([^:]+)\s*:\s*(.*?)\s*$/);
  if (!match) return null;
  return { system: toCamelCaseKey(match[1]), manufacturer: match[2].trim() };
}

function toCamelCaseKey(value: string): string {
  const words = String(value ?? "").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  if (words.length === 0) return "unknown";
  return words.map((word, index) => index === 0 ? word : `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join("");
}

function normalizeFluffSectionHeader(line: string): string | null {
  const normalized = line.trim().replace(/:$/, "").toLowerCase();
  const map: Record<string, string> = {
    overview: "overview",
    capabilities: "capabilities",
    capability: "capabilities",
    deployment: "deployment",
    history: "history",
    variants: "variants",
    variant: "variants",
    notable: "notables",
    notables: "notables",
    battlehistory: "battleHistory",
    "battle history": "battleHistory",
    fluff: "fluff",
  };
  return map[normalized] ?? null;
}

function parseQuirks(lines: string[]): string[] {
  const quirks: string[] = [];
  let inQuirks = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/^quirks\s*:?$/i.test(line)) {
      inQuirks = true;
      continue;
    }

    if (inQuirks && (normalizeLocationHeader(line) || isNonLocationSectionHeader(line))) {
      break;
    }

    if (inQuirks) quirks.push(line.replace(/^[-*]\s*/, ""));

    const parsed = parseKeyValueLine(line);
    if (parsed && normalizeMtfKey(parsed.key) === "quirks") {
      quirks.push(...parsed.value.split(/[;,]/).map((value) => value.trim()).filter(Boolean));
    }
  }

  return [...new Set(quirks)];
}

function isNonLocationSectionHeader(line: string): boolean {
  return /^(weapons|quirks|fluff|overview|deployment|history|capabilities|variants|notables|battle history)\s*:?\s*\d*$/i.test(line);
}

function isTopLevelMtfFieldBoundary(line: string): boolean {
  const parsed = parseKeyValueLine(line);
  if (!parsed) return false;
  const key = normalizeMtfKey(parsed.key);
  return new Set([
    "overview", "capabilities", "deployment", "history", "variants", "variant",
    "notables", "notable", "battlehistory", "fluff", "manufacturer", "primaryfactory",
    "systemmanufacturer",
    "masterunitlistid",
    "mulid",
    "notes",
    "fluffimage",
    "imagefile", "source", "sourcebook", "ruleslevel", "rules", "role", "quirks",
  ]).has(key);
}

function isHardSectionBoundary(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (normalizeLocationHeader(trimmed)) return true;
  return /^(weapons|quirks|system quirks|weapon quirks|manufacturer|primary factory|primaryfactory|systemmanufacturer|chassis|model|config|mass|engine|structure|myomer|heat sinks|armor)\s*:?/i.test(trimmed);
}

function normalizeLocationHeader(line: string): MekLocationKey | null {
  const normalized = line.toLowerCase().replace(/:$/, "").replace(/\s+/g, " ").trim();
  const map: Record<string, MekLocationKey> = {
    head: "head",
    hd: "head",
    "center torso": "centerTorso",
    ct: "centerTorso",
    "left torso": "leftTorso",
    lt: "leftTorso",
    "right torso": "rightTorso",
    rt: "rightTorso",
    "left arm": "leftArm",
    la: "leftArm",
    "right arm": "rightArm",
    ra: "rightArm",
    "left leg": "leftLeg",
    ll: "leftLeg",
    "right leg": "rightLeg",
    rl: "rightLeg",
    "front left leg": "frontLeftLeg",
    fll: "frontLeftLeg",
    "front right leg": "frontRightLeg",
    frl: "frontRightLeg",
    "rear left leg": "rearLeftLeg",
    rll: "rearLeftLeg",
    "rear right leg": "rearRightLeg",
    rrl: "rearRightLeg",
  };
  return map[normalized] ?? null;
}

function resolveAmmoDefinition(rawValue: string, unitTechBase: string): AmmoDefinition | null {
  const normalized = normalizeLookupText(rawValue);
  if (!normalized.includes("ammo")) return null;

  const cleaned = normalizeAmmoLookupText(rawValue);
  const desiredTechBase = inferTechBaseFromRawText(rawValue) || normalizeTechBase(unitTechBase);
  const candidates: Array<{ definition: AmmoDefinition; score: number }> = [];

  for (const [key, definition] of Object.entries(AMMO as Record<string, AmmoDefinition>)) {
    const values = [
      key,
      definition.id,
      definition.name,
      definition.ammoType,
      ...(Array.isArray(definition.compatibleWeaponNames) ? definition.compatibleWeaponNames : []),
      ...(Array.isArray(definition.weaponIds) ? definition.weaponIds : []),
    ].filter(Boolean).map((value) => normalizeAmmoLookupText(String(value)));

    let score = 0;
    if (values.some((value) => value === cleaned)) {
      score = 260;
    } else if (values.some((value) => cleaned.includes(value) || value.includes(cleaned))) {
      score = 160;
    } else {
      const withoutAmmo = cleaned.replace(/ammo/g, "");
      if (values.some((value) => {
        const candidate = value.replace(/ammo/g, "");
        return withoutAmmo && (withoutAmmo.includes(candidate) || candidate.includes(withoutAmmo));
      })) {
        score = 130;
      }
    }

    if (score <= 0) continue;
    score += getTechBaseScore(definition, desiredTechBase);
    candidates.push({ definition, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.definition ?? null;
}

function normalizeAmmoLookupText(value: string): string {
  return normalizeLookupText(value)
    .replace(/^clanammo/, "clan")
    .replace(/^isammo/, "is")
    .replace(/^ammo/, "");
}

function findWeaponRefForAmmoSlot(ammo: AmmoDefinition | null, weapons: DetailWeapon[]): string {
  if (!ammo) return "";

  const weaponIds = Array.isArray(ammo.weaponIds)
    ? ammo.weaponIds.map((value) => normalizeLookupText(String(value)))
    : [];
  if (weaponIds.length === 0) return "";

  const matchingRefs = new Set<string>();
  for (const weapon of weapons) {
    if (weaponIds.includes(normalizeLookupText(weapon.referenceId))) {
      matchingRefs.add(weapon.ref);
    }
  }

  return matchingRefs.size === 1 ? [...matchingRefs][0] : "";
}

function resolveDefinition(rawValue: string, unitTechBase: string): { source: DefinitionSource; definition: WeaponDefinition } | null {
  const weapon = resolveWeaponDefinition(rawValue, unitTechBase);
  if (weapon) return { source: "weapon", definition: weapon };

  const component = resolveComponentDefinition(rawValue);
  if (component) return { source: "component", definition: component };

  return null;
}

function resolveWeaponDefinition(rawValue: string, unitTechBase: string): WeaponDefinition | null {
  return findBestDefinitionMatch(rawValue, WEAPONS as Record<string, WeaponDefinition>, unitTechBase);
}

function resolveComponentDefinition(rawValue: string): ComponentDefinition | null {
  return findBestDefinitionMatch(rawValue, COMPONENTS as Record<string, ComponentDefinition>, "");
}

function findBestDefinitionMatch<T extends Record<string, any>>(
  rawValue: string,
  definitions: Record<string, T>,
  unitTechBase: string
): T | null {
  const cleaned = stripSlotAnnotations(rawValue);
  const normalizedRaw = normalizeLookupText(rawValue);
  const normalizedCleaned = normalizeLookupText(cleaned);
  const strippedCleaned = stripTechPrefixFromNormalizedText(normalizedCleaned);
  const desiredTechBase = inferTechBaseFromRawText(rawValue) || normalizeTechBase(unitTechBase);
  const candidates: Array<{ definition: T; score: number }> = [];

  for (const [key, definition] of Object.entries(definitions)) {
    const values = [
      key,
      definition.id,
      definition.name,
      definition.family,
      ...(Array.isArray(definition.altNames) ? definition.altNames : []),
    ].filter(Boolean).map((value) => normalizeLookupText(String(value)));

    let score = 0;

    if (values.some((value) => value === normalizedRaw || value === normalizedCleaned || value === strippedCleaned)) {
      score = 240;
    } else if (values.some((value) => normalizedCleaned.includes(value) || value.includes(normalizedCleaned))) {
      score = 140;
    } else if (values.some((value) => strippedCleaned && (strippedCleaned.includes(value) || value.includes(strippedCleaned)))) {
      score = 120;
    }

    if (score <= 0) continue;
    score += getTechBaseScore(definition, desiredTechBase);
    candidates.push({ definition, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.definition ?? null;
}

function classifyRawSlotForDetail(rawSlot: string): DetailLocationSlot["type"] {
  const normalized = normalizeLookupText(rawSlot);
  if (!normalized || normalized === "empty" || normalized === "none") return "empty";
  if (normalized.includes("ammo")) return "ammo";
  return "equipment";
}

function classifySlot(rawSlot: string, resolved?: { source: DefinitionSource; definition: WeaponDefinition } | null): DetailLocationSlot["type"] {
  const normalized = normalizeLookupText(rawSlot);
  if (!normalized || normalized === "empty" || normalized === "none") return "empty";
  if (normalized.includes("ammo")) return "ammo";

  const category = normalizeLookupText(String(resolved?.definition?.category || ""));

  if (resolved?.source === "weapon") {
    if (category.includes("energy") || category.includes("ballistic") || category.includes("missile") || category.includes("weapon")) return "weapon";
    return "equipment";
  }

  if (resolved?.source === "component") return "system";

  if (
    normalized.includes("engine") ||
    normalized.includes("gyro") ||
    normalized.includes("cockpit") ||
    normalized.includes("lifesupport") ||
    normalized.includes("sensors") ||
    normalized.includes("actuator") ||
    normalized.includes("shoulder") ||
    normalized.includes("upperarm") ||
    normalized.includes("lowerarm") ||
    normalized.includes("hand") ||
    normalized.includes("hip") ||
    normalized.includes("upperleg") ||
    normalized.includes("lowerleg") ||
    normalized.includes("foot")
  ) return "system";

  return "equipment";
}

function getFallbackSlotDisplayName(rawSlot: string, type: DetailLocationSlot["type"]): string {
  if (type === "empty") return "Empty";
  return stripSlotAnnotations(rawSlot);
}

function shouldWarnForUnresolvedSlot(rawSlot: string, type: DetailLocationSlot["type"]): boolean {
  if (type === "empty") return false;
  const normalized = normalizeLookupText(rawSlot);
  if (!normalized) return false;

  const knownSystemFragments = [
    "engine", "gyro", "cockpit", "lifesupport", "sensors", "shoulder", "upperarm",
    "lowerarm", "hand", "hip", "upperleg", "lowerleg", "foot", "endosteel",
    "avionics",
    "landinggear",
    "arrestinghoist",
    "lifthoist",
    "artemisiv",
    "aes",
    "partialwing",
    "impactresistant",
    "ballisticreinforced", "endocomposite",
  ];

  return !knownSystemFragments.some((fragment) => normalized.includes(fragment));
}

function getCompactComponentDetails(definition: ComponentDefinition): {
  techRating?: string;
  availability?: AvailabilityByEra;
  cost?: any;
} {
  return {
    ...(definition.techRating ? { techRating: String(definition.techRating) } : {}),
    ...(definition.availability ? { availability: normalizeAvailability(definition.availability) } : {}),
    ...(definition.cost ? { cost: definition.cost } : {}),
  };
}

function normalizeDefinitionForJson<T extends Record<string, any>>(definition: T): T {
  return {
    ...definition,
    ...(definition.availability ? { availability: normalizeAvailability(definition.availability) } : {}),
  };
}

function normalizeAvailability(value: string | AvailabilityByEra | any | undefined): AvailabilityByEra {
  if (!value) return { starLeague: "", successionWars: "", clanInvasion: "" };

  if (typeof value === "string") return availabilityFromCode(value);

  if (typeof value.code === "string") {
    const availability = availabilityFromCode(value.code);
    return {
      ...availability,
      ...(value.introduced ? { introduced: value.introduced } : {}),
      ...(value.extinct ? { extinct: value.extinct } : {}),
      ...(value.reintroduced ? { reintroduced: value.reintroduced } : {}),
    };
  }

  return value;
}

function availabilityFromCode(code: string): AvailabilityByEra {
  const [starLeague = "", successionWars = "", clanInvasion = "", darkAge = ""] = code.split("-").map((part) => part.trim());
  return { starLeague, successionWars, clanInvasion, ...(darkAge ? { darkAge } : {}) };
}

function isRearFacingText(rawValue: string): boolean {
  return /\(R\)|\brear\b/i.test(String(rawValue ?? ""));
}

function withRearFacingSuffix(displayName: string, isRearFacing: boolean): string {
  if (!isRearFacing) return displayName;
  return /\(R\)\s*$/i.test(displayName) ? displayName : `${displayName} (R)`;
}

function getFieldValue(fields: MtfKeyValue[], ...keys: string[]): string {
  const normalizedKeys = keys.map(normalizeMtfKey);
  for (const field of fields) {
    if (normalizedKeys.includes(normalizeMtfKey(field.key))) return field.value;
  }
  return "";
}

function getFirstNumberField(fields: MtfKeyValue[], keys: string[]): number {
  for (const key of keys) {
    const value = getFieldValue(fields, key);
    if (value) return toNumber(value);
  }
  return 0;
}

function applyRandomSelection(rows: CsvRow[], options: CliOptions): CsvRow[] {
  if (options.randomCount <= 0) return rows;
  if (options.randomCount >= rows.length) return rows;

  const random = createSeededRandom(options.randomSeed);
  const shuffled = [...rows];

  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, options.randomCount);
}

function createSeededRandom(seedText: string): () => number {
  let seed = hashSeed(seedText || "default");

  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
}

function hashSeed(seedText: string): number {
  let hash = 2166136261;

  for (let index = 0; index < seedText.length; index++) {
    hash ^= seedText.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function matchesUnitSelection(row: CsvRow, options: CliOptions): boolean {
  if (options.unitIds.length > 0) {
    const normalizedIdSet = new Set(options.unitIds.map(normalizeLookupText));
    const candidateIds = [row.id, row.name, `${row.chassis} ${row.model}`.trim(), row.model, row.fileName, row.mulId].map(normalizeLookupText);
    return candidateIds.some((candidate) => normalizedIdSet.has(candidate));
  }

  if (options.chassisQuery) return normalizeLookupText(row.chassis) === normalizeLookupText(options.chassisQuery);
  return matchesUnitQuery(row, options.unitQuery);
}

function matchesUnitQuery(row: CsvRow, query: string | null): boolean {
  if (!query) return true;
  const normalizedQuery = normalizeLookupText(query);
  const exactCandidates = [
    row.id,
    row.name,
    `${row.chassis} ${row.model}`.trim(),
    row.model,
    row.fileName.replace(/\.mtf$/i, ""),
    row.mulId,
  ].map(normalizeLookupText);

  return exactCandidates.some((candidate) => candidate === normalizedQuery);
}

function parseCsv(csvText: string): CsvRow[] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const next = csvText[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      current.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;
      current.push(field);
      field = "";
      if (current.some((value) => value.length > 0)) rows.push(current);
      current = [];
    } else {
      field += char;
    }
  }

  current.push(field);
  if (current.some((value) => value.length > 0)) rows.push(current);

  const [headers, ...body] = rows;
  if (!headers) return [];

  return body.map((row) => {
    const object: CsvRow = {};
    headers.forEach((header, index) => {
      object[header] = row[index] ?? "";
    });
    return object;
  });
}

function getCliOptions(): CliOptions {
  const args = process.argv.slice(2);

  const getArg = (name: string, fallback = ""): string => {
    const equalsPrefix = `--${name}=`;
    const equalsMatch = args.find((arg) => arg.startsWith(equalsPrefix));
    if (equalsMatch) return equalsMatch.slice(equalsPrefix.length);

    const flagIndex = args.indexOf(`--${name}`);
    if (flagIndex >= 0) {
      const next = args[flagIndex + 1];
      if (next && !next.startsWith("--")) return next;
      return "true";
    }

    return fallback;
  };

  const getCsvArg = (name: string): string[] => {
    const value = getArg(name, "");
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  };

  const unitQuery = getArg("model") || getArg("unit") || getArg("name") || "";
  const chassisQuery = getArg("chassis") || "";
  const unitIds = [...getCsvArg("id"), ...getCsvArg("ids")];
  const randomCount = parsePositiveInteger(getArg("random", getArg("random-count", getArg("sample", "0"))));
  const randomSeed = getArg("seed", String(Date.now()));

  return {
    unitIndexPath: path.resolve(process.cwd(), getArg("unit-index", getArg("index", DEFAULT_UNIT_INDEX_PATH))),
    outputDir: path.resolve(process.cwd(), getArg("out", DEFAULT_OUTPUT_DIR)),
    unitQuery: unitQuery || null,
    chassisQuery: chassisQuery || null,
    unitIds,
    randomCount,
    randomSeed,
    embedDefinitions: !args.includes("--refs-only"),
    pretty: !args.includes("--minify"),
  };
}

function shouldOmitFromRawFields(key: string): boolean {
  const normalized = normalizeMtfKey(key);
  return new Set([
    "config", "engine", "myomer", "ejection", "ejectionsystem", "ejectiontype",
    "quirks", "overview", "capabilities", "deployment", "history", "variants",
    "variant", "notables", "notable", "battlehistory", "fluff", "manufacturer",
    "primaryfactory", "systemmanufacturer",
  ]).has(normalized);
}

function parsePositiveInteger(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function normalizeMtfKey(value: string): string {
  return normalizeLookupText(value);
}

function normalizeLookupText(value: string | undefined): string {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function stripSlotAnnotations(value: string): string {
  return String(value ?? "")
    .replace(/\(R\)/gi, "")
    .replace(/\(OMNIPOD\)/gi, "")
    .replace(/\(T\)/gi, "")
    .replace(/^-Empty-$/i, "Empty")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTechPrefixFromNormalizedText(normalized: string): string {
  return normalized.replace(/^clan/, "").replace(/^cl/, "").replace(/^is/, "");
}

function inferTechBaseFromRawText(rawValue: string): string {
  const normalized = normalizeLookupText(rawValue);
  if (normalized.startsWith("cl") || normalized.includes("clan")) return "Clan";
  if (normalized.startsWith("is") || normalized.includes("innersphere")) return "Inner Sphere";
  return "";
}

function normalizeTechBase(value: string | undefined): string {
  const normalized = normalizeLookupText(value);
  if (normalized.includes("clan")) return "Clan";
  if (normalized.includes("inner") || normalized === "is") return "Inner Sphere";
  return String(value ?? "").trim();
}

function getTechBaseScore(definition: WeaponDefinition, desiredTechBase: string): number {
  const definitionTechBase = normalizeTechBase(String(definition.techBase || definition.variant || ""));
  if (!desiredTechBase || !definitionTechBase) return 0;
  return definitionTechBase === desiredTechBase ? 20 : -20;
}

function toNumber(value: string | number | undefined): number {
  if (typeof value === "number") return value;
  const cleaned = String(value ?? "").replace(/,/g, "").trim();
  const match = cleaned.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function getUniqueDetailFileName(row: CsvRow, sequenceNumber: number, usedFileNames: Set<string>): string {
  const baseSlug = slugForFileName(`${row.chassis} ${row.model}`.trim() || row.name || row.id || `mek-${sequenceNumber}`);
  const candidates = [
    `${baseSlug}.json`,
    row.mulId ? `${baseSlug}--mul-${slugForFileName(row.mulId)}.json` : "",
    row.id ? `${baseSlug}--${getStableIdSuffix(row.id)}.json` : "",
    `${baseSlug}--${sequenceNumber}.json`,
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (!usedFileNames.has(candidate)) {
      usedFileNames.add(candidate);
      return candidate;
    }
  }

  let dedupeNumber = 2;
  while (usedFileNames.has(`${baseSlug}--${dedupeNumber}.json`)) dedupeNumber++;

  const fileName = `${baseSlug}--${dedupeNumber}.json`;
  usedFileNames.add(fileName);
  return fileName;
}

function slugForFileName(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "unit";
}

function getStableIdSuffix(catalogId: string): string {
  const slug = slugForFileName(catalogId);
  const parts = slug.split("-").filter(Boolean);
  return parts.slice(-4).join("-") || slug || "duplicate";
}

main().catch((error) => {
  console.error("[generateUnitDetails] failed:", error);
  process.exit(1);
});
