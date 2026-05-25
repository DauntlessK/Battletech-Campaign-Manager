import fs from "fs/promises";
import path from "path";
import { WEAPONS } from "../src/data/weapons";

type UnitTypeKey =
  | "meks"
  | "vehicles"
  | "aerospace"
  | "battlearmor"
  | "infantry"
  | "protomeks";

type CatalogRow = {
  id: string;
  unitType: UnitTypeKey;
  chassis: string;
  model: string;
  name: string;
  fileName: string;
  relativePath: string;

  tonnage: string;
  weightClass: string;
  bv: string;
  bvSource: "mtf" | "calculated" | "missing";
  costCBills: string;
  costSource: "calculated" | "mtf" | "missing";

  techBase: string;
  rulesLevel: string;
  year: string;
  era: string;
  role: string;
  source: string;

  walkMP: string;
  runMP: string;
  jumpMP: string;
  engineRating: string;
  engineType: string;
  gyroType: string;
  cockpitType: string;
  heatSinkCount: string;
  heatSinkType: string;
  armorType: string;
  structureType: string;

  armorPoints: string;
  armorTonnage: string;
  weaponCount: string;
  weaponSummary: string;
  warnings: string;
};

type ParsedMtfMetadata = {
  chassis: string;
  model: string;
  tonnage: string;
  year: string;
  techBase: string;
  rulesLevel: string;
  role: string;
  source: string;
  era: string;

  officialBV: string;
  officialCostCBills: string;

  config: string;
  walkMP: number;
  runMP: number;
  jumpMP: number;
  engine: string;
  engineType: string;
  engineRating: number;
  gyroType: string;
  cockpitType: string;
  heatSinkCount: number;
  heatSinkType: string;
  armorType: string;
  structureType: string;
  myomerType: string;

  armor: MekArmorValues;
  locations: MekLocationMap;
  weapons: ParsedWeaponEntry[];
  quirks: string[];
};

type ParsedWeaponEntry = {
  name: string;
  location: string;
  isRearFacing: boolean;
  weaponId?: string;
  weaponData?: any;
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

type MekLocationRecord = {
  key: MekLocationKey;
  mtfName: string;
  armor: number;
  rearArmor: number;
  internal: number;
  slots: string[];
  hasCase: boolean;
};

type MekLocationMap = Record<MekLocationKey, MekLocationRecord>;

type MekArmorValues = Record<MekLocationKey | "centerTorsoRear" | "leftTorsoRear" | "rightTorsoRear", number>;

type IndexOptions = {
  rulesLevel: string | null;
  debug: boolean;
  unitQuery: string | null;
};


const UNITS_ROOT = path.resolve(process.cwd(), "src", "data", "units");
const OUTPUT_DIR = path.resolve(process.cwd(), "server", "data", "generated");

const UNIT_TYPE_FOLDERS: Record<UnitTypeKey, string> = {
  meks: "meks",
  vehicles: "vehicles",
  aerospace: "aerospace",
  battlearmor: "battlearmor",
  infantry: "infantry",
  protomeks: "protomeks",
};

const CSV_COLUMNS: Array<keyof CatalogRow> = [
  "id",
  "unitType",
  "chassis",
  "model",
  "name",
  "fileName",
  "relativePath",
  "tonnage",
  "weightClass",
  "bv",
  "bvSource",
  "costCBills",
  "costSource",
  "techBase",
  "rulesLevel",
  "year",
  "era",
  "role",
  "source",
  "walkMP",
  "runMP",
  "jumpMP",
  "engineRating",
  "engineType",
  "gyroType",
  "cockpitType",
  "heatSinkCount",
  "heatSinkType",
  "armorType",
  "structureType",
  "armorPoints",
  "armorTonnage",
  "weaponCount",
  "weaponSummary",
  "warnings",
];

type LocationDefinition = {
  key: MekLocationKey;
  mtfName: string;
  armorKeys: string[];
  rearArmorKeys?: string[];
};

const TORSO_LOCATION_DEFS: LocationDefinition[] = [
  { key: "head", mtfName: "Head", armorKeys: ["HD armor", "Head armor"] },
  {
    key: "centerTorso",
    mtfName: "Center Torso",
    armorKeys: ["CT armor", "Center Torso armor"],
    rearArmorKeys: ["RTC armor", "CTR armor", "Center Torso Rear armor"],
  },
  {
    key: "leftTorso",
    mtfName: "Left Torso",
    armorKeys: ["LT armor", "Left Torso armor"],
    rearArmorKeys: ["RTL armor", "LTR armor", "Left Torso Rear armor"],
  },
  {
    key: "rightTorso",
    mtfName: "Right Torso",
    armorKeys: ["RT armor", "Right Torso armor"],
    rearArmorKeys: ["RTR armor", "Right Torso Rear armor"],
  },
];

const BIPED_LOCATION_DEFS: LocationDefinition[] = [
  ...TORSO_LOCATION_DEFS,
  { key: "leftArm", mtfName: "Left Arm", armorKeys: ["LA armor", "Left Arm armor"] },
  { key: "rightArm", mtfName: "Right Arm", armorKeys: ["RA armor", "Right Arm armor"] },
  { key: "leftLeg", mtfName: "Left Leg", armorKeys: ["LL armor", "Left Leg armor"] },
  { key: "rightLeg", mtfName: "Right Leg", armorKeys: ["RL armor", "Right Leg armor"] },
];

const QUAD_LOCATION_DEFS: LocationDefinition[] = [
  ...TORSO_LOCATION_DEFS,
  { key: "frontLeftLeg", mtfName: "Front Left Leg", armorKeys: ["FLL armor", "Front Left Leg armor"] },
  { key: "frontRightLeg", mtfName: "Front Right Leg", armorKeys: ["FRL armor", "Front Right Leg armor"] },
  { key: "rearLeftLeg", mtfName: "Rear Left Leg", armorKeys: ["RLL armor", "Rear Left Leg armor"] },
  { key: "rearRightLeg", mtfName: "Rear Right Leg", armorKeys: ["RRL armor", "Rear Right Leg armor"] },
];

/**
 * Main.
 * @returns Promise<void> result from main.
 */
async function main() {
  const requestedType = getRequestedType();
  const sampleCount = getRequestedSampleCount();
  const options = getIndexOptions();

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const unitTypes = requestedType
    ? [requestedType]
    : (Object.keys(UNIT_TYPE_FOLDERS) as UnitTypeKey[]);

  if (options.unitQuery) {
    await indexSpecificUnits(unitTypes, options);
    return;
  }

  if (sampleCount != null) {
    await indexRandomSample(unitTypes, sampleCount, options);
    return;
  }

  for (const unitType of unitTypes) {
    await indexUnitType(unitType, options);
  }
}


/**
 * Indexes one or more units matching a requested chassis, model, file name, or full display name.
 * @param unitTypes - Unit type folders to search for the requested unit.
 * @param options - Indexing options containing the requested unit query, rules filter, and debug flag.
 * @returns Promise that resolves after the specific-unit catalog CSV has been written.
 */
async function indexSpecificUnits(unitTypes: UnitTypeKey[], options: IndexOptions): Promise<void> {
  if (!options.unitQuery) return;

  const rows: CatalogRow[] = [];

  for (const unitType of unitTypes) {
    const folderName = UNIT_TYPE_FOLDERS[unitType];
    const root = path.join(UNITS_ROOT, folderName);
    const files = await findFilesByExtension(root, ".mtf");

    for (const filePath of files) {
      const content = await fs.readFile(filePath, "utf-8");
      const metadata = parseMtfMetadata(content, unitType);
      const parsedName = parseChassisModelFromFileName(path.basename(filePath));

      if (!matchesRequestedUnit(options.unitQuery, metadata, parsedName, filePath)) {
        continue;
      }

      const row = await buildCatalogRow(unitType, filePath, options);
      if (row) rows.push(row);
    }
  }

  rows.sort(sortCatalogRows);

  const safeQuery = slug(options.unitQuery);
  const outputPath = path.join(OUTPUT_DIR, `testcatalog_${safeQuery}.csv`);
  await fs.writeFile(outputPath, toCsv(rows), "utf-8");

  console.log(`[indexUnits] specific unit: "${options.unitQuery}" -> ${rows.length} row(s) -> ${outputPath}`);
  if (options.rulesLevel) {
    console.log(`[indexUnits] specific unit: rules level filter=${options.rulesLevel}`);
  }
  if (rows.length === 0) {
    console.warn(`[indexUnits] No units matched "${options.unitQuery}". Try --unit=<model>, --unit=<chassis>, or --unit="<chassis> <model>".`);
  }
}

/**
 * Checks whether parsed unit metadata matches a requested unit query.
 * @param query - User-provided unit query from --unit, --model, or --unitModel.
 * @param metadata - Parsed MTF metadata for the candidate unit.
 * @param parsedName - Chassis/model parsed from the candidate file name, used as fallback metadata.
 * @param filePath - Candidate MTF file path used for file-name matching.
 * @returns True when the candidate should be indexed for the requested unit query.
 */
function matchesRequestedUnit(
  query: string,
  metadata: ParsedMtfMetadata,
  parsedName: { chassis: string; model: string } | null,
  filePath: string
): boolean {
  const normalizedQuery = normalizeLookupText(query);
  if (!normalizedQuery) return false;

  const chassis = metadata.chassis || parsedName?.chassis || "";
  const model = metadata.model || parsedName?.model || "";
  const fileName = path.basename(filePath).replace(/\.mtf$/i, "");

  const candidates = [
    model,
    chassis,
    `${chassis} ${model}`,
    fileName,
  ].map(normalizeLookupText);

  return candidates.some((candidate) => candidate === normalizedQuery || candidate.includes(normalizedQuery));
}

/**
 * Index random sample.
 * @param unitTypes - Input value used by indexRandomSample.
 * @param sampleCount - Input value used by indexRandomSample.
 * @param options - Input value used by indexRandomSample.
 * @returns Promise<void> result from indexRandomSample.
 */
async function indexRandomSample(unitTypes: UnitTypeKey[], sampleCount: number, options: IndexOptions) {
  const candidates: Array<{ unitType: UnitTypeKey; filePath: string }> = [];

  for (const unitType of unitTypes) {
    const folderName = UNIT_TYPE_FOLDERS[unitType];
    const extension = unitType === "meks" ? ".mtf" : ".mtf";
    const root = path.join(UNITS_ROOT, folderName);

    const files = await findFilesByExtension(root, extension);
    candidates.push(...files.map((filePath) => ({ unitType, filePath })));
  }

  const shuffledCandidates = shuffle(candidates);
  const rows: CatalogRow[] = [];

  for (const candidate of shuffledCandidates) {
    if (rows.length >= sampleCount) break;

    const row = await buildCatalogRow(candidate.unitType, candidate.filePath, options);
    if (row) rows.push(row);
  }

  rows.sort(sortCatalogRows);

  const outputPath = path.join(OUTPUT_DIR, "testcatalog.csv");
  await fs.writeFile(outputPath, toCsv(rows), "utf-8");

  console.log(
    `[indexUnits] test sample: ${rows.length}/${sampleCount} rows -> ${outputPath}`
  );
  console.log(
    `[indexUnits] usage: npm run index:units -- 10 OR npm run index:units -- --sample=10 --type=meks OR npm run index:units -- --type=meks --unit=XNT-3O --debug`
  );
}

/**
 * Index unit type.
 * @param unitType - Input value used by indexUnitType.
 * @param options - Input value used by indexUnitType.
 * @returns Promise<void> result from indexUnitType.
 */
async function indexUnitType(unitType: UnitTypeKey, options: IndexOptions) {
  const folderName = UNIT_TYPE_FOLDERS[unitType];
  const root = path.join(UNITS_ROOT, folderName);

  const files = await findFilesByExtension(root, ".mtf");
  const rows: CatalogRow[] = [];

  for (const filePath of files) {
    const row = await buildCatalogRow(unitType, filePath, options);
    if (row) rows.push(row);
  }

  rows.sort(sortCatalogRows);

  const csv = toCsv(rows);
  const outputPath = path.join(OUTPUT_DIR, `catalog_${unitType}.csv`);

  await fs.writeFile(outputPath, csv, "utf-8");

  const missingBvCount = rows.filter((row) => !row.bv).length;
  const missingCostCount = rows.filter((row) => !row.costCBills).length;

  console.log(`[indexUnits] ${unitType}: ${rows.length} rows -> ${outputPath}`);
  if (options.rulesLevel) {
    console.log(`[indexUnits] ${unitType}: rules level filter=${options.rulesLevel}`);
  }
  console.log(`[indexUnits] ${unitType}: missing BV=${missingBvCount}, missing C-bills=${missingCostCount}`);
}

/**
 * Build catalog row.
 * @param unitType - Input value used by buildCatalogRow.
 * @param filePath - Input value used by buildCatalogRow.
 * @param options - Input value used by buildCatalogRow.
 * @returns Promise<CatalogRow | null> result from buildCatalogRow.
 */
async function buildCatalogRow(
  unitType: UnitTypeKey,
  filePath: string,
  options: IndexOptions
): Promise<CatalogRow | null> {
  const fileName = path.basename(filePath);
  const content = await fs.readFile(filePath, "utf-8");

  const metadata = parseMtfMetadata(content, unitType);
  const parsedName = parseChassisModelFromFileName(fileName);

  const chassis = metadata.chassis || parsedName?.chassis || "";
  const model = metadata.model || parsedName?.model || "";

  if (!chassis || !model) {
    console.warn("[indexUnits] Skipping file with missing chassis/model:", filePath);
    return null;
  }

  if (options.rulesLevel && metadata.rulesLevel !== options.rulesLevel) {
    return null;
  }

  const warnings: string[] = [];
  const tonnageNumber = toNumber(metadata.tonnage);

  let bv = normalizeIntegerString(metadata.officialBV);
  let bvSource: CatalogRow["bvSource"] = bv ? "mtf" : "missing";

  if (!bv && unitType === "meks") {
    const calculatedBV = calculateMekBV(metadata);
    if (calculatedBV != null) {
      bv = String(Math.round(calculatedBV));
      bvSource = "calculated";
    } else {
      warnings.push("BV missing and calculated BV failed");
    }
  }

  let costCBills = "";
  let costSource: CatalogRow["costSource"] = "missing";
  let calculatedCost: ReturnType<typeof calculateMekCBills> = null;

  if (unitType === "meks") {
    calculatedCost = calculateMekCBills(metadata);
    if (calculatedCost != null) {
      costCBills = String(Math.round(calculatedCost.total));
      costSource = "calculated";
    }
  }

  if (!costCBills) {
    costCBills = normalizeIntegerString(metadata.officialCostCBills);
    costSource = costCBills ? "mtf" : "missing";
  }

  if (!metadata.walkMP && unitType === "meks") warnings.push("Missing walkMP");
  if (!metadata.engineType && unitType === "meks") warnings.push("Missing engine type");
  if (!metadata.heatSinkCount && unitType === "meks") warnings.push("Missing heat sink count");

  const row: CatalogRow = {
    id: createCatalogId(unitType, path.relative(UNITS_ROOT, filePath)),
    unitType,
    chassis,
    model,
    name: `${chassis} ${model}`.trim(),
    fileName,
    relativePath: path.relative(UNITS_ROOT, filePath).replace(/\\/g, "/"),

    tonnage: metadata.tonnage,
    weightClass: getWeightClass(metadata.tonnage),
    bv,
    bvSource,
    costCBills,
    costSource,

    techBase: metadata.techBase,
    rulesLevel: metadata.rulesLevel,
    year: metadata.year,
    era: metadata.era,
    role: metadata.role,
    source: metadata.source,

    walkMP: numberToString(metadata.walkMP),
    runMP: numberToString(metadata.runMP || getRunMP(metadata.walkMP)),
    jumpMP: numberToString(metadata.jumpMP),
    engineRating: numberToString(metadata.engineRating || (tonnageNumber && metadata.walkMP ? tonnageNumber * metadata.walkMP : 0)),
    engineType: metadata.engineType,
    gyroType: metadata.gyroType,
    cockpitType: metadata.cockpitType,
    heatSinkCount: numberToString(metadata.heatSinkCount),
    heatSinkType: metadata.heatSinkType,
    armorType: metadata.armorType,
    structureType: metadata.structureType,

    armorPoints: numberToString(getTotalArmor(metadata.armor)),
    armorTonnage: formatNumber(getArmorTonnage(metadata.armorType, metadata.techBase, getTotalArmor(metadata.armor))),
    weaponCount: numberToString(metadata.weapons.length),
    weaponSummary: summarizeWeapons(metadata.weapons),
    warnings: warnings.join("; "),
  };

  if (options.debug && unitType === "meks") {
    logMekDebugReport(metadata, row, calculatedCost, filePath);
  }

  return row;
}

/**
 * Find files by extension.
 * @param root - Input value used by findFilesByExtension.
 * @param extension - Input value used by findFilesByExtension.
 * @returns Promise<string[]> result from findFilesByExtension.
 */
async function findFilesByExtension(root: string, extension: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(dir: string) {
    let entries;

    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      console.warn(`[indexUnits] Could not read folder: ${dir}`);
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name.toLowerCase().endsWith(extension)) {
        results.push(fullPath);
      }
    }
  }

  await walk(root);

  return results;
}

