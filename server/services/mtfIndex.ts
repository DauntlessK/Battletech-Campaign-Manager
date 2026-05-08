import fs from "fs/promises";
import path from "path";

export type MtfIndexRecord = {
  key: string;
  chassis: string;
  model: string;
  fileName: string;
  filePath: string;
  relativePath: string;
};

let cachedIndex: Map<string, MtfIndexRecord> | null = null;

// Your restored MegaMek unit folder:
const UNITS_ROOT = path.resolve(process.cwd(), "src", "data", "units");
const MEKS_ROOT = path.join(UNITS_ROOT, "meks");

export async function getMtfIndex(): Promise<Map<string, MtfIndexRecord>> {
  if (cachedIndex) return cachedIndex;

  const records = await scanForMtfFiles(MEKS_ROOT);
  const index = new Map<string, MtfIndexRecord>();

  for (const record of records) {
    if (!index.has(record.key)) {
      index.set(record.key, record);
    } else {
      const existing = index.get(record.key);

      console.warn("[mtfIndex] duplicate chassis/model key:", record.key, {
        keeping: existing?.relativePath,
        ignoring: record.relativePath,
      });
    }
  }

  cachedIndex = index;

  console.log(
    `[mtfIndex] indexed ${index.size} unique Mek definitions from ${records.length} .mtf files`
  );

  return index;
}

export async function findMtfByChassisModel(
  chassis: string,
  model: string
): Promise<MtfIndexRecord | null> {
  const index = await getMtfIndex();
  return index.get(createMtfKey(chassis, model)) ?? null;
}

export function clearMtfIndexCache() {
  cachedIndex = null;
}

async function scanForMtfFiles(root: string): Promise<MtfIndexRecord[]> {
  const results: MtfIndexRecord[] = [];

  async function walk(dir: string) {
    let entries;

    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch (error) {
      console.warn("[mtfIndex] could not read directory:", dir);
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".mtf")) {
        continue;
      }

      const parsed = parseChassisModelFromFileName(entry.name);

      if (!parsed) {
        console.warn("[mtfIndex] could not parse filename:", entry.name);
        continue;
      }

      results.push({
        key: createMtfKey(parsed.chassis, parsed.model),
        chassis: parsed.chassis,
        model: parsed.model,
        fileName: entry.name,
        filePath: fullPath,
        relativePath: path.relative(root, fullPath),
      });
    }
  }

  await walk(root);

  return results;
}

function parseChassisModelFromFileName(
  fileName: string
): { chassis: string; model: string } | null {
  const baseName = fileName.replace(/\.mtf$/i, "").trim();

  const parts = baseName.split(/\s+/);

  if (parts.length < 2) {
    return null;
  }

  const model = parts[parts.length - 1];
  const chassis = parts.slice(0, -1).join(" ");

  return {
    chassis,
    model,
  };
}

function createMtfKey(chassis: string, model: string): string {
  return `${normalizeKey(chassis)}|${normalizeKey(model)}`;
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}