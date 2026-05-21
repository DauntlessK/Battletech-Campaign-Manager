import crypto from "crypto";
import { loadStore, saveStore } from "./storageService";
import type { Battle } from "../types/models";

export async function createBattle(campaignId: string, submittedByUserId: string, payload: Partial<Battle>): Promise<Battle> {
  const store = await loadStore();
  const battle: Battle = {
    id: crypto.randomUUID(),
    campaignId,
    turnNumber: payload.turnNumber,
    date: payload.date ?? new Date().toISOString(),
    location: payload.location,
    status: "Proposed",
    submittedByUserId,
    defendingUserId: payload.defendingUserId,
    winnerUserId: payload.winnerUserId,
    attackerForceId: payload.attackerForceId,
    defenderForceId: payload.defenderForceId,
    attackerScore: payload.attackerScore,
    defenderScore: payload.defenderScore,
    summary: payload.summary,
    confirmedAt: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.battles.push(battle);
  await saveStore(store);
  return battle;
}

export async function getBattleById(id: string): Promise<Battle | null> {
  const store = await loadStore();
  return store.battles.find((b) => b.id === id) ?? null;
}

export async function listBattlesForCampaign(campaignId: string): Promise<Battle[]> {
  const store = await loadStore();
  return store.battles.filter((b) => b.campaignId === campaignId).sort((a, b) => a.date.localeCompare(b.date));
}

export async function updateBattle(id: string, updates: Partial<Battle>): Promise<Battle> {
  const store = await loadStore();
  const b = store.battles.find((x) => x.id === id);
  if (!b) throw new Error("Battle not found");
  Object.assign(b, updates, { updatedAt: new Date().toISOString() });
  await saveStore(store);
  return b;
}

export async function confirmBattle(id: string): Promise<Battle> {
  const store = await loadStore();
  const b = store.battles.find((x) => x.id === id);
  if (!b) throw new Error("Battle not found");
  b.status = "Finalized";
  b.confirmedAt = new Date().toISOString();
  b.updatedAt = new Date().toISOString();
  await saveStore(store);
  return b;
}

export async function deleteBattle(id: string): Promise<void> {
  const store = await loadStore();
  store.battles = store.battles.filter((x) => x.id !== id);
  await saveStore(store);
}
