"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { loadListings, resetDemoData, saveListings } from "@/lib/storage";
import type { CategorySlug, Listing, ListingStatus, MembershipKind } from "@/lib/types";

export type ListingInput = Omit<Listing, "id" | "createdAt" | "updatedAt" | "currency"> & {
  id?: string;
};

interface ListingsContextValue {
  listings: Listing[];
  ready: boolean;
  getById: (id: string) => Listing | undefined;
  getByCategory: (slug: CategorySlug, opts?: { includeHidden?: boolean }) => Listing[];
  createListing: (input: ListingInput) => Listing;
  updateListing: (id: string, patch: Partial<Listing>) => Listing | null;
  deleteListing: (id: string) => void;
  setStatus: (id: string, status: ListingStatus) => void;
  resetData: () => void;
}

const ListingsContext = createContext<ListingsContextValue | null>(null);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setListings(loadListings());
    setReady(true);
  }, []);

  const persist = useCallback((next: Listing[]) => {
    setListings(next);
    saveListings(next);
  }, []);

  const getById = useCallback(
    (id: string) => listings.find((l) => l.id === id),
    [listings],
  );

  const getByCategory = useCallback(
    (slug: CategorySlug, opts?: { includeHidden?: boolean }) => {
      return listings.filter((l) => {
        if (l.category !== slug) return false;
        if (opts?.includeHidden) return true;
        return l.status === "approved";
      });
    },
    [listings],
  );

  const createListing = useCallback(
    (input: ListingInput) => {
      const now = new Date().toISOString();
      const listing: Listing = {
        ...input,
        id: input.id ?? `l-${Date.now()}`,
        currency: "TRY",
        createdAt: now,
        updatedAt: now,
      };
      persist([listing, ...listings]);
      return listing;
    },
    [listings, persist],
  );

  const updateListing = useCallback(
    (id: string, patch: Partial<Listing>) => {
      let updated: Listing | null = null;
      const next = listings.map((l) => {
        if (l.id !== id) return l;
        updated = { ...l, ...patch, updatedAt: new Date().toISOString() };
        return updated;
      });
      if (!updated) return null;
      persist(next);
      return updated;
    },
    [listings, persist],
  );

  const deleteListing = useCallback(
    (id: string) => {
      persist(listings.filter((l) => l.id !== id));
    },
    [listings, persist],
  );

  const setStatus = useCallback(
    (id: string, status: ListingStatus) => {
      updateListing(id, { status });
    },
    [updateListing],
  );

  const resetData = useCallback(() => {
    resetDemoData();
    setListings(loadListings());
  }, []);

  const value = useMemo(
    () => ({
      listings,
      ready,
      getById,
      getByCategory,
      createListing,
      updateListing,
      deleteListing,
      setStatus,
      resetData,
    }),
    [
      listings,
      ready,
      getById,
      getByCategory,
      createListing,
      updateListing,
      deleteListing,
      setStatus,
      resetData,
    ],
  );

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

export function useListings(): ListingsContextValue {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error("useListings must be used within ListingsProvider");
  return ctx;
}

export function sellerLabel(kind: MembershipKind): string {
  return kind === "kurumsal" ? "Kurumsal" : "Bireysel";
}
