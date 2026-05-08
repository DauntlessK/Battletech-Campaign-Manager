import fs from "fs/promises";
import path from "path";

export type MtfFileRecord = {
  id: string;
  fileName: string;
  filePath: string;
  content: string;
};

const MTF_DIR = path.resolve(process.cwd(), "server", "data", "mtf");

function createUnitIdFromFileName(fileName: string) {
  return fileName
    .replace(/\.mtf$/i, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getAllMtfFiles(): Promise<MtfFileRecord[]> {
  const entries = await fs.readdir(MTF_DIR, { withFileTypes: true });

  const mtfFiles = entries.filter(
    (entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".mtf")
  );

  const records = await Promise.all(
    mtfFiles.map(async (entry) => {
      const filePath = path.join(MTF_DIR, entry.name);
      const content = await fs.readFile(filePath, "utf-8");

      return {
        id: createUnitIdFromFileName(entry.name),
        fileName: entry.name,
        filePath,
        content,
      };
    })
  );

  return records;
}

export async function getMtfFileById(id: string): Promise<MtfFileRecord | null> {
  const files = await getAllMtfFiles();
  return files.find((file) => file.id === id) ?? null;
}