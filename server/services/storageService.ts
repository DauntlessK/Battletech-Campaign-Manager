import fs from "fs/promises";
import os from "os";
import path from "path";
import type { StoreData } from "../types/models";

const LEGACY_STORE_PATH = path.resolve(process.cwd(), "server", "data", "store.json");
const STORE_PATH = process.env.BTCM_STORE_PATH
  ? path.resolve(process.env.BTCM_STORE_PATH)
  : path.resolve(os.homedir(), ".btcm", "store.json");

const DEFAULT_STORE: StoreData = {
  users: [],
  campaigns: [],
  campaignParticipants: [],
  forces: [],
  forceUnits: [],
  battles: [],
  objectives: [],
  resourceAccounts: [],
  resourceTransactions: [],
  authTokens: [],
  notifications: [],
  friendRequests: [],
};

const REQUIRED_ARRAY_KEYS: Array<keyof StoreData> = [
  "users",
  "campaigns",
  "campaignParticipants",
  "forces",
  "forceUnits",
  "battles",
  "objectives",
  "resourceAccounts",
  "resourceTransactions",
  "authTokens",
];

const OPTIONAL_ARRAY_KEYS: Array<keyof StoreData> = ["notifications", "friendRequests"];

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function backupExistingStore(label = "bak"): Promise<void> {
  if (!(await pathExists(STORE_PATH))) return;
  const backupPath = `${STORE_PATH}.${label}.${createTimestamp()}`;
  await fs.copyFile(STORE_PATH, backupPath);
}

function normalizeStore(raw: unknown): StoreData {
  if (!isRecord(raw)) {
    throw new Error("Store data is not a JSON object.");
  }

  const normalized = { ...DEFAULT_STORE, ...raw } as StoreData;

  for (const key of REQUIRED_ARRAY_KEYS) {
    if (!Array.isArray(normalized[key])) {
      throw new Error(`Store data is missing required array "${String(key)}".`);
    }
  }

  for (const key of OPTIONAL_ARRAY_KEYS) {
    if (!Array.isArray(normalized[key])) {
      (normalized as Record<string, unknown>)[String(key)] = [];
    }
  }

  return normalized;
}

function assertValidStoreForSave(store: StoreData): void {
  normalizeStore(store);
}

async function writeStoreFile(store: StoreData): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  const tempPath = `${STORE_PATH}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(store, null, 2), "utf-8");
  await fs.rename(tempPath, STORE_PATH);
}

async function ensureStoreExists(): Promise<void> {
  if (await pathExists(STORE_PATH)) return;

  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });

  if (STORE_PATH !== LEGACY_STORE_PATH && (await pathExists(LEGACY_STORE_PATH))) {
    await fs.copyFile(LEGACY_STORE_PATH, STORE_PATH);
    return;
  }

  await writeStoreFile(DEFAULT_STORE);
}

export async function loadStore(): Promise<StoreData> {
  await ensureStoreExists();
  const raw = await fs.readFile(STORE_PATH, "utf-8");

  try {
    return normalizeStore(JSON.parse(raw));
  } catch (error) {
    await backupExistingStore("invalid").catch(() => undefined);
    throw new Error(
      error instanceof Error
        ? `Store file is invalid and was not overwritten: ${error.message}`
        : "Store file is invalid and was not overwritten.",
    );
  }
}

export async function saveStore(store: StoreData): Promise<void> {
  await ensureStoreExists();
  assertValidStoreForSave(store);
  await backupExistingStore();
  await writeStoreFile(store);
}

export function getStorePath(): string {
  return STORE_PATH;
}
