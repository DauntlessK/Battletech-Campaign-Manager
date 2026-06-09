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
  pilots: [],
  unitDamage: [],
  unitLocationDamage: [],
  unitEquipmentDamage: [],
  unitAmmoState: [],
  repairOrders: [],
  battles: [],
  objectives: [],
  resourceAccounts: [],
  resourceTransactions: [],
  authTokens: [],
  notifications: [],
  friendRequests: [],
  unassignedPilots: [],
  systemSettings: [{ id: "global", repairEstimateMultiplier: 1.5, unitsPerTechnician: 2, defaultTurnLengthDays: 5, workDayMinutes: 480, requisitionsPerTurn: 10, techExperience: "Regular" }],
};

const COLLECTION_KEYS = [
  "users",
  "campaigns",
  "campaignParticipants",
  "forces",
  "forceUnits",
  "pilots",
  "unitDamage",
  "unitLocationDamage",
  "unitEquipmentDamage",
  "unitAmmoState",
  "repairOrders",
  "battles",
  "objectives",
  "resourceAccounts",
  "resourceTransactions",
  "authTokens",
  "notifications",
  "friendRequests",
  "unassignedPilots",
  "systemSettings",
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

const OPTIONAL_ARRAY_KEYS: readonly CollectionKey[] = ["notifications", "friendRequests", "unassignedPilots", "pilots", "unitDamage", "unitLocationDamage", "unitEquipmentDamage", "unitAmmoState", "repairOrders", "systemSettings"];

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


function slugKey(value: string): string {
  return String(value || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function findCampaignIdForForce(store: any, forceId?: string): string | undefined {
  if (!forceId) return undefined;
  const force = (store.forces ?? []).find((entry: any) => entry.id === forceId);
  return force?.campaignId;
}

function findOwnerIdForForce(store: any, forceId?: string): string | undefined {
  if (!forceId) return undefined;
  const force = (store.forces ?? []).find((entry: any) => entry.id === forceId);
  return force?.ownerId;
}

function buildDamageTablesFromOverlay(store: any, forceUnit: any, overlay: any): void {
  if (!forceUnit?.id || !overlay) return;
  store.unitDamage ??= [];
  store.unitLocationDamage ??= [];
  store.unitEquipmentDamage ??= [];
  store.unitAmmoState ??= [];
  store.repairOrders ??= [];

  store.unitDamage = store.unitDamage.filter((entry: any) => entry.forceUnitId !== forceUnit.id);
  store.unitLocationDamage = store.unitLocationDamage.filter((entry: any) => entry.forceUnitId !== forceUnit.id);
  store.unitEquipmentDamage = store.unitEquipmentDamage.filter((entry: any) => entry.forceUnitId !== forceUnit.id);
  store.unitAmmoState = store.unitAmmoState.filter((entry: any) => entry.forceUnitId !== forceUnit.id);

  const summary = overlay.damageSummary ?? {};
  const locations = overlay.detailed?.locations ?? {};
  const ammoSpent = overlay.detailed?.ammoSpent ?? {};
  const hasDamage =
    Object.values(summary).some((value: any) => Number(value ?? 0) > 0) ||
    Object.values(locations).some((entry: any) =>
      Number(entry?.armorDamage ?? 0) > 0 ||
      Number(entry?.rearArmorDamage ?? 0) > 0 ||
      Number(entry?.structureDamage ?? 0) > 0 ||
      Boolean(entry?.missing || entry?.destroyed),
    ) ||
    Object.values(ammoSpent).some((value: any) => Number(value ?? 0) > 0) ||
    !["ready", "available"].includes(String(overlay.status ?? forceUnit.status ?? "").toLowerCase());
  if (!hasDamage) return;

  const now = new Date().toISOString();
  const damageId = `damage-${forceUnit.id}`;
  store.unitDamage.push({
    id: damageId,
    campaignId: findCampaignIdForForce(store, forceUnit.forceId),
    forceId: forceUnit.forceId,
    forceUnitId: forceUnit.id,
    status: overlay.status ?? forceUnit.status,
    repairComplexity: overlay.repairComplexity,
    armorDamageTotal: Number(summary.armor ?? 0),
    rearArmorDamageTotal: Object.values(locations).reduce((sum: number, entry: any) => sum + Number(entry?.rearArmorDamage ?? 0), 0),
    structureDamageTotal: Number(summary.internal ?? 0),
    engineHits: Number(summary.engineHits ?? 0),
    gyroHits: Number(summary.gyroHits ?? 0),
    ammoSpentTotal: Number(summary.ammo ?? Object.values(ammoSpent).reduce((sum: number, value: any) => sum + Number(value ?? 0), 0)),
    limbs: Number(summary.limbs ?? 0),
    weapons: Number(summary.weapons ?? 0),
    components: Number(summary.components ?? 0),
    notes: overlay.detailed?.notes,
    createdAt: now,
    updatedAt: now,
  });

  Object.entries(locations).forEach(([locationKey, value]: [string, any]) => {
    if (!value) return;
    store.unitLocationDamage.push({
      id: `locdmg-${forceUnit.id}-${slugKey(locationKey)}`,
      unitDamageId: damageId,
      forceUnitId: forceUnit.id,
      locationId: locationKey,
      locationName: locationKey,
      armorDamage: Number(value.armorDamage ?? 0),
      rearArmorDamage: Number(value.rearArmorDamage ?? 0),
      structureDamage: Number(value.structureDamage ?? 0),
      isMissing: Boolean(value.missing),
      isDestroyed: Boolean(value.destroyed),
      damagedSlots: [...(value.damagedSlots ?? [])],
      destroyedSlots: [...(value.destroyedSlots ?? [])],
    });
  });

  Object.entries(ammoSpent).forEach(([ammoTypeId, shots]: [string, any]) => {
    const shotsSpent = Math.max(0, Number(shots ?? 0));
    if (!shotsSpent) return;
    store.unitAmmoState.push({
      id: `ammo-${forceUnit.id}-${slugKey(ammoTypeId)}`,
      forceUnitId: forceUnit.id,
      unitDamageId: damageId,
      ammoTypeId,
      shotsSpent,
      updatedAt: now,
    });
  });
}

function migrateLegacyEmbeddedState(store: any): void {
  store.pilots ??= [];
  store.unitDamage ??= [];
  store.unitLocationDamage ??= [];
  store.unitEquipmentDamage ??= [];
  store.unitAmmoState ??= [];

  const pilotsByAssignedUnit = new Set((store.pilots ?? []).map((pilot: any) => pilot.assignedUnitId).filter(Boolean));
  for (const forceUnit of store.forceUnits ?? []) {
    if (forceUnit.pilot && !forceUnit.assignedPilotId && !pilotsByAssignedUnit.has(forceUnit.id)) {
      const now = new Date().toISOString();
      const pilotId = crypto.randomUUID();
      forceUnit.assignedPilotId = pilotId;
      store.pilots.push({
        id: pilotId,
        ownerId: findOwnerIdForForce(store, forceUnit.forceId) ?? "unknown",
        campaignId: findCampaignIdForForce(store, forceUnit.forceId),
        forceId: forceUnit.forceId,
        assignedUnitId: forceUnit.id,
        status: Number(forceUnit.pilot?.wounds ?? 0) > 0 ? "Wounded" : "Assigned",
        name: forceUnit.pilot?.name,
        gunnery: Number(forceUnit.pilot?.gunnery ?? 4),
        piloting: Number(forceUnit.pilot?.piloting ?? 5),
        wounds: Number(forceUnit.pilot?.wounds ?? 0),
        kills: Number(forceUnit.kills ?? 0),
        experience: 0,
        isAlive: !forceUnit.pilot?.dead,
        isCaptured: false,
        createdAt: now,
        updatedAt: now,
      });
      pilotsByAssignedUnit.add(forceUnit.id);
    }

    const embeddedDamage = forceUnit.currentDamage ?? forceUnit.damageOverlay ?? forceUnit.damageState;
    if (embeddedDamage && !(store.unitDamage ?? []).some((entry: any) => entry.forceUnitId === forceUnit.id)) {
      buildDamageTablesFromOverlay(store, forceUnit, embeddedDamage);
    }

    delete forceUnit.pilot;
    delete forceUnit.currentDamage;
    delete forceUnit.damageOverlay;
    delete forceUnit.damageState;
  }
}

function normalizeStore(raw: unknown): StoreData {
  if (!isRecord(raw)) {
    throw new Error("Store data is not a JSON object.");
  }

  const normalized = { ...DEFAULT_STORE, ...raw } as StoreData;
  migrateLegacyEmbeddedState(normalized as any);

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

  return normalized;
}

function assertValidStoreForSave(store: StoreData): void {
  normalizeStore(store);
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
