import crypto from "crypto";
import { loadStore, saveStore } from "./storageService";
import type { ResourceAccount, ResourceTransaction, ResourceType, ResourceBalance } from "../types/models";

export async function getOrCreateResourceAccount(
  campaignId: string,
  userId: string,
  initialBalances?: Partial<ResourceBalance>
): Promise<ResourceAccount> {
  const store = await loadStore();
  let account = store.resourceAccounts.find((a) => a.campaignId === campaignId && a.userId === userId);

  if (!account) {
    account = {
      id: crypto.randomUUID(),
      campaignId,
      userId,
      balances: initialBalances ?? { CBills: 0, RepairPoints: 0, Warchest: 0, Time: 0, Salvage: 0 },
      lastUpdatedAt: new Date().toISOString(),
    };
    store.resourceAccounts.push(account);
    await saveStore(store);
  }
  return account;
}

export async function getResourceAccount(id: string): Promise<ResourceAccount | null> {
  const store = await loadStore();
  return store.resourceAccounts.find((a) => a.id === id) ?? null;
}

export async function listResourceAccountsForCampaign(campaignId: string): Promise<ResourceAccount[]> {
  const store = await loadStore();
  return store.resourceAccounts.filter((a) => a.campaignId === campaignId);
}

export async function updateResourceBalance(
  campaignId: string,
  userId: string,
  type: ResourceType,
  amount: number
): Promise<ResourceAccount> {
  const store = await loadStore();
  const account = store.resourceAccounts.find((a) => a.campaignId === campaignId && a.userId === userId);
  if (!account) throw new Error("Resource account not found");

  account.balances[type] = (account.balances[type] ?? 0) + amount;
  account.lastUpdatedAt = new Date().toISOString();
  await saveStore(store);
  return account;
}

export async function createResourceTransaction(
  campaignId: string,
  userId: string,
  type: ResourceType,
  amount: number,
  reason: string
): Promise<ResourceTransaction> {
  const transaction: ResourceTransaction = {
    id: crypto.randomUUID(),
    campaignId,
    userId,
    type,
    amount,
    reason,
    createdAt: new Date().toISOString(),
  };

  const store = await loadStore();
  store.resourceTransactions.push(transaction);
  await saveStore(store);

  // Also update the balance
  await updateResourceBalance(campaignId, userId, type, amount);

  return transaction;
}

export async function listTransactionsForUser(campaignId: string, userId: string): Promise<ResourceTransaction[]> {
  const store = await loadStore();
  return store.resourceTransactions
    .filter((t) => t.campaignId === campaignId && t.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listTransactionsForCampaign(campaignId: string): Promise<ResourceTransaction[]> {
  const store = await loadStore();
  return store.resourceTransactions
    .filter((t) => t.campaignId === campaignId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
