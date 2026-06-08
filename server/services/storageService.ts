import crypto from "crypto";
import fs from "fs/promises";
import os from "os";
import path from "path";
import type { StoreData } from "../types/models";

const LEGACY_PROJECT_STORE_PATH = path.resolve(process.cwd(), "server", "data", "store.json");
const configuredStorePath = process.env.BTCM_STORE_PATH?.trim();
const resolvedConfiguredStorePath = configuredStorePath
  ? path.resolve(configuredStorePath)
  : undefined;

// Backward compatibility: BTCM_STORE_PATH may still point to the old store.json.
// A directory path is also accepted for the new split-file layout.
const STORE_DIR = resolvedConfiguredStorePath
  ? path.extname(resolvedConfiguredStorePath).toLowerCase() === ".json"
    ? path.dirname(resolvedConfiguredStorePath)
    : resolvedConfiguredStorePath
  : path.resolve(os.homedir(), ".btcm");

const LEGACY_ACTIVE_STORE_PATH = resolvedConfiguredStorePath?.endsWith(".json")
  ? resolvedConfiguredStorePath
  : path.join(STORE_DIR, "store.json");

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
  pilots: [],
};

const COLLECTION_KEYS = [
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
  "notifications",
  "friendRequests",
  "pilots",
] as const satisfies readonly (keyof StoreData)[];

type CollectionKey = (typeof COLLECTION_KEYS)[number];

const REQUIRED_ARRAY_KEYS: readonly CollectionKey[] = [
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

const OPTIONAL_ARRAY_KEYS: readonly CollectionKey[] = ["notifications", "friendRequests", "pilots"];

let saveQueue: Promise<void> = Promise.resolve();

function collectionPath(key: CollectionKey): string {
  return path.join(STORE_DIR, `${key}.json`);
}

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

function normalizeStore(raw: unknown): StoreData {
  if (!isRecord(raw)) {
    throw new Error("Store data is not a JSON object.");
  }

  const normalized = { ...DEFAULT_STORE, ...raw } as StoreData;

  for (const key of REQUIRED_ARRAY_KEYS) {
    if (!Array.isArray(normalized[key])) {
      throw new Error(`Store data is missing required array "${key}".`);
    }
  }

  for (const key of OPTIONAL_ARRAY_KEYS) {
    if (!Array.isArray(normalized[key])) {
      (normalized as Record<string, unknown>)[key] = [];
    }
  }

  return migrateEmbeddedPilots(normalized);
}


function migrateEmbeddedPilots(store: StoreData): StoreData {
  store.pilots ??= [];
  const forceById = new Map(store.forces.map((force) => [force.id, force]));
  const pilotByAssignedUnit = new Map(
    store.pilots
      .filter((pilot) => pilot.assignedUnitId)
      .map((pilot) => [pilot.assignedUnitId as string, pilot]),
  );

  for (const forceUnit of store.forceUnits) {
    const embeddedPilot = forceUnit.pilot;
    let pilot = forceUnit.assignedPilotId
      ? store.pilots.find((candidate) => candidate.id === forceUnit.assignedPilotId)
      : pilotByAssignedUnit.get(forceUnit.id);

    if (!pilot && embeddedPilot) {
      const force = forceById.get(forceUnit.forceId);
      const ownerId = force?.ownerId ?? "unknown";
      const now = new Date().toISOString();
      pilot = {
        id: crypto.randomUUID(),
        ownerId,
        campaignId: force?.campaignId,
        forceId: forceUnit.forceId,
        assignedUnitId: forceUnit.id,
        status: embeddedPilot.dead ? "Killed" : Number(embeddedPilot.wounds ?? 0) > 0 ? "Wounded" : "Assigned",
        name: embeddedPilot.name,
        gunnery: Number(embeddedPilot.gunnery ?? 4),
        piloting: Number(embeddedPilot.piloting ?? 5),
        wounds: Number(embeddedPilot.wounds ?? 0),
        kills: Number(forceUnit.kills ?? 0),
        experience: 0,
        isAlive: !embeddedPilot.dead,
        isCaptured: false,
        createdAt: now,
        updatedAt: now,
      };
      store.pilots.push(pilot);
      pilotByAssignedUnit.set(forceUnit.id, pilot);
    }

    if (pilot) {
      forceUnit.assignedPilotId = pilot.id;
      pilot.forceId = forceUnit.forceId;
      pilot.assignedUnitId = forceUnit.id;
      if (pilot.isAlive && !pilot.isCaptured && pilot.status !== "Wounded") pilot.status = "Assigned";
    }

    delete forceUnit.pilot;
  }

  return store;
}
function assertValidStoreForSave(store: StoreData): void {
  migrateEmbeddedPilots(normalizeStore(store));
}

async function readJsonFile(filePath: string): Promise<unknown> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function backupSplitStore(label = "bak"): Promise<void> {
  const existingKeys: CollectionKey[] = [];
  for (const key of COLLECTION_KEYS) {
    if (await pathExists(collectionPath(key))) existingKeys.push(key);
  }
  if (existingKeys.length === 0) return;

  const backupDir = path.join(STORE_DIR, "backups", `${label}-${createTimestamp()}`);
  await fs.mkdir(backupDir, { recursive: true });
  await Promise.all(
    existingKeys.map((key) =>
      fs.copyFile(collectionPath(key), path.join(backupDir, `${key}.json`)),
    ),
  );
}

async function writeSplitStore(store: StoreData): Promise<void> {
  migrateEmbeddedPilots(store);
  await fs.mkdir(STORE_DIR, { recursive: true });

  const stagingDir = path.join(
    STORE_DIR,
    `.store-write-${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  );
  await fs.mkdir(stagingDir, { recursive: true });

  try {
    await Promise.all(
      COLLECTION_KEYS.map((key) =>
        fs.writeFile(
          path.join(stagingDir, `${key}.json`),
          `${JSON.stringify(store[key] ?? [], null, 2)}\n`,
          "utf-8",
        ),
      ),
    );

    // Every file is fully written before any live collection is replaced.
    for (const key of COLLECTION_KEYS) {
      const stagedPath = path.join(stagingDir, `${key}.json`);
      const livePath = collectionPath(key);
      const replacementPath = `${livePath}.next`;
      await fs.copyFile(stagedPath, replacementPath);
      await fs.rename(replacementPath, livePath);
    }
  } finally {
    await fs.rm(stagingDir, { recursive: true, force: true });
  }
}

async function findLegacyStorePath(): Promise<string | undefined> {
  const candidates = [LEGACY_ACTIVE_STORE_PATH, LEGACY_PROJECT_STORE_PATH];
  const seen = new Set<string>();

  for (const candidate of candidates) {
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    if (await pathExists(candidate)) return candidate;
  }

  return undefined;
}

async function hasAnySplitCollection(): Promise<boolean> {
  for (const key of COLLECTION_KEYS) {
    if (await pathExists(collectionPath(key))) return true;
  }
  return false;
}

async function migrateLegacyStore(legacyPath: string): Promise<void> {
  let store: StoreData;
  try {
    store = normalizeStore(await readJsonFile(legacyPath));
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Legacy store file is invalid and was not migrated: ${error.message}`
        : "Legacy store file is invalid and was not migrated.",
    );
  }

  await writeSplitStore(store);

  const migratedBackupPath = `${legacyPath}.migrated.${createTimestamp()}`;
  await fs.copyFile(legacyPath, migratedBackupPath);
}

