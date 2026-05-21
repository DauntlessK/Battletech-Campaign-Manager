import crypto from "crypto";
import { loadStore, saveStore } from "./storageService";
import type { Force, ForceUnit } from "../types/models";

export async function createForce(
  ownerId: string,
  name: string,
  unitIds: string[] = [],
  description?: string,
  era?: string,
  rulesLevel?: string,
  totalBV?: number,
  forConquest?: boolean,
  combatTeamCount?: number,
  combatTeamBV?: number
): Promise<Force> {
  const store = await loadStore();

  const force: Force = {
    id: crypto.randomUUID(),
    ownerId,
    name,
    description,
    era,
    rulesLevel,
    totalBV,
    currencyCBills: undefined,
    forConquest,
    combatTeamCount,
    combatTeamBV,
    unitIds,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    origin: "UserCreated",
    status: "Active",
  } as Force;

  store.forces.push(force);
  await saveStore(store);

  return force;
}

export async function listForcesForUser(ownerId: string): Promise<Force[]> {
  const store = await loadStore();
  return store.forces.filter((f) => f.ownerId === ownerId && f.status !== "Deleted");
}

export async function assignForceToCampaign(originalForceId: string, campaignId: string, assignedOwnerId: string): Promise<Force> {
  const store = await loadStore();

  const original = store.forces.find((f) => f.id === originalForceId);
  if (!original) throw new Error("Original force not found");

  const copy: Force = {
    ...original,
    id: crypto.randomUUID(),
    ownerId: assignedOwnerId,
    campaignId,
    originalForceId: original.id,
    origin: "CampaignCopy",
    status: "Assigned",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Force;

  // Deep-copy unit entries for campaign (if any exist)
  const originalUnits = store.forceUnits.filter((u) => u.forceId === original.id);
  const newUnitIds: string[] = [];

  for (const u of originalUnits) {
    const newUnit: ForceUnit = {
      ...u,
      id: crypto.randomUUID(),
      forceId: copy.id,
    };
    store.forceUnits.push(newUnit);
    newUnitIds.push(newUnit.id);
  }

  // If original had unitIds referencing base units, keep them
  copy.unitIds = original.unitIds ? [...original.unitIds] : [];

  store.forces.push(copy);
  await saveStore(store);

  return copy;
}
