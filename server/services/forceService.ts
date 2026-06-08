import crypto from "crypto";
import { loadStore, saveStore } from "./storageService";
import { getUnitDefinitionById } from "./unitLibraryService";
import { randomPilotName } from "../data/pilotNames";
import type { CampaignUnitSnapshot, Force, ForceUnit } from "../types/models";
import type { Unit } from "../types/unit";

function withForceUnits(force: Force, forceUnits: ForceUnit[]): Force {
  return {
    ...force,
    forceUnits: forceUnits
      .filter((unit) => unit.forceId === force.id)
      .map((unit, index) => ({
        ...unit,
        teamNumber: unit.teamNumber ?? 1,
        sortOrder: unit.sortOrder ?? index,
        pilot: unit.pilot ?? { name: randomPilotName(), gunnery: 4, piloting: 5 },
      }))
      .sort((a, b) => (a.teamNumber ?? 1) - (b.teamNumber ?? 1) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
  };
}

function refreshForceUnitIds(force: Force, forceUnits: ForceUnit[]) {
  force.unitIds = forceUnits
    .filter((unit) => unit.forceId === force.id)
    .sort((a, b) => (a.teamNumber ?? 1) - (b.teamNumber ?? 1) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((unit) => unit.baseUnitId);
}

function getRulesRank(value?: string) {
  if (!value || value === "All" || value === "Any" || value === "Unknown") return null;
  const normalized = value.toLowerCase();
  const order = ["introductory", "standard", "advanced", "experimental", "unofficial"];
  const index = order.findIndex((entry) => normalized.includes(entry));
  return index >= 0 ? index : null;
}

function getEraRank(value?: string) {
  if (!value || value === "All" || value === "Any" || value === "Unknown") return null;
  const normalized = value.toLowerCase();
  if (normalized.includes("succession war")) return 2;
  if (normalized.includes("republic")) return 6;
  const eraOrder = ["age of war", "star league", "clan invasion", "civil war", "jihad", "dark age", "ilclan"];
  const index = eraOrder.findIndex((era) => normalized.includes(era));
  if (index < 0) return null;
  return index >= 2 ? index + 1 : index;
}

function getUnitBV(unit: Unit) {
  return Number(unit.totalBV ?? 0);
}

function getForceUnitBV(forceUnit: ForceUnit) {
  return Number(forceUnit.currentBV ?? forceUnit.snapshot?.totalBV ?? 0);
}

function teamBVTotal(forceUnits: ForceUnit[], teamNumber: number) {
  return forceUnits
    .filter((forceUnit) => (forceUnit.teamNumber ?? 1) === teamNumber)
    .reduce((total, forceUnit) => total + getForceUnitBV(forceUnit), 0);
}

function validateUnitAgainstForce(force: Force, unit: Unit, existingForceUnits: ForceUnit[], targetTeamNumber?: number) {
  const reasons: string[] = [];
  const unitBV = getUnitBV(unit);
  const forceBVLimit = Number(force.totalBV ?? 0);
  const currentBV = existingForceUnits.reduce((total, forceUnit) => total + getForceUnitBV(forceUnit), 0);

  if (forceBVLimit > 0 && currentBV + unitBV > forceBVLimit) {
    reasons.push(`Adding this unit would exceed the force BV limit by ${(currentBV + unitBV - forceBVLimit).toLocaleString("en-US")} BV.`);
  }

  if (force.forConquest) {
    const teamBVLimit = Number(force.combatTeamBV ?? 0);
    const teamNumber = targetTeamNumber ?? 1;
    const currentTeamBV = teamBVTotal(existingForceUnits, teamNumber);
    if (teamBVLimit > 0 && currentTeamBV + unitBV > teamBVLimit) {
      reasons.push(`Adding this unit would exceed Team ${teamNumber}'s BV limit by ${(currentTeamBV + unitBV - teamBVLimit).toLocaleString("en-US")} BV.`);
    }
  }

  const forceRulesRank = getRulesRank(force.rulesLevel);
  const unitRulesRank = getRulesRank(unit.rulesLevel);
  if (forceRulesRank !== null && unitRulesRank !== null && unitRulesRank > forceRulesRank) {
    reasons.push(`${unit.rulesLevel} units are above this force's ${force.rulesLevel} rules level.`);
  }

  const forceEraRank = getEraRank(force.era);
  const unitEraRank = getEraRank(unit.era);
  if (forceEraRank !== null && unitEraRank !== null && unitEraRank > forceEraRank) {
    reasons.push(`${unit.era || "This unit's era"} is later than this force's ${force.era} era.`);
  }

  if (reasons.length) throw new Error(reasons.join(" "));
}

function validateForceUnitRoster(force: Force, forceUnits: ForceUnit[]) {
  const reasons: string[] = [];
  const forceBVLimit = Number(force.totalBV ?? 0);
  const totalBV = forceUnits.reduce((total, forceUnit) => total + getForceUnitBV(forceUnit), 0);

  if (forceBVLimit > 0 && totalBV > forceBVLimit) {
    reasons.push(`This force exceeds its total BV limit by ${(totalBV - forceBVLimit).toLocaleString("en-US")} BV.`);
  }

  if (force.forConquest) {
    const teamBVLimit = Number(force.combatTeamBV ?? 0);
    const teamCount = Math.max(1, Number(force.combatTeamCount ?? 1));
    if (teamBVLimit > 0) {
      for (let teamNumber = 1; teamNumber <= teamCount; teamNumber += 1) {
        const total = teamBVTotal(forceUnits, teamNumber);
        if (total > teamBVLimit) {
          reasons.push(`Team ${teamNumber} exceeds its BV limit by ${(total - teamBVLimit).toLocaleString("en-US")} BV.`);
        }
      }
    }
  }

  if (reasons.length) throw new Error(reasons.join(" "));
}

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

  return withForceUnits(force, store.forceUnits);
}

export async function listForcesForUser(ownerId: string): Promise<Force[]> {
  const store = await loadStore();
  return store.forces
    .filter((f) => f.ownerId === ownerId && f.status !== "Deleted")
    .map((force) => withForceUnits(force, store.forceUnits));
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

  const originalUnits = store.forceUnits.filter((u) => u.forceId === original.id);
  for (const u of originalUnits) {
    const newUnit: ForceUnit = {
      ...u,
      id: crypto.randomUUID(),
      forceId: copy.id,
      pilot: u.pilot ?? { name: randomPilotName(), gunnery: 4, piloting: 5 },
    };
    store.forceUnits.push(newUnit);
  }

  refreshForceUnitIds(copy, store.forceUnits);
  store.forces.push(copy);
  await saveStore(store);

  return withForceUnits(copy, store.forceUnits);
}

export async function getForceById(forceId: string): Promise<Force | undefined> {
  const store = await loadStore();
  const force = store.forces.find((candidate) => candidate.id === forceId);
  return force ? withForceUnits(force, store.forceUnits) : undefined;
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

export async function addUnitToForce(forceId: string, baseUnitId: string, ownerId: string, teamNumber?: number): Promise<Force> {
  const store = await loadStore();
  const force = store.forces.find((f) => f.id === forceId);
  if (!force) throw new Error("Force not found.");
  if (force.ownerId !== ownerId) throw new Error("You do not have permission to edit this force.");
  if (force.origin !== "UserCreated") throw new Error("Units can only be added to original user forces.");

  const normalizedTeam = force.forConquest ? Math.max(1, Math.min(Number(force.combatTeamCount ?? 1), Number(teamNumber ?? 0))) : undefined;
  if (force.forConquest && !normalizedTeam) throw new Error("Choose which team this unit should be added to.");

  const unit = await getUnitDefinitionById(baseUnitId);
  if (!unit) throw new Error("Unit definition not found.");

  validateUnitAgainstForce(force, unit, store.forceUnits.filter((entry) => entry.forceId === force.id), normalizedTeam ?? 1);

  const unitSnapshot = buildUnitSnapshot(unit);
  const sameTeamUnits = store.forceUnits.filter((entry) => entry.forceId === force.id && (entry.teamNumber ?? 1) === (normalizedTeam ?? 1));
  const nextSortOrder = sameTeamUnits.length ? Math.max(...sameTeamUnits.map((entry) => entry.sortOrder ?? 0)) + 1 : 0;

  const newForceUnit: ForceUnit = {
    id: crypto.randomUUID(),
    forceId: force.id,
    baseUnitId,
    snapshot: unitSnapshot,
    currentBV: unitSnapshot.totalBV,
    status: "Available",
    kills: 0,
    isDestroyed: false,
    teamNumber: normalizedTeam,
    sortOrder: nextSortOrder,
    pilot: { name: randomPilotName(), gunnery: 4, piloting: 5 },
  };

  store.forceUnits.push(newForceUnit);
  refreshForceUnitIds(force, store.forceUnits);
  force.updatedAt = new Date().toISOString();
  await saveStore(store);

  return withForceUnits(force, store.forceUnits);
}

export async function updateForce(
  forceId: string,
  ownerId: string,
  updates: { name?: string; description?: string; forceUnits?: Partial<ForceUnit>[] }
): Promise<Force> {
  const store = await loadStore();
  const force = store.forces.find((candidate) => candidate.id === forceId);
  if (!force) throw new Error("Force not found.");
  if (force.ownerId !== ownerId) throw new Error("You do not have permission to edit this force.");
  if (force.origin !== "UserCreated") throw new Error("Only original user forces can be edited here.");

  if (updates.name !== undefined) {
    const name = updates.name.trim();
    if (!name) throw new Error("Force name is required.");
    force.name = name;
  }
  if (updates.description !== undefined) force.description = updates.description;

  if (updates.forceUnits) {
    const maxTeamNumber = Math.max(1, Number(force.combatTeamCount ?? 1));
    const sanitizedForceUnits: ForceUnit[] = [];

    for (const [index, incoming] of updates.forceUnits.entries()) {
      const baseUnitId = typeof incoming.baseUnitId === "string" ? incoming.baseUnitId : incoming.snapshot?.id;
      if (!baseUnitId) continue;

      const existing = store.forceUnits.find((candidate) => candidate.id === incoming.id && candidate.forceId === forceId);
      const sourceUnit = existing?.snapshot ? null : await getUnitDefinitionById(baseUnitId).catch(() => null);
      const snapshot = existing?.snapshot ?? (sourceUnit
        ? {
            id: sourceUnit.id,
            name: sourceUnit.name,
            model: sourceUnit.model,
            chassis: sourceUnit.chassis,
            type: sourceUnit.type as CampaignUnitSnapshot["type"],
            techBase: sourceUnit.techBase,
            era: sourceUnit.era,
            year: sourceUnit.year,
            tonnage: sourceUnit.tonnage,
            weightClass: sourceUnit.weightClass,
            totalBV: Number(sourceUnit.totalBV ?? sourceUnit.bv ?? 0),
            role: sourceUnit.role,
            weapons: sourceUnit.weapons ?? [],
            locations: sourceUnit.locations ?? [],
          }
        : incoming.snapshot);

      if (!snapshot) continue;

      const incomingTeamNumber = Number(incoming.teamNumber ?? existing?.teamNumber ?? 1);
      const normalizedTeamNumber = force.forConquest ? Math.max(1, Math.min(maxTeamNumber, incomingTeamNumber)) : 1;
      const incomingPilot = incoming.pilot ?? existing?.pilot ?? { name: randomPilotName(), gunnery: 4, piloting: 5 };

      sanitizedForceUnits.push({
        id: typeof incoming.id === "string" && !incoming.id.startsWith("draft-") ? incoming.id : crypto.randomUUID(),
        forceId,
        baseUnitId,
        snapshot,
        currentBV: Number(incoming.currentBV ?? existing?.currentBV ?? snapshot.totalBV ?? 0),
        status: incoming.status ?? existing?.status ?? "Available",
        kills: Number(incoming.kills ?? existing?.kills ?? 0),
        damageDescription: incoming.damageDescription ?? existing?.damageDescription,
        isDestroyed: Boolean(incoming.isDestroyed ?? existing?.isDestroyed ?? false),
        assignedPilotId: incoming.assignedPilotId ?? existing?.assignedPilotId,
        teamNumber: normalizedTeamNumber,
        sortOrder: Number(incoming.sortOrder ?? index),
        pilot: {
          name: incomingPilot.name || randomPilotName(),
          gunnery: Number(incomingPilot.gunnery ?? 4),
          piloting: Number(incomingPilot.piloting ?? 5),
        },
      });
    }

    validateForceUnitRoster(force, sanitizedForceUnits);

    store.forceUnits = store.forceUnits.filter((forceUnit) => forceUnit.forceId !== forceId).concat(sanitizedForceUnits);
    refreshForceUnitIds(force, store.forceUnits);
  }

  force.updatedAt = new Date().toISOString();
  await saveStore(store);
  return withForceUnits(force, store.forceUnits);
}

export async function deleteForce(forceId: string, ownerId: string): Promise<void> {
  const store = await loadStore();
  const force = store.forces.find((candidate) => candidate.id === forceId);
  if (!force) throw new Error("Force not found.");
  if (force.ownerId !== ownerId) throw new Error("You do not have permission to delete this force.");
  if (force.origin !== "UserCreated") throw new Error("Only original user forces can be deleted here.");
  force.status = "Deleted";
  force.updatedAt = new Date().toISOString();
  await saveStore(store);
}

export async function updateForceUnit(forceId: string, forceUnitId: string, ownerId: string, updates: { teamNumber?: number; sortOrder?: number; pilotName?: string; gunnery?: number; piloting?: number }): Promise<Force> {
  const store = await loadStore();
  const force = store.forces.find((candidate) => candidate.id === forceId);
  if (!force) throw new Error("Force not found.");
  if (force.ownerId !== ownerId) throw new Error("You do not have permission to edit this force.");
  if (force.origin !== "UserCreated") throw new Error("Only original user forces can be edited here.");

  const forceUnit = store.forceUnits.find((candidate) => candidate.id === forceUnitId && candidate.forceId === forceId);
  if (!forceUnit) throw new Error("Force unit not found.");

  if (updates.teamNumber !== undefined) {
    forceUnit.teamNumber = Math.max(1, Math.min(Number(force.combatTeamCount ?? 1), Number(updates.teamNumber)));
  }
  if (updates.sortOrder !== undefined) forceUnit.sortOrder = Number(updates.sortOrder);
  if (updates.pilotName !== undefined || updates.gunnery !== undefined || updates.piloting !== undefined) {
    forceUnit.pilot = {
      name: updates.pilotName ?? forceUnit.pilot?.name ?? randomPilotName(),
      gunnery: updates.gunnery !== undefined ? Number(updates.gunnery) : forceUnit.pilot?.gunnery ?? 4,
      piloting: updates.piloting !== undefined ? Number(updates.piloting) : forceUnit.pilot?.piloting ?? 5,
    };
  }

  validateForceUnitRoster(force, store.forceUnits.filter((entry) => entry.forceId === force.id));
  refreshForceUnitIds(force, store.forceUnits);
  force.updatedAt = new Date().toISOString();
  await saveStore(store);
  return withForceUnits(force, store.forceUnits);
}

function chaosRepairCostForUnit(forceUnit: ForceUnit): number {
  const weightClass = String(forceUnit.snapshot?.weightClass ?? "").toLowerCase();
  const crippled = String(forceUnit.status ?? "").toLowerCase() === "crippled";
  if (weightClass === "light") return crippled ? 25 : 15;
  if (weightClass === "medium") return crippled ? 45 : 30;
  if (weightClass === "heavy") return crippled ? 75 : 60;
  return crippled ? 100 : 80;
}

export async function repairChaosForceUnit(
  forceId: string,
  forceUnitId: string,
  campaignId: string,
  userId: string,
): Promise<{ force: Force; cost: number; remainingWarchest: number }> {
  const store = await loadStore();
  const force = store.forces.find((entry) => entry.id === forceId);
  if (!force || force.ownerId !== userId || force.campaignId !== campaignId) {
    throw new Error("Campaign force not found.");
  }
  const campaign = store.campaigns.find((entry) => entry.id === campaignId);
  if (!campaign || String(campaign.settings?.type ?? "") !== "Chaos") {
    throw new Error("This repair action is only available in Chaos campaigns.");
  }
  const forceUnit = store.forceUnits.find((entry) => entry.id === forceUnitId && entry.forceId === forceId);
  if (!forceUnit) throw new Error("Unit not found in this force.");
  if (forceUnit.isDestroyed || String(forceUnit.status ?? "").toLowerCase() === "destroyed") {
    throw new Error("Destroyed units cannot be repaired in Chaos campaigns.");
  }

  const cost = chaosRepairCostForUnit(forceUnit);
  let account = store.resourceAccounts.find((entry) => entry.campaignId === campaignId && entry.userId === userId);
  if (!account) {
    const starting = Number((campaign.settings as any)?.startingResources?.Warchest ?? 0);
    account = { id: crypto.randomUUID(), campaignId, userId, balances: { Warchest: starting }, lastUpdatedAt: new Date().toISOString() };
    store.resourceAccounts.push(account);
  }
  const available = Number(account.balances.Warchest ?? 0);
  if (available < cost) throw new Error(`Insufficient WP. This repair costs ${cost} WP and only ${available} WP is available.`);

  account.balances.Warchest = available - cost;
  account.lastUpdatedAt = new Date().toISOString();
  store.resourceTransactions.push({
    id: crypto.randomUUID(),
    campaignId,
    userId,
    type: "Warchest",
    amount: -cost,
    reason: `Chaos repair: ${forceUnit.snapshot?.name ?? forceUnit.baseUnitId}`,
    createdAt: new Date().toISOString(),
  });

  forceUnit.currentBV = Number(forceUnit.snapshot?.totalBV ?? forceUnit.currentBV ?? 0);
  forceUnit.status = "Ready" as any;
  forceUnit.isDestroyed = false;
  delete (forceUnit as any).currentDamage;
  delete (forceUnit as any).damageOverlay;
  delete (forceUnit as any).damageState;
  force.updatedAt = new Date().toISOString();
  await saveStore(store);

  return {
    force: withForceUnits(force, store.forceUnits),
    cost,
    remainingWarchest: Number(account.balances.Warchest ?? 0),
  };
}


export async function quoteForceUnitDisposition(forceId: string, forceUnitId: string, campaignId: string, userId: string, action: "salvage" | "sell") {
  const store = await loadStore();
  const force = store.forces.find((f) => f.id === forceId);
  const campaign = store.campaigns.find((c) => c.id === campaignId);
  const unit = store.forceUnits.find((u) => u.id === forceUnitId && u.forceId === forceId);
  if (!force || !campaign || !unit) throw new Error("Campaign unit not found.");
  if (force.ownerId !== userId || force.campaignId !== campaignId) throw new Error("You do not have permission to manage this unit.");
  const isChaos = campaign.settings?.type === "Chaos";
  const damaged = unit.isDestroyed || !["Ready", "Available"].includes(String(unit.status ?? "Ready"));
  if (isChaos && action === "sell" && damaged) throw new Error("Damaged or destroyed Chaos units cannot be sold.");
  if (isChaos) {
    const tonnage = Number(unit.snapshot?.tonnage ?? 0);
    return { action, resourceType: "Warchest" as const, amount: action === "sell" ? tonnage : Math.floor(tonnage / 2), bonus: null };
  }
  const definition = await getUnitDefinitionById(unit.baseUnitId).catch(() => null);
  const originalCost = Number(definition?.costCBills ?? 0);
  const amount = action === "salvage" ? Math.floor(originalCost * 0.10) : Math.floor(originalCost * (damaged ? 0.125 : 0.75));
  return { action, resourceType: "CBills" as const, amount, bonus: action === "salvage" ? "Future repair bonus (not yet implemented)" : null };
}

export async function disposeForceUnit(forceId: string, forceUnitId: string, campaignId: string, userId: string, action: "salvage" | "sell") {
  const quote = await quoteForceUnitDisposition(forceId, forceUnitId, campaignId, userId, action);
  const store = await loadStore();
  const force = store.forces.find((f) => f.id === forceId)!;
  const index = store.forceUnits.findIndex((u) => u.id === forceUnitId && u.forceId === forceId);
  if (index < 0) throw new Error("Campaign unit not found.");
  const unit = store.forceUnits[index];
  let account = store.resourceAccounts.find((a) => a.campaignId === campaignId && a.userId === userId);
  if (!account) {
    const campaign = store.campaigns.find((c) => c.id === campaignId);
    const starting = Number((campaign?.settings as any)?.startingResources?.[quote.resourceType] ?? 0);
    account = { id: crypto.randomUUID(), campaignId, userId, balances: { [quote.resourceType]: starting }, lastUpdatedAt: new Date().toISOString() };
    store.resourceAccounts.push(account);
  }
  account.balances[quote.resourceType] = Number(account.balances[quote.resourceType] ?? 0) + quote.amount;
  account.lastUpdatedAt = new Date().toISOString();
  store.resourceTransactions.push({ id: crypto.randomUUID(), campaignId, userId, type: quote.resourceType, amount: quote.amount, reason: `${action === "sell" ? "Sold" : "Salvaged"} ${unit.snapshot?.name ?? unit.baseUnitId}`, createdAt: new Date().toISOString() });
  const pilot = store.pilots.find((p: any) => p.assignedUnitId === unit.id);
  if (pilot) { pilot.assignedUnitId = undefined; pilot.status = pilot.wounds > 0 ? "Wounded" : "Unassigned"; pilot.updatedAt = new Date().toISOString(); }
  store.forceUnits.splice(index, 1);
  refreshForceUnitIds(force, store.forceUnits);
  force.updatedAt = new Date().toISOString();
  await saveStore(store);
  return { force: withForceUnits(force, store.forceUnits), ...quote, balance: account.balances[quote.resourceType] };
}
