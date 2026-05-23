import crypto from "crypto";
import { loadStore, saveStore } from "./storageService";
import { getUnitDefinitionById } from "./unitLibraryService";
import type { CampaignUnitSnapshot, Force, ForceUnit } from "../types/models";
import type { Unit } from "../types/unit";

export async function createForce(
  ownerId: string,
  name: string,
  unitIds: string[] = [],
  description?: string,
  era?: string,
  rulesLevel?: string,
  totalBV?: number,
  faction?: string,
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
    faction,
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

export async function getForceById(forceId: string): Promise<Force | undefined> {
  const store = await loadStore();
  return store.forces.find((force) => force.id === forceId);
}

function buildUnitSnapshot(unit: Unit): CampaignUnitSnapshot {
  return {
    id: unit.id,
    name: unit.name,
    model: unit.model,
    chassis: unit.chassis,
    type: unit.type,
    techBase: unit.techBase,
    era: unit.era,
    year: unit.year,
    tonnage: unit.tonnage,
    weightClass: unit.weightClass,
    totalBV: unit.totalBV,
    role: unit.role,
    weapons: unit.weapons.map((weapon) => ({
      name: weapon.name,
      damage: weapon.damage,
      heat: weapon.heat,
      location: weapon.location,
      ammo: weapon.ammo,
      shots: weapon.shots,
    })),
    locations: unit.locations.map((location) => ({
      id: location.id,
      name: location.name,
      armor: location.armor,
      rearArmor: location.rearArmor,
      structure: location.structure,
      slots: location.slots.map((slot) => ({
        slot: slot.slot,
        item: slot.item,
        type: slot.type,
      })),
    })),
  };
}

export async function addUnitToForce(forceId: string, baseUnitId: string, ownerId: string): Promise<ForceUnit> {
  const store = await loadStore();
  const force = store.forces.find((f) => f.id === forceId);
  if (!force) throw new Error("Force not found.");
  if (force.ownerId !== ownerId) throw new Error("You do not have permission to edit this force.");
  if (force.origin !== "UserCreated") throw new Error("Units can only be added to original user forces.");
  if (force.unitIds.includes(baseUnitId)) throw new Error("This unit is already part of the force.");

  const unit = await getUnitDefinitionById(baseUnitId);
  if (!unit) throw new Error("Unit definition not found.");

  force.unitIds = [...force.unitIds, baseUnitId];
  force.updatedAt = new Date().toISOString();

  const unitSnapshot = buildUnitSnapshot(unit);
  const newForceUnit: ForceUnit = {
    id: crypto.randomUUID(),
    forceId: force.id,
    baseUnitId,
    snapshot: unitSnapshot,
    currentBV: unitSnapshot.totalBV,
    status: "Available",
    kills: 0,
    isDestroyed: false,
  };

  store.forceUnits.push(newForceUnit);
  await saveStore(store);

  return newForceUnit;
}
