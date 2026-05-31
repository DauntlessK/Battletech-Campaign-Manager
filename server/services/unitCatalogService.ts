import fs from "fs/promises";
import path from "path";

export type UnitCatalogItem = {
  id: string;
  unitType: string;
  chassis: string;
  model: string;
  name: string;
  fileName: string;
  relativePath: string;
  detailPath?: string;
  mulId?: string;
  tonnage: number;
  weightClass: string;
  bv: number;
  totalBV: number;
  costCBills: number;
  techBase: string;
  rulesLevel: string;
  year: number;
  era: string;
  role: string;
  walk: number;
  run: number;
  jump: number;
  heatSinks: number;
  heatSinkType: string;
  engine: string;
  gyro: string;
  armorType: string;
  structureType: string;
};

const GENERATED_DIR = path.resolve(process.cwd(), "server", "data", "generated");

const CATALOG_FILES: Record<string, string> = {
  meks: path.join("unitIndex", "meks.csv"),
  vehicles: "catalog_vehicles.csv",
  aerospace: "catalog_aerospace.csv",
  battlearmor: "catalog_battlearmor.csv",
  infantry: "catalog_infantry.csv",
  protomeks: "catalog_protomeks.csv",
};

const UNIT_DETAIL_MANIFESTS: Record<string, string> = {
  meks: path.join(GENERATED_DIR, "unitDetails", "meks", "manifest.json"),
};

let catalogCache: UnitCatalogItem[] | null = null;

export async function getUnitCatalog(unitType = "meks"): Promise<UnitCatalogItem[]> {
  if (unitType === "all") {
    return getAllCatalogs();
  }

  const fileName = CATALOG_FILES[unitType];

  if (!fileName) {
    throw new Error(`Unknown catalog type "${unitType}"`);
  }

  const filePath = path.join(GENERATED_DIR, fileName);
  const csv = await fs.readFile(filePath, "utf-8");
  const detailPathMap = await loadUnitDetailManifest(unitType);

  return parseCatalogCsv(csv, detailPathMap);
}

export async function getAllCatalogs(): Promise<UnitCatalogItem[]> {
  if (catalogCache) return catalogCache;

  const allRows: UnitCatalogItem[] = [];

  for (const [unitType, fileName] of Object.entries(CATALOG_FILES)) {
    const filePath = path.join(GENERATED_DIR, fileName);

    try {
      const csv = await fs.readFile(filePath, "utf-8");
      const detailPathMap = await loadUnitDetailManifest(unitType);
      allRows.push(...parseCatalogCsv(csv, detailPathMap));
    } catch {
      // It's fine if some catalogs don't exist yet.
    }
  }

  catalogCache = allRows;
  return allRows;
}

async function loadUnitDetailManifest(unitType: string): Promise<Map<string, string> | undefined> {
  const manifestPath = UNIT_DETAIL_MANIFESTS[unitType];

  if (!manifestPath) {
    return undefined;
  }

  const detailPathMap = new Map<string, string>();

  try {
    const manifestContent = await fs.readFile(manifestPath, "utf-8");
    const manifestEntries = JSON.parse(manifestContent) as Array<{ id: string; detailPath: string }>;

    for (const entry of manifestEntries) {
      if (entry.id && entry.detailPath) {
        detailPathMap.set(entry.id, path.resolve(process.cwd(), entry.detailPath));
      }
    }
  } catch {
    // The manifest is optional. If it is missing or incomplete, scan the generated JSON folder below.
  }

  await addGeneratedDetailFilesToMap(detailPathMap, path.dirname(manifestPath));

  return detailPathMap;
}

async function addGeneratedDetailFilesToMap(detailPathMap: Map<string, string>, detailDir: string) {
  let entries: string[];

  try {
    entries = await fs.readdir(detailDir);
  } catch {
    return;
  }

  await Promise.all(
    entries
      .filter((entry) => entry.toLowerCase().endsWith(".json") && entry !== "manifest.json")
      .map(async (entry) => {
        const detailPath = path.join(detailDir, entry);

        try {
          const detailContent = await fs.readFile(detailPath, "utf-8");
          const detail = JSON.parse(detailContent) as {
            catalog?: {
              id?: string;
              name?: string;
              chassis?: string;
              model?: string;
              fileName?: string;
            };
          };

          const catalog = detail.catalog ?? {};
          const ids = [
            catalog.id,
            slugForDetailMatch(catalog.name),
            slugForDetailMatch(`${catalog.chassis ?? ""} ${catalog.model ?? ""}`),
            slugForDetailMatch(catalog.fileName?.replace(/\.mtf$/i, "")),
          ].filter(Boolean) as string[];

          for (const id of ids) {
            if (!detailPathMap.has(id)) {
              detailPathMap.set(id, detailPath);
            }
          }
        } catch {
          // Ignore malformed/generated files here; the selected-unit route will report detail-load errors.
        }
      })
  );
}

function slugForDetailMatch(value: string | undefined): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\.mtf$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function findCatalogItemById(id: string): Promise<UnitCatalogItem | null> {
  const catalogs = await getAllCatalogs();
  return catalogs.find((item) => item.id === id) ?? null;
}

export function clearUnitCatalogCache() {
  catalogCache = null;
}

function parseCatalogCsv(csv: string, detailPathMap?: Map<string, string>): UnitCatalogItem[] {
  const rows = parseCsv(csv);

  if (rows.length === 0) return [];

  const [header, ...dataRows] = rows;

  return dataRows
    .filter((row) => row.some((cell) => cell.trim() !== ""))
    .map((row) => {
      const record: Record<string, string> = {};

      header.forEach((column, index) => {
        record[column] = row[index] ?? "";
      });

      return {
        id: record.id,
        unitType: record.unitType,
        chassis: record.chassis,
        model: record.model,
        name: record.name || record.chassis,
        fileName: record.fileName,
        relativePath: record.relativePath,
        detailPath: detailPathMap?.get(record.id),
        mulId: record.mulId,
        tonnage: toNumber(record.tonnage),
        weightClass: record.weightClass,
        bv: toNumber(record.bv || record.totalBV),
        totalBV: toNumber(record.totalBV || record.bv),
        costCBills: toNumber(record.costCBills),
        techBase: record.techBase || "Unknown",
        rulesLevel: record.rulesLevel || "Unknown",
        year: toNumber(record.year),
        era: record.era,
        role: record.role || "Unknown",
        walk: toNumber(record.walk),
        run: toNumber(record.run),
        jump: toNumber(record.jump),
        heatSinks: toNumber(record.heatSinks),
        heatSinkType: record.heatSinkType,
        engine: record.engine,
        gyro: record.gyro,
        armorType: record.armorType,
        structureType: record.structureType,
      };
    });
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      currentCell += '"';
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }

      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

function toNumber(value: string): number {
  const parsed = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}