/**
 * Parse chassis model from file name.
 * @param fileName - Input value used by parseChassisModelFromFileName.
 * @returns  result from parseChassisModelFromFileName.
 */
function parseChassisModelFromFileName(fileName: string): {
  chassis: string;
  model: string;
} | null {
  const baseName = fileName.replace(/\.mtf$/i, "").trim();

  // Handles Clan-style names like:
  // Daishi (Dire Wolf) Prime.mtf
  // by treating the parenthetical name as an alternate name rather than part of model parsing.
  const withoutParentheses = baseName.replace(/\s*\([^)]*\)\s*/g, " ").trim();
  const parts = withoutParentheses.split(/\s+/);

  if (parts.length < 2) {
    return null;
  }

  return {
    chassis: parts.slice(0, -1).join(" "),
    model: parts[parts.length - 1],
  };
}

/**
 * Parse mtf metadata.
 * @param content - Input value used by parseMtfMetadata.
 * @param unitType - Input value used by parseMtfMetadata.
 * @returns ParsedMtfMetadata result from parseMtfMetadata.
 */
function parseMtfMetadata(content: string, unitType: UnitTypeKey): ParsedMtfMetadata {
  const lines = content.split(/\r?\n/);

  const getValue = (...keys: string[]) => {
    for (const key of keys) {
      const normalizedTarget = normalizeMtfKey(key);

      for (const line of lines) {
        const parsed = parseKeyValueLine(line);

        if (!parsed) continue;

        if (normalizeMtfKey(parsed.key) === normalizedTarget) {
          return parsed.value;
        }
      }
    }

    return "";
  };

  const chassis = getValue("chassis");
  const model = getValue("model");
  const tonnage = getValue("mass", "tonnage", "weight");

  // Many MegaMek MTF files use "era" as the introduction year.
  const year =
    getValue("year", "introYear", "intro year", "introduced", "introduction year") ||
    numericYearOnly(getValue("era"));

  const techBase = normalizeTechBase(
    getValue("techbase", "tech base", "tech_base")
  );

  const rulesLevel = normalizeRulesLevelForCatalog(
    getValue("rules level", "rules_level", "rules", "ruleslevel")
  );

  const officialBV = normalizeIntegerString(
    getValue("bv", "battle value", "battlevalue", "battle value 2", "bv2") ||
      findLooseNumericValue(lines, /^bv\s*[:=]\s*([\d,]+)/i) ||
      findLooseNumericValue(lines, /^battle\s*value\s*[:=]\s*([\d,]+)/i)
  );

  const officialCostCBills = normalizeIntegerString(
    getValue("cost", "cost cbills", "cbills", "c-bills", "c bills")
  );

  const role = getValue("role");
  const source = getValue("source", "sourcebook");

  const walkMP = toNumber(getValue("walk mp", "walkmp", "walking mp", "walkingmp"));
  const runMP = toNumber(getValue("run mp", "runmp", "running mp", "runningmp")) || getRunMP(walkMP);
  const jumpMP = toNumber(getValue("jump mp", "jumpmp", "jumping mp", "jumpingmp"));

  const engine = getValue("engine");
  const unitTonnage = toNumber(tonnage);
  const engineRatingFromString = parseEngineRating(engine);
  const engineRating = engineRatingFromString || (unitTonnage && walkMP ? unitTonnage * walkMP : 0);

  const heatSinkType = normalizeHeatSinkType(
    getValue("heat sinks type", "heat sink type", "heatsinktype", "heat sinks")
  );
  const heatSinkCount = parseHeatSinkCount(getValue("heat sinks", "heatsinks"));

  const armorType = normalizeComponentText(getValue("armor", "armor type", "armortype")) || "Standard";
  const structureType = normalizeComponentText(getValue("structure", "internal structure", "structure type")) || "Standard";
  const gyroType = normalizeComponentText(getValue("gyro", "gyro type")) || "Standard";
  const cockpitType = normalizeComponentText(getValue("cockpit", "cockpit type")) || "Standard";
  const myomerType = normalizeComponentText(getValue("myomer", "myomer type")) || "Standard";

  const config = getValue("config");
  const armor = parseArmorValues(lines);
  const locations = unitType === "meks" ? parseMekLocations(lines, unitTonnage, armor, config) : emptyMekLocations(config);
  const weapons = unitType === "meks" ? parseMekWeapons(lines, locations, techBase) : [];
  const quirks = parseRepeatedValues(lines, "quirk");

  return {
    chassis,
    model,
    tonnage,
    year,
    techBase,
    rulesLevel,
    officialBV,
    officialCostCBills,
    role,
    source,
    era: year ? yearToEraBucket(year) : "",

    config,
    walkMP,
    runMP,
    jumpMP,
    engine,
    engineType: normalizeEngineType(engine),
    engineRating,
    gyroType,
    cockpitType,
    heatSinkCount,
    heatSinkType,
    armorType,
    structureType,
    myomerType,

    armor,
    locations,
    weapons,
    quirks,
  };
}

/**
 * Parse key value line.
 * @param line - Input value used by parseKeyValueLine.
 * @returns void result from parseKeyValueLine.
 */
function parseKeyValueLine(line: string): { key: string; value: string } | null {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  // Handles:
  // key: value
  // key=value
  const separatorMatch = trimmed.match(/^([^:=]+)\s*[:=]\s*(.*)$/);

  if (!separatorMatch) {
    return null;
  }

  return {
    key: separatorMatch[1].trim(),
    value: separatorMatch[2].trim(),
  };
}

/**
 * Find loose numeric value.
 * @param lines - Input value used by findLooseNumericValue.
 * @param pattern - Input value used by findLooseNumericValue.
 * @returns string result from findLooseNumericValue.
 */
function findLooseNumericValue(lines: string[], pattern: RegExp): string {
  for (const line of lines) {
    const match = line.trim().match(pattern);
    if (match?.[1]) return match[1];
  }
  return "";
}

/**
 * Parse repeated values.
 * @param lines - Input value used by parseRepeatedValues.
 * @param key - Input value used by parseRepeatedValues.
 * @returns string[] result from parseRepeatedValues.
 */
function parseRepeatedValues(lines: string[], key: string): string[] {
  const normalizedTarget = normalizeMtfKey(key);
  const values: string[] = [];

  for (const line of lines) {
    const parsed = parseKeyValueLine(line);
    if (!parsed) continue;
    if (normalizeMtfKey(parsed.key) === normalizedTarget && parsed.value) {
      values.push(parsed.value);
    }
  }

  return values;
}

/**
 * Parse armor values.
 * @param lines - Input value used by parseArmorValues.
 * @returns MekArmorValues result from parseArmorValues.
 */
function parseArmorValues(lines: string[]): MekArmorValues {
  const getValue = (...keys: string[]) => {
    for (const key of keys) {
      const normalizedTarget = normalizeMtfKey(key);
      for (const line of lines) {
        const parsed = parseKeyValueLine(line);
        if (!parsed) continue;
        if (normalizeMtfKey(parsed.key) === normalizedTarget) {
          return toNumber(parsed.value);
        }
      }
    }
    return 0;
  };

  return {
    head: getValue("HD armor", "Head armor"),
    centerTorso: getValue("CT armor", "Center Torso armor"),
    centerTorsoRear: getValue("RTC armor", "CTR armor", "Center Torso Rear armor"),
    leftTorso: getValue("LT armor", "Left Torso armor"),
    leftTorsoRear: getValue("RTL armor", "LTR armor", "Left Torso Rear armor"),
    rightTorso: getValue("RT armor", "Right Torso armor"),
    rightTorsoRear: getValue("RTR armor", "Right Torso Rear armor"),
    leftArm: getValue("LA armor", "Left Arm armor"),
    rightArm: getValue("RA armor", "Right Arm armor"),
    leftLeg: getValue("LL armor", "Left Leg armor"),
    rightLeg: getValue("RL armor", "Right Leg armor"),
    frontLeftLeg: getValue("FLL armor", "Front Left Leg armor"),
    frontRightLeg: getValue("FRL armor", "Front Right Leg armor"),
    rearLeftLeg: getValue("RLL armor", "Rear Left Leg armor"),
    rearRightLeg: getValue("RRL armor", "Rear Right Leg armor"),
  };
}


/**
 * Returns the correct critical-location definition set for biped or quad BattleMechs.
 * @param config - MTF config string, such as "Biped" or "Quad".
 * @returns Location definitions appropriate for the unit configuration.
 */
function getLocationDefsForConfig(config: string): LocationDefinition[] {
  return isQuadConfig(config) ? QUAD_LOCATION_DEFS : BIPED_LOCATION_DEFS;
}

/**
 * Determines whether a Mek configuration should be parsed as a quad.
 * @param config - MTF config string.
 * @returns True when the config indicates a quad chassis.
 */
function isQuadConfig(config: string): boolean {
  return String(config || "").toLowerCase().includes("quad");
}
/**
 * Parse mek locations.
 * @param lines - Input value used by parseMekLocations.
 * @param unitTonnage - Input value used by parseMekLocations.
 * @param armor - Input value used by parseMekLocations.
 * @returns MekLocationMap result from parseMekLocations.
 */
