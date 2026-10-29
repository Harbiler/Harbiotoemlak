import { freeListingValidUntil } from "./listing-validity";
import { SEED_LISTINGS, SEED_USERS } from "./seed";
import type {
  CaregiverApplication,
  Listing,
  PetHotelApplication,
  User,
} from "./types";

const USERS_KEY = "harbidenbak.users";
const LISTINGS_KEY = "harbidenbak.listings";
const SESSION_KEY = "harbidenbak.session";
const REMEMBER_KEY = "harbidenbak.remember";
const REMEMBERED_EMAIL_KEY = "harbidenbak.rememberedEmail";
const PET_HOTEL_APPS_KEY = "harbidenbak.petHotelApplications";
const CAREGIVER_APPS_KEY = "harbidenbak.caregiverApplications";
const VERSION_KEY = "harbidenbak.seedVersion";
/** Bumped for Bakıcı vatandaşlık + kimlik/pasaport alanları. */
const SEED_VERSION = "15";

function ensureListingValidity(listing: Listing): Listing {
  if (listing.validUntil) return listing;
  return {
    ...listing,
    validUntil: freeListingValidUntil(listing.createdAt),
  };
}

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
    const listings = JSON.parse(
      localStorage.getItem(LISTINGS_KEY) || "[]",
    ) as Listing[];
    let changed = false;
    const next = listings.map((l) => {
      let row = ensureListingValidity(l);
      if (row !== l) changed = true;
      if (row.status === "pending") {
        changed = true;
        // Keep auto-approve; start free validity from approval/load time if missing.
        row = {
          ...row,
          status: "approved" as const,
          validUntil: row.validUntil || freeListingValidUntil(),
        };
      }
      return row;
    });
    if (changed) saveListings(next);
    return next;
  } catch {
    return SEED_LISTINGS;
  }
}

export function saveListings(listings: Listing[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
}

export function loadRememberPreference(): boolean {
  if (!canUseStorage()) return true;
  const raw = localStorage.getItem(REMEMBER_KEY);
  if (raw === null) return true;
  return raw === "1";
}

export function saveRememberPreference(remember: boolean): void {
  if (!canUseStorage()) return;
  localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
  if (!remember) localStorage.removeItem(REMEMBERED_EMAIL_KEY);
}

export function loadRememberedEmail(): string | null {
  if (!canUseStorage()) return null;
  if (!loadRememberPreference()) return null;
  return localStorage.getItem(REMEMBERED_EMAIL_KEY);
}

export function saveRememberedEmail(email: string | null): void {
  if (!canUseStorage()) return;
  if (email) localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
  else localStorage.removeItem(REMEMBERED_EMAIL_KEY);
}

export function loadSessionUserId(): string | null {
  if (!canUseStorage()) return null;
  return localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
}

export function saveSessionUserId(userId: string | null, remember?: boolean): void {
  if (!canUseStorage()) return;
  if (!userId) {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    return;
  }
  const persist = remember ?? loadRememberPreference();
  if (persist) {
    localStorage.setItem(SESSION_KEY, userId);
    sessionStorage.removeItem(SESSION_KEY);
  } else {
    sessionStorage.setItem(SESSION_KEY, userId);
    localStorage.removeItem(SESSION_KEY);
  }
}

export function loadPetHotelApplications(): PetHotelApplication[] {
  if (!canUseStorage()) return [];
  try {
    const apps = JSON.parse(
      localStorage.getItem(PET_HOTEL_APPS_KEY) || "[]",
    ) as PetHotelApplication[];
    let changed = false;
    const next = apps.map((a) => {
      if (a.status !== "pending") return a;
      changed = true;
      return { ...a, status: "reviewed" as const };
    });
    if (changed) savePetHotelApplications(next);
    return next;
  } catch {
    return [];
  }
}

export function savePetHotelApplications(apps: PetHotelApplication[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(PET_HOTEL_APPS_KEY, JSON.stringify(apps));
}

export function addPetHotelApplication(
  app: Omit<PetHotelApplication, "id" | "status" | "createdAt">,
): PetHotelApplication {
  const next: PetHotelApplication = {
    ...app,
    id: `pet-hotel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: "reviewed",
    createdAt: new Date().toISOString(),
  };
  const apps = loadPetHotelApplications();
  apps.unshift(next);
  savePetHotelApplications(apps);
  return next;
}

/** Auto-approve any leftover pending pet-hotel applications. */
export function approvePendingPetHotelApplications(): PetHotelApplication[] {
  const apps = loadPetHotelApplications();
  let changed = false;
  const next = apps.map((a) => {
    if (a.status !== "pending") return a;
    changed = true;
    return { ...a, status: "reviewed" as const };
  });
  if (changed) savePetHotelApplications(next);
  return next;
}

export function updatePetHotelApplicationStatus(
  id: string,
  status: PetHotelApplication["status"],
): void {
  const apps = loadPetHotelApplications().map((a) =>
    a.id === id ? { ...a, status } : a,
  );
  savePetHotelApplications(apps);
}

export function loadCaregiverApplications(): CaregiverApplication[] {
  if (!canUseStorage()) return [];
  try {
    const apps = JSON.parse(
      localStorage.getItem(CAREGIVER_APPS_KEY) || "[]",
    ) as CaregiverApplication[];
    let changed = false;
    const next = apps.map((a) => {
      if (a.status !== "pending") return a;
      changed = true;
      return { ...a, status: "reviewed" as const };
    });
    if (changed) saveCaregiverApplications(next);
    return next;
  } catch {
    return [];
  }
}

export function saveCaregiverApplications(apps: CaregiverApplication[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(CAREGIVER_APPS_KEY, JSON.stringify(apps));
}

export function addCaregiverApplication(
  app: Omit<CaregiverApplication, "id" | "status" | "createdAt">,
): CaregiverApplication {
  const next: CaregiverApplication = {
    ...app,
    id: `caregiver-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: "reviewed",
    createdAt: new Date().toISOString(),
  };
  const apps = loadCaregiverApplications();
  apps.unshift(next);
  saveCaregiverApplications(apps);
  return next;
}

export function approvePendingCaregiverApplications(): CaregiverApplication[] {
  const apps = loadCaregiverApplications();
  let changed = false;
  const next = apps.map((a) => {
    if (a.status !== "pending") return a;
    changed = true;
    return { ...a, status: "reviewed" as const };
  });
  if (changed) saveCaregiverApplications(next);
  return next;
}

export function updateCaregiverApplicationStatus(
  id: string,
  status: CaregiverApplication["status"],
): void {
  const apps = loadCaregiverApplications().map((a) =>
    a.id === id ? { ...a, status } : a,
  );
  saveCaregiverApplications(apps);
}

export function resetDemoData(): void {
  if (!canUseStorage()) return;
  localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(SEED_LISTINGS));
  localStorage.setItem(PET_HOTEL_APPS_KEY, JSON.stringify([]));
  localStorage.setItem(CAREGIVER_APPS_KEY, JSON.stringify([]));
  localStorage.setItem(VERSION_KEY, SEED_VERSION);
}
