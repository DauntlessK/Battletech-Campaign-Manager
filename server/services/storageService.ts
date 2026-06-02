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

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureStoreExists(): Promise<void> {
  if (await pathExists(STORE_PATH)) return;

  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });

  if (STORE_PATH !== LEGACY_STORE_PATH && (await pathExists(LEGACY_STORE_PATH))) {
    await fs.copyFile(LEGACY_STORE_PATH, STORE_PATH);
    return;
  }

  await fs.writeFile(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), "utf-8");
}

export async function loadStore(): Promise<StoreData> {
  await ensureStoreExists();
  const raw = await fs.readFile(STORE_PATH, "utf-8");
  try {
    return JSON.parse(raw) as StoreData;
  } catch (error) {
    await fs.writeFile(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), "utf-8");
    return { ...DEFAULT_STORE };
  }
}

export async function saveStore(store: StoreData): Promise<void> {
  await ensureStoreExists();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}