function parseMekLocations(
  lines: string[],
  unitTonnage: number,
  armor: MekArmorValues,
  config: string
): MekLocationMap {
  const internals = getBattleMechInternalStructure(unitTonnage);

  const locations: Partial<MekLocationMap> = {};

  for (const def of getLocationDefsForConfig(config)) {
    const slots = getSlotsForLocation(lines, def.mtfName);
    const locationArmor = armor[def.key as keyof MekArmorValues] || 0;
    const rearArmor = getRearArmorForLocation(def.key, armor);

    locations[def.key] = {
      key: def.key,
      mtfName: def.mtfName,
      armor: locationArmor,
      rearArmor,
      internal: internals[def.key],
      slots,
      hasCase: slots.some((slot) => slot.toLowerCase().includes("case")),
    };
  }

  return locations as MekLocationMap;
}

/**
 * Empty mek locations.
 * @returns MekLocationMap result from emptyMekLocations.
 */
function emptyMekLocations(config: string = ""): MekLocationMap {
  const locations: Partial<MekLocationMap> = {};
  for (const def of getLocationDefsForConfig(config)) {
    locations[def.key] = {
      key: def.key,
      mtfName: def.mtfName,
      armor: 0,
      rearArmor: 0,
      internal: 0,
      slots: [],
      hasCase: false,
    };
  }
  return locations as MekLocationMap;
}

/**
 * Get slots for location.
 * @param lines - Input value used by getSlotsForLocation.
 * @param location - Input value used by getSlotsForLocation.
 * @returns string[] result from getSlotsForLocation.
 */
function getSlotsForLocation(lines: string[], location: string): string[] {
  const locationWithColon = `${location}:`;
  let locationIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().toLowerCase() === locationWithColon.toLowerCase()) {
      locationIndex = i;
      break;
    }
  }

  if (locationIndex === -1) return [];

  const slots: string[] = [];

  for (let i = 1; i <= 12; i++) {
    const slotLine = lines[locationIndex + i];
    if (slotLine == null) {
      slots.push("");
    } else {
      slots.push(slotLine.trim());
    }
  }

  // Mek heads only have 6 real critical slots; many MTF blocks still provide 12 lines.
  if (location.toLowerCase() === "head") {
    return slots.slice(0, 6);
  }

  return slots;
}

/**
 * Parse mek weapons.
 * @param lines - Input value used by parseMekWeapons.
 * @param locations - Parsed location/critical-slot map for the Mek.
 * @param unitTechBase - Normalized unit tech base from the MTF file; used to prefer Clan vs. Inner Sphere weapon definitions.
 * @returns Parsed weapon entries with resolved weapon definitions when a reliable match is found.
 */
function parseMekWeapons(lines: string[], locations: MekLocationMap, unitTechBase: string): ParsedWeaponEntry[] {
  const weaponsFromSection = parseWeaponsSection(lines);
  const slotUsageMap: Record<string, number> = {};

  return weaponsFromSection.map((entry) => {
    const normalizedLocationKey = normalizeLocationName(entry.location);
    const location = normalizedLocationKey ? locations[normalizedLocationKey] : undefined;
    const weaponNameKey = normalizeLookupText(entry.name);
    const slotKey = `${normalizedLocationKey || entry.location}:${weaponNameKey}`;
    const usedIndex = slotUsageMap[slotKey] || 0;

    let foundSlot = "";
    let foundWeaponId = "";
    let weaponData: any = null;
    let instanceCount = 0;

    if (location) {
      for (const slot of location.slots) {
        if (!slot || slot === "-Empty-") continue;

        if (normalizeLookupText(slot).includes(weaponNameKey)) {
          if (instanceCount === usedIndex) {
            foundSlot = slot;
            foundWeaponId = extractWeaponId(slot);
            weaponData = resolveWeapon(entry.name, foundWeaponId, unitTechBase);
            slotUsageMap[slotKey] = usedIndex + 1;
            break;
          }
          instanceCount++;
        }
      }
    }

    if (!weaponData) {
      weaponData = resolveWeapon(entry.name, undefined, unitTechBase);
    }

    return {
      ...entry,
      isRearFacing: entry.isRearFacing || foundSlot.includes("(R)") || /\(r\)/i.test(entry.name),
      weaponId: weaponData?.id || foundWeaponId || undefined,
      weaponData,
    };
  });
}

/**
 * Parse weapons section.
 * @param lines - Input value used by parseWeaponsSection.
 * @returns ParsedWeaponEntry[] result from parseWeaponsSection.
 */
function parseWeaponsSection(lines: string[]): ParsedWeaponEntry[] {
  const weapons: ParsedWeaponEntry[] = [];
  let inWeaponsSection = false;
  let expectedCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();

    if (lower.startsWith("weapons:")) {
      inWeaponsSection = true;
      const countString = trimmed.substring(trimmed.indexOf(":") + 1).trim();
      expectedCount = toNumber(countString);
      continue;
    }

    if (!inWeaponsSection) continue;

    if (isLocationHeader(lower)) {
      break;
    }

    if (!trimmed) continue;

    if (expectedCount > 0 && weapons.length >= expectedCount) {
      break;
    }

    const parts = trimmed.split(",").map((part) => part.trim());
    const name = parts[0] || "";
    const location = parts[1] || "";

    if (!name) continue;

    weapons.push({
      name: name.replace(/\s*\(R\)\s*$/i, "").trim(),
      location,
      isRearFacing: /\(r\)/i.test(name),
    });
  }

  return weapons;
}

/**
 * Resolve weapon.
 * @param rawName - Weapon display name from the MTF weapons section, such as "ER PPC".
 * @param possibleId - Optional compact slot id from a critical slot, such as "CLERPPC" or "ISLRM10".
 * @param unitTechBase - Unit tech base from the MTF file; used to prefer Clan or Inner Sphere definitions for ambiguous shared names.
 * @returns Best matching weapon definition, or null if no reliable match is found.
 */
