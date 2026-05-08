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
  meks: "catalog_meks.csv",
  vehicles: "catalog_vehicles.csv",
  aerospace: "catalog_aerospace.csv",
  battlearmor: "catalog_battlearmor.csv",
  infantry: "catalog_infantry.csv",
  protomeks: "catalog_protomeks.csv",
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

  return parseCatalogCsv(csv);
}

export async function getAllCatalogs(): Promise<UnitCatalogItem[]> {
  if (catalogCache) return catalogCache;

  const allRows: UnitCatalogItem[] = [];

  for (const fileName of Object.values(CATALOG_FILES)) {
    const filePath = path.join(GENERATED_DIR, fileName);

    try {
      const csv = await fs.readFile(filePath, "utf-8");
      allRows.push(...parseCatalogCsv(csv));
    } catch {
      // It's fine if some catalogs don't exist yet.
    }
  }

  catalogCache = allRows;
  return allRows;
}

export async function findCatalogItemById(id: string): Promise<UnitCatalogItem | null> {
  const catalogs = await getAllCatalogs();
  return catalogs.find((item) => item.id === id) ?? null;
}

export function clearUnitCatalogCache() {
  catalogCache = null;
}

function parseCatalogCsv(csv: string): UnitCatalogItem[] {
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
        tonnage: toNumber(record.tonnage),
        weightClass: record.weightClass,
        bv: toNumber(record.bv),
        totalBV: toNumber(record.bv),
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