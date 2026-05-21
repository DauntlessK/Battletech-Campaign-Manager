import crypto from "crypto";
import { loadStore, saveStore } from "./storageService";
import type { Objective, ObjectiveControl } from "../types/models";

export async function createObjective(campaignId: string, payload: Partial<Objective>): Promise<Objective> {
  const store = await loadStore();
  const obj: Objective = {
    id: crypto.randomUUID(),
    campaignId,
    name: payload.name ?? "Unnamed Objective",
    description: payload.description,
    type: payload.type ?? "Custom",
    controlType: payload.controlType ?? "Binary",
    currentOwnerId: payload.currentOwnerId,
    currentControl: payload.currentControl as ObjectiveControl[] | undefined,
    bonusDescription: payload.bonusDescription,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.objectives.push(obj);
  await saveStore(store);
  return obj;
}

export async function getObjectiveById(id: string): Promise<Objective | null> {
  const store = await loadStore();
  return store.objectives.find((o) => o.id === id) ?? null;
}

export async function listObjectivesForCampaign(campaignId: string): Promise<Objective[]> {
  const store = await loadStore();
  return store.objectives.filter((o) => o.campaignId === campaignId);
}

export async function updateObjective(id: string, updates: Partial<Objective>): Promise<Objective> {
  const store = await loadStore();
  const o = store.objectives.find((x) => x.id === id);
  if (!o) throw new Error("Objective not found");
  Object.assign(o, updates, { updatedAt: new Date().toISOString() });
  await saveStore(store);
  return o;
}

export async function deleteObjective(id: string): Promise<void> {
  const store = await loadStore();
  store.objectives = store.objectives.filter((x) => x.id !== id);
  await saveStore(store);
}