function resolveWeapon(rawName: string, possibleId?: string, unitTechBase?: string): any {
  const weaponRecord = WEAPONS as Record<string, any>;
  const desiredTechBase = inferWeaponTechBase(possibleId || rawName) || normalizeTechBase(unitTechBase || "");
  const normalizedRawName = normalizeLookupText(rawName);
  const normalizedPossibleId = possibleId ? normalizeLookupText(possibleId) : "";
  const normalizedSearchValues = [normalizedRawName, normalizedPossibleId].filter(Boolean);

  const candidates: Array<{ weapon: any; score: number }> = [];

  for (const key of Object.keys(weaponRecord)) {
    const weapon = weaponRecord[key];
    const names = [
      key,
      weapon?.id,
      weapon?.name,
      ...(Array.isArray(weapon?.altNames) ? weapon.altNames : []),
    ].filter(Boolean).map((name) => normalizeLookupText(String(name)));

    let score = 0;

    if (normalizedPossibleId && names.includes(normalizedPossibleId)) {
      score += 120;
    }

    if (normalizedRawName && names.includes(normalizedRawName)) {
      score += 90;
    }

    const strippedNames = names.map(stripTechPrefixFromNormalizedText);
    const strippedRawName = stripTechPrefixFromNormalizedText(normalizedRawName);
    const strippedPossibleId = stripTechPrefixFromNormalizedText(normalizedPossibleId);

    if (strippedPossibleId && strippedNames.includes(strippedPossibleId)) {
      score += 70;
    }

    if (strippedRawName && strippedNames.includes(strippedRawName)) {
      score += 50;
    }

    if (score <= 0) continue;

    score += getTechBaseMatchScore(weapon, desiredTechBase);
    candidates.push({ weapon, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.weapon ?? null;
}
/**
 * Extract weapon id.
 * @param slot - Input value used by extractWeaponId.
 * @returns string result from extractWeaponId.
 */
function extractWeaponId(slot: string): string {
  const cleaned = slot.split("(")[0].trim();
  if (/^[A-Za-z0-9]+$/.test(cleaned)) {
    return cleaned;
  }
  return "";
}

/**
 * Infers an explicit weapon tech base from a weapon id, compact slot id, or MTF label.
 * @param value - Raw weapon, ammo, or critical-slot text to inspect.
 * @returns "Clan" or "Inner Sphere" when the text explicitly identifies one, otherwise an empty string.
 */
function inferWeaponTechBase(value?: string): string {
  const normalized = normalizeLookupText(value || "");

  if (!normalized) return "";
  if (normalized.startsWith("clan") || normalized.startsWith("cl")) return "Clan";
  if (normalized.startsWith("innersphere") || normalized.startsWith("is")) return "Inner Sphere";

  return "";
}

/**
 * Removes leading Inner Sphere or Clan markers from normalized text so shared names can still be compared.
 * @param value - Already-normalized lookup text.
 * @returns Normalized text without a leading tech-base marker.
 */
function stripTechPrefixFromNormalizedText(value: string): string {
  return value
    .replace(/^innersphere/, "")
    .replace(/^clan/, "")
    .replace(/^is/, "")
    .replace(/^cl/, "");
}

/**
 * Scores a weapon definition against the desired unit or slot tech base.
 * @param weapon - Weapon definition from WEAPONS.
 * @param desiredTechBase - Preferred tech base, usually from the unit MTF or explicit IS/CL slot prefix.
 * @returns Positive score for a match, negative score for a mismatch, and zero when no preference applies.
 */
function getTechBaseMatchScore(weapon: any, desiredTechBase: string): number {
  const desired = normalizeTechBase(desiredTechBase || "");
  const weaponTechBase = normalizeTechBase(String(weapon?.techBase || weapon?.variant || ""));

  if (!desired || desired === "Mixed" || !weaponTechBase || weaponTechBase === "Mixed") {
    return 0;
  }

  return weaponTechBase === desired ? 100 : -100;
}

/**
 * Selects the best weapon from a small candidate list using tech-base preference.
 * @param candidates - Candidate weapon definitions.
 * @param desiredTechBase - Preferred tech base, usually from the unit MTF or explicit IS/CL ammo label.
 * @returns Best matching weapon definition, or null when no candidates are provided.
 */
function chooseBestWeaponByTechBase(candidates: any[], desiredTechBase: string): any {
  if (!candidates.length) return null;

  const scored = candidates
    .filter(Boolean)
    .map((weapon) => ({
      weapon,
      score: getTechBaseMatchScore(weapon, desiredTechBase),
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.weapon ?? null;
}

/**
 * Calculate mek bv.
 * @param metadata - Input value used by calculateMekBV.
 * @returns number | null result from calculateMekBV.
 */
function calculateMekBV(metadata: ParsedMtfMetadata): number | null {
  if (!metadata.tonnage || !metadata.walkMP) return null;

  const defensiveBV = calculateDefensiveBV(metadata);
  const offensiveBV = calculateOffensiveBV(metadata);

  if (defensiveBV == null || offensiveBV == null) return null;

  return Math.round(defensiveBV + offensiveBV);
}

/**
 * Calculate defensive bv.
 * @param metadata - Input value used by calculateDefensiveBV.
 * @returns number | null result from calculateDefensiveBV.
 */
function calculateDefensiveBV(metadata: ParsedMtfMetadata): number | null {
  const mass = toNumber(metadata.tonnage);
  if (!mass) return null;

  let armorTypeModifier = 1.0;
  if (metadata.armorType.toLowerCase().includes("commercial")) {
    armorTypeModifier = 0.5;
  }

  let structureModifier = 1.0;
  if (metadata.structureType.toLowerCase().includes("industrial")) {
    structureModifier = 0.5;
  }

  let engineModifier = 1.0;
  const engineLower = metadata.engineType.toLowerCase();
  if (engineLower.includes("light")) {
    engineModifier = 0.75;
  } else if (engineLower.includes("xl") && metadata.techBase === "Inner Sphere") {
    engineModifier = 0.5;
  } else if (engineLower.includes("xl") && metadata.techBase === "Clan") {
    engineModifier = 0.75;
  }

  let gyroModifier = 0.5;
  if (metadata.gyroType.toLowerCase().includes("heavy duty")) {
    gyroModifier = 1.0;
  }

  const totalArmor = getTotalArmor(metadata.armor) * armorTypeModifier;
  const totalInternal = getTotalInternal(metadata.locations);

  const baseDefense =
    totalArmor * 2.5 +
    totalInternal * 1.5 * structureModifier * engineModifier +
    mass * gyroModifier;

  let defensiveEquipmentBV = 0;
  if (hasSlotText(metadata.locations, "guardianecm") || hasSlotText(metadata.locations, "guardian ecm")) {
    defensiveEquipmentBV += 61;
  }
  if (hasSlotText(metadata.locations, "anti-missile system") || hasSlotText(metadata.locations, "ams")) {
    defensiveEquipmentBV += 32;
    defensiveEquipmentBV += 11 * countSlotText(metadata.locations, "ams ammo");
  }
  if (hasSlotText(metadata.locations, "beagle")) {
    defensiveEquipmentBV += 10;
  }

  const explosiveAmmoSubtraction = calculateExplosiveAmmoSubtraction(metadata);

  return (
    baseDefense +
    defensiveEquipmentBV -
    explosiveAmmoSubtraction
  ) * getDefensiveMovementMultiplier(metadata.walkMP, metadata.jumpMP);
}

/**
 * Determines whether a location key is any biped or quad leg location.
 * @param locationKey - Parsed Mek location key.
 * @returns True when the location represents a leg.
 */
function isLegLocationKey(locationKey: MekLocationKey): boolean {
  return ["leftLeg", "rightLeg", "frontLeftLeg", "frontRightLeg", "rearLeftLeg", "rearRightLeg"].includes(locationKey);
}

/**
 * Calculate explosive ammo subtraction.
 * @param metadata - Input value used by calculateExplosiveAmmoSubtraction.
 * @returns number result from calculateExplosiveAmmoSubtraction.
 */
function calculateExplosiveAmmoSubtraction(metadata: ParsedMtfMetadata): number {
  let subtraction = 0;

  for (const locationKey of Object.keys(metadata.locations) as MekLocationKey[]) {
    const location = metadata.locations[locationKey];

    if (metadata.techBase === "Inner Sphere") {
      const engineLower = metadata.engineType.toLowerCase();
      const hasCASEProtection =
        location.hasCase ||
        (locationKey === "leftArm" && Boolean(metadata.locations.leftTorso?.hasCase)) ||
        (locationKey === "rightArm" && Boolean(metadata.locations.rightTorso?.hasCase));

      if (!engineLower.includes("xl") && hasCASEProtection) {
        continue;
      }

      subtraction += 15 * getAmmoSlotCountInLocation(location.slots, true);
      subtraction += getTotalUnprotectedGaussCountInLocation(location.slots);
    } else {
      if (
        locationKey === "centerTorso" ||
        isLegLocationKey(locationKey) ||
        locationKey === "head"
      ) {
        subtraction += 15 * getAmmoSlotCountInLocation(location.slots, true);
      }
      subtraction += getTotalGaussCountInLocation(location.slots);
    }
  }

  return subtraction;
}

/**
 * Calculate offensive bv.
 * @param metadata - Input value used by calculateOffensiveBV.
 * @returns number | null result from calculateOffensiveBV.
 */
function calculateOffensiveBV(metadata: ParsedMtfMetadata): number | null {
  const mass = toNumber(metadata.tonnage);
  if (!mass) return null;

  const heatWeapons: Array<{ modifiedBV: number; heat: number }> = [];
  let zeroHeatWeaponBV = 0;

  for (const weaponEntry of metadata.weapons) {
    const weapon = weaponEntry.weaponData;
    if (!weapon) continue;

    const bv = typeof weapon.bv === "number" ? weapon.bv : toNumber(weapon.bv);
    const heat = typeof weapon.heat === "number" ? weapon.heat : toNumber(weapon.heat);

    if (!bv) continue;

    const tcMultiplier = hasSlotText(metadata.locations, "targeting computer") && isTargetingComputerEligibleWeapon(weapon) ? 1.25 : 1;
    const modifiedBV = (weaponEntry.isRearFacing ? bv / 2 : bv) * tcMultiplier;

    if (heat === 0) {
      zeroHeatWeaponBV += modifiedBV;
    } else {
      heatWeapons.push({ modifiedBV, heat });
    }
  }

  const ammoBV = calculateAmmoBV(metadata);

  const heatSinkCapacity = metadata.heatSinkType.toLowerCase().includes("double")
    ? metadata.heatSinkCount * 2
    : metadata.heatSinkCount;

  const movementHeat = metadata.jumpMP > 0 ? Math.max(3, metadata.jumpMP) : 2;
  const heatEfficiency = 6 + heatSinkCapacity - movementHeat;

  const totalWeaponHeat = heatWeapons.reduce((sum, weapon) => sum + weapon.heat, 0);

  let heatAdjustedWeaponBV = zeroHeatWeaponBV;

  if (totalWeaponHeat <= heatEfficiency) {
    for (const weapon of heatWeapons) {
      heatAdjustedWeaponBV += weapon.modifiedBV;
    }
  } else {
    heatWeapons.sort((a, b) => {
      if (b.modifiedBV !== a.modifiedBV) {
        return b.modifiedBV - a.modifiedBV;
      }
      return a.heat - b.heat;
    });

    let runningHeat = 0;
    let heatLimitReached = false;

    for (const weapon of heatWeapons) {
      if (!heatLimitReached) {
        runningHeat += weapon.heat;
        heatAdjustedWeaponBV += weapon.modifiedBV;

        if (runningHeat >= heatEfficiency) {
          heatLimitReached = true;
        }
      } else {
        heatAdjustedWeaponBV += weapon.modifiedBV / 2;
      }
    }
  }

  const weaponBattleRating = heatAdjustedWeaponBV + ammoBV + mass;
  return weaponBattleRating * getOffensiveSpeedFactor(metadata.walkMP, metadata.jumpMP);
}

/**
 * Calculates offensive ammo BV by scanning every critical slot for ammo entries and matching them to weapon definitions.
 * @param metadata - Parsed Mek metadata containing location slots and linked weapon definitions.
 * @returns Total ammo BV contributed by all matched ammo slots.
 */
function calculateAmmoBV(metadata: ParsedMtfMetadata): number {
  let ammoBV = 0;

  for (const locationKey of Object.keys(metadata.locations) as MekLocationKey[]) {
    const location = metadata.locations[locationKey];

    for (const slot of location.slots) {
      const lowerSlot = slot.toLowerCase();

      if (!lowerSlot.includes("ammo")) continue;

      const matchingWeapon = findAmmoWeaponForSlot(lowerSlot, metadata.weapons, metadata.techBase);
      const weaponAmmoBV = matchingWeapon?.ammo?.ammoBV;
      const ammoMultiplier = getAmmoSlotBVMultiplier(slot);

      if (typeof weaponAmmoBV === "number") {
        ammoBV += weaponAmmoBV * ammoMultiplier;
      } else if (weaponAmmoBV != null) {
        ammoBV += toNumber(String(weaponAmmoBV)) * ammoMultiplier;
      }
    }
  }

  return ammoBV;
}


/**
 * Determines how much of one ton of ammo a critical-slot label represents for BV purposes.
 * @param slot - Raw critical-slot text from the MTF file.
 * @returns Ammo BV multiplier, with half-ton labels returning 0.5 and normal ammo slots returning 1.
 */
function getAmmoSlotBVMultiplier(slot: string): number {
  const normalized = normalizeLookupText(slot);
  const lower = slot.toLowerCase();

  if (
    normalized.includes("half") ||
    lower.includes("1/2") ||
    lower.includes("0.5") ||
    lower.includes(".5") ||
    normalized.includes("halfton")
  ) {
    return 0.5;
  }

  return 1;
}

/**
 * Resolves an ammo critical-slot label such as "IS Ammo AC/5" to the matching weapon definition.
 * @param lowerSlot - Lowercase raw slot text from the MTF critical-slot list.
 * @param weapons - Mounted weapons already parsed from the unit, used as a fallback for ambiguous ammo names.
 * @param unitTechBase - Unit tech base from the MTF file; used to prefer Clan vs. Inner Sphere ammo BV values.
 * @returns The matching weapon definition, or null when no reliable match can be made.
 */
function findAmmoWeaponForSlot(lowerSlot: string, weapons: ParsedWeaponEntry[], unitTechBase: string): any {
  const weaponRecord = WEAPONS as Record<string, any>;
  const normalizedSlot = normalizeLookupText(lowerSlot);
  const desiredTechBase = inferWeaponTechBase(lowerSlot) || normalizeTechBase(unitTechBase || "");

  const getWeaponByIds = (...ids: string[]) => chooseBestWeaponByTechBase(
    ids.map((id) => weaponRecord[id]).filter(Boolean),
    desiredTechBase
  );

  const mountedAmmoWeapons = weapons
    .map((entry) => entry.weaponData)
    .filter((weapon) => weapon?.ammo);

  const mountedCandidates = mountedAmmoWeapons.filter((weapon) => {
    const ammoType = weapon.ammo?.ammoType
      ? normalizeLookupText(String(weapon.ammo.ammoType))
      : "";
    const family = weapon.family ? normalizeLookupText(String(weapon.family)) : "";
    const name = weapon.name ? normalizeLookupText(String(weapon.name)) : "";
    const id = weapon.id ? normalizeLookupText(String(weapon.id)) : "";
    const altNames = Array.isArray(weapon.altNames)
      ? weapon.altNames.map((altName: string) => normalizeLookupText(String(altName)))
      : [];

    return (
      (ammoType && normalizedSlot.includes(ammoType)) ||
      (family && normalizedSlot.includes(family)) ||
      (name && normalizedSlot.includes(name)) ||
      (id && normalizedSlot.includes(id)) ||
      altNames.some((altName: string) => altName && normalizedSlot.includes(altName))
    );
  });

  const uniqueMountedCandidates = Array.from(
    new Map(mountedCandidates.map((weapon: any) => [weapon.id, weapon])).values()
  );

  if (uniqueMountedCandidates.length === 1) {
    return uniqueMountedCandidates[0];
  }

  if (uniqueMountedCandidates.length > 1) {
    const bestMounted = chooseBestWeaponByTechBase(uniqueMountedCandidates, desiredTechBase);
    if (bestMounted) return bestMounted;
  }

  const normalizedExactMatches: Array<{ tokens: string[]; ids: string[] }> = [
    { tokens: ["ac20", "autocannon20"], ids: ["is_autocannon_20", "ac20", "is_ac20"] },
    { tokens: ["ac10", "autocannon10"], ids: ["is_autocannon_10", "ac10", "is_ac10"] },
    { tokens: ["ac5", "autocannon5"], ids: ["is_autocannon_5", "ac5", "is_ac5"] },
    { tokens: ["ac2", "autocannon2"], ids: ["is_autocannon_2", "ac2", "is_ac2"] },

    { tokens: ["uac20", "ultraac20"], ids: ["is_ultra_ac_20", "clan_ultra_ac_20"] },
    { tokens: ["uac10", "ultraac10"], ids: ["is_ultra_ac_10", "clan_ultra_ac_10"] },
    { tokens: ["uac5", "ultraac5"], ids: ["is_ultra_ac_5", "clan_ultra_ac_5"] },
    { tokens: ["uac2", "ultraac2"], ids: ["is_ultra_ac_2", "clan_ultra_ac_2"] },

    { tokens: ["rac5", "rotaryac5"], ids: ["is_rotary_ac_5"] },
    { tokens: ["rac2", "rotaryac2"], ids: ["is_rotary_ac_2"] },

    { tokens: ["lbx20", "lb20xac", "lbxac20", "lb20x"], ids: ["is_lb_20_x_ac", "clan_lb_20_x_ac"] },
    { tokens: ["lbx10", "lb10xac", "lbxac10", "lb10x"], ids: ["is_lb_10_x_ac", "clan_lb_10_x_ac"] },
    { tokens: ["lbx5", "lb5xac", "lbxac5", "lb5x"], ids: ["is_lb_5_x_ac", "clan_lb_5_x_ac"] },
    { tokens: ["lbx2", "lb2xac", "lbxac2", "lb2x"], ids: ["is_lb_2_x_ac", "clan_lb_2_x_ac"] },

    { tokens: ["lrm20"], ids: ["is_lrm_20", "clan_lrm_20", "lrm20"] },
    { tokens: ["lrm15"], ids: ["is_lrm_15", "clan_lrm_15", "lrm15"] },
    { tokens: ["lrm10"], ids: ["is_lrm_10", "clan_lrm_10", "lrm10"] },
    { tokens: ["lrm5"], ids: ["is_lrm_5", "clan_lrm_5", "lrm5"] },

    { tokens: ["srm6"], ids: ["is_srm_6", "clan_srm_6", "srm6"] },
    { tokens: ["srm4"], ids: ["is_srm_4", "clan_srm_4", "srm4"] },
    { tokens: ["srm2"], ids: ["is_srm_2", "clan_srm_2", "srm2"] },

    { tokens: ["streaksrm6", "ssrm6"], ids: ["is_streak_srm_6", "clan_streak_srm_6"] },
    { tokens: ["streaksrm4", "ssrm4"], ids: ["is_streak_srm_4", "clan_streak_srm_4"] },
    { tokens: ["streaksrm2", "ssrm2"], ids: ["is_streak_srm_2", "clan_streak_srm_2"] },

    { tokens: ["mrm40"], ids: ["is_mrm_40"] },
    { tokens: ["mrm30"], ids: ["is_mrm_30"] },
    { tokens: ["mrm20"], ids: ["is_mrm_20"] },
    { tokens: ["mrm10"], ids: ["is_mrm_10"] },

    { tokens: ["atm12"], ids: ["clan_atm_12"] },
    { tokens: ["atm9"], ids: ["clan_atm_9"] },
    { tokens: ["atm6"], ids: ["clan_atm_6"] },
    { tokens: ["atm3"], ids: ["clan_atm_3"] },

    { tokens: ["hag40", "hyperassaultgauss40"], ids: ["clan_hag_40", "clan_hyper_assault_gauss_40"] },
    { tokens: ["hag30", "hyperassaultgauss30"], ids: ["clan_hag_30", "clan_hyper_assault_gauss_30"] },
    { tokens: ["hag20", "hyperassaultgauss20"], ids: ["clan_hag_20", "clan_hyper_assault_gauss_20"] },
    { tokens: ["lightgauss"], ids: ["is_light_gauss_rifle"] },
    { tokens: ["heavygauss"], ids: ["is_heavy_gauss_rifle"] },
    { tokens: ["apgauss"], ids: ["clan_ap_gauss_rifle"] },
    { tokens: ["gauss"], ids: ["is_gauss_rifle", "clan_gauss_rifle"] },

    { tokens: ["heavymachinegun", "hmg"], ids: ["is_heavy_machine_gun", "clan_heavy_machine_gun"] },
    { tokens: ["lightmachinegun", "lmg"], ids: ["is_light_machine_gun", "clan_light_machine_gun"] },
    { tokens: ["machinegun", "mg"], ids: ["is_machine_gun", "clan_machine_gun", "machineGun"] },
    { tokens: ["flamer"], ids: ["is_vehicle_flamer", "clan_vehicle_flamer", "is_flamer", "clan_flamer"] },
    { tokens: ["ams"], ids: ["is_anti_missile_system", "clan_anti_missile_system"] },
  ];

  for (const match of normalizedExactMatches) {
    if (match.tokens.some((token) => normalizedSlot.includes(token))) {
      const weapon = getWeaponByIds(...match.ids);
      if (weapon) return weapon;
    }
  }

  return null;
}
/**
 * Calculate mek cbills.
 * @param metadata - Input value used by calculateMekCBills.
 * @returns void result from calculateMekCBills.
 */
function calculateMekCBills(metadata: ParsedMtfMetadata): { total: number; subtotal: number; weightMultiplier: number; breakdown: Record<string, number> } | null {
  const unitTonnage = toNumber(metadata.tonnage);
  if (!unitTonnage || !metadata.walkMP) return null;

  const engineRating = metadata.engineRating || unitTonnage * metadata.walkMP;
  const gyroTonnage = getGyroTonnage(engineRating, metadata.gyroType);
  const armorTonnage = getArmorTonnage(
    metadata.armorType,
    metadata.techBase,
    getTotalArmor(metadata.armor)
  );

  const breakdown: Record<string, number> = {};

  breakdown.cockpit = getCockpitCost(metadata.cockpitType);
  breakdown.lifeSupport = 50_000;
  breakdown.sensors = 2_000 * unitTonnage;
  breakdown.musculature = getMyomerCost(metadata.myomerType, unitTonnage);
  breakdown.internalStructure = getStructureCost(metadata.structureType, unitTonnage);
  breakdown.actuators = getActuatorCost(metadata.locations, unitTonnage);
  breakdown.engine = getEngineCost(metadata.engineType, engineRating, unitTonnage);
  breakdown.gyro = getGyroCost(metadata.gyroType, gyroTonnage);
  breakdown.jumpJets = getJumpJetCost(metadata.jumpMP, unitTonnage, "Standard");
  breakdown.heatSinks = getHeatSinkCost(
    metadata.heatSinkType,
    metadata.heatSinkCount,
    metadata.engineType
  );
  breakdown.armor = getArmorCost(metadata.armorType, armorTonnage);
  breakdown.powerAmplifiers = 0;
  breakdown.weapons = getWeaponCost(metadata.weapons);

  const subtotal = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  const weightMultiplier = getBattleMechCostWeightMultiplier(unitTonnage);
  const total = subtotal * weightMultiplier;

  return { total, subtotal, weightMultiplier, breakdown };
}

/**
 * Calculates actuator cost from arm and leg critical slots without double-counting hip/upper-leg entries.
 * @param locations - Parsed Mek location records containing critical-slot contents.
 * @param unitTonnage - Unit tonnage used by the actuator cost multipliers.
 * @returns Total C-bill cost for actuators present on the unit.
 */
function getActuatorCost(locations: MekLocationMap, unitTonnage: number): number {
  const hasInLocation = (locationKey: MekLocationKey, patterns: RegExp[]) => {
    const slots = locations[locationKey]?.slots ?? [];
    return slots.some((slot) => patterns.some((pattern) => pattern.test(slot)));
  };

  let cost = 0;

  for (const arm of getArmLocationKeys(locations)) {
    if (hasInLocation(arm, [/upper\s+arm\s+actuator/i])) cost += 100 * unitTonnage;
    if (hasInLocation(arm, [/lower\s+arm\s+actuator/i])) cost += 50 * unitTonnage;
    if (hasInLocation(arm, [/hand\s+actuator/i])) cost += 80 * unitTonnage;
  }

  for (const leg of getLegLocationKeys(locations)) {
    if (hasInLocation(leg, [/hip/i, /upper\s+leg\s+actuator/i])) cost += 150 * unitTonnage;
    if (hasInLocation(leg, [/lower\s+leg\s+actuator/i])) cost += 80 * unitTonnage;
    if (hasInLocation(leg, [/foot\s+actuator/i])) cost += 120 * unitTonnage;
  }

  return cost;
}

/**
 * Lists arm locations present on this parsed Mek. Quad Meks return none because they have no arms.
 * @param locations - Parsed Mek location map.
 * @returns Arm location keys that exist in the map.
 */
function getArmLocationKeys(locations: MekLocationMap): MekLocationKey[] {
  return (["leftArm", "rightArm"] as MekLocationKey[]).filter((key) => Boolean(locations[key]));
}

/**
 * Lists leg locations present on this parsed Mek, including quad front/rear legs when applicable.
 * @param locations - Parsed Mek location map.
 * @returns Leg location keys that exist in the map.
 */
function getLegLocationKeys(locations: MekLocationMap): MekLocationKey[] {
  return (["leftLeg", "rightLeg", "frontLeftLeg", "frontRightLeg", "rearLeftLeg", "rearRightLeg"] as MekLocationKey[])
    .filter((key) => Boolean(locations[key]));
}

/**
 * Get battle mech cost weight multiplier.
 * @param unitTonnage - Input value used by getBattleMechCostWeightMultiplier.
 * @returns number result from getBattleMechCostWeightMultiplier.
 */
function getBattleMechCostWeightMultiplier(unitTonnage: number): number {
  return 1 + unitTonnage / 100;
}

/**
 * Get cockpit cost.
 * @param cockpitType - Input value used by getCockpitCost.
 * @returns number result from getCockpitCost.
 */
function getCockpitCost(cockpitType: string): number {
  const lower = cockpitType.toLowerCase();

  if (lower.includes("small")) return 175_000;
  if (lower.includes("industrial") && lower.includes("advanced")) return 200_000;
  if (lower.includes("industrial")) return 100_000;

  return 200_000;
}

/**
 * Get myomer cost.
 * @param myomerType - Input value used by getMyomerCost.
 * @param unitTonnage - Input value used by getMyomerCost.
 * @returns number result from getMyomerCost.
 */
function getMyomerCost(myomerType: string, unitTonnage: number): number {
  const lower = myomerType.toLowerCase();

  if (lower.includes("industrial") && lower.includes("tsm")) return 12_000 * unitTonnage;
  if (lower.includes("triple") || lower.includes("tsm")) return 16_000 * unitTonnage;

  return 2_000 * unitTonnage;
}

/**
 * Get structure cost.
 * @param structureType - Input value used by getStructureCost.
 * @param unitTonnage - Input value used by getStructureCost.
 * @returns number result from getStructureCost.
 */
function getStructureCost(structureType: string, unitTonnage: number): number {
  const lower = structureType.toLowerCase();

  if (lower.includes("endo")) return 1_600 * unitTonnage;
  if (lower.includes("industrial")) return 300 * unitTonnage;

  return 400 * unitTonnage;
}

/**
 * Get engine cost.
 * @param engineType - Input value used by getEngineCost.
 * @param engineRating - Input value used by getEngineCost.
 * @param unitTonnage - Input value used by getEngineCost.
 * @returns number result from getEngineCost.
 */
function getEngineCost(engineType: string, engineRating: number, unitTonnage: number): number {
  const lower = engineType.toLowerCase();

  if (lower.includes("light")) return (15_000 * engineRating * unitTonnage) / 75;
  if (lower.includes("xl")) return (20_000 * engineRating * unitTonnage) / 75;
  if (lower.includes("compact")) return (10_000 * engineRating * unitTonnage) / 75;
  if (lower.includes("combustion") || lower.includes("ice")) return (1_250 * engineRating * unitTonnage) / 75;
  if (lower.includes("fuel cell")) return (3_500 * engineRating * unitTonnage) / 75;
  if (lower.includes("fission")) return (7_500 * engineRating * unitTonnage) / 75;

  return (5_000 * engineRating * unitTonnage) / 75;
}

/**
 * Get gyro cost.
 * @param gyroType - Input value used by getGyroCost.
 * @param gyroTonnage - Input value used by getGyroCost.
 * @returns number result from getGyroCost.
 */
function getGyroCost(gyroType: string, gyroTonnage: number): number {
  const lower = gyroType.toLowerCase();

  if (lower.includes("compact")) return 400_000 * gyroTonnage;
  if (lower.includes("heavy")) return 500_000 * gyroTonnage;
  if (lower.includes("xl")) return 750_000 * gyroTonnage;

  return 300_000 * gyroTonnage;
}

/**
 * Get jump jet cost.
 * @param jumpMP - Input value used by getJumpJetCost.
 * @param unitTonnage - Input value used by getJumpJetCost.
 * @param jumpJetType - Input value used by getJumpJetCost.
 * @returns number result from getJumpJetCost.
 */
function getJumpJetCost(jumpMP: number, unitTonnage: number, jumpJetType: string): number {
  if (!jumpMP) return 0;

  const lower = jumpJetType.toLowerCase();
  const multiplier = lower.includes("improved") ? 500 : 200;

  return multiplier * Math.pow(jumpMP, 2) * unitTonnage;
}

/**
 * Get heat sink cost.
 * @param heatSinkType - Input value used by getHeatSinkCost.
 * @param heatSinkCount - Input value used by getHeatSinkCost.
 * @param engineType - Input value used by getHeatSinkCost.
 * @returns number result from getHeatSinkCost.
 */
function getHeatSinkCost(heatSinkType: string, heatSinkCount: number, engineType: string): number {
  if (!heatSinkCount) return 0;

  if (heatSinkType.toLowerCase().includes("double")) {
    return 6_000 * heatSinkCount;
  }

  if (isFusionEngine(engineType)) {
    return 2_000 * Math.max(0, heatSinkCount - 10);
  }

  return 2_000 * heatSinkCount;
}

/**
 * Get armor cost.
 * @param armorType - Input value used by getArmorCost.
 * @param armorTonnage - Input value used by getArmorCost.
 * @returns number result from getArmorCost.
 */
function getArmorCost(armorType: string, armorTonnage: number): number {
  const lower = armorType.toLowerCase();

  if (lower.includes("light ferro")) return 15_000 * armorTonnage;
  if (lower.includes("heavy ferro")) return 25_000 * armorTonnage;
  if (lower.includes("ferro")) return 20_000 * armorTonnage;
  if (lower.includes("stealth")) return 50_000 * armorTonnage;
  if (lower.includes("commercial")) return 3_000 * armorTonnage;
  if (lower.includes("industrial")) return 5_000 * armorTonnage;

  return 10_000 * armorTonnage;
}

/**
 * Get weapon cost.
 * @param weapons - Input value used by getWeaponCost.
 * @returns number result from getWeaponCost.
 */
function getWeaponCost(weapons: ParsedWeaponEntry[]): number {
  let total = 0;

  for (const weaponEntry of weapons) {
    const weapon = weaponEntry.weaponData;
    if (!weapon) continue;

    if (typeof weapon.cost === "number") {
      total += weapon.cost;
    } else if (weapon.cost != null) {
      total += toNumber(String(weapon.cost));
    }
  }

  return total;
}

/**
 * Get gyro tonnage.
 * @param engineRating - Input value used by getGyroTonnage.
 * @param gyroType - Input value used by getGyroTonnage.
 * @returns number result from getGyroTonnage.
 */
function getGyroTonnage(engineRating: number, gyroType: string): number {
  const standardGyroTonnage = Math.ceil(engineRating / 100);
  const lower = gyroType.toLowerCase();

  if (lower.includes("compact")) return standardGyroTonnage * 1.5;
  if (lower.includes("heavy")) return standardGyroTonnage * 2;
  if (lower.includes("xl")) return standardGyroTonnage / 2;

  return standardGyroTonnage;
}

/**
 * Get armor tonnage.
 * @param armorType - Input value used by getArmorTonnage.
 * @param techBase - Input value used by getArmorTonnage.
 * @param armorPoints - Input value used by getArmorTonnage.
 * @returns number result from getArmorTonnage.
 */
function getArmorTonnage(armorType: string, techBase: string, armorPoints: number): number {
  if (!armorPoints) return 0;

  const lowerArmor = armorType.toLowerCase();
  const lowerTech = techBase.toLowerCase();

  let pointsPerTon = 16;

  if (lowerArmor.includes("light ferro")) {
    pointsPerTon = 16.8;
  } else if (lowerArmor.includes("heavy ferro")) {
    pointsPerTon = 19.2;
  } else if (lowerArmor.includes("ferro")) {
    pointsPerTon = lowerTech.includes("clan") ? 20.16 : 17.92;
  }

  return Math.ceil((armorPoints / pointsPerTon) * 2) / 2;
}

/**
 * Parse engine rating.
 * @param engine - Input value used by parseEngineRating.
 * @returns number result from parseEngineRating.
 */
function parseEngineRating(engine: string): number {
  const match = String(engine || "").match(/\b([1-9][0-9]{1,3})\b/);
  return match ? toNumber(match[1]) : 0;
}

/**
 * Normalize engine type.
 * @param engine - Input value used by normalizeEngineType.
 * @returns string result from normalizeEngineType.
 */
function normalizeEngineType(engine: string): string {
  const raw = normalizeComponentText(engine);
  const lower = raw.toLowerCase();

  if (!raw) return "Standard Fusion";
  if (lower.includes("light")) return "Light Fusion";
  if (lower.includes("xl")) return "XL Fusion";
  if (lower.includes("compact")) return "Compact Fusion";
  if (lower.includes("combustion") || lower.includes("ice")) return "Internal Combustion";
  if (lower.includes("fuel")) return "Fuel Cell";
  if (lower.includes("fission")) return "Fission";
  if (lower.includes("fusion")) return "Standard Fusion";

  return raw;
}

/**
 * Normalize heat sink type.
 * @param value - Input value used by normalizeHeatSinkType.
 * @returns string result from normalizeHeatSinkType.
 */
function normalizeHeatSinkType(value: string): string {
  const lower = String(value || "").toLowerCase();

  if (lower.includes("double")) return "Double";
  if (lower.includes("single") || lower.includes("standard")) return "Single";

  return value ? normalizeComponentText(value) : "Single";
}

/**
 * Parse heat sink count.
 * @param value - Input value used by parseHeatSinkCount.
 * @returns number result from parseHeatSinkCount.
 */
function parseHeatSinkCount(value: string): number {
  const match = String(value || "").match(/\b(\d+)\b/);
  return match ? Number(match[1]) : 0;
}

/**
 * Normalize component text.
 * @param value - Input value used by normalizeComponentText.
 * @returns string result from normalizeComponentText.
 */
function normalizeComponentText(value: string): string {
  return String(value || "")
    .replace(/\b\d+\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Is fusion engine.
 * @param engineType - Input value used by isFusionEngine.
 * @returns boolean result from isFusionEngine.
 */
function isFusionEngine(engineType: string): boolean {
  const lower = engineType.toLowerCase();
  return lower.includes("fusion") || lower.includes("xl") || lower.includes("light");
}

/**
 * Get total armor.
 * @param armor - Input value used by getTotalArmor.
 * @returns number result from getTotalArmor.
 */
function getTotalArmor(armor: MekArmorValues): number {
  return Object.values(armor).reduce((sum, value) => sum + (Number(value) || 0), 0);
}

/**
 * Get total internal.
 * @param locations - Input value used by getTotalInternal.
 * @returns number result from getTotalInternal.
 */
function getTotalInternal(locations: MekLocationMap): number {
  return Object.values(locations).reduce((sum, location) => sum + location.internal, 0);
}

/**
 * Get rear armor for location.
 * @param key - Input value used by getRearArmorForLocation.
 * @param armor - Input value used by getRearArmorForLocation.
 * @returns number result from getRearArmorForLocation.
 */
function getRearArmorForLocation(key: MekLocationKey, armor: MekArmorValues): number {
  if (key === "centerTorso") return armor.centerTorsoRear || 0;
  if (key === "leftTorso") return armor.leftTorsoRear || 0;
  if (key === "rightTorso") return armor.rightTorsoRear || 0;
  return 0;
}

/**
 * Get ammo slot count in location.
 * @param slots - Input value used by getAmmoSlotCountInLocation.
 * @param isCountingExplosive - Input value used by getAmmoSlotCountInLocation.
 * @returns number result from getAmmoSlotCountInLocation.
 */
function getAmmoSlotCountInLocation(slots: string[], isCountingExplosive: boolean): number {
  let ammoSlotCount = 0;

  for (const slot of slots) {
    const lower = slot.toLowerCase();

    if (!lower.includes("ammo")) continue;

    if (!isCountingExplosive) {
      ammoSlotCount++;
      continue;
    }

    const isNonExplosiveAmmo =
      lower.includes("flamer") ||
      lower.includes("coolant");

    if (!isNonExplosiveAmmo) {
      ammoSlotCount++;
    }
  }

  return ammoSlotCount;
}

/**
 * Get total unprotected gauss count in location.
 * @param slots - Input value used by getTotalUnprotectedGaussCountInLocation.
 * @returns number result from getTotalUnprotectedGaussCountInLocation.
 */
function getTotalUnprotectedGaussCountInLocation(slots: string[]): number {
  let gaussCount = 0;

  for (const slot of slots) {
    const lower = slot.toLowerCase();

    if (lower.includes("gauss")) {
      gaussCount++;
    }

    if (lower.includes("case")) {
      return 0;
    }
  }

  return gaussCount;
}

/**
 * Get total gauss count in location.
 * @param slots - Input value used by getTotalGaussCountInLocation.
 * @returns number result from getTotalGaussCountInLocation.
 */
function getTotalGaussCountInLocation(slots: string[]): number {
  return slots.filter((slot) => slot.toLowerCase().includes("gauss")).length;
}

/**
 * Has slot text.
 * @param locations - Input value used by hasSlotText.
 * @param search - Input value used by hasSlotText.
 * @returns boolean result from hasSlotText.
 */
function hasSlotText(locations: MekLocationMap, search: string): boolean {
  return Object.values(locations).some((location) =>
    location.slots.some((slot) => normalizeLookupText(slot).includes(normalizeLookupText(search)))
  );
}

/**
 * Count slot text.
 * @param locations - Input value used by countSlotText.
 * @param search - Input value used by countSlotText.
 * @returns number result from countSlotText.
 */
function countSlotText(locations: MekLocationMap, search: string): number {
  let count = 0;
  for (const location of Object.values(locations)) {
    for (const slot of location.slots) {
      if (normalizeLookupText(slot).includes(normalizeLookupText(search))) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Get run mp.
 * @param walkMP - Input value used by getRunMP.
 * @returns number result from getRunMP.
 */
function getRunMP(walkMP: number): number {
  if (!walkMP) return 0;
  return Math.ceil(walkMP * 1.5);
}

/**
 * Get defensive movement multiplier.
 * @param walkMP - Input value used by getDefensiveMovementMultiplier.
 * @param jumpMP - Input value used by getDefensiveMovementMultiplier.
 * @returns number result from getDefensiveMovementMultiplier.
 */
function getDefensiveMovementMultiplier(walkMP: number, jumpMP: number): number {
  const runMP = getRunMP(walkMP);
  const effectiveMP = Math.max(runMP, jumpMP);

  if (effectiveMP <= 2) return 1.0;
  if (effectiveMP <= 4) return 1.1;
  if (effectiveMP <= 6) return 1.2;
  if (effectiveMP <= 9) return 1.3;
  if (effectiveMP <= 17) return 1.4;
  if (effectiveMP <= 24) return 1.5;
  return 1.6;
}

/**
 * Get offensive speed factor.
 * @param walkMP - Input value used by getOffensiveSpeedFactor.
 * @param jumpMP - Input value used by getOffensiveSpeedFactor.
 * @returns number result from getOffensiveSpeedFactor.
 */
function getOffensiveSpeedFactor(walkMP: number, jumpMP: number): number {
  const runMP = getRunMP(walkMP);
  const mobility = runMP + Math.ceil((jumpMP || 0) / 2);

  const speedTable: Record<number, number> = {
    0: 0.44,
    1: 0.54,
    2: 0.65,
    3: 0.77,
    4: 0.88,
    5: 1.00,
    6: 1.12,
    7: 1.24,
    8: 1.37,
    9: 1.50,
    10: 1.63,
    11: 1.76,
    12: 1.89,
    13: 2.02,
    14: 2.16,
    15: 2.30,
    16: 2.44,
    17: 2.58,
    18: 2.72,
    19: 2.86,
    20: 3.00,
    21: 3.15,
    22: 3.29,
    23: 3.44,
    24: 3.59,
    25: 3.74,
  };

  const clampedMobility = Math.min(Math.max(mobility, 0), 25);
  return speedTable[clampedMobility];
}

/**
 * Get battle mech internal structure.
 * @param unitTonnage - Input value used by getBattleMechInternalStructure.
 * @returns Record<MekLocationKey, number> result from getBattleMechInternalStructure.
 */
function getBattleMechInternalStructure(unitTonnage: number): Record<MekLocationKey, number> {
  // BattleMech internal structure table.
  const tons = Number(unitTonnage);

  const table: Record<number, { head: number; ct: number; sideTorso: number; arm: number; leg: number }> = {
    20: { head: 3, ct: 6, sideTorso: 5, arm: 3, leg: 4 },
    25: { head: 3, ct: 8, sideTorso: 6, arm: 4, leg: 6 },
    30: { head: 3, ct: 10, sideTorso: 7, arm: 5, leg: 7 },
    35: { head: 3, ct: 11, sideTorso: 8, arm: 6, leg: 8 },
    40: { head: 3, ct: 12, sideTorso: 10, arm: 6, leg: 10 },
    45: { head: 3, ct: 14, sideTorso: 11, arm: 7, leg: 11 },
    50: { head: 3, ct: 16, sideTorso: 12, arm: 8, leg: 12 },
    55: { head: 3, ct: 18, sideTorso: 13, arm: 9, leg: 13 },
    60: { head: 3, ct: 20, sideTorso: 14, arm: 10, leg: 14 },
    65: { head: 3, ct: 21, sideTorso: 15, arm: 10, leg: 15 },
    70: { head: 3, ct: 22, sideTorso: 15, arm: 11, leg: 15 },
    75: { head: 3, ct: 23, sideTorso: 16, arm: 12, leg: 16 },
    80: { head: 3, ct: 25, sideTorso: 17, arm: 13, leg: 17 },
    85: { head: 3, ct: 27, sideTorso: 18, arm: 14, leg: 18 },
    90: { head: 3, ct: 29, sideTorso: 19, arm: 15, leg: 19 },
    95: { head: 3, ct: 30, sideTorso: 20, arm: 16, leg: 20 },
    100: { head: 3, ct: 31, sideTorso: 21, arm: 17, leg: 21 },
  };

  const row = table[tons] || { head: 3, ct: 0, sideTorso: 0, arm: 0, leg: 0 };

  return {
    head: row.head,
    centerTorso: row.ct,
    leftTorso: row.sideTorso,
    rightTorso: row.sideTorso,
    leftArm: row.arm,
    rightArm: row.arm,
    leftLeg: row.leg,
    rightLeg: row.leg,
    frontLeftLeg: row.leg,
    frontRightLeg: row.leg,
    rearLeftLeg: row.leg,
    rearRightLeg: row.leg,
  };
}

/**
 * Normalize mtf key.
 * @param value - Input value used by normalizeMtfKey.
 * @returns void result from normalizeMtfKey.
 */
function normalizeMtfKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Normalize lookup text.
 * @param value - Input value used by normalizeLookupText.
 * @returns void result from normalizeLookupText.
 */
function normalizeLookupText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Normalize integer string.
 * @param value - Input value used by normalizeIntegerString.
 * @returns void result from normalizeIntegerString.
 */
function normalizeIntegerString(value: string) {
  const cleaned = String(value || "").replace(/[^\d.-]/g, "");
  if (!cleaned) return "";
  const number = Number(cleaned);
  if (!Number.isFinite(number)) return "";
  return String(Math.round(number));
}

/**
 * Numeric year only.
 * @param value - Input value used by numericYearOnly.
 * @returns void result from numericYearOnly.
 */
function numericYearOnly(value: string) {
  const match = String(value || "").match(/\b(2[0-9]{3}|3[0-9]{3})\b/);
  return match ? match[1] : "";
}

/**
 * Normalize tech base.
 * @param value - Input value used by normalizeTechBase.
 * @returns void result from normalizeTechBase.
 */
function normalizeTechBase(value: string) {
  const raw = String(value || "").trim();
  const lower = raw.toLowerCase();

  if (!raw) return "";

  if (lower.includes("clan")) return "Clan";
  if (lower.includes("mixed")) return "Mixed";
  if (lower.includes("inner") || lower === "is") return "Inner Sphere";

  return raw;
}

/**
 * Normalize rules level for catalog.
 * @param value - Input value used by normalizeRulesLevelForCatalog.
 * @returns void result from normalizeRulesLevelForCatalog.
 */
function normalizeRulesLevelForCatalog(value: string) {
  const raw = String(value || "").trim();
  const lower = raw.toLowerCase();

  if (!raw) return "";

  if (["1", "intro", "introductory"].includes(lower)) return "Introductory";
  if (["2", "standard"].includes(lower)) return "Standard";
  if (["3", "advanced"].includes(lower)) return "Advanced";
  if (["4", "experimental"].includes(lower)) return "Experimental";
  if (["5", "unofficial"].includes(lower)) return "Unofficial";

  return raw;
}

/**
 * Get weight class.
 * @param tonnage - Input value used by getWeightClass.
 * @returns void result from getWeightClass.
 */
function getWeightClass(tonnage: string) {
  const tons = Number(tonnage);

  if (!Number.isFinite(tons) || tons <= 0) return "";
  if (tons <= 35) return "Light";
  if (tons <= 55) return "Medium";
  if (tons <= 75) return "Heavy";

  return "Assault";
}

/**
 * Year to era bucket.
 * @param yearValue - Input value used by yearToEraBucket.
 * @returns void result from yearToEraBucket.
 */
function yearToEraBucket(yearValue: string) {
  const year = Number(yearValue);

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

/**
 * Create catalog id.
 * @param unitType - Input value used by createCatalogId.
 * @param relativePath - Input value used by createCatalogId.
 * @returns void result from createCatalogId.
 */
function createCatalogId(unitType: UnitTypeKey, relativePath: string) {
  return slug(`${unitType}-${relativePath}`);
}

/**
 * Slug.
 * @param value - Input value used by slug.
 * @returns void result from slug.
 */
function slug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\.mtf$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Log mek debug report.
 * @param metadata - Input value used by logMekDebugReport.
 * @param row - Input value used by logMekDebugReport.
 * @param costDetail - Input value used by logMekDebugReport.
 * @param filePath - Input value used by logMekDebugReport.
 * @returns void result from logMekDebugReport.
 */
function logMekDebugReport(
  metadata: ParsedMtfMetadata,
  row: CatalogRow,
  costDetail: ReturnType<typeof calculateMekCBills>,
  filePath: string
): void {
  const name = `${metadata.chassis} ${metadata.model}`.trim() || row.name;
  const bvDebug = calculateMekBVDebug(metadata);

  console.log("\n" + "=".repeat(96));
  console.log(`[indexUnits][debug] ${name}`);
  console.log(`[indexUnits][debug] File: ${path.relative(process.cwd(), filePath).replace(/\\/g, "/")}`);
  console.log(`[indexUnits][debug] Rules: ${metadata.rulesLevel || "?"} | Tech: ${metadata.techBase || "?"} | Year: ${metadata.year || "?"}`);
  console.log(`[indexUnits][debug] Effective MP: R: ${getRunMP(metadata.walkMP)}, J: ${metadata.jumpMP || 0}, W: ${metadata.walkMP || 0}`);

  if (metadata.officialBV) {
    console.log(`[indexUnits][debug] MTF BV: ${metadata.officialBV}`);
  }

  console.log("\n[indexUnits][debug] Battle Value Calculation");
  for (const line of bvDebug.lines) console.log(line);
  console.log(`[indexUnits][debug] BV result: defensive ${formatDebugNumber(bvDebug.defensiveBV)} + offensive ${formatDebugNumber(bvDebug.offensiveBV)} = ${Math.round(bvDebug.totalBV)}`);
  console.log(`[indexUnits][debug] Catalog BV: ${row.bv || ""} (${row.bvSource})`);

  console.log("\n[indexUnits][debug] C-Bill Cost Calculation");
  if (costDetail) {
    for (const [key, value] of Object.entries(costDetail.breakdown)) {
      console.log(`  ${padRight(toTitleLabel(key), 28)} ${formatDebugNumber(value)}`);
    }
    console.log(`  ${padRight("Subtotal", 28)} ${formatDebugNumber(costDetail.subtotal)}`);
    console.log(`  ${padRight("Weight Multiplier", 28)} x ${formatDebugNumber(costDetail.weightMultiplier)}`);
    console.log(`  ${padRight("Total Cost", 28)} ${Math.round(costDetail.total).toLocaleString()}`);
  } else {
    console.log("  Cost calculation failed");
  }
  console.log("=".repeat(96));
}

/**
 * Calculate mek bvdebug.
 * @param metadata - Input value used by calculateMekBVDebug.
 * @returns  result from calculateMekBVDebug.
 */
function calculateMekBVDebug(metadata: ParsedMtfMetadata): {
  defensiveBV: number;
  offensiveBV: number;
  totalBV: number;
  lines: string[];
} {
  const defensive = calculateDefensiveBVDebug(metadata);
  const offensive = calculateOffensiveBVDebug(metadata);

  return {
    defensiveBV: defensive.total,
    offensiveBV: offensive.total,
    totalBV: defensive.total + offensive.total,
    lines: [...defensive.lines, "", ...offensive.lines],
  };
}

/**
 * Calculate defensive bvdebug.
 * @param metadata - Input value used by calculateDefensiveBVDebug.
 * @returns void result from calculateDefensiveBVDebug.
 */
function calculateDefensiveBVDebug(metadata: ParsedMtfMetadata): { total: number; lines: string[] } {
  const lines: string[] = [];
  const mass = toNumber(metadata.tonnage);
  const totalArmorRaw = getTotalArmor(metadata.armor);

  let armorTypeModifier = 1.0;
  if (metadata.armorType.toLowerCase().includes("commercial")) armorTypeModifier = 0.5;

  let structureModifier = 1.0;
  if (metadata.structureType.toLowerCase().includes("industrial")) structureModifier = 0.5;

  let engineModifier = 1.0;
  const engineLower = metadata.engineType.toLowerCase();
  if (engineLower.includes("light")) engineModifier = 0.75;
  else if (engineLower.includes("xl") && metadata.techBase === "Inner Sphere") engineModifier = 0.5;
  else if (engineLower.includes("xl") && metadata.techBase === "Clan") engineModifier = 0.75;

  let gyroModifier = 0.5;
  if (metadata.gyroType.toLowerCase().includes("heavy duty")) gyroModifier = 1.0;

  const totalArmor = totalArmorRaw * armorTypeModifier;
  const totalInternal = getTotalInternal(metadata.locations);
  const armorValue = totalArmor * 2.5;
  const internalValue = totalInternal * 1.5 * structureModifier * engineModifier;
  const gyroValue = mass * gyroModifier;
  let running = armorValue + internalValue + gyroValue;

  lines.push("Defensive Battle Rating:");
  lines.push(`  Armor:            ${formatDebugNumber(totalArmorRaw)}${armorTypeModifier !== 1 ? ` x ${armorTypeModifier}` : ""} x 2.5 = ${formatDebugNumber(armorValue)}`);
  lines.push(`  Internal:         ${formatDebugNumber(totalInternal)} x 1.5${structureModifier !== 1 ? ` x ${structureModifier}` : ""}${engineModifier !== 1 ? ` x ${engineModifier}` : ""} = ${formatDebugNumber(internalValue)}`);
  lines.push(`  Gyro:             ${formatDebugNumber(mass)} x ${formatDebugNumber(gyroModifier)} = ${formatDebugNumber(gyroValue)}`);
  lines.push(`  Base Defense:     ${formatDebugNumber(running)}`);

  const equipmentLines: string[] = [];
  let equipmentBV = 0;
  if (hasSlotText(metadata.locations, "guardianecm") || hasSlotText(metadata.locations, "guardian ecm")) {
    equipmentBV += 61;
    equipmentLines.push("    Guardian ECM Suite +61");
  }
  if (hasSlotText(metadata.locations, "anti-missile system") || hasSlotText(metadata.locations, "ams")) {
    const amsAmmo = countSlotText(metadata.locations, "ams ammo");
    const amsBV = 32 + 11 * amsAmmo;
    equipmentBV += amsBV;
    equipmentLines.push(`    Anti-Missile System +32${amsAmmo ? `; AMS ammo ${amsAmmo} x 11` : ""}`);
  }
  if (hasSlotText(metadata.locations, "beagle")) {
    equipmentBV += 10;
    equipmentLines.push("    Beagle Active Probe +10");
  }

  if (equipmentLines.length) {
    lines.push("  Defensive Equipment:");
    lines.push(...equipmentLines);
    running += equipmentBV;
    lines.push(`  After Equipment:  ${formatDebugNumber(running)}`);
  }

  const ammoPenalty = calculateExplosiveAmmoSubtractionDebug(metadata);
  if (ammoPenalty.lines.length) {
    lines.push("  Explosive Ammo / Gauss Penalty:");
    lines.push(...ammoPenalty.lines.map((line) => `    ${line}`));
    running -= ammoPenalty.total;
    lines.push(`  After Penalty:    ${formatDebugNumber(running)}`);
  }

  const defensiveMultiplier = getDefensiveMovementMultiplier(metadata.walkMP, metadata.jumpMP);
  const total = running * defensiveMultiplier;
  lines.push(`  Defensive Factor: ${formatDebugNumber(running)} x ${formatDebugNumber(defensiveMultiplier)} = ${formatDebugNumber(total)}`);

  return { total, lines };
}

/**
 * Calculate explosive ammo subtraction debug.
 * @param metadata - Input value used by calculateExplosiveAmmoSubtractionDebug.
 * @returns void result from calculateExplosiveAmmoSubtractionDebug.
 */
function calculateExplosiveAmmoSubtractionDebug(metadata: ParsedMtfMetadata): { total: number; lines: string[] } {
  let total = 0;
  const lines: string[] = [];

  for (const locationKey of Object.keys(metadata.locations) as MekLocationKey[]) {
    const location = metadata.locations[locationKey];
    let locationPenalty = 0;

    if (metadata.techBase === "Inner Sphere") {
      const engineLower = metadata.engineType.toLowerCase();
      const hasCASEProtection =
        location.hasCase ||
        (locationKey === "leftArm" && Boolean(metadata.locations.leftTorso?.hasCase)) ||
        (locationKey === "rightArm" && Boolean(metadata.locations.rightTorso?.hasCase));

      if (!engineLower.includes("xl") && hasCASEProtection) continue;

      const ammoSlots = getAmmoSlotCountInLocation(location.slots, true);
      const gaussCount = getTotalUnprotectedGaussCountInLocation(location.slots);
      locationPenalty = 15 * ammoSlots + gaussCount;
    } else {
      if (["centerTorso", "leftLeg", "rightLeg", "head"].includes(locationKey)) {
        locationPenalty += 15 * getAmmoSlotCountInLocation(location.slots, true);
      }
      locationPenalty += getTotalGaussCountInLocation(location.slots);
    }

    if (locationPenalty > 0) {
      total += locationPenalty;
      lines.push(`${location.mtfName}: -${locationPenalty}`);
    }
  }

  return { total, lines };
}

/**
 * Calculate offensive bvdebug.
 * @param metadata - Input value used by calculateOffensiveBVDebug.
 * @returns void result from calculateOffensiveBVDebug.
 */
function calculateOffensiveBVDebug(metadata: ParsedMtfMetadata): { total: number; lines: string[] } {
  const lines: string[] = [];
  const mass = toNumber(metadata.tonnage);
  const hasTargetingComputer = hasSlotText(metadata.locations, "targeting computer");

  const heatWeapons: Array<{
    name: string;
    baseBV: number;
    modifiedBV: number;
    heat: number;
    isRear: boolean;
    tcMultiplier: number;
  }> = [];
  const zeroHeatWeapons: Array<{ name: string; modifiedBV: number; isRear: boolean; tcMultiplier: number }> = [];

  for (const weaponEntry of metadata.weapons) {
    const weapon = weaponEntry.weaponData;
    if (!weapon) continue;

    const baseBV = typeof weapon.bv === "number" ? weapon.bv : toNumber(weapon.bv);
    const heat = typeof weapon.heat === "number" ? weapon.heat : toNumber(weapon.heat);
    if (!baseBV) continue;

    const tcMultiplier = hasTargetingComputer && isTargetingComputerEligibleWeapon(weapon) ? 1.25 : 1;
    const rearMultiplier = weaponEntry.isRearFacing ? 0.5 : 1;
    const modifiedBV = baseBV * tcMultiplier * rearMultiplier;
    const name = getWeaponDebugLabel(weapon, weaponEntry.name);

    if (heat === 0) zeroHeatWeapons.push({ name, modifiedBV, isRear: weaponEntry.isRearFacing, tcMultiplier });
    else heatWeapons.push({ name, baseBV, modifiedBV, heat, isRear: weaponEntry.isRearFacing, tcMultiplier });
  }

  const ammo = calculateAmmoBVDebug(metadata);
  const heatSinkCapacity = metadata.heatSinkType.toLowerCase().includes("double")
    ? metadata.heatSinkCount * 2
    : metadata.heatSinkCount;
  const movementHeat = metadata.jumpMP > 0 ? Math.max(3, metadata.jumpMP) : 2;
  const heatEfficiency = 6 + heatSinkCapacity - movementHeat;
  const totalWeaponHeat = heatWeapons.reduce((sum, weapon) => sum + weapon.heat, 0);

  let heatAdjustedWeaponBV = 0;
  let runningHeat = 0;

  lines.push("Offensive Battle Rating:");
  lines.push(`  Heat Efficiency:  6 + ${heatSinkCapacity} - ${movementHeat} = ${formatDebugNumber(heatEfficiency)}`);
  if (hasTargetingComputer) lines.push("  Targeting Computer detected: eligible direct-fire weapons use x 1.25 BV");
  lines.push("  Weapons:");

  for (const weapon of zeroHeatWeapons) {
    heatAdjustedWeaponBV += weapon.modifiedBV;
    lines.push(`    ${weapon.name}${weapon.isRear ? " (R)" : ""}: ${formatDebugNumber(weapon.modifiedBV)} (Heat: 0${weapon.tcMultiplier !== 1 ? ", TC" : ""})`);
  }

  if (totalWeaponHeat <= heatEfficiency) {
    for (const weapon of heatWeapons) {
      runningHeat += weapon.heat;
      heatAdjustedWeaponBV += weapon.modifiedBV;
      lines.push(`    ${weapon.name}${weapon.isRear ? " (R)" : ""}: ${formatDebugNumber(weapon.modifiedBV)} (Heat: ${runningHeat}${weapon.tcMultiplier !== 1 ? ", TC" : ""})`);
    }
  } else {
    const sortedWeapons = [...heatWeapons].sort((a, b) => {
      if (b.modifiedBV !== a.modifiedBV) return b.modifiedBV - a.modifiedBV;
      return a.heat - b.heat;
    });

    let heatLimitReached = false;
    for (const weapon of sortedWeapons) {
      if (!heatLimitReached) {
        runningHeat += weapon.heat;
        heatAdjustedWeaponBV += weapon.modifiedBV;
        lines.push(`    ${weapon.name}${weapon.isRear ? " (R)" : ""}: ${formatDebugNumber(weapon.modifiedBV)} (Heat: ${runningHeat}${weapon.tcMultiplier !== 1 ? ", TC" : ""})`);
        if (runningHeat >= heatEfficiency) heatLimitReached = true;
      } else {
        heatAdjustedWeaponBV += weapon.modifiedBV / 2;
        lines.push(`    ${weapon.name}${weapon.isRear ? " (R)" : ""}: ${formatDebugNumber(weapon.modifiedBV)} x 0.5 (Overheat)`);
      }
    }
  }

  if (ammo.lines.length) {
    lines.push("  Ammo:");
    lines.push(...ammo.lines.map((line) => `    ${line}`));
  }

  lines.push(`  Weapon BV subtotal: ${formatDebugNumber(heatAdjustedWeaponBV)}`);
  lines.push(`  Ammo BV subtotal:   ${formatDebugNumber(ammo.total)}`);
  lines.push(`  Weight:             + ${formatDebugNumber(mass)}`);

  const weaponBattleRating = heatAdjustedWeaponBV + ammo.total + mass;
  const speedFactor = getOffensiveSpeedFactor(metadata.walkMP, metadata.jumpMP);
  const total = weaponBattleRating * speedFactor;

  lines.push(`  Speed Factor:       ${formatDebugNumber(weaponBattleRating)} x ${formatDebugNumber(speedFactor)} = ${formatDebugNumber(total)}`);

  return { total, lines };
}

/**
 * Builds debug lines for ammo BV matching and totals.
 * @param metadata - Parsed Mek metadata containing location slots and linked weapon definitions.
 * @returns Object containing total ammo BV and printable debug lines for each ammo slot.
 */
function calculateAmmoBVDebug(metadata: ParsedMtfMetadata): { total: number; lines: string[] } {
  let total = 0;
  const lines: string[] = [];

  for (const location of Object.values(metadata.locations)) {
    for (const slot of location.slots) {
      const lowerSlot = slot.toLowerCase();
      if (!lowerSlot.includes("ammo")) continue;

      const matchingWeapon = findAmmoWeaponForSlot(lowerSlot, metadata.weapons, metadata.techBase);
      const weaponAmmoBV = matchingWeapon?.ammo?.ammoBV;
      const ammoMultiplier = getAmmoSlotBVMultiplier(slot);
      let baseBV = 0;
      if (typeof weaponAmmoBV === "number") baseBV = weaponAmmoBV;
      else if (weaponAmmoBV != null) baseBV = toNumber(String(weaponAmmoBV));

      const bv = baseBV * ammoMultiplier;
      total += bv;
      const multiplierNote = ammoMultiplier === 1 ? "" : ` x ${formatDebugNumber(ammoMultiplier)}`;
      lines.push(`${slot} (${location.mtfName}) +${formatDebugNumber(bv)}${multiplierNote ? ` (${formatDebugNumber(baseBV)}${multiplierNote})` : ""}${matchingWeapon?.name ? ` [${matchingWeapon.name}]` : " [unmatched]"}`);
    }
  }

  return { total, lines };
}

/**
 * Is targeting computer eligible weapon.
 * @param weapon - Input value used by isTargetingComputerEligibleWeapon.
 * @returns boolean result from isTargetingComputerEligibleWeapon.
 */
function isTargetingComputerEligibleWeapon(weapon: any): boolean {
  const category = String(weapon.category || "").toLowerCase();
  const name = String(weapon.name || "").toLowerCase();
  const family = String(weapon.family || "").toLowerCase();
  const flags = Array.isArray(weapon.flags) ? weapon.flags.map((flag: any) => String(flag).toLowerCase()) : [];

  if (category === "missile" || family.includes("lrm") || family.includes("srm") || family.includes("mrm") || family.includes("atm")) return false;
  if (name.includes("flamer") || name.includes("tag") || name.includes("narc") || name.includes("anti-missile")) return false;
  if (flags.includes("indirectfire") || flags.includes("cluster")) return false;

  return category === "energy" || category === "ballistic" || flags.includes("directfire");
}


/**
 * Formats a weapon label for debug output, including id and tech base so Clan/Inner Sphere resolution is visible.
 * @param weapon - Resolved weapon definition from WEAPONS.
 * @param fallbackName - Original MTF weapon name used when the definition has no display name.
 * @returns Printable debug label for weapon BV/cost diagnostics.
 */
function getWeaponDebugLabel(weapon: any, fallbackName: string): string {
  const name = weapon?.name || fallbackName;
  const id = weapon?.id ? `id=${weapon.id}` : "id=?";
  const techBase = weapon?.techBase ? `tech=${weapon.techBase}` : "tech=?";
  const bv = weapon?.bv != null ? `bv=${weapon.bv}` : "bv=?";

  return `${name} [${id}, ${techBase}, ${bv}]`;
}

/**
 * Format debug number.
 * @param value - Input value used by formatDebugNumber.
 * @returns string result from formatDebugNumber.
 */
function formatDebugNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded) ? rounded.toLocaleString() : rounded.toLocaleString(undefined, { maximumFractionDigits: 3 });
}

/**
 * Pad right.
 * @param value - Input value used by padRight.
 * @param length - Input value used by padRight.
 * @returns string result from padRight.
 */
function padRight(value: string, length: number): string {
  return value.length >= length ? value : value + " ".repeat(length - value.length);
}

/**
 * To title label.
 * @param value - Input value used by toTitleLabel.
 * @returns string result from toTitleLabel.
 */
function toTitleLabel(value: string): string {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

/**
 * Summarize weapons.
 * @param weapons - Input value used by summarizeWeapons.
 * @returns void result from summarizeWeapons.
 */
function summarizeWeapons(weapons: ParsedWeaponEntry[]) {
  const counts = new Map<string, number>();

  for (const weapon of weapons) {
    const name = weapon.weaponData?.name || weapon.name;
    counts.set(name, (counts.get(name) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => (count > 1 ? `${count}x ${name}` : name))
    .join("; ");
}

/**
 * Sort catalog rows.
 * @param a - Input value used by sortCatalogRows.
 * @param b - Input value used by sortCatalogRows.
 * @returns void result from sortCatalogRows.
 */
function sortCatalogRows(a: CatalogRow, b: CatalogRow) {
  const aName = `${a.chassis} ${a.model}`;
  const bName = `${b.chassis} ${b.model}`;
  return aName.localeCompare(bName);
}

/**
 * To csv.
 * @param rows - Input value used by toCsv.
 * @returns void result from toCsv.
 */
function toCsv(rows: CatalogRow[]) {
  const header = CSV_COLUMNS.join(",");

  const body = rows.map((row) =>
    CSV_COLUMNS.map((column) => escapeCsv(row[column])).join(",")
  );

  return [header, ...body].join("\n");
}

/**
 * Escape csv.
 * @param value - Input value used by escapeCsv.
 * @returns void result from escapeCsv.
 */
function escapeCsv(value: unknown) {
  if (value == null) return "";

  const stringValue = String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * To number.
 * @param value - Input value used by toNumber.
 * @returns number result from toNumber.
 */
function toNumber(value: string | number | undefined | null): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const cleaned = String(value || "").replace(/[^\d.-]/g, "");
  if (!cleaned) return 0;

  const number = Number(cleaned);
  return Number.isFinite(number) ? number : 0;
}

/**
 * Number to string.
 * @param value - Input value used by numberToString.
 * @returns void result from numberToString.
 */
function numberToString(value: number) {
  return Number.isFinite(value) && value !== 0 ? String(value) : "";
}

/**
 * Format number.
 * @param value - Input value used by formatNumber.
 * @returns void result from formatNumber.
 */
function formatNumber(value: number) {
  if (!Number.isFinite(value) || value === 0) return "";
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

/**
 * Is location header.
 * @param lowerLine - Input value used by isLocationHeader.
 * @returns boolean result from isLocationHeader.
 */
function isLocationHeader(lowerLine: string): boolean {
  const locationHeaders = [
    "head:",
    "center torso:",
    "left torso:",
    "right torso:",
    "left arm:",
    "right arm:",
    "left leg:",
    "right leg:",
    "front left leg:",
    "front right leg:",
    "rear left leg:",
    "rear right leg:",
  ];
  return locationHeaders.includes(lowerLine);
}

/**
 * Normalize location name.
 * @param location - Input value used by normalizeLocationName.
 * @returns MekLocationKey | null result from normalizeLocationName.
 */
function normalizeLocationName(location: string): MekLocationKey | null {
  const normalized = location.toLowerCase().replace(/\s+/g, " ").trim();

  const locationMap: Record<string, MekLocationKey> = {
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

  return locationMap[normalized] || null;
}

/**
 * Randomizes the order of an array using a Fisher-Yates shuffle.
 * @param values - Source array to shuffle without mutating the original array.
 * @returns Shuffled copy of the source array.
 */
function shuffle<T>(values: T[]): T[] {
  const copy = [...values];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

/**
 * Get requested type.
 * @returns UnitTypeKey | null result from getRequestedType.
 */
function getRequestedType(): UnitTypeKey | null {
  const typeArg = process.argv.find((arg) => arg.startsWith("--type="));

  if (!typeArg) return null;

  const requested = typeArg.replace("--type=", "") as UnitTypeKey;

  if (!Object.keys(UNIT_TYPE_FOLDERS).includes(requested)) {
    throw new Error(
      `Unknown unit type "${requested}". Valid types: ${Object.keys(UNIT_TYPE_FOLDERS).join(", ")}`
    );
  }

  return requested;
}

/**
 * Get requested sample count.
 * @returns number | null result from getRequestedSampleCount.
 */
function getRequestedSampleCount(): number | null {
  const explicitArg = process.argv.find(
    (arg) =>
      arg.startsWith("--sample=") ||
      arg.startsWith("--test=") ||
      arg.startsWith("--limit=")
  );

  if (explicitArg) {
    const value = explicitArg.split("=")[1];
    const count = Number(value);

    if (!Number.isInteger(count) || count <= 0) {
      throw new Error(`Sample count must be a positive integer. Received: ${value}`);
    }

    return count;
  }

  // Allows: npm run index:units -- 10
  const positionalNumber = process.argv
    .slice(2)
    .find((arg) => /^\d+$/.test(arg));

  if (!positionalNumber) return null;

  const count = Number(positionalNumber);

  if (!Number.isInteger(count) || count <= 0) {
    throw new Error(`Sample count must be a positive integer. Received: ${positionalNumber}`);
  }

  return count;
}


/**
 * Get index options.
 * @returns IndexOptions result from getIndexOptions.
 */
function getIndexOptions(): IndexOptions {
  return {
    rulesLevel: getRequestedRulesLevel(),
    debug: hasDebugFlag(),
    unitQuery: getRequestedUnitQuery(),
  };
}

/**
 * Get requested rules level.
 * @returns string | null result from getRequestedRulesLevel.
 */
function getRequestedRulesLevel(): string | null {
  const rulesArg = process.argv.find(
    (arg) =>
      arg.startsWith("--rules=") ||
      arg.startsWith("--rulesLevel=") ||
      arg.startsWith("--rules-level=") ||
      arg.startsWith("--level=")
  );

  if (!rulesArg) return null;

  const rawValue = rulesArg.substring(rulesArg.indexOf("=") + 1).trim();
  const normalized = normalizeRulesLevelForCatalog(rawValue);

  if (!normalized) return null;

  const allowed = ["Introductory", "Standard", "Advanced", "Experimental", "Unofficial"];
  if (!allowed.includes(normalized)) {
    throw new Error(
      `Unknown rules level "${rawValue}". Use 1-5, Introductory, Standard, Advanced, Experimental, or Unofficial.`
    );
  }

  return normalized;
}


/**
 * Reads the requested specific unit query from CLI arguments.
 * @returns Unit query string from --unit, --model, or --unitModel, or null when no specific unit was requested.
 */
function getRequestedUnitQuery(): string | null {
  const unitArg = process.argv.find(
    (arg) =>
      arg.startsWith("--unit=") ||
      arg.startsWith("--model=") ||
      arg.startsWith("--unitModel=") ||
      arg.startsWith("--unit-model=")
  );

  if (!unitArg) return null;

  const value = unitArg.substring(unitArg.indexOf("=") + 1).trim();
  return value || null;
}

/**
 * Has debug flag.
 * @returns boolean result from hasDebugFlag.
 */
function hasDebugFlag(): boolean {
  return process.argv.some(
    (arg) =>
      arg === "--debug" ||
      arg === "--debug=true" ||
      arg === "--debug-bv" ||
      arg === "--debug-cost"
  );
}

main().catch((error) => {
  console.error("[indexUnits] Failed:", error);
  process.exit(1);
});
