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
    const content = await fs.readFile(filePath, "utf-8");

    const metadata = parseMtfMetadata(content);
    const parsedName = parseChassisModelFromFileName(fileName);

    const chassis = metadata.chassis || parsedName?.chassis || "";
    const model = metadata.model || parsedName?.model || "";

    if (!chassis || !model) {
      console.warn("[indexUnits] Skipping file with missing chassis/model:", filePath);
      continue;
    }

    rows.push({
      id: createCatalogId(unitType, path.relative(UNITS_ROOT, filePath)),
      unitType,
      chassis,
      model,
      name: chassis,
      fileName,
      relativePath: path.relative(UNITS_ROOT, filePath).replace(/\\/g, "/"),

      tonnage: metadata.tonnage,
      weightClass: getWeightClass(metadata.tonnage),
      bv: metadata.bv,
      costCBills: metadata.costCBills,
      techBase: metadata.techBase,
      rulesLevel: metadata.rulesLevel,
      year: metadata.year,
      era: metadata.era,
      role: metadata.role,
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

function parseMtfMetadata(content: string) {
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

  const bv = getValue("bv", "battle value", "battlevalue");
  const costCBills = getValue("cost", "cost cbills", "cbills");
  const role = getValue("role");

  return {
    chassis,
    model,
    tonnage,
    year,
    techBase,
    rulesLevel,
    bv,
    costCBills,
    role,
    era: year ? yearToEraBucket(year) : "",
  };
}

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

function normalizeMtfKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function numericYearOnly(value: string) {
  const match = String(value || "").match(/\b(2[0-9]{3}|3[0-9]{3})\b/);
  return match ? match[1] : "";
}

function normalizeTechBase(value: string) {
  const raw = String(value || "").trim();
  const lower = raw.toLowerCase();

  if (!raw) return "";

  if (lower.includes("clan")) return "Clan";
  if (lower.includes("mixed")) return "Mixed";
  if (lower.includes("inner") || lower.includes("is")) return "Inner Sphere";

  return raw;
}

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

function getWeightClass(tonnage: string) {
  const tons = Number(tonnage);

  if (!Number.isFinite(tons) || tons <= 0) return "";
  if (tons <= 35) return "Light";
  if (tons <= 55) return "Medium";
  if (tons <= 75) return "Heavy";

  return "Assault";
}

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