async function ensureSplitStoreExists(): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });

  if (!(await hasAnySplitCollection())) {
    const legacyPath = await findLegacyStorePath();
    if (legacyPath) {
      await migrateLegacyStore(legacyPath);
      return;
    }

    await writeSplitStore(DEFAULT_STORE);
    return;
  }

  // Optional collections introduced after an installation was created are safe
  // to initialize as empty. Required collections must never be silently replaced.
  for (const key of OPTIONAL_ARRAY_KEYS) {
    if (!(await pathExists(collectionPath(key)))) {
      await fs.writeFile(collectionPath(key), "[]\n", "utf-8");
    }
  }
}

async function loadSplitStore(): Promise<StoreData> {
  const rawStore: Record<string, unknown> = {};

  for (const key of COLLECTION_KEYS) {
    const filePath = collectionPath(key);
    if (!(await pathExists(filePath))) {
      if ((OPTIONAL_ARRAY_KEYS as readonly string[]).includes(key)) {
        rawStore[key] = [];
        continue;
      }
      throw new Error(`Split store is missing required file "${key}.json".`);
    }

    try {
      const value = await readJsonFile(filePath);
      if (!Array.isArray(value)) {
        throw new Error("top-level JSON value must be an array");
      }
      rawStore[key] = value;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Store collection "${key}.json" is invalid: ${error.message}`
          : `Store collection "${key}.json" is invalid.`,
      );
    }
  }

  return normalizeStore(rawStore);
}

export async function loadStore(): Promise<StoreData> {
  await ensureSplitStoreExists();

  try {
    return await loadSplitStore();
  } catch (error) {
    await backupSplitStore("invalid").catch(() => undefined);
    throw error;
  }
}

export async function saveStore(store: StoreData): Promise<void> {
  assertValidStoreForSave(store);

  const queuedSave = saveQueue.then(async () => {
    await ensureSplitStoreExists();
    await backupSplitStore();
    await writeSplitStore(store);
  });

  // Keep later saves running even if this save fails, while still returning the
  // current failure to its caller.
  saveQueue = queuedSave.catch(() => undefined);
  return queuedSave;
}

export function getStorePath(): string {
  return STORE_DIR;
}

export function getStoreCollectionPath(key: CollectionKey): string {
  return collectionPath(key);
}
