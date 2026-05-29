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
  mulId: string;

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
  ejectionType: string;
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
  mulId: string;
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
  armorTonnageOverride: number;
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
  quantity: number;
  quantityIndex: number;
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
  rulesLevels: string[];
  debug: boolean;
  unitQuery: string | null;
};

type CostBreakdownLine = {
  label: string;
  amount: number;
  count?: number;
};

type MekCBillCalculation = {
  total: number;
  subtotal: number;
  omniMultiplier: number;
  weightMultiplier: number;
  breakdown: Record<string, number>;
  costLines: CostBreakdownLine[];
};


const UNITS_ROOT = path.resolve(process.cwd(), "src", "data", "units");
const OUTPUT_DIR = path.resolve(process.cwd(), "server", "data", "generated");
const UNIT_INDEX_OUTPUT_DIR = path.join(OUTPUT_DIR, "unitIndex");

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
  "mulId",
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
  await fs.mkdir(UNIT_INDEX_OUTPUT_DIR, { recursive: true });

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
  const outputPath = path.join(UNIT_INDEX_OUTPUT_DIR, `test_${safeQuery}.csv`);
  await fs.writeFile(outputPath, toCsv(rows), "utf-8");

  console.log(`[indexUnits] specific unit: "${options.unitQuery}" -> ${rows.length} row(s) -> ${outputPath}`);
  if (hasRulesLevelFilter(options)) {
    console.log(`[indexUnits] specific unit: rules level filter=${getRulesLevelFilterDescription(options)}`);
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

  const outputPath = path.join(UNIT_INDEX_OUTPUT_DIR, "testSample.csv");
  await fs.writeFile(outputPath, toCsv(rows), "utf-8");

  console.log(
    `[indexUnits] test sample: ${rows.length}/${sampleCount} rows -> ${outputPath}`
  );
  console.log(
    `[indexUnits] usage: npm run index:units -- 10 OR npm run index:units -- --sample=10 --type=meks OR npm run index:units -- --type=meks --supported-only OR npm run index:units -- --type=meks --unit=XNT-3O --debug`
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
  const outputPath = getUnitIndexCsvPath(unitType);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, csv, "utf-8");

  const missingBvCount = rows.filter((row) => !row.bv).length;
  const missingCostCount = rows.filter((row) => !row.costCBills).length;

  console.log(`[indexUnits] ${unitType}: ${rows.length} rows -> ${outputPath}`);
  if (hasRulesLevelFilter(options)) {
    console.log(`[indexUnits] ${unitType}: rules level filter=${getRulesLevelFilterDescription(options)}`);
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

  if (!shouldIncludeRulesLevel(metadata.rulesLevel, options)) {
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
    mulId: metadata.mulId,

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
    armorTonnage: formatNumber(getArmorTonnage(getEffectiveArmorType(metadata), metadata.techBase, getTotalArmor(metadata.armor))),
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
  const mulId = normalizeIntegerString(
    getValue(
      "mul id",
      "mulId",
      "mul_id",
      "mulid",
      "master unit list id",
      "masterunitlistid",
      "master unit list"
    )
  );

  const walkMP = toNumber(getValue("walk mp", "walkmp", "walking mp", "walkingmp"));
  let runMP = toNumber(getValue("run mp", "runmp", "running mp", "runningmp")) || getRunMP(walkMP);
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
  const armorTonnageOverride = parseArmorTonnageHint(lines);
  const structureType = normalizeComponentText(getValue("structure", "internal structure", "structure type")) || "Standard";
  const gyroType = normalizeComponentText(getValue("gyro", "gyro type")) || "Standard";
  const cockpitType = normalizeComponentText(getValue("cockpit", "cockpit type")) || "Standard";
  const ejectionType = normalizeComponentText(getValue("ejection", "ejection system", "ejection type"));
  const myomerType = normalizeComponentText(getValue("myomer", "myomer type")) || "Standard";

  const config = getValue("config");
  const armor = parseArmorValues(lines);
  const locations = unitType === "meks" ? parseMekLocations(lines, unitTonnage, armor, config) : emptyMekLocations(config);
  runMP = getEffectiveRunMP(walkMP, runMP, myomerType, locations);
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
    mulId,
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
    ejectionType,
    heatSinkCount,
    heatSinkType,
    armorType,
    armorTonnageOverride,
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
 * Normalizes a declared MTF weapon name by removing a leading quantity such as "1 Small Laser" or "2 Medium Laser".
 * @param rawName - Raw weapon name from the MTF Weapons section or related slot text.
 * @returns Weapon name with leading quantity removed.
 */
function normalizeDeclaredWeaponName(rawName: string): string {
  return String(rawName ?? "")
    .trim()
    .replace(/^\d+(?:\.\d+)?\s*[xX]?\s+/, "")
    .replace(/^[xX]\s*\d+(?:\.\d+)?\s+/, "")
    .replace(/^\(\s*\d+(?:\.\d+)?\s*\)\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parses a declared weapon quantity while preserving the cleaned weapon name.
 * Examples: "2 SRM 2" becomes quantity 2/name "SRM 2"; "SRM 2" becomes quantity 1/name "SRM 2".
 * @param rawName - Raw weapon name field from the MTF Weapons section.
 * @returns Parsed quantity and normalized weapon name.
 */
function parseDeclaredWeaponQuantity(rawName: string): { quantity: number; name: string } {
  const trimmed = String(rawName ?? "").trim();
  const leadingCountMatch = trimmed.match(/^(\d+)\s+(.+)$/);

  if (!leadingCountMatch) {
    return { quantity: 1, name: normalizeDeclaredWeaponName(trimmed) };
  }

  return {
    quantity: Math.max(1, Number(leadingCountMatch[1])),
    name: normalizeDeclaredWeaponName(leadingCountMatch[2]),
  };
}

/**
 * Parse weapons section.
 * @param lines - Input value used by parseWeaponsSection.
 * @returns ParsedWeaponEntry[] result from parseWeaponsSection.
 */
function parseWeaponsSection(lines: string[]): ParsedWeaponEntry[] {
  const weapons: ParsedWeaponEntry[] = [];
  let inWeaponsSection = false;
  let expectedLineCount = 0;
  let consumedWeaponLines = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase();

    if (lower.startsWith("weapons:")) {
      inWeaponsSection = true;
      const countString = trimmed.substring(trimmed.indexOf(":") + 1).trim();
      expectedLineCount = toNumber(countString);
      consumedWeaponLines = 0;
      continue;
    }

    if (!inWeaponsSection) continue;

    if (isLocationHeader(lower)) {
      break;
    }

    if (!trimmed) continue;

    if (expectedLineCount > 0 && consumedWeaponLines >= expectedLineCount) {
      break;
    }

    consumedWeaponLines++;

    const parts = trimmed.split(",").map((part) => part.trim());
    const rawName = parts[0] || "";
    const location = parts[1] || "";
    const isRearFacing = /\(r\)/i.test(rawName);
    const withoutRearMarker = rawName.replace(/\s*\(R\)\s*$/i, "").trim();
    const parsedQuantity = parseDeclaredWeaponQuantity(withoutRearMarker);

    if (!parsedQuantity.name) continue;

    for (let quantityIndex = 1; quantityIndex <= parsedQuantity.quantity; quantityIndex++) {
      weapons.push({
        name: parsedQuantity.name,
        location,
        isRearFacing,
        quantity: parsedQuantity.quantity,
        quantityIndex,
      });
    }
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
  const normalizedRawName = normalizeLookupText(normalizeDeclaredWeaponName(rawName));
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

  const cockpitMultiplier = getCockpitBVMultiplier(metadata.cockpitType);
  return Math.round((defensiveBV + offensiveBV) * cockpitMultiplier);
}

/**
 * Calculate defensive bv.
 * @param metadata - Input value used by calculateDefensiveBV.
 * @returns number | null result from calculateDefensiveBV.
 */
/**
 * Gets the defensive internal-structure BV modifier for structure type.
 * Reinforced structure doubles internal structure contribution before engine-type modifiers.
 * Industrial structure halves it.
 *
 * @param structureType - Parsed internal structure type from the MTF.
 * @returns Defensive BV structure modifier.
 */
function getDefensiveStructureModifier(structureType: string): number {
  const lower = String(structureType || "").toLowerCase();

  if (lower.includes("reinforced")) return 2.0;
  if (lower.includes("industrial")) return 0.5;

  return 1.0;
}

/**
 * Gets the armor modifier used in Defensive Battle Rating.
 *
 * Most armor types use x1.0. Commercial armor uses x0.5. Reflective armor uses
 * x1.5. Ferro-Lamellor uses x1.2.
 *
 * @param armorType - Effective armor type.
 * @returns Defensive armor BV modifier.
 */
function getDefensiveArmorBVModifier(armorType: string): number {
  const normalized = normalizeLookupText(armorType);

  if (normalized.includes("commercial")) return 0.5;
  if (normalized.includes("reflective")) return 1.5;
  if (normalized.includes("ferrolamell")) return 1.2;

  return 1.0;
}

function calculateDefensiveBV(metadata: ParsedMtfMetadata): number | null {
  const mass = toNumber(metadata.tonnage);
  if (!mass) return null;

  const effectiveArmorType = getEffectiveArmorType(metadata);
  const armorTypeModifier = getDefensiveArmorBVModifier(effectiveArmorType);
  const structureModifier = getDefensiveStructureModifier(metadata.structureType);

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

  const additionalDefensiveEquipment = calculateAdditionalDefensiveEquipmentBV(metadata);
  let defensiveEquipmentBV = additionalDefensiveEquipment.total;
  defensiveEquipmentBV += calculateDefensiveAntiMissileBV(metadata).total;

  const explosiveAmmoSubtraction = calculateExplosiveAmmoSubtraction(metadata);

  return (
    baseDefense +
    defensiveEquipmentBV -
    explosiveAmmoSubtraction
  ) * getDefensiveMovementMultiplier(metadata.walkMP, metadata.jumpMP, metadata.runMP, hasStealthArmor(metadata));
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
 * Detects whether the Mek has MASC or a MASC-like system that doubles running MP for BV movement calculations.
 * MTFs are inconsistent: some use Myomer: MASC, while others only expose critical slots such as CLMASC or MASC.
 * @param myomerType - Parsed myomer field from the MTF.
 * @param locations - Parsed critical slots by location.
 * @returns True when MASC is found in either myomer metadata or critical slots.
 */
function hasMASC(myomerType: string, locations: MekLocationMap): boolean {
  const myomer = normalizeLookupText(myomerType || "");
  if (myomer.includes("masc")) return true;

  return Object.values(locations).some((location) =>
    location.slots.some((slot) => {
      const normalized = normalizeLookupText(slot);
      return normalized === "masc" || normalized === "clmasc" || normalized === "ismasc" || normalized.includes("myomeraccelerator");
    })
  );
}

/**
 * Detects whether the Mek has a Supercharger system.
 * MTFs usually expose this through critical slots such as Supercharger or CLSupercharger.
 * Superchargers use the same doubled-run movement basis as MASC for BV movement factors.
 * @param locations - Parsed critical slots by location.
 * @returns True when a Supercharger critical slot is found.
 */
function hasSupercharger(locations: MekLocationMap): boolean {
  return Object.values(locations).some((location) =>
    location.slots.some((slot) => {
      const normalized = normalizeLookupText(slot);
      return normalized === "supercharger" || normalized === "clsupercharger" || normalized === "issupercharger" || normalized.includes("supercharger");
    })
  );
}


/**
 * Detects Stealth Armor from armor type or critical-slot labels.
 * Stealth Armor adds +2 defensive TMM and +10 heat burden for offensive BV.
 * @param metadata - Parsed Mek metadata.
 * @returns True when the unit has Stealth Armor.
 */
function hasStealthArmor(metadata: ParsedMtfMetadata): boolean {
  const armorType = normalizeLookupText(metadata.armorType || "");
  if (armorType.includes("stealth")) return true;

  return Object.values(metadata.locations).some((location) =>
    location.slots.some((slot) => normalizeLookupText(slot).includes("stealtharmor"))
  );
}

/**
 * Calculates the effective running MP used for BV, including MASC when present.
 * @param walkMP - Walking MP from the MTF.
 * @param parsedRunMP - Running MP from the MTF or the normal 1.5x fallback.
 * @param myomerType - Parsed myomer field.
 * @param locations - Parsed critical slots by location.
 * @returns Effective running MP for defensive TMM and offensive speed factor calculations.
 */
function getEffectiveRunMP(walkMP: number, parsedRunMP: number, myomerType: string, locations: MekLocationMap): number {
  if (!walkMP) return 0;
  const normalRun = parsedRunMP || getRunMP(walkMP);
  if (hasMASC(myomerType, locations) || hasSupercharger(locations)) {
    return Math.max(normalRun, walkMP * 2);
  }
  return normalRun;
}

/**
 * Determines whether a weapon should be counted only in Defensive Battle Rating and excluded from Offensive Battle Rating.
 * @param weapon - Weapon or equipment definition from weapons.ts.
 * @returns True for AMS and other defensive-only equipment.
 */
function isDefensiveOnlyWeapon(weapon: any): boolean {
  const name = normalizeLookupText(String(weapon?.name || ""));
  const id = normalizeLookupText(String(weapon?.id || ""));
  const family = normalizeLookupText(String(weapon?.family || ""));
  const flags = Array.isArray(weapon?.flags) ? weapon.flags.map((flag: any) => normalizeLookupText(String(flag))) : [];

  return (
    name.includes("antimissilesystem") ||
    id.includes("antimissilesystem") ||
    id.includes("ams") ||
    family.includes("antimissilesystem") ||
    flags.includes("defensive") ||
    flags.includes("antimissile")
  );
}

/**
 * Calculates defensive BV for non-AMS defensive equipment by scanning raw critical slots
 * and resolving equipment definitions from WEAPONS.
 *
 * This covers equipment such as ECM suites, active probes, A-Pods, and B-Pods. AMS is
 * handled separately by calculateDefensiveAntiMissileBV because AMS ammunition has its
 * own defensive BV handling.
 *
 * @param metadata - Parsed Mek metadata.
 * @returns Defensive equipment BV total and printable debug lines.
 */
function calculateAdditionalDefensiveEquipmentBV(metadata: ParsedMtfMetadata): { total: number; lines: string[] } {
  const countedKeys = new Set<string>();
  const grouped = new Map<string, { label: string; count: number; bvEach: number; total: number }>();

  for (const location of Object.values(metadata.locations)) {
    for (let slotIndex = 0; slotIndex < location.slots.length; slotIndex++) {
      const rawSlot = location.slots[slotIndex];
      const equipment = resolveDefensiveEquipmentDefinitionFromSlot(rawSlot, metadata);

      if (!equipment || !isAdditionalDefensiveEquipmentBVDefinition(equipment)) continue;

      const bv = getResolvedBVValue(equipment.bv);
      if (bv <= 0) continue;

      const equipmentKey = getDefensiveEquipmentBVCountKey(equipment, location.key, slotIndex);
      if (countedKeys.has(equipmentKey)) continue;
      countedKeys.add(equipmentKey);

      const label = String(equipment.name || cleanMiscEquipmentSlotText(rawSlot));
      const groupKey = `${label}|${bv}`;
      const existing = grouped.get(groupKey);

      if (existing) {
        existing.count += 1;
        existing.total += bv;
      } else {
        grouped.set(groupKey, { label, count: 1, bvEach: bv, total: bv });
      }
    }
  }

  const lines = [...grouped.values()]
    .sort((a, b) => a.label.localeCompare(b.label))
    .map((entry) => {
      const countText = entry.count > 1 ? ` (${entry.count} x ${formatDebugNumber(entry.bvEach)})` : "";
      return `${entry.label} +${formatDebugNumber(entry.total)}${countText}`;
    });

  const total = [...grouped.values()].reduce((sum, entry) => sum + entry.total, 0);
  return { total, lines };
}

/**
 * Resolves one raw critical slot to a defensive equipment definition from WEAPONS.
 *
 * @param rawSlot - Raw critical slot text.
 * @param metadata - Parsed Mek metadata.
 * @returns Matching defensive equipment definition, or null if none is found.
 */
function resolveDefensiveEquipmentDefinitionFromSlot(rawSlot: string, metadata: ParsedMtfMetadata): any | null {
  const normalized = normalizeLookupText(rawSlot);
  if (!normalized || normalized.includes("ammo") || normalized.includes("empty") || normalized === "omnipod") {
    return null;
  }

  const cleanedSlot = cleanMiscEquipmentSlotText(rawSlot);
  const possibleId = extractWeaponId(rawSlot) || extractWeaponId(cleanedSlot);

  const directCandidates = [
    resolveWeapon(rawSlot, possibleId, metadata.techBase),
    resolveWeapon(cleanedSlot, possibleId, metadata.techBase),
  ].filter(Boolean);

  for (const candidate of directCandidates) {
    if (isAdditionalDefensiveEquipmentBVDefinition(candidate)) {
      return candidate;
    }
  }

  return findLooseDefensiveEquipmentDefinition(rawSlot, metadata.techBase);
}

/**
 * Finds a defensive equipment definition by comparing raw slot tokens to WEAPONS ids,
 * names, and altNames.
 *
 * @param rawSlot - Raw critical slot text.
 * @param unitTechBase - Unit tech base used to prefer Clan or Inner Sphere definitions.
 * @returns Matching defensive equipment definition, or null if no reliable match is found.
 */
function findLooseDefensiveEquipmentDefinition(rawSlot: string, unitTechBase: string): any | null {
  const weaponRecord = WEAPONS as Record<string, any>;
  const desiredTechBase = normalizeTechBase(inferWeaponTechBase(rawSlot) || unitTechBase || "");
  const slotTokens = tokenizeEquipmentText(rawSlot);
  const normalizedSlot = normalizeLookupText(rawSlot);

  if (!slotTokens.length && !normalizedSlot) return null;

  const candidates: Array<{ equipment: any; score: number }> = [];

  for (const [key, equipment] of Object.entries(weaponRecord)) {
    if (!isAdditionalDefensiveEquipmentBVDefinition(equipment)) continue;

    const nameValues = [
      key,
      equipment?.id,
      equipment?.name,
      ...(Array.isArray(equipment?.altNames) ? equipment.altNames : []),
    ].filter(Boolean).map(String);

    let bestNameScore = 0;

    for (const nameValue of nameValues) {
      const normalizedName = normalizeLookupText(nameValue);
      const nameTokens = tokenizeEquipmentText(nameValue);

      if (normalizedName && normalizedSlot && normalizedName === normalizedSlot) {
        bestNameScore = Math.max(bestNameScore, 120);
      } else if (normalizedName && normalizedSlot && (normalizedSlot.includes(normalizedName) || normalizedName.includes(normalizedSlot))) {
        bestNameScore = Math.max(bestNameScore, 90);
      }

      if (nameTokens.length > 0 && nameTokens.every((token) => slotTokens.includes(token))) {
        bestNameScore = Math.max(bestNameScore, 80 + nameTokens.length);
      }
    }

    if (bestNameScore <= 0) continue;

    candidates.push({
      equipment,
      score: bestNameScore + getTechBaseMatchScore(equipment, desiredTechBase),
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.equipment ?? null;
}

/**
 * Determines whether a WEAPONS definition should add defensive equipment BV outside
 * the AMS-specific path.
 *
 * @param definition - Weapon/equipment definition from WEAPONS.
 * @returns True when this definition contributes fixed defensive equipment BV.
 */
function isAdditionalDefensiveEquipmentBVDefinition(definition: any): boolean {
  if (!definition) return false;
  if (getResolvedBVValue(definition.bv) <= 0) return false;

  const category = String(definition?.category || "").toLowerCase();
  const family = normalizeLookupText(String(definition?.family || ""));
  const id = normalizeLookupText(String(definition?.id || ""));
  const name = normalizeLookupText(String(definition?.name || ""));
  const flags = Array.isArray(definition?.flags)
    ? definition.flags.map((flag: any) => normalizeLookupText(String(flag)))
    : [];

  if (category !== "equipment") return false;

  // CASE II contributes defensive equipment BV when weapons.ts provides a numeric BV.
  // Standard CASE is still handled by cost/protection logic and should not add BV here.
  if (isCASEIIDefinition(definition)) return true;

  // Handled elsewhere or not defensive equipment BV.
  if (isDefensiveOnlyWeapon(definition)) return false;
  if (family.includes("case") || id.includes("case")) return false;
  if (family.includes("masc") || id.includes("masc")) return false;
  if (family.includes("artemis") || id.includes("artemis")) return false;
  if (family.includes("c3") || id.includes("c3") || flags.includes("c3")) return false;
  if (family.includes("tag") || id.includes("tag") || flags.includes("tag")) return false;
  if (family.includes("targeting") || id.includes("targetingcomputer")) return false;
  if (family.includes("narc") || id.includes("narc")) return false;

  return (
    family.includes("ecm") ||
    family.includes("probe") ||
    family.includes("activeprobe") ||
    family.includes("a_pod") ||
    family.includes("b_pod") ||
    id.includes("apod") ||
    id.includes("bpod") ||
    name.includes("apod") ||
    name.includes("bpod") ||
    flags.includes("ecm") ||
    flags.includes("probe") ||
    flags.includes("activeprobe")
  );
}

/**
 * Creates a stable count key for defensive equipment BV. Multi-slot electronics are
 * counted once per location, while A-Pods and B-Pods are counted per critical slot.
 *
 * @param equipment - Resolved WEAPONS equipment definition.
 * @param locationKey - Location containing the equipment.
 * @param slotIndex - Slot index within the location.
 * @returns Stable count key.
 */
function getDefensiveEquipmentBVCountKey(equipment: any, locationKey: MekLocationKey, slotIndex: number): string {
  const id = normalizeLookupText(String(equipment?.id || equipment?.name || ""));
  const family = normalizeLookupText(String(equipment?.family || ""));
  const name = normalizeLookupText(String(equipment?.name || ""));

  const isPod = (
    family.includes("a_pod") ||
    family.includes("b_pod") ||
    id.includes("apod") ||
    id.includes("bpod") ||
    name.includes("apod") ||
    name.includes("bpod")
  );

  if (isCASEIIDefinition(equipment)) {
    return `${id}|${locationKey}|${slotIndex}`;
  }

  return isPod ? `${id}|${locationKey}|${slotIndex}` : `${id}|${locationKey}`;
}

/**
 * Determines whether a WEAPONS definition is CASE II rather than standard CASE.
 *
 * CASE II contributes defensive equipment BV when the equipment table provides a
 * numeric BV. Standard CASE does not use this path.
 *
 * @param definition - Weapon/equipment definition from WEAPONS.
 * @returns True when the definition represents CASE II.
 */
function isCASEIIDefinition(definition: any): boolean {
  const id = normalizeLookupText(String(definition?.id || ""));
  const name = normalizeLookupText(String(definition?.name || ""));
  const family = normalizeLookupText(String(definition?.family || ""));
  const altNames = Array.isArray(definition?.altNames)
    ? definition.altNames.map((altName: any) => normalizeLookupText(String(altName)))
    : [];

  return (
    id.includes("caseii") ||
    name.includes("caseii") ||
    family.includes("caseii") ||
    altNames.some((altName: string) => altName.includes("caseii"))
  );
}

/**
 * Gets a numeric BV value from a WEAPONS definition.
 *
 * Rule-code BV values such as "A", "C", or "D" are intentionally ignored here because
 * they require separate rule-specific handling rather than a flat defensive BV addition.
 *
 * @param value - Raw BV value.
 * @returns Numeric BV, or 0 for non-numeric/rule-code values.
 */
function getResolvedBVValue(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value.trim())) {
    return Number(value);
  }
  return 0;
}

/**
 * Calculates defensive BV from AMS-style equipment and its ammunition using the resolved Clan/IS weapon data.
 * @param metadata - Parsed Mek metadata.
 * @returns Defensive AMS total and printable debug lines.
 */
function calculateDefensiveAntiMissileBV(metadata: ParsedMtfMetadata): { total: number; lines: string[] } {
  let total = 0;
  const lines: string[] = [];

  const antiMissileWeapons = metadata.weapons
    .map((entry) => entry.weaponData)
    .filter((weapon) => weapon && isDefensiveOnlyWeapon(weapon));

  const uniqueAntiMissileWeapons = antiMissileWeapons.length
    ? antiMissileWeapons
    : (hasSlotText(metadata.locations, "anti-missile system") || hasSlotText(metadata.locations, "ams"))
      ? [findAmmoWeaponForSlot("ams ammo", metadata.weapons, metadata.techBase)].filter(Boolean)
      : [];

  for (const weapon of uniqueAntiMissileWeapons) {
    const weaponBV = typeof weapon.bv === "number" ? weapon.bv : toNumber(String(weapon.bv || 0));
    if (weaponBV > 0) {
      total += weaponBV;
      lines.push(`${weapon.name || "Anti-Missile System"} +${formatDebugNumber(weaponBV)}`);
    }
  }

  const amsAmmoSlots = getAmmoSlotsForDefensiveAntiMissile(metadata);
  if (amsAmmoSlots.length > 0) {
    const ammoWeapon = chooseBestWeaponByTechBase(uniqueAntiMissileWeapons, metadata.techBase) || findAmmoWeaponForSlot("ams ammo", metadata.weapons, metadata.techBase);
    const ammoBV = typeof ammoWeapon?.ammo?.ammoBV === "number" ? ammoWeapon.ammo.ammoBV : toNumber(String(ammoWeapon?.ammo?.ammoBV || 0));
    const ammoTotal = amsAmmoSlots.reduce((sum, slot) => sum + ammoBV * getAmmoSlotBVMultiplier(slot), 0);
    total += ammoTotal;
    lines.push(`AMS Ammo +${formatDebugNumber(ammoTotal)}${ammoBV ? ` (${amsAmmoSlots.length} x ${formatDebugNumber(ammoBV)})` : ""}`);
  }

  return { total, lines };
}

/**
 * Collects AMS ammunition critical-slot labels for defensive BV accounting.
 * @param metadata - Parsed Mek metadata.
 * @returns Raw slot labels for AMS ammunition.
 */
function getAmmoSlotsForDefensiveAntiMissile(metadata: ParsedMtfMetadata): string[] {
  const slots: string[] = [];
  for (const location of Object.values(metadata.locations)) {
    for (const slot of location.slots) {
      const normalized = normalizeLookupText(slot);
      if (normalized.includes("ammo") && (normalized.includes("ams") || normalized.includes("antimissile"))) {
        slots.push(slot);
      }
    }
  }
  return slots;
}

/**
 * Determines whether a missile launcher should receive the Artemis IV 20 percent BV increase.
 * This first pass uses MTF slot/ammo labels because Omni files often encode Artemis as "Artemis-capable" ammo.
 * @param weaponEntry - Mounted weapon entry.
 * @param metadata - Parsed Mek metadata.
 * @returns True when the weapon is an eligible launcher and Artemis-capable labels are found for the unit/location.
 */
function weaponGetsArtemisModifier(weaponEntry: ParsedWeaponEntry, metadata: ParsedMtfMetadata): boolean {
  const weapon = weaponEntry.weaponData;
  if (!weapon) return false;

  const family = normalizeLookupText(String(weapon.family || ""));
  const name = normalizeLookupText(String(weapon.name || weaponEntry.name || ""));
  const eligible = family.includes("lrm") || family.includes("srm") || family.includes("mml") || name.includes("lrm") || name.includes("srm") || name.includes("mml");
  if (!eligible) return false;

  const locationKey = normalizeLocationName(weaponEntry.location);
  const locationSlots = locationKey ? metadata.locations[locationKey]?.slots ?? [] : [];
  const allSlots = Object.values(metadata.locations).flatMap((location) => location.slots);
  const searchSlots = locationSlots.length ? locationSlots : allSlots;

  const hasLocalArtemis = searchSlots.some((slot) => normalizeLookupText(slot).includes("artemis"));
  if (hasLocalArtemis) return true;

  // Fallback: if the unit has Artemis-capable ammo and all mounted launchers of this rack family are likely Artemis-capable.
  const rack = String(weapon.rackSize || "") || (String(weapon.name || "").match(/\d+/)?.[0] ?? "");
  const normalizedWeaponName = normalizeLookupText(String(weapon.name || weaponEntry.name || ""));
  return allSlots.some((slot) => {
    const normalized = normalizeLookupText(slot);
    return normalized.includes("ammo") && normalized.includes("artemis") && (!rack || normalized.includes(rack)) && (
      normalizedWeaponName.includes("lrm") ? normalized.includes("lrm") :
      normalizedWeaponName.includes("srm") ? normalized.includes("srm") :
      true
    );
  });
}

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

      subtraction +=
        15 * getAmmoSlotCountInLocation(location.slots, true) +
        getExplosiveWeaponSlotCountInLocation(location.slots);
    } else {
      if (
        locationKey === "centerTorso" ||
        isLegLocationKey(locationKey) ||
        locationKey === "head"
      ) {
        subtraction +=
          15 * getAmmoSlotCountInLocation(location.slots, true) +
          getExplosiveWeaponSlotCountInLocation(location.slots);
      }
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

    if (isDefensiveOnlyWeapon(weapon)) continue;

    const bv = typeof weapon.bv === "number" ? weapon.bv : toNumber(weapon.bv);
    const heat = typeof weapon.heat === "number" ? weapon.heat : toNumber(weapon.heat);

    if (!bv) continue;

    const tcMultiplier = hasSlotText(metadata.locations, "targeting computer") && isTargetingComputerEligibleWeapon(weapon) ? 1.25 : 1;
    const artemisMultiplier = weaponGetsArtemisModifier(weaponEntry, metadata) ? 1.2 : 1;
    const modifiedBV = (weaponEntry.isRearFacing ? bv / 2 : bv) * tcMultiplier * artemisMultiplier;

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

  const movementHeat = getBVMovementHeat(metadata);
  const stealthHeat = hasStealthArmor(metadata) ? 10 : 0;
  const heatEfficiency = 6 + heatSinkCapacity - movementHeat - stealthHeat;

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
  return weaponBattleRating * getOffensiveSpeedFactor(metadata.walkMP, metadata.jumpMP, metadata.runMP);
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
      if (matchingWeapon && isDefensiveOnlyWeapon(matchingWeapon)) continue;
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
 * Extracts a launcher/rack size from a normalized ammo slot label.
 *
 * This prevents ambiguous ammo like "LRM-5" from matching a mounted LRM 20 merely
 * because both share the broad "LRM" ammo family.
 *
 * @param normalizedSlot - Normalized ammo slot text.
 * @returns Rack size, or null when no rack size is identifiable.
 */
function getRackSizeFromNormalizedAmmoSlot(normalizedSlot: string): number | null {
  const patterns = [
    /streaksrm(\d+)/,
    /ssrm(\d+)/,
    /lrm(\d+)/,
    /srm(\d+)/,
    /mrm(\d+)/,
    /atm(\d+)/,
    /hag(\d+)/,
    /hyperassaultgauss(\d+)/,
    /ultraac(\d+)/,
    /uac(\d+)/,
    /rotaryac(\d+)/,
    /rac(\d+)/,
    /lbxac(\d+)/,
    /lbx(\d+)/,
    /lb(\d+)xac/,
    /ac(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = normalizedSlot.match(pattern);
    if (match?.[1]) return Number(match[1]);
  }

  return null;
}

/**
 * Extracts launcher/rack size from a weapon definition.
 *
 * @param weapon - Weapon definition from weapons.ts.
 * @returns Rack size, or null when the weapon has no rack size.
 */
function getRackSizeFromWeaponDefinition(weapon: any): number | null {
  const values = [
    weapon?.id,
    weapon?.name,
    weapon?.family,
    ...(Array.isArray(weapon?.altNames) ? weapon.altNames : []),
  ].filter(Boolean).map((value) => normalizeLookupText(String(value)));

  for (const value of values) {
    const rackSize = getRackSizeFromNormalizedAmmoSlot(value);
    if (rackSize != null) return rackSize;
  }

  return null;
}

/**
 * Filters ambiguous ammo weapon candidates by exact rack size when the ammo slot
 * includes one.
 *
 * @param ammoRackSize - Rack size extracted from the ammo slot.
 * @param candidates - Mounted weapon candidates.
 * @returns Rack-size-matched candidates when possible; otherwise original candidates.
 */
function filterAmmoWeaponCandidatesByRackSize(ammoRackSize: number | null, candidates: any[]): any[] {
  if (ammoRackSize == null || candidates.length <= 1) return candidates;

  const exactRackMatches = candidates.filter((weapon) => getRackSizeFromWeaponDefinition(weapon) === ammoRackSize);
  return exactRackMatches.length > 0 ? exactRackMatches : candidates;
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
  const ammoRackSize = getRackSizeFromNormalizedAmmoSlot(normalizedSlot);
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
  const rackMatchedMountedCandidates = filterAmmoWeaponCandidatesByRackSize(ammoRackSize, uniqueMountedCandidates);

  if (rackMatchedMountedCandidates.length === 1) {
    return rackMatchedMountedCandidates[0];
  }

  if (rackMatchedMountedCandidates.length > 1) {
    const bestMounted = chooseBestWeaponByTechBase(rackMatchedMountedCandidates, desiredTechBase);
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
 * @param metadata - Parsed Mek metadata.
 * @returns Detailed C-bill cost calculation for the Mek, or null when required data is missing.
 */
function calculateMekCBills(metadata: ParsedMtfMetadata): MekCBillCalculation | null {
  const unitTonnage = toNumber(metadata.tonnage);
  if (!unitTonnage || !metadata.walkMP) return null;

  const engineRating = metadata.engineRating || unitTonnage * metadata.walkMP;
  const gyroTonnage = getGyroTonnage(engineRating, metadata.gyroType);
  const effectiveArmorType = getEffectiveArmorType(metadata);
  const armorTonnage = getArmorTonnage(
    effectiveArmorType,
    metadata.techBase,
    getTotalArmor(metadata.armor)
  );

  const breakdown: Record<string, number> = {};
  const costLines: CostBreakdownLine[] = [];

  const addLine = (key: string, label: string, amount: number, count?: number) => {
    breakdown[key] = amount;
    costLines.push({ label, amount, count });
  };

  addLine("cockpit", "Cockpit", getCockpitCost(metadata.cockpitType));
  addLine("lifeSupport", "Life Support", 50_000);
  addLine("sensors", "Sensors", 2_000 * unitTonnage);
  addLine("musculature", "Musculature", getMyomerCost(metadata.myomerType, unitTonnage));
  addLine("internalStructure", "Internal Structure", getStructureCost(metadata.structureType, unitTonnage));
  addLine("actuators", "Actuators", getActuatorCost(metadata.locations, unitTonnage));
  addLine("engine", "Engine", getEngineCost(metadata.engineType, engineRating, unitTonnage));
  addLine("gyro", "Gyro", getGyroCost(metadata.gyroType, gyroTonnage));
  addLine("jumpJets", "Jump Jets", getJumpJetCost(metadata.jumpMP, unitTonnage, getJumpJetType(metadata)));
  addLine("heatSinks", "Heat Sinks", getHeatSinkCost(
    metadata.heatSinkType,
    metadata.heatSinkCount,
    metadata.engineType
  ));
  addLine("fullHeadEjectionSystem", "Full Head Ejection System", getFullHeadEjectionSystemCost(metadata));
  addLine("armor", "Armor", getArmorCost(effectiveArmorType, armorTonnage));

  const mascCost = getMASCCost(metadata, engineRating);
  addLine("masc", "MASC", mascCost, mascCost > 0 ? 1 : undefined);

  const superchargerCost = getSuperchargerCost(metadata, engineRating);
  addLine("supercharger", "Supercharger", superchargerCost, superchargerCost > 0 ? 1 : undefined);

  const weaponCostLines = getWeaponCostBreakdown(metadata.weapons);
  breakdown.weapons = sumCostLines(weaponCostLines);
  costLines.push(...weaponCostLines);

  const artemisCostLines = getArtemisIVFCSCostBreakdown(metadata);
  breakdown.artemisIVFCS = sumCostLines(artemisCostLines);
  costLines.push(...artemisCostLines);

  const amsCostLines = getMissingAntiMissileSystemCostBreakdown(metadata.weapons);
  breakdown.antiMissileSystems = sumCostLines(amsCostLines);
  costLines.push(...amsCostLines);

  const miscCostLines = getMiscEquipmentCostBreakdown(metadata);
  breakdown.miscEquipment = sumCostLines(miscCostLines);
  costLines.push(...miscCostLines);

  const caseCostLines = getCASECostBreakdown(metadata);
  breakdown.case = sumCostLines(caseCostLines);
  costLines.push(...caseCostLines);

  addLine("powerAmplifiers", "Power Amplifiers", 0);

  const subtotal = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  const omniMultiplier = getOmniMultiplier(metadata);
  const weightMultiplier = getBattleMechCostWeightMultiplier(unitTonnage);
  const total = subtotal * omniMultiplier * weightMultiplier;

  return { total, subtotal, omniMultiplier, weightMultiplier, breakdown, costLines };
}

/**
 * Sums a list of detailed cost lines.
 * @param lines - Cost lines to sum.
 * @returns Total C-bill cost.
 */
function sumCostLines(lines: CostBreakdownLine[]): number {
  return lines.reduce((sum, line) => sum + line.amount, 0);
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
 * Gets the final BV multiplier applied by cockpit type.
 * Small Cockpits apply a 0.95 multiplier after defensive and offensive BV are totaled,
 * before the final BV rounding step.
 * @param cockpitType - Parsed cockpit type from the MTF.
 * @returns Final BV multiplier for the cockpit type.
 */
function getCockpitBVMultiplier(cockpitType: string): number {
  const lower = String(cockpitType || "").toLowerCase();
  return lower.includes("small") ? 0.95 : 1;
}

/**
 * Gets cockpit C-bill cost.
 *
 * MegaMekLab folds Command Console into the cockpit line:
 * Standard Cockpit 200,000 + Command Console 500,000 = 700,000.
 *
 * @param cockpitType - Parsed cockpit type from the MTF.
 * @returns Cockpit C-bill cost.
 */
function getCockpitCost(cockpitType: string): number {
  const normalized = normalizeLookupText(cockpitType);

  if (normalized.includes("commandconsole")) return 700_000;
  if (normalized.includes("torso")) return 750_000;
  if (normalized.includes("small")) return 175_000;
  if (normalized.includes("interface")) return 400_000;

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

  if (lower.includes("reinforced")) return 6_400 * unitTonnage;
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
 * Detects the BattleMech jump jet type from raw critical slots.
 * Improved Jump Jets use a different C-bill formula and, in MegaMek's BV report,
 * use the fixed 3-point jump heat burden for heat efficiency.
 * @param metadata - Parsed Mek metadata.
 * @returns "Improved" when improved jump jets are present; otherwise "Standard".
 */
function getJumpJetType(metadata: ParsedMtfMetadata): string {
  return hasImprovedJumpJets(metadata.locations) ? "Improved" : "Standard";
}

/**
 * Detects Improved Jump Jets from raw critical slot text.
 * @param locations - Parsed Mek location map.
 * @returns True when at least one improved jump jet slot is found.
 */
function hasImprovedJumpJets(locations: MekLocationMap): boolean {
  return Object.values(locations).some((location) =>
    location.slots.some((slot) => {
      const normalized = normalizeLookupText(slot);
      return normalized.includes("improvedjumpjet") || normalized.includes("improvedjumpjets") || normalized.includes("ijj");
    })
  );
}

/**
 * Calculates the movement heat burden used for Offensive BV heat efficiency.
 * Standard jump jets use max(3, jump MP). Improved Jump Jets match MegaMek's
 * fixed 3-point jump burden in tested cases such as ARC-9M.
 * @param metadata - Parsed Mek metadata.
 * @returns Movement heat to subtract from heat efficiency.
 */
function getBVMovementHeat(metadata: ParsedMtfMetadata): number {
  if (metadata.jumpMP > 0) {
    return hasImprovedJumpJets(metadata.locations) ? 3 : Math.max(3, metadata.jumpMP);
  }

  return 2;
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
 * Calculates armor C-bill cost from billable armor tonnage.
 * Armor tonnage is billed in half-ton increments, but a few armor types such as
 * Light Ferro-Fibrous need nearest-half behavior to match MegaMekLab examples.
 * The passed armorTonnage may already be billable; this function normalizes it
 * again so direct callers do not accidentally use raw fractional tonnage.
 * @param armorType - Parsed armor type.
 * @param armorTonnage - Raw or already-billable armor tonnage.
 * @returns Armor cost in C-bills.
 */

/**
 * Determines the effective armor type for calculations, using both the parsed armor
 * metadata field and raw critical-slot labels. Some MTFs expose special armor names
 * only in the critical slots, while the top-level armor field may look generic.
 *
 * @param metadata - Parsed Mek metadata.
 * @returns Armor type name to use for armor tonnage and C-bill calculations.
 */

/**
 * Parses explicit armor tonnage hints from MTF prose when the point totals alone
 * cannot reconstruct the exact billable armor mass used by MegaMekLab.
 *
 * Some MTF files store only armor points plus armor type, but MegaMekLab may still
 * bill the design using allocated armor tonnage that is higher than the minimum
 * points-derived half-ton amount. Mastodon B is an example: its points fit in
 * 15.0 tons of Clan Ferro-Fibrous, but the MTF prose states "fifteen and a half
 * tons", and MegaMekLab bills 15.5 tons.
 *
 * @param lines - Raw MTF lines.
 * @returns Parsed armor tonnage, or 0 when no reliable hint is found.
 */
function parseArmorTonnageHint(lines: string[]): number {
  const text = lines.join(" ").replace(/\s+/g, " ");
  const armorContextPattern = /(armor|armour|ferro|stealth|hardened|reflective|reactive)/i;

  const numericMatches = text.matchAll(/(\d+(?:\.\d+)?)\s*(?:tons?|tonnes?)\s+(?:of\s+)?([^.;]{0,80})/gi);
  for (const match of numericMatches) {
    const value = toNumber(match[1]);
    const context = match[2] || "";
    if (value > 0 && value < 100 && armorContextPattern.test(context)) {
      return value;
    }
  }

  const wordNumberMatches = text.matchAll(/([a-z]+)(?:\s+and\s+a\s+half)?\s+(?:tons?|tonnes?)\s+(?:of\s+)?([^.;]{0,80})/gi);
  for (const match of wordNumberMatches) {
    const wholeNumber = parseSmallNumberWord(match[1]);
    const hasHalf = /\sand\sa\shalf/i.test(match[0]);
    const context = match[2] || "";

    if (wholeNumber > 0 && wholeNumber < 100 && armorContextPattern.test(context)) {
      return wholeNumber + (hasHalf ? 0.5 : 0);
    }
  }

  return 0;
}

/**
 * Parses a small English number word used in MTF prose.
 *
 * @param word - Number word such as "fifteen".
 * @returns Numeric value, or 0 when unknown.
 */
function parseSmallNumberWord(word: string): number {
  const normalized = String(word || "").toLowerCase();

  const numbers: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
    twenty: 20,
  };

  return numbers[normalized] ?? 0;
}

function getEffectiveArmorType(metadata: ParsedMtfMetadata): string {
  const parsedArmorType = metadata.armorType || "Standard";
  const combinedText = normalizeLookupText([
    parsedArmorType,
    ...Object.values(metadata.locations).flatMap((location) => location.slots),
  ].join(" "));

  if (combinedText.includes("reflective")) {
    return "Reflective";
  }

  if (combinedText.includes("ferrolamell") || combinedText.includes("lamellor") || combinedText.includes("lamellar")) {
    return "Ferro-Lamellor";
  }

  if (combinedText.includes("reactive")) {
    return "Reactive";
  }

  return parsedArmorType;
}

/**
 * Detects Ferro-Lamellor / Ferro-Lamellar armor using normalized text.
 * MegaMek/MTF names are not perfectly consistent, so match on "ferrolamell".
 * @param armorType - Parsed armor type.
 * @returns True when the armor is Ferro-Lamellor/Ferro-Lamellar.
 */
function isFerroLamellorArmor(armorType: string): boolean {
  const normalized = normalizeLookupText(armorType);
  return normalized.includes("ferrolamell") || normalized.includes("lamellor") || normalized.includes("lamellar");
}

/**
 * Rounds raw armor tonnage up to the next legal half-ton increment for C-bill billing.
 *
 * @param rawArmorTonnage - Raw armor tonnage from armor points / points per ton.
 * @returns Armor tonnage rounded up to the nearest half ton.
 */
function roundArmorTonnageUpToHalfTon(rawArmorTonnage: number): number {
  if (!rawArmorTonnage || rawArmorTonnage <= 0) return 0;
  return Math.ceil(rawArmorTonnage * 2) / 2;
}

/**
 * Gets C-bill cost per ton for the effective armor type.
 *
 * @param armorType - Effective armor type.
 * @returns C-bill cost per ton.
 */
function getArmorCostPerTon(armorType: string): number {
  const normalized = normalizeLookupText(armorType);

  if (normalized.includes("commercial")) return 3_000;
  if (normalized.includes("heavyindustrial")) return 10_000;
  if (normalized.includes("industrial")) return 5_000;

  if (normalized.includes("lightferro")) return 15_000;
  if (normalized.includes("heavyferro")) return 25_000;
  if (normalized.includes("stealth")) return 50_000;
  if (normalized.includes("ferrolamell")) return 50_000;
  if (normalized.includes("reflective")) return 37_500;

  if (normalized.includes("ferro")) return 20_000;

  return 10_000;
}

/**
 * Calculates armor C-bill cost from raw armor tonnage and effective armor type.
 *
 * @param armorType - Effective armor type.
 * @param armorTonnage - Raw armor tonnage before billable rounding.
 * @returns Armor C-bill cost.
 */
function getArmorCost(armorType: string, armorTonnage: number): number {
  const normalized = normalizeLookupText(armorType);
  const usesPointBasedArmorCost =
    normalized.includes("ferrolamell") ||
    normalized.includes("reflective");

  const billableArmorTonnage = usesPointBasedArmorCost
    ? armorTonnage
    : roundArmorTonnageUpToHalfTon(armorTonnage);

  return Math.round(getArmorCostPerTon(armorType) * billableArmorTonnage);
}

/**
 * Converts raw armor tonnage into the armor tonnage MegaMekLab bills for cost.
 * Most armor types round up to the next half ton. Light Ferro-Fibrous is kept as
 * nearest-half because tested ARC-9M output bills 186 points as 11.0 tons, not 11.5.
 * @param armorType - Parsed armor type.
 * @param rawArmorTonnage - Raw armor tonnage before billing adjustment.
 * @returns Billable armor tonnage.
 */
function getBillableArmorTonnageForCost(armorType: string, rawArmorTonnage: number): number {
  if (!rawArmorTonnage) return 0;

  const lower = armorType.toLowerCase();

  if (lower.includes("light ferro")) {
    return Math.round(rawArmorTonnage * 2) / 2;
  }

  return Math.ceil(rawArmorTonnage * 2) / 2;
}

/**
 * Calculates MASC C-bill cost.
 *
 * Formula:
 * 1,000 x Engine Rating x MASC Tonnage
 *
 * MASC tonnage:
 * - Inner Sphere: 5% of total Mek tonnage
 * - Clan: 4% of total Mek tonnage
 *
 * Round MASC tonnage normally to the nearest full ton / critical slot.
 *
 * @param metadata - Parsed Mek metadata.
 * @param engineRating - Engine rating.
 * @returns MASC C-bill cost.
 */
function getMASCCost(metadata: ParsedMtfMetadata, engineRating: number): number {
  if (!hasMASC(metadata.myomerType, metadata.locations)) return 0;

  const unitTonnage = toNumber(metadata.tonnage);
  if (!unitTonnage || !engineRating) return 0;

  const mascTonnage = getMASCTonnage(metadata.techBase, unitTonnage);

  return 1_000 * engineRating * mascTonnage;
}

/**
 * Calculates MASC tonnage.
 *
 * @param techBase - Unit tech base.
 * @param unitTonnage - Total Mek tonnage.
 * @returns MASC tonnage rounded normally to nearest full ton, minimum 1.
 */
function getMASCTonnage(techBase: string, unitTonnage: number): number {
  const normalizedTechBase = normalizeTechBase(techBase);
  const percentage = normalizedTechBase === "Clan" ? 0.04 : 0.05;

  return Math.max(1, Math.round(unitTonnage * percentage));
}

/**
 * Calculates Supercharger cost for BattleMech construction costs.
 * Supercharger cost is formula-based rather than a fixed equipment cost.
 * @param metadata - Parsed Mek metadata.
 * @param engineRating - Effective engine rating used by the Mek.
 * @returns C-bill cost for one Supercharger, or 0 when absent.
 */
function getSuperchargerCost(metadata: ParsedMtfMetadata, engineRating: number): number {
  if (!hasSupercharger(metadata.locations)) return 0;
  return 10_000 * engineRating;
}

/**
 * Calculates Artemis IV FCS cost for missile launchers that receive the Artemis BV modifier.
 * @param metadata - Parsed Mek metadata.
 * @returns C-bill cost for Artemis IV FCS equipment.
 */
function getArtemisIVFCSCost(metadata: ParsedMtfMetadata): number {
  return sumCostLines(getArtemisIVFCSCostBreakdown(metadata));
}

/**
 * Builds grouped Artemis IV FCS C-bill cost lines.
 * @param metadata - Parsed Mek metadata.
 * @returns Artemis IV FCS cost lines.
 */
function getArtemisIVFCSCostBreakdown(metadata: ParsedMtfMetadata): CostBreakdownLine[] {
  const artemisLauncherCount = metadata.weapons.filter((weaponEntry) =>
    weaponGetsArtemisModifier(weaponEntry, metadata)
  ).length;

  return artemisLauncherCount > 0
    ? [{ label: "Artemis IV FCS", count: artemisLauncherCount, amount: artemisLauncherCount * 100_000 }]
    : [];
}

/**
 * Adds a fallback cost for AMS entries when the resolved weapon definition has no cost value.
 * This prevents Clan/IS AMS equipment from disappearing from cost calculations.
 * @param weapons - Parsed mounted weapons and equipment from the MTF Weapons section.
 * @returns Fallback AMS equipment cost.
 */
function getMissingAntiMissileSystemCost(weapons: ParsedWeaponEntry[]): number {
  return sumCostLines(getMissingAntiMissileSystemCostBreakdown(weapons));
}

/**
 * Builds fallback cost lines for AMS entries missing weapon definition costs.
 * @param weapons - Parsed mounted weapons and equipment from the MTF Weapons section.
 * @returns Fallback AMS cost lines.
 */
function getMissingAntiMissileSystemCostBreakdown(weapons: ParsedWeaponEntry[]): CostBreakdownLine[] {
  let count = 0;

  for (const weaponEntry of weapons) {
    const weapon = weaponEntry.weaponData;
    if (!weapon || !isDefensiveOnlyWeapon(weapon)) continue;
    if (getResolvedCostValue(weapon.cost) > 0) continue;
    count++;
  }

  return count > 0
    ? [{ label: "Anti-Missile System", count, amount: count * 100_000 }]
    : [];
}

/**
 * Calculates CASE cost from critical slots or inherent Clan CASE protection.
 * @param metadata - Parsed Mek metadata.
 * @returns Total CASE cost.
 */
function getCASECost(metadata: ParsedMtfMetadata): number {
  return sumCostLines(getCASECostBreakdown(metadata));
}

/**
 * Builds CASE C-bill cost lines.
 * @param metadata - Parsed Mek metadata.
 * @returns CASE cost lines.
 */
function getCASECostBreakdown(metadata: ParsedMtfMetadata): CostBreakdownLine[] {
  const lines: CostBreakdownLine[] = [];

  const explicitStandardCaseCount = countExplicitStandardCaseSlots(metadata.locations);
  if (explicitStandardCaseCount > 0) {
    lines.push({
      label: "CASE",
      count: explicitStandardCaseCount,
      amount: explicitStandardCaseCount * 50_000,
    });
  }

  lines.push(...getExplicitCASEIICostBreakdown(metadata));

  // Clan units often omit explicit standard CASE because standard CASE protection is inherent.
  // CASE II does not replace this C-bill accounting; MegaMekLab can charge both
  // explicit CASE II systems and standard Clan CASE protection for explosive ammo/weapon locations.
  if (explicitStandardCaseCount === 0 && metadata.techBase === "Clan") {
    const inferredCaseCount = countClanInherentCaseSystems(metadata);
    if (inferredCaseCount > 0) {
      lines.push({
        label: "CASE",
        count: inferredCaseCount,
        amount: inferredCaseCount * 50_000,
      });
    }
  }

  return lines;
}

/**
 * Counts explicit standard CASE slots, used primarily by Inner Sphere units.
 * CASE II is costed separately from weapons.ts because it can have different cost/BV.
 * @param locations - Parsed Mek location map.
 * @returns Number of explicit standard CASE critical slots.
 */
function countExplicitStandardCaseSlots(locations: MekLocationMap): number {
  let caseCount = 0;

  for (const location of Object.values(locations)) {
    for (const slot of location.slots) {
      if (isExplicitStandardCaseSlot(slot)) {
        caseCount++;
      }
    }
  }

  return caseCount;
}

/**
 * Builds C-bill cost lines for explicit CASE II slots using weapons.ts as source data.
 *
 * @param metadata - Parsed Mek metadata.
 * @returns Grouped CASE II cost lines.
 */
function getExplicitCASEIICostBreakdown(metadata: ParsedMtfMetadata): CostBreakdownLine[] {
  const grouped = new Map<string, CostBreakdownLine>();

  for (const location of Object.values(metadata.locations)) {
    for (let slotIndex = 0; slotIndex < location.slots.length; slotIndex++) {
      const slot = location.slots[slotIndex];
      if (!isExplicitCASEIISlot(slot)) continue;

      const resolved = resolveMiscEquipmentDefinitionFromSlot(slot, metadata) ||
        resolveDefensiveEquipmentDefinitionFromSlot(slot, metadata) ||
        resolveWeapon(slot, extractWeaponId(slot), metadata.techBase);

      const cost = getResolvedCostValue(resolved?.cost) || 50_000;
      const label = String(resolved?.name || "CASE II");
      const key = `${label}|${cost}`;
      const existing = grouped.get(key);

      if (existing) {
        existing.count = (existing.count ?? 1) + 1;
        existing.amount += cost;
      } else {
        grouped.set(key, { label, count: 1, amount: cost });
      }
    }
  }

  return [...grouped.values()].sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Determines whether a raw critical slot explicitly represents CASE or CASE II.
 * @param rawSlot - Raw MTF critical slot text.
 * @returns True when the slot explicitly lists CASE/CASE II.
 */
function isExplicitStandardCaseSlot(rawSlot: string): boolean {
  const normalized = normalizeLookupText(rawSlot);

  if (isExplicitCASEIISlot(rawSlot)) return false;

  return (
    normalized === "case" ||
    normalized === "iscase" ||
    normalized === "clcase" ||
    normalized.includes("iscase") ||
    normalized.includes("clcase")
  );
}

/**
 * Determines whether a raw critical slot explicitly represents CASE II.
 *
 * @param rawSlot - Raw MTF critical slot text.
 * @returns True when the slot explicitly lists CASE II.
 */
function isExplicitCASEIISlot(rawSlot: string): boolean {
  const normalized = normalizeLookupText(rawSlot);

  return (
    normalized === "caseii" ||
    normalized === "iscaseii" ||
    normalized === "clcaseii" ||
    normalized.includes("caseii")
  );
}

function countClanInherentCaseSystems(metadata: ParsedMtfMetadata): number {
  let caseCount = 0;

  for (const [locationKey, location] of Object.entries(metadata.locations) as Array<[MekLocationKey, MekLocation]>) {
    // MegaMekLab does not bill standard CASE for CT/head locations, even when
    // ammo is physically present there. It does bill Clan inherent CASE by other
    // protected locations such as side torsos, arms, and legs.
    if (locationKey === "centerTorso" || locationKey === "head") {
      continue;
    }

    const needsCase = location.slots.some((slot) =>
      isAmmoSlotForCaseCost(slot) || isExplosiveWeaponSlotForCaseCost(slot)
    );

    if (needsCase) {
      caseCount++;
    }
  }

  return caseCount;
}

/**
 * Determines whether an ammo slot should trigger CASE cost. This is separate from offensive ammo BV:
 * AMS ammo counts for CASE cost, while Gauss/plasma/flamer/coolant/caseless ammo does not.
 * @param rawSlot - Raw critical slot text.
 * @returns True when ammo should require CASE for cost purposes.
 */
function isAmmoSlotForCaseCost(rawSlot: string): boolean {
  const normalized = normalizeLookupText(rawSlot);

  if (!normalized.includes("ammo")) return false;
  if (normalized.includes("gauss")) return false;
  if (normalized.includes("plasma")) return false;
  if (normalized.includes("flamer")) return false;
  if (normalized.includes("coolant")) return false;
  if (normalized.includes("caseless")) return false;
  if (normalized.includes("nailrivet")) return false;
  if (normalized.includes("nail") && normalized.includes("rivet")) return false;

  return true;
}

/**
 * Detects explosive weapon critical slots for defensive BV and CASE handling.
 *
 * Standard Gauss rifles and Improved Heavy Lasers count as explosive weapon slots.
 * Hyper-Assault Gauss/HAG ammo can require CASE by location, but the HAG weapon
 * itself should not create an additional CASE requirement beyond the ammo
 * locations in MegaMekLab's cost output.
 *
 * @param rawSlot - Raw critical slot text.
 * @returns True when the slot contains an explosive weapon.
 */
function isExplosiveWeaponSlot(rawSlot: string): boolean {
  const normalized = normalizeLookupText(rawSlot);

  if (!normalized || normalized.includes("ammo")) return false;

  const isHyperAssaultGauss =
    normalized.includes("hag") ||
    normalized.includes("hyperassaultgauss");

  const isGaussWeapon =
    !isHyperAssaultGauss &&
    normalized.includes("gauss");

  const isImprovedHeavyLaser =
    normalized.includes("laser") &&
    (
      normalized.includes("improvedheavy") ||
      normalized.includes("impheavy") ||
      (normalized.includes("improved") && normalized.includes("heavy")) ||
      (normalized.includes("imp") && normalized.includes("heavy"))
    );

  return isGaussWeapon || isImprovedHeavyLaser;
}

/**
 * Counts explosive weapon critical slots in one location.
 *
 * @param slots - Critical slots in a location.
 * @returns Number of explosive weapon critical slots.
 */
function getExplosiveWeaponSlotCountInLocation(slots: string[]): number {
  return slots.filter((slot) => isExplosiveWeaponSlot(slot)).length;
}

function isExplosiveWeaponSlotForCaseCost(rawSlot: string): boolean {
  return isExplosiveWeaponSlot(rawSlot);
}

/**
 * Determines whether the Mek should receive the OmniMech cost multiplier.
 * @param metadata - Parsed Mek metadata.
 * @returns 1.25 for Omni units, otherwise 1.
 */
function getOmniMultiplier(metadata: ParsedMtfMetadata): number {
  const config = normalizeLookupText(metadata.config || "");
  if (config.includes("omni")) return 1.25;

  const hasOmniPodSlot = Object.values(metadata.locations).some((location) =>
    location.slots.some((slot) => normalizeLookupText(slot).includes("omnipod"))
  );
  if (hasOmniPodSlot) return 1.25;

  const hasOmniWeapon = metadata.weapons.some((weapon) => normalizeLookupText(weapon.name).includes("omnipod"));
  return hasOmniWeapon ? 1.25 : 1;
}

/**
 * Get weapon cost.
 * @param weapons - Parsed weapons from the MTF Weapons section.
 * @returns Total C-bill weapon cost.
 */
function getWeaponCost(weapons: ParsedWeaponEntry[]): number {
  return sumCostLines(getWeaponCostBreakdown(weapons));
}

/**
 * Builds grouped C-bill cost lines for mounted weapons.
 * @param weapons - Parsed weapons from the MTF Weapons section.
 * @returns Grouped weapon cost lines with counts in the label metadata.
 */
function getWeaponCostBreakdown(weapons: ParsedWeaponEntry[]): CostBreakdownLine[] {
  const grouped = new Map<string, CostBreakdownLine>();

  for (const weaponEntry of weapons) {
    const weapon = weaponEntry.weaponData;
    if (!weapon) continue;

    const unitCost = getResolvedCostValue(weapon.cost);
    if (unitCost <= 0) continue;

    const label = weapon.name || weaponEntry.name;
    const key = `${label}|${unitCost}`;
    const existing = grouped.get(key);

    if (existing) {
      existing.count = (existing.count ?? 1) + 1;
      existing.amount += unitCost;
    } else {
      grouped.set(key, { label, count: 1, amount: unitCost });
    }
  }

  return [...grouped.values()].sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Normalizes a numeric cost value from weapon/equipment definitions.
 * @param value - Raw cost value from a definition.
 * @returns Numeric C-bill cost, or 0 if missing/invalid.
 */
function getResolvedCostValue(value: unknown): number {
  if (typeof value === "number") return value;
  if (value != null) return toNumber(String(value));
  return 0;
}


/**
 * Calculates C-bill cost for miscellaneous equipment found in raw critical slots.
 * Fixed-cost equipment is resolved from WEAPONS first, even though that data file also
 * contains non-weapon equipment such as C3, ECM, TAG, probes, and targeting computers.
 * Formula-based or separately handled systems such as CASE, MASC, Artemis, AMS, heat
 * sinks, jump jets, actuators, and OmniPod markers are excluded here.
 * @param metadata - Parsed Mek metadata.
 * @returns Total C-bill cost for miscellaneous equipment.
 */
function getMiscEquipmentCost(metadata: ParsedMtfMetadata): number {
  return sumCostLines(getMiscEquipmentCostBreakdown(metadata));
}

/**
 * Calculates Full Head Ejection System C-bill cost by resolving the installed
 * critical-slot equipment against weapons.ts.
 *
 * This keeps the equipment definition, cost, tech rating, and availability in
 * weapons.ts rather than hardcoding those values in the indexer.
 *
 * @param metadata - Parsed Mek metadata.
 * @returns Full Head Ejection System C-bill cost, or 0 when not installed.
 */
function getFullHeadEjectionSystemCost(metadata: ParsedMtfMetadata): number {
  const equipment = getFullHeadEjectionSystemDefinition(metadata);
  return equipment ? getResolvedCostValue(equipment.cost) : 0;
}

/**
 * Resolves Full Head Ejection System equipment from the MTF ejection field or critical slots.
 *
 * MegaMek MTFs may represent this as a top-level field:
 *   ejection:Full Head Ejection System
 * rather than as a head critical slot.
 *
 * @param metadata - Parsed Mek metadata.
 * @returns Matching weapons.ts equipment definition, or null when absent.
 */
function getFullHeadEjectionSystemDefinition(metadata: ParsedMtfMetadata): any | null {
  if (isFullHeadEjectionSystemSlot(metadata.ejectionType)) {
    const resolved =
      resolveWeapon(metadata.ejectionType, undefined, metadata.techBase) ||
      resolveWeapon("Full Head Ejection System", undefined, metadata.techBase);

    if (resolved && getResolvedCostValue(resolved.cost) > 0) {
      return resolved;
    }
  }

  for (const location of Object.values(metadata.locations)) {
    for (const rawSlot of location.slots) {
      if (!isFullHeadEjectionSystemSlot(rawSlot)) continue;

      const cleanedSlot = cleanMiscEquipmentSlotText(rawSlot);
      const possibleId = extractWeaponId(rawSlot) || extractWeaponId(cleanedSlot);

      const resolved =
        resolveWeapon(rawSlot, possibleId, metadata.techBase) ||
        resolveWeapon(cleanedSlot, possibleId, metadata.techBase) ||
        resolveWeapon("Full Head Ejection System", undefined, metadata.techBase);

      if (resolved && getResolvedCostValue(resolved.cost) > 0) {
        return resolved;
      }
    }
  }

  return null;
}

/**
 * Detects Full Head Ejection System labels.
 *
 * @param rawSlot - Raw critical slot text or ejection field value.
 * @returns True when the text represents a Full Head Ejection System.
 */
function isFullHeadEjectionSystemSlot(rawSlot: string): boolean {
  const normalized = normalizeLookupText(rawSlot);

  return (
    normalized.includes("fullheadejectionsystem") ||
    normalized.includes("headejectionsystem") ||
    normalized.includes("fullejectionsystem") ||
    normalized.includes("fhes")
  );
}

/**
 * Builds grouped C-bill cost lines for miscellaneous equipment found in raw critical slots.
 * Multiple critical slots for the same item in the same location are charged once, while
 * duplicate equipment mounted in different locations is grouped with a count.
 * @param metadata - Parsed Mek metadata.
 * @returns Grouped misc equipment cost lines with counts.
 */
function getMiscEquipmentCostBreakdown(metadata: ParsedMtfMetadata): CostBreakdownLine[] {
  const countedKeys = new Set<string>();
  const grouped = new Map<string, CostBreakdownLine>();

  for (const location of Object.values(metadata.locations)) {
    for (const rawSlot of location.slots) {
      const resolved = resolveMiscEquipmentDefinitionFromSlot(rawSlot, metadata);

      if (!shouldConsiderMiscEquipmentSlot(rawSlot, metadata, resolved)) continue;
      if (!resolved) continue;

      const cost = getMiscEquipmentSlotCost(rawSlot, metadata, resolved);
      if (cost <= 0) continue;

      const equipmentKey = getMiscEquipmentCountKey(rawSlot, metadata, location.key, resolved);
      if (!equipmentKey || countedKeys.has(equipmentKey)) continue;

      countedKeys.add(equipmentKey);

      const label = getMiscEquipmentDisplayName(rawSlot, metadata, resolved);
      const groupKey = `${label}|${cost}`;
      const existing = grouped.get(groupKey);

      if (existing) {
        existing.count = (existing.count ?? 1) + 1;
        existing.amount += cost;
      } else {
        grouped.set(groupKey, { label, count: 1, amount: cost });
      }
    }
  }

  return [...grouped.values()].sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Resolves a raw critical slot to a costed miscellaneous equipment definition from WEAPONS.
 * This is intentionally broader than normal weapon resolution because MTF equipment slot
 * names may appear as compact ids, readable names, or reordered labels such as
 * "ECM Suite (Guardian)".
 * @param rawSlot - Raw critical slot text.
 * @param metadata - Parsed Mek metadata.
 * @returns Matching equipment definition from WEAPONS, or null if none is found.
 */
function resolveMiscEquipmentDefinitionFromSlot(rawSlot: string, metadata: ParsedMtfMetadata): any | null {
  const cleanedSlot = cleanMiscEquipmentSlotText(rawSlot);
  const possibleId = extractWeaponId(rawSlot) || extractWeaponId(cleanedSlot);

  const directCandidates = [
    resolveWeapon(rawSlot, possibleId, metadata.techBase),
    resolveWeapon(cleanedSlot, possibleId, metadata.techBase),
  ].filter(Boolean);

  for (const candidate of directCandidates) {
    if (isCostedMiscEquipmentDefinition(candidate)) {
      return candidate;
    }
  }

  return findLooseMiscEquipmentDefinition(rawSlot, metadata.techBase);
}

/**
 * Finds a costed equipment definition by comparing raw slot tokens against names and altNames
 * in WEAPONS. This avoids hardcoding C3/ECM/TAG/etc. costs in the indexer.
 * @param rawSlot - Raw critical slot text.
 * @param unitTechBase - Unit tech base used to prefer Clan or Inner Sphere definitions.
 * @returns Best matching equipment definition, or null if no reliable match is found.
 */
function findLooseMiscEquipmentDefinition(rawSlot: string, unitTechBase: string): any | null {
  const weaponRecord = WEAPONS as Record<string, any>;
  const desiredTechBase = normalizeTechBase(inferWeaponTechBase(rawSlot) || unitTechBase || "");
  const slotTokens = tokenizeEquipmentText(rawSlot);
  const normalizedSlot = normalizeLookupText(rawSlot);

  if (!slotTokens.length && !normalizedSlot) return null;

  const candidates: Array<{ equipment: any; score: number }> = [];

  for (const [key, equipment] of Object.entries(weaponRecord)) {
    if (!isCostedMiscEquipmentDefinition(equipment)) continue;

    const nameValues = [
      key,
      equipment?.id,
      equipment?.name,
      ...(Array.isArray(equipment?.altNames) ? equipment.altNames : []),
    ].filter(Boolean).map(String);

    let bestNameScore = 0;

    for (const nameValue of nameValues) {
      const normalizedName = normalizeLookupText(nameValue);
      const nameTokens = tokenizeEquipmentText(nameValue);

      if (normalizedName && normalizedSlot && normalizedName === normalizedSlot) {
        bestNameScore = Math.max(bestNameScore, 120);
      } else if (normalizedName && normalizedSlot && (normalizedSlot.includes(normalizedName) || normalizedName.includes(normalizedSlot))) {
        bestNameScore = Math.max(bestNameScore, 90);
      }

      if (nameTokens.length > 0 && nameTokens.every((token) => slotTokens.includes(token))) {
        bestNameScore = Math.max(bestNameScore, 80 + nameTokens.length);
      }
    }

    if (bestNameScore <= 0) continue;

    candidates.push({
      equipment,
      score: bestNameScore + getTechBaseMatchScore(equipment, desiredTechBase),
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.equipment ?? null;
}

/**
 * Determines whether a critical slot should be checked for miscellaneous equipment cost.
 * @param rawSlot - Raw critical slot text.
 * @param metadata - Parsed Mek metadata used to avoid double-counting mounted weapons/equipment.
 * @param resolved - Optional resolved equipment definition from WEAPONS.
 * @returns True when the slot represents separately costed misc equipment.
 */
function shouldConsiderMiscEquipmentSlot(rawSlot: string, metadata: ParsedMtfMetadata, resolved?: any | null): boolean {
  const normalized = normalizeLookupText(rawSlot);
  const cleanedNormalized = normalizeLookupText(cleanMiscEquipmentSlotText(rawSlot));

  if (!normalized && !cleanedNormalized) return false;

  if (cleanedNormalized === "empty" || normalized.includes("empty")) return false;
  if (cleanedNormalized === "omnipod") return false;
  if (normalized.includes("ammo")) return false;

  // Systems handled by dedicated cost logic.
  if (normalized.includes("engine")) return false;
  if (normalized.includes("gyro")) return false;
  if (normalized.includes("cockpit")) return false;
  if (normalized.includes("lifesupport")) return false;
  if (normalized.includes("sensors")) return false;
  if (normalized.includes("actuator")) return false;
  if (normalized === "hip" || normalized.includes("hipactuator")) return false;
  if (normalized.includes("heatsink")) return false;
  if (normalized.includes("jumpjet")) return false;
  if (normalized.includes("case")) return false;
  if (normalized.includes("masc")) return false;
  if (normalized.includes("supercharger")) return false;
  if (isFullHeadEjectionSystemSlot(rawSlot)) return false;
  if (normalized.includes("artemis")) return false;

  if (isAlreadyCountedMountedWeaponOrEquipment(rawSlot, metadata)) return false;
  if (resolved && isNormalWeaponForCost(resolved)) return false;
  if (!resolved && looksLikeMountedWeaponSlot(rawSlot)) return false;

  return Boolean(resolved && isCostedMiscEquipmentDefinition(resolved));
}

/**
 * Detects a Targeting Computer definition or slot.
 *
 * @param rawSlot - Raw critical slot text.
 * @param resolved - Optional resolved equipment definition.
 * @returns True when the slot/equipment represents a Targeting Computer.
 */
function isTargetingComputerEquipment(rawSlot: string, resolved?: any | null): boolean {
  const normalizedSlot = normalizeLookupText(rawSlot);
  const id = normalizeLookupText(String(resolved?.id || ""));
  const name = normalizeLookupText(String(resolved?.name || ""));
  const family = normalizeLookupText(String(resolved?.family || ""));
  const category = normalizeLookupText(String(resolved?.category || ""));

  return (
    normalizedSlot.includes("targetingcomputer") ||
    id.includes("targetingcomputer") ||
    name.includes("targetingcomputer") ||
    family.includes("targetingcomputer") ||
    (category.includes("targeting") && name.includes("computer"))
  );
}

/**
 * Calculates Targeting Computer C-bill cost.
 *
 * MegaMekLab cost behavior is tech-base-specific:
 * - Inner Sphere: total tonnage of TC-eligible weapons / 4
 * - Clan: total tonnage of TC-eligible weapons / 5
 *
 * The resulting Targeting Computer weight is rounded up to the next full ton,
 * with a minimum of 1 ton and maximum of 20 tons. C-bill cost is weight x 10,000.
 *
 * @param metadata - Parsed Mek metadata.
 * @returns Targeting Computer C-bill cost.
 */
function getTargetingComputerCost(metadata: ParsedMtfMetadata): number {
  if (!hasTargetingComputer(metadata)) return 0;

  const targetedWeaponTonnage = getTargetingComputerEligibleWeaponTonnage(metadata);
  const divisor = normalizeTechBase(metadata.techBase) === "Clan" ? 5 : 4;
  const targetingComputerTonnage = Math.min(20, Math.max(1, Math.ceil(targetedWeaponTonnage / divisor)));

  return targetingComputerTonnage * 10_000;
}

/**
 * Gets total tonnage of weapons eligible for Targeting Computer support.
 *
 * @param metadata - Parsed Mek metadata.
 * @returns Total eligible weapon tonnage.
 */
function getTargetingComputerEligibleWeaponTonnage(metadata: ParsedMtfMetadata): number {
  return metadata.weapons.reduce((total, entry) => {
    const weapon = entry.weaponData;
    if (!weapon) return total;
    if (!isTargetingComputerEligibleWeapon(weapon)) return total;

    const tons = typeof weapon.tons === "number" ? weapon.tons : toNumber(String(weapon.tons || 0));
    return total + tons;
  }, 0);
}

/**
 * Detects whether a Mek has a Targeting Computer installed.
 *
 * @param metadata - Parsed Mek metadata.
 * @returns True when a Targeting Computer is present.
 */
function hasTargetingComputer(metadata: ParsedMtfMetadata): boolean {
  return Object.values(metadata.locations).some((location) =>
    location.slots.some((slot) => {
      const resolved = resolveMiscEquipmentDefinitionFromSlot(slot, metadata);
      return isTargetingComputerEquipment(slot, resolved);
    })
  );
}

function getMiscEquipmentSlotCost(rawSlot: string, metadata: ParsedMtfMetadata, resolved?: any | null): number {
  const equipment = resolved ?? resolveMiscEquipmentDefinitionFromSlot(rawSlot, metadata);
  if (!equipment || !isCostedMiscEquipmentDefinition(equipment)) return 0;

  if (isTargetingComputerEquipment(rawSlot, equipment)) {
    return getTargetingComputerCost(metadata);
  }

  return getResolvedCostValue(equipment.cost);
}

/**
 * Determines whether a WEAPONS definition is miscellaneous equipment with a fixed cost.
 * @param definition - Weapon/equipment definition from WEAPONS.
 * @returns True when this should be costed through the misc equipment pass.
 */
function isCostedMiscEquipmentDefinition(definition: any): boolean {
  if (!definition) return false;
  const idForCostCheck = normalizeLookupText(String(definition?.id || ""));
  const nameForCostCheck = normalizeLookupText(String(definition?.name || ""));
  const familyForCostCheck = normalizeLookupText(String(definition?.family || ""));
  const isTargetingComputerForCostCheck =
    idForCostCheck.includes("targetingcomputer") ||
    nameForCostCheck.includes("targetingcomputer") ||
    familyForCostCheck.includes("targetingcomputer");

  if (!isTargetingComputerForCostCheck && getResolvedCostValue(definition.cost) <= 0) return false;
  if (isNormalWeaponForCost(definition)) return false;

  const category = String(definition?.category || "").toLowerCase();
  const family = normalizeLookupText(String(definition?.family || ""));
  const id = normalizeLookupText(String(definition?.id || ""));
  const flags = Array.isArray(definition?.flags)
    ? definition.flags.map((flag: any) => normalizeLookupText(String(flag)))
    : [];

  // These are handled elsewhere in the cost calculation.
  if (family.includes("case") || id.includes("case")) return false;
  if (family.includes("masc") || id.includes("masc")) return false;
  if (family.includes("artemis") || id.includes("artemis")) return false;
  if (family.includes("antimissile") || id.includes("antimissile") || id.includes("ams")) return false;

  if (category === "equipment") return true;

  return (
    family.includes("ecm") ||
    family.includes("probe") ||
    family.includes("c3") ||
    family.includes("tag") ||
    family.includes("targetingcomputer") ||
    family.includes("targeting") ||
    family.includes("narc") ||
    flags.includes("equipment") ||
    flags.includes("electronics") ||
    flags.includes("ecm") ||
    flags.includes("probe") ||
    flags.includes("c3") ||
    flags.includes("tag")
  );
}

/**
 * Gets a readable display name for a miscellaneous equipment slot.
 * @param rawSlot - Raw critical slot text.
 * @param metadata - Parsed Mek metadata.
 * @param resolved - Optional resolved equipment definition from WEAPONS.
 * @returns Human-readable equipment name for debug cost output.
 */
function getMiscEquipmentDisplayName(rawSlot: string, metadata: ParsedMtfMetadata, resolved?: any | null): string {
  const equipment = resolved ?? resolveMiscEquipmentDefinitionFromSlot(rawSlot, metadata);
  if (equipment?.name) return String(equipment.name);

  return cleanEquipmentDebugLabel(rawSlot);
}

/**
 * Cleans a raw MTF slot label for readable debug output.
 * @param rawSlot - Raw critical slot text.
 * @returns Cleaned display label.
 */
function cleanEquipmentDebugLabel(rawSlot: string): string {
  return cleanMiscEquipmentSlotText(rawSlot);
}

/**
 * Removes non-equipment parenthetical markers while preserving the core slot label.
 * @param rawSlot - Raw critical slot text.
 * @returns Cleaned slot text.
 */
function cleanMiscEquipmentSlotText(rawSlot: string): string {
  return String(rawSlot || "")
    .replace(/\(\s*omnipod\s*\)/gi, " ")
    .replace(/\(\s*r\s*\)/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getMiscEquipmentCountKey(rawSlot: string, metadata: ParsedMtfMetadata, locationKey: MekLocationKey, resolved?: any | null): string {
  const equipment = resolved ?? resolveMiscEquipmentDefinitionFromSlot(rawSlot, metadata);

  if (isTargetingComputerEquipment(rawSlot, equipment)) {
    return "targetingcomputer|unit";
  }

  const equipmentId = equipment?.id ? normalizeLookupText(String(equipment.id)) : normalizeLookupText(cleanMiscEquipmentSlotText(rawSlot));

  if (!equipmentId) return "";
  return `${equipmentId}|${locationKey}`;
}

/**
 * Tokenizes equipment text for loose matching against WEAPONS names and altNames.
 * @param value - Raw text to tokenize.
 * @returns Lowercase alphanumeric tokens.
 */
function tokenizeEquipmentText(value: string): string[] {
  return String(value || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => token !== "is" && token !== "cl" && token !== "clan" && token !== "omnipod");
}

/**
 * Determines whether a slot is already represented by the MTF Weapons section and should not
 * be charged again as miscellaneous equipment.
 * @param rawSlot - Raw critical slot text.
 * @param metadata - Parsed Mek metadata.
 * @returns True when a matching parsed weapon/equipment entry already carries this cost.
 */
function isAlreadyCountedMountedWeaponOrEquipment(rawSlot: string, metadata: ParsedMtfMetadata): boolean {
  const resolved = resolveWeapon(rawSlot, extractWeaponId(rawSlot), metadata.techBase);
  if (!resolved?.id) return false;

  return metadata.weapons.some((entry) => entry.weaponData?.id === resolved.id);
}

/**
 * Determines whether a resolved WEAPONS entry is a normal mounted weapon for cost purposes.
 * @param weapon - Resolved weapon/equipment definition.
 * @returns True when the item should already be covered by the mounted weapon cost pass.
 */
function isNormalWeaponForCost(weapon: any): boolean {
  const category = String(weapon?.category || "").toLowerCase();
  const family = normalizeLookupText(String(weapon?.family || ""));
  const flags = Array.isArray(weapon?.flags)
    ? weapon.flags.map((flag: any) => normalizeLookupText(String(flag)))
    : [];

  if (category === "energy" || category === "ballistic" || category === "missile") return true;
  if (flags.includes("directfire") || flags.includes("requiresammo")) return true;

  return (
    family.includes("laser") ||
    family.includes("ppc") ||
    family.includes("autocannon") ||
    family.includes("gauss") ||
    family.includes("machinegun") ||
    family.includes("flamer") ||
    family.includes("lrm") ||
    family.includes("srm") ||
    family.includes("mrm") ||
    family.includes("atm")
  );
}

/**
 * Determines whether a raw critical slot looks like a mounted weapon already handled elsewhere.
 * @param rawSlot - Raw critical slot text.
 * @returns True when the slot resolves to a normal weapon.
 */
function looksLikeMountedWeaponSlot(rawSlot: string): boolean {
  const resolved = resolveWeapon(rawSlot, extractWeaponId(rawSlot), "");
  return Boolean(resolved && isNormalWeaponForCost(resolved));
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
/**
 * Gets armor points per ton for armor tonnage calculation.
 *
 * @param armorType - Effective armor type.
 * @param techBase - Unit tech base.
 * @returns Armor points per ton.
 */
function getArmorPointsPerTon(armorType: string, techBase: string): number {
  const normalizedArmorType = normalizeLookupText(armorType);
  const normalizedTechBase = normalizeTechBase(techBase);

  if (normalizedArmorType.includes("commercial")) return 16;
  if (normalizedArmorType.includes("heavyindustrial")) return 16;
  if (normalizedArmorType.includes("industrial")) return 16;
  if (normalizedArmorType.includes("stealth")) return 16;

  if (normalizedArmorType.includes("lightferro")) return 16.96;
  if (normalizedArmorType.includes("heavyferro")) return 19.84;
  if (normalizedArmorType.includes("ferrolamell")) return 20;
  if (normalizedArmorType.includes("reflective")) return 20;

  if (normalizedArmorType.includes("ferro")) {
    return normalizedTechBase === "Clan" ? 19.2 : 17.92;
  }

  return 16;
}

/**
 * Calculates raw armor tonnage from armor points.
 *
 * @param armorType - Effective armor type.
 * @param techBase - Unit tech base.
 * @param armorPoints - Total armor points.
 * @returns Raw armor tonnage before billable half-ton rounding.
 */
function getArmorTonnage(armorType: string, techBase: string, armorPoints: number): number {
  const pointsPerTon = getArmorPointsPerTon(armorType, techBase);
  if (!pointsPerTon || !armorPoints) return 0;

  return armorPoints / pointsPerTon;
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
 * Counts ammo critical slots in a location.
 *
 * For offensive ammo BV, half-ton bins use getAmmoSlotBVMultiplier() because ammo BV
 * scales by ammo tonnage. For defensive explosive equipment penalties, the penalty is
 * per explosive ammo critical slot/bin, so a half-ton MG ammo bin still counts as 1
 * penalty item, not 0.5.
 *
 * @param slots - Critical slots in the location.
 * @param isCountingExplosive - True when counting explosive equipment defensive penalties.
 * @returns Ammo slot count or weighted ammo BV multiplier count.
 */
function getAmmoSlotCountInLocation(slots: string[], isCountingExplosive: boolean): number {
  let ammoSlotCount = 0;

  for (const slot of slots) {
    const normalized = normalizeLookupText(slot);

    if (!normalized.includes("ammo")) continue;

    if (isCountingExplosive) {
      if (!isExplosiveAmmoForDefensivePenalty(slot)) continue;
      ammoSlotCount += 1;
      continue;
    }

    ammoSlotCount += getAmmoSlotBVMultiplier(slot);
  }

  return ammoSlotCount;
}

function isExplosiveAmmoForDefensivePenalty(rawSlot: string): boolean {
  const normalized = normalizeLookupText(rawSlot);

  if (!normalized.includes("ammo")) return false;

  // Gauss-family ammo does not explode for defensive BV penalties.
  if (normalized.includes("gauss")) return false;
  if (normalized.includes("hag")) return false;
  if (normalized.includes("hyperassaultgauss")) return false;

  if (normalized.includes("plasma")) return false;
  if (normalized.includes("flamer")) return false;
  if (normalized.includes("coolant")) return false;
  if (normalized.includes("caseless")) return false;
  if (normalized.includes("nailrivet")) return false;
  if (normalized.includes("nail") && normalized.includes("rivet")) return false;

  return true;
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
 * Converts movement points to the target movement modifier used by BV defensive factor.
 * @param mp - Movement points moved.
 * @returns TMM value.
 */
function getTMMForMP(mp: number): number {
  if (mp >= 25) return 6;
  if (mp >= 18) return 5;
  if (mp >= 10) return 4;
  if (mp >= 7) return 3;
  if (mp >= 5) return 2;
  if (mp >= 3) return 1;
  return 0;
}

/**
 * Get defensive movement multiplier.
 * @param walkMP - Input value used by getDefensiveMovementMultiplier.
 * @param jumpMP - Input value used by getDefensiveMovementMultiplier.
 * @returns number result from getDefensiveMovementMultiplier.
 */
function getDefensiveMovementMultiplier(walkMP: number, jumpMP: number, effectiveRunMP?: number, stealthArmor: boolean = false): number {
  const runMP = effectiveRunMP || getRunMP(walkMP);
  const runTMM = getTMMForMP(runMP);
  const jumpTMM = jumpMP > 0 ? getTMMForMP(jumpMP) + 1 : 0;
  const stealthTMM = stealthArmor ? 2 : 0;
  const effectiveTMM = Math.max(runTMM, jumpTMM) + stealthTMM;

  return 1 + effectiveTMM / 10;
}

/**
 * Get offensive speed factor.
 * @param walkMP - Input value used by getOffensiveSpeedFactor.
 * @param jumpMP - Input value used by getOffensiveSpeedFactor.
 * @returns number result from getOffensiveSpeedFactor.
 */
function getOffensiveSpeedFactor(walkMP: number, jumpMP: number, effectiveRunMP?: number): number {
  const runMP = effectiveRunMP || getRunMP(walkMP);
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
  console.log(`[indexUnits][debug] Effective MP: R: ${getEffectiveRunMP(metadata.walkMP, metadata.runMP, metadata.myomerType, metadata.locations)}, J: ${metadata.jumpMP || 0}, W: ${metadata.walkMP || 0}`);

  if (metadata.officialBV) {
    console.log(`[indexUnits][debug] MTF BV: ${metadata.officialBV}`);
  }

  console.log("\n[indexUnits][debug] Battle Value Calculation");
  for (const line of bvDebug.lines) console.log(line);
  console.log(`[indexUnits][debug] BV result: defensive ${formatDebugNumber(bvDebug.defensiveBV)} + offensive ${formatDebugNumber(bvDebug.offensiveBV)} = ${Math.round(bvDebug.totalBV)}`);
  console.log(`[indexUnits][debug] Catalog BV: ${row.bv || ""} (${row.bvSource})`);

  console.log("\n[indexUnits][debug] C-Bill Cost Calculation");
  if (costDetail) {
    for (const line of costDetail.costLines) {
      console.log(`  ${padRight(formatCostLineLabel(line), 28)} ${formatDebugNumber(line.amount)}`);
    }
    console.log(`  ${padRight("Subtotal", 28)} ${formatDebugNumber(costDetail.subtotal)}`);
    if (costDetail.omniMultiplier !== 1) {
      console.log(`  ${padRight("Omni Multiplier", 28)} x ${formatDebugNumber(costDetail.omniMultiplier)}`);
    }
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
  const baseTotal = defensive.total + offensive.total;
  const cockpitMultiplier = getCockpitBVMultiplier(metadata.cockpitType);
  const totalBV = baseTotal * cockpitMultiplier;
  const lines = [...defensive.lines, "", ...offensive.lines];

  if (cockpitMultiplier !== 1) {
    lines.push("");
    lines.push("Battle Value Modifiers:");
    lines.push(`  Small Cockpit:     ${formatDebugNumber(baseTotal)} x ${formatDebugNumber(cockpitMultiplier)} = ${formatDebugNumber(totalBV)}`);
  }

  return {
    defensiveBV: defensive.total,
    offensiveBV: offensive.total,
    totalBV,
    lines,
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

  const structureModifier = getDefensiveStructureModifier(metadata.structureType);

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

  const additionalDefensiveEquipment = calculateAdditionalDefensiveEquipmentBV(metadata);
  if (additionalDefensiveEquipment.total > 0) {
    equipmentBV += additionalDefensiveEquipment.total;
    equipmentLines.push(...additionalDefensiveEquipment.lines.map((line) => `    ${line}`));
  }

  const antiMissileDebug = calculateDefensiveAntiMissileBV(metadata);
  if (antiMissileDebug.total > 0) {
    equipmentBV += antiMissileDebug.total;
    equipmentLines.push(...antiMissileDebug.lines.map((line) => `    ${line}`));
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

  const defensiveMultiplier = getDefensiveMovementMultiplier(metadata.walkMP, metadata.jumpMP, metadata.runMP, hasStealthArmor(metadata));
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
      locationPenalty = 15 * ammoSlots;
    } else {
      if (["centerTorso", "leftLeg", "rightLeg", "head", "frontLeftLeg", "frontRightLeg", "rearLeftLeg", "rearRightLeg"].includes(locationKey)) {
        locationPenalty += 15 * getAmmoSlotCountInLocation(location.slots, true);
      }
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

    if (isDefensiveOnlyWeapon(weapon)) continue;

    const baseBV = typeof weapon.bv === "number" ? weapon.bv : toNumber(weapon.bv);
    const heat = typeof weapon.heat === "number" ? weapon.heat : toNumber(weapon.heat);
    if (!baseBV) continue;

    const tcMultiplier = hasTargetingComputer && isTargetingComputerEligibleWeapon(weapon) ? 1.25 : 1;
    const artemisMultiplier = weaponGetsArtemisModifier(weaponEntry, metadata) ? 1.2 : 1;
    const rearMultiplier = weaponEntry.isRearFacing ? 0.5 : 1;
    const modifiedBV = baseBV * tcMultiplier * rearMultiplier * artemisMultiplier;
    const name = `${getWeaponDebugLabel(weapon, weaponEntry.name)}${artemisMultiplier !== 1 ? " x 1.2 (Art-IV)" : ""}`;

    if (heat === 0) zeroHeatWeapons.push({ name, modifiedBV, isRear: weaponEntry.isRearFacing, tcMultiplier });
    else heatWeapons.push({ name, baseBV, modifiedBV, heat, isRear: weaponEntry.isRearFacing, tcMultiplier });
  }

  const ammo = calculateAmmoBVDebug(metadata);
  const heatSinkCapacity = metadata.heatSinkType.toLowerCase().includes("double")
    ? metadata.heatSinkCount * 2
    : metadata.heatSinkCount;
  const movementHeat = getBVMovementHeat(metadata);
  const movementHeatLabel = metadata.jumpMP > 0 ? "Jump" : "Run";
  const stealthHeat = hasStealthArmor(metadata) ? 10 : 0;
  const stealthHeatText = stealthHeat > 0 ? ` - ${stealthHeat} (Stealth)` : "";
  const heatEfficiency = 6 + heatSinkCapacity - movementHeat - stealthHeat;
  const totalWeaponHeat = heatWeapons.reduce((sum, weapon) => sum + weapon.heat, 0);

  let heatAdjustedWeaponBV = 0;
  let runningHeat = 0;

  lines.push("Offensive Battle Rating:");
  lines.push(`  Heat Efficiency:  6 + ${heatSinkCapacity} - ${movementHeat} (${movementHeatLabel})${stealthHeatText} = ${formatDebugNumber(heatEfficiency)}`);
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
  const speedFactor = getOffensiveSpeedFactor(metadata.walkMP, metadata.jumpMP, metadata.runMP);
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
      if (matchingWeapon && isDefensiveOnlyWeapon(matchingWeapon)) continue;
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
 * Determines whether a weapon contributes tonnage to Targeting Computer cost/BV eligibility.
 *
 * Prefer weapons.ts flags as the source of truth. A weapon with directFire is
 * TC-eligible unless it is explicitly marked indirect/cluster-only or excluded.
 * Name/category fallbacks remain for older entries that do not yet have flags.
 *
 * @param weapon - Weapon definition from weapons.ts.
 * @returns True when the weapon is eligible for Targeting Computer support.
 */
function isTargetingComputerEligibleWeapon(weapon: any): boolean {
  const category = normalizeLookupText(String(weapon.category || ""));
  const name = normalizeLookupText(String(weapon.name || ""));
  const family = normalizeLookupText(String(weapon.family || ""));
  const id = normalizeLookupText(String(weapon.id || ""));
  const flags = Array.isArray(weapon.flags)
    ? weapon.flags.map((flag: any) => normalizeLookupText(String(flag)))
    : [];

  const combined = `${id} ${name} ${family} ${category} ${flags.join(" ")}`;

  const hasDirectFireFlag =
    flags.includes("directfire") ||
    flags.includes("direct") ||
    flags.includes("directfireweapon");

  const hasExclusionFlag =
    flags.includes("indirectfire") ||
    flags.includes("cluster") ||
    flags.includes("clusteronly") ||
    flags.includes("tcineligible") ||
    flags.includes("notargetingcomputer") ||
    flags.includes("no targeting computer");

  if (hasExclusionFlag) return false;

  if (combined.includes("flamer")) return false;
  if (combined.includes("tag")) return false;
  if (combined.includes("narc")) return false;
  if (combined.includes("antimissile") || combined.includes("ams")) return false;

  // Normal missile launchers are not TC-eligible unless weapons.ts explicitly flags
  // a direct-fire mode/variant as directFire.
  const isMissile =
    category.includes("missile") ||
    family.includes("lrm") ||
    family.includes("srm") ||
    family.includes("mrm") ||
    family.includes("atm");

  if (isMissile) {
    return hasDirectFireFlag;
  }

  if (hasDirectFireFlag) return true;

  // Fallbacks for weapon entries that do not yet have directFire flags.
  if (category.includes("energy")) return true;
  if (combined.includes("laser")) return true;
  if (combined.includes("ppc")) return true;

  if (category.includes("ballistic")) return true;
  if (combined.includes("autocannon")) return true;
  if (combined.includes("lightac")) return true;
  if (combined.includes("ac")) return true;
  if (combined.includes("gauss")) return true;
  if (combined.includes("rifle")) return true;

  return false;
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
 * Formats a cost line label with an optional count suffix.
 * @param line - Cost breakdown line.
 * @returns Debug label such as "Large Laser (2)".
 */
function formatCostLineLabel(line: CostBreakdownLine): string {
  return line.count && line.count > 0 ? `${line.label} (${line.count})` : line.label;
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
    rulesLevels: getRequestedRulesLevels(),
    debug: hasDebugFlag(),
    unitQuery: getRequestedUnitQuery(),
  };
}

/**
 * Gets requested rules-level filters from CLI arguments.
 * Supports --supported-only for Introductory, Standard, and Advanced Meks, and
 * supports comma-separated values such as --rules=1,2,3.
 * @returns Normalized rules level names to include, or an empty array when no rules filter is requested.
 */
function getRequestedRulesLevels(): string[] {
  if (hasSupportedOnlyFlag()) {
    return ["Introductory", "Standard", "Advanced"];
  }

  const rulesArg = process.argv.find(
    (arg) =>
      arg.startsWith("--rules=") ||
      arg.startsWith("--rulesLevel=") ||
      arg.startsWith("--rules-level=") ||
      arg.startsWith("--level=")
  );

  if (!rulesArg) return [];

  const rawValue = rulesArg.substring(rulesArg.indexOf("=") + 1).trim();
  if (!rawValue) return [];

  const allowed = ["Introductory", "Standard", "Advanced", "Experimental", "Unofficial"];
  const rulesLevels = rawValue
    .split(",")
    .map((value) => normalizeRulesLevelForCatalog(value.trim()))
    .filter(Boolean);

  for (const level of rulesLevels) {
    if (!allowed.includes(level)) {
      throw new Error(
        `Unknown rules level in "${rawValue}". Use 1-5, Introductory, Standard, Advanced, Experimental, or Unofficial.`
      );
    }
  }

  return Array.from(new Set(rulesLevels));
}

/**
 * Determines whether supported-only indexing was requested.
 * @returns True when --supported-only, --rules=supported, or --rules=1,2,3 style support was requested.
 */
function hasSupportedOnlyFlag(): boolean {
  return process.argv.some(
    (arg) =>
      arg === "--supported-only" ||
      arg === "--supportedOnly" ||
      arg === "--intro-standard-advanced" ||
      arg === "--rules=supported" ||
      arg === "--rulesLevel=supported" ||
      arg === "--rules-level=supported"
  );
}

/**
 * Determines whether a parsed unit should be included for the requested rules-level filters.
 * @param rulesLevel - Parsed catalog rules level for a unit.
 * @param options - Index options from the CLI.
 * @returns True when no rules filter is active or the unit's rules level is included.
 */
function shouldIncludeRulesLevel(rulesLevel: string, options: IndexOptions): boolean {
  return !hasRulesLevelFilter(options) || options.rulesLevels.includes(rulesLevel);
}

/**
 * Determines whether a rules-level filter is active.
 * @param options - Index options from the CLI.
 * @returns True when one or more rules levels were requested.
 */
function hasRulesLevelFilter(options: IndexOptions): boolean {
  return options.rulesLevels.length > 0;
}

/**
 * Formats the active rules-level filter for console output.
 * @param options - Index options from the CLI.
 * @returns Printable filter description.
 */
function getRulesLevelFilterDescription(options: IndexOptions): string {
  return options.rulesLevels.join(", ");
}

/**
 * Gets the output path for the lightweight Unit Index CSV for one unit type.
 * @param unitType - Unit type being indexed.
 * @returns Output CSV path under server/data/generated/unitIndex.
 */
function getUnitIndexCsvPath(unitType: UnitTypeKey): string {
  return path.join(UNIT_INDEX_OUTPUT_DIR, `${unitType}.csv`);
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
