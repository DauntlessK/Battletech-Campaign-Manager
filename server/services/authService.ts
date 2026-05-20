import crypto from "crypto";
import { loadStore, saveStore } from "./storageService";
import type { AuthToken, UserAccount, ResourceBalance } from "../types/models";

const HASH_ALGORITHM = "sha512";
const HASH_ITERATIONS = 120000;
const HASH_KEYLEN = 64;
const TOKEN_EXPIRATION_DAYS = 14;

function createSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password: string, salt: string): string {
  const hash = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_ALGORITHM);
  return `${salt}$${hash.toString("hex")}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split("$");
  if (!salt || !hash) {
    return false;
  }
  return hashPassword(password, salt) === storedHash;
}

function generateFriendCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

function sanitizeUser(user: UserAccount) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

function createAuthTokenRecord(userId: string): AuthToken {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(now.getDate() + TOKEN_EXPIRATION_DAYS);

  return {
    id: crypto.randomUUID(),
    token: crypto.randomUUID(),
    userId,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

export async function createUserAccount(
  email: string,
  displayName: string,
  password: string
): Promise<{ user: UserAccount; token: AuthToken }> {
  const store = await loadStore();

  const normalizedEmail = email.trim().toLowerCase();
  if (store.users.some((user) => user.email === normalizedEmail)) {
    throw new Error("A user with that email address already exists.");
  }

  const friendCode = generateFriendCode();
  const saltedHash = hashPassword(password, createSalt());

  const user: UserAccount = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    displayName: displayName.trim() || normalizedEmail,
    friendCode,
    passwordHash: saltedHash,
    role: "player",
    status: "active",
    authProvider: "local",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const token = createAuthTokenRecord(user.id);
  store.users.push(user);
  store.authTokens.push(token);
  await saveStore(store);

  return { user, token };
}

export async function authenticateUser(email: string, password: string): Promise<{ user: UserAccount; token: AuthToken }> {
  const store = await loadStore();
  const normalizedEmail = email.trim().toLowerCase();
  const user = store.users.find((record) => record.email === normalizedEmail && record.status === "active");

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw new Error("Invalid email or password.");
  }

  const token = createAuthTokenRecord(user.id);
  store.authTokens.push(token);
  await saveStore(store);

  return { user, token };
}

export async function getUserByToken(token: string): Promise<UserAccount | null> {
  const store = await loadStore();
  const tokenRecord = store.authTokens.find(
    (record) => record.token === token && new Date(record.expiresAt) > new Date()
  );
  if (!tokenRecord) {
    return null;
  }
  return store.users.find((user) => user.id === tokenRecord.userId) ?? null;
}

export async function invalidateToken(token: string): Promise<void> {
  const store = await loadStore();
  store.authTokens = store.authTokens.filter((record) => record.token !== token);
  await saveStore(store);
}

export async function updateUserProfile(
  userId: string,
  updates: { displayName?: string; password?: string }
): Promise<UserAccount> {
  const store = await loadStore();
  const user = store.users.find((record) => record.id === userId);
  if (!user) {
    throw new Error("User not found.");
  }

  if (updates.displayName !== undefined) {
    user.displayName = updates.displayName.trim() || user.displayName;
  }

  if (updates.password) {
    user.passwordHash = hashPassword(updates.password, createSalt());
  }

  user.updatedAt = new Date().toISOString();
  await saveStore(store);

  return user;
}

export { sanitizeUser };
