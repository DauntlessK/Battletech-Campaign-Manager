import fs from "fs/promises";
import path from "path";

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
  costCBills: string;
  techBase: string;
  rulesLevel: string;
  year: string;
  era: string;
  role: string;
  walk: string;
  run: string;
  jump: string;
  heatSinks: string;
  heatSinkType: string;
  engine: string;
  gyro: string;
  armorType: string;
  structureType: string;
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
  "costCBills",
  "techBase",
  "rulesLevel",
  "year",
  "era",
  "role",
  "walk",
  "run",
  "jump",
  "heatSinks",
  "heatSinkType",
  "engine",
  "gyro",
  "armorType",
  "structureType",
];

async function main() {
  const requestedType = getRequestedType();

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const unitTypes = requestedType
    ? [requestedType]
    : (Object.keys(UNIT_TYPE_FOLDERS) as UnitTypeKey[]);

  for (const unitType of unitTypes) {
    await indexUnitType(unitType);
  }
}

async function indexUnitType(unitType: UnitTypeKey) {
  const folderName = UNIT_TYPE_FOLDERS[unitType];
  const root = path.join(UNITS_ROOT, folderName);

  const files = await findFilesByExtension(root, ".mtf");
  const rows: CatalogRow[] = [];

  for (const filePath of files) {
    const fileName = path.basename(filePath);
    const parsedName = parseChassisModelFromFileName(fileName);

    if (!parsedName) {
      continue;
    }

    const content = await fs.readFile(filePath, "utf-8");
    const metadata = parseMtfMetadata(content);

    const chassis = metadata.chassis || parsedName.chassis;
    const model = metadata.model || parsedName.model;
    const tonnage = metadata.tonnage;

    rows.push({
      id: createCatalogId(unitType, path.relative(UNITS_ROOT, filePath)),
      unitType,
      chassis,
      model,
      name: chassis,
      fileName,
      relativePath: path.relative(UNITS_ROOT, filePath).replace(/\\/g, "/"),

      tonnage,
      weightClass: getWeightClass(tonnage),
      bv: metadata.bv,
      costCBills: metadata.costCBills,
      techBase: metadata.techBase,
      rulesLevel: metadata.rulesLevel,
      year: metadata.year,
      era: metadata.era,
      role: metadata.role,
      walk: metadata.walk,
      run: metadata.run,
      jump: metadata.jump,
      heatSinks: metadata.heatSinks,
      heatSinkType: metadata.heatSinkType,
      engine: metadata.engine,
      gyro: metadata.gyro,
      armorType: metadata.armorType,
      structureType: metadata.structureType,
    });
  }

  rows.sort((a, b) => {
    const aName = `${a.chassis} ${a.model}`;
    const bName = `${b.chassis} ${b.model}`;
    return aName.localeCompare(bName);
  });

  const csv = toCsv(rows);
  const outputPath = path.join(OUTPUT_DIR, `catalog_${unitType}.csv`);

  await fs.writeFile(outputPath, csv, "utf-8");

  console.log(`[indexUnits] ${unitType}: ${rows.length} rows -> ${outputPath}`);
}

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

function parseChassisModelFromFileName(fileName: string) {
  const baseName = fileName.replace(/\.mtf$/i, "").trim();
  const parts = baseName.split(/\s+/);

  if (parts.length < 2) {
    return null;
  }

  return {
    chassis: parts.slice(0, -1).join(" "),
    model: parts[parts.length - 1],
  };
}

function parseMtfMetadata(content: string) {
  const lines = content.split(/\r?\n/);

  const getValue = (...keys: string[]) => {
    for (const key of keys) {
      const found = lines.find((line) =>
        line.trim().toLowerCase().startsWith(`${key.toLowerCase()}:`)
      );

      if (found) {
        return found.slice(found.indexOf(":") + 1).trim();
      }
    }

    return "";
  };

  const chassis = getValue("chassis", "Chassis");
  const model = getValue("model", "Model");
  const tonnage = getValue("mass", "tonnage", "weight");
  const year = getValue("year", "introYear");
  const techBase = getValue("techbase", "tech_base", "tech base");
  const rulesLevel = getValue("rules level", "rules_level", "rules");
  const walk = getValue("walkmp", "walk mp", "walkingmp", "walking mp");
  const jump = getValue("jumpmp", "jump mp", "jumpingmp", "jumping mp");
  const heatSinks = getValue("heatsinks", "heat sinks");
  const heatSinkType = getValue("sinktype", "heat sink type", "heatsinktype");
  const engine = getValue("engine");
  const gyro = getValue("gyro");
  const armorType = getValue("armor type", "armortype");
  const structureType = getValue("structure type", "structuretype");
  const bv = getValue("bv", "battle value", "battlevalue");
  const costCBills = getValue("cost", "cost cbills", "cbills");
  const role = getValue("role");
  const era = year ? yearToEra(year) : "";

  return {
    chassis,
    model,
    tonnage,
    year,
    techBase,
    rulesLevel,
    walk,
    run: walk ? String(Math.ceil(Number(walk) * 1.5)) : "",
    jump,
    heatSinks,
    heatSinkType,
    engine,
    gyro,
    armorType,
    structureType,
    bv,
    costCBills,
    role,
    era,
  };
}

function getWeightClass(tonnage: string) {
  const tons = Number(tonnage);

  if (!Number.isFinite(tons) || tons <= 0) return "";
  if (tons <= 35) return "Light";
  if (tons <= 55) return "Medium";
  if (tons <= 75) return "Heavy";

  return "Assault";
}

function yearToEra(yearValue: string) {
  const year = Number(yearValue);

  if (!Number.isFinite(year) || year <= 0) return "";
  if (year < 2781) return "Star League";
  if (year < 3049) return "Succession Wars";
  if (year < 3062) return "Clan Invasion";
  if (year < 3068) return "Civil War";
  if (year < 3081) return "Jihad";
  if (year < 3131) return "Republic";
  return "Dark Age / ilClan";
}

function createCatalogId(unitType: UnitTypeKey, relativePath: string) {
  return slug(`${unitType}-${relativePath}`);
}

function slug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\.mtf$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toCsv(rows: CatalogRow[]) {
  const header = CSV_COLUMNS.join(",");

  const body = rows.map((row) =>
    CSV_COLUMNS.map((column) => escapeCsv(row[column])).join(",")
  );

  return [header, ...body].join("\n");
}

function escapeCsv(value: string) {
  if (value == null) return "";

  const stringValue = String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

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

main().catch((error) => {
  console.error("[indexUnits] Failed:", error);
  process.exit(1);
});