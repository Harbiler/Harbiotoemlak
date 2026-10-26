import { SEED_LISTINGS, SEED_USERS } from "./seed";
import type { Listing, User } from "./types";

const USERS_KEY = "harbidenbak.users";
const LISTINGS_KEY = "harbidenbak.listings";
const SESSION_KEY = "harbidenbak.session";
const VERSION_KEY = "harbidenbak.seedVersion";
const SEED_VERSION = "5";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function ensureSeedData(): void {
  if (!canUseStorage()) return;
  const version = localStorage.getItem(VERSION_KEY);
  if (version !== SEED_VERSION) {
    localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(SEED_LISTINGS));
    localStorage.setItem(VERSION_KEY, SEED_VERSION);
    return;
  }
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(LISTINGS_KEY)) {
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(SEED_LISTINGS));
  }
}

export function loadUsers(): User[] {
  ensureSeedData();
  if (!canUseStorage()) return SEED_USERS;
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as User[];
  } catch {
    return SEED_USERS;
  }
}

export function saveUsers(users: User[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function loadListings(): Listing[] {
  ensureSeedData();
  if (!canUseStorage()) return SEED_LISTINGS;
  try {
    return JSON.parse(localStorage.getItem(LISTINGS_KEY) || "[]") as Listing[];
  } catch {
    return SEED_LISTINGS;
  }
}

export function saveListings(listings: Listing[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
}

export function loadSessionUserId(): string | null {
  if (!canUseStorage()) return null;
  return localStorage.getItem(SESSION_KEY);
}

export function saveSessionUserId(userId: string | null): void {
  if (!canUseStorage()) return;
  if (userId) localStorage.setItem(SESSION_KEY, userId);
  else localStorage.removeItem(SESSION_KEY);
}

export function resetDemoData(): void {
  if (!canUseStorage()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(SEED_LISTINGS));
  localStorage.setItem(VERSION_KEY, SEED_VERSION);
}
