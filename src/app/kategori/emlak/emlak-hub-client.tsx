"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getCategory } from "@/lib/categories";
import type { CategorySlug, Listing } from "@/lib/types";
import { useListings } from "@/context/listings-context";
import { CategoryIcon } from "@/components/category-icon";
import { ListingCard } from "@/components/listings/listing-card";
import {
  applyFilters,
  DEFAULT_FILTERS,
  ListingFilters,
  type FilterState,
} from "@/components/listings/listing-filters";
import {
  ListingsEmpty,
  ListingsLoading,
} from "@/components/listings/listing-states";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

/** Sahibinden-style vertical tip index for the Emlak hub. */
export const EMLAK_HUB_TYPES = [
  "Daire",
  "Villa",
  "Müstakil Ev",
  "Rezidans",
  "Yazlık",
  "İşyeri",
  "Arsa",
  "Köşk",
] as const;

function listingEmlakTipi(listing: Listing): string {
  return String(listing.fields?.emlakTipi ?? "").trim();
}

export function EmlakHubClient() {
  const category = getCategory("emlak")!;
  const { getByCategory, ready } = useListings();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedTip = (searchParams.get("tip") ?? "").trim();
  const showAllListings = searchParams.get("tum") === "1";
  const detailFromUrl = searchParams.get("detay") === "1";
  const showTipIndex = !selectedTip && !showAllListings;

  const [filters, setFilters] = useState<FilterState>(() => {
    const details: Record<string, string> = {};
    if (selectedTip) details.emlakTipi = selectedTip;
    return { ...DEFAULT_FILTERS, details };
  });
  const [detailOpen, setDetailOpen] = useState(
    () => detailFromUrl || !!selectedTip,
  );

  useEffect(() => {
    setDetailOpen(detailFromUrl || !!selectedTip);
  }, [detailFromUrl, selectedTip]);

  const listings = useMemo(
    () => getByCategory("emlak" as CategorySlug),
    [getByCategory],
  );

  const tipRows = useMemo(() => {
    const counts = new Map<string, number>();
    for (const listing of listings) {
      const tip = listingEmlakTipi(listing);
      if (!tip) continue;
      counts.set(tip, (counts.get(tip) ?? 0) + 1);
    }
    const known = new Set(
      EMLAK_HUB_TYPES.map((t) => t.toLocaleLowerCase("tr")),
    );
    const extras = [...counts.keys()]
      .filter((t) => !known.has(t.toLocaleLowerCase("tr")))
      .sort((a, b) => a.localeCompare(b, "tr"));
    return [...EMLAK_HUB_TYPES, ...extras].map((tip) => ({
      tip,
      count:
        counts.get(tip) ??
        [...counts.entries()].find(
          ([k]) => k.toLocaleLowerCase("tr") === tip.toLocaleLowerCase("tr"),
        )?.[1] ??
        0,
    }));
  }, [listings]);

  const filtersForView = useMemo(() => {
    if (!selectedTip) return filters;
    if (filters.details.emlakTipi === selectedTip) return filters;
    return {
      ...filters,
      details: { ...filters.details, emlakTipi: selectedTip },
    };
  }, [filters, selectedTip]);

  const filtered = useMemo(
    () => applyFilters(listings, filtersForView),
    [listings, filtersForView],
  );

  function openTip(tip: string) {
    const params = new URLSearchParams();
    params.set("tip", tip);
    router.push(`${pathname}?${params.toString()}`);
    setDetailOpen(true);
    setFilters((prev) => ({
      ...prev,
      details: { ...prev.details, emlakTipi: tip },
    }));
  }

  function clearTip() {
    router.push(pathname);
    setDetailOpen(false);
    setFilters({ ...DEFAULT_FILTERS, details: {} });
  }

  function openAllListings(opts?: { detail?: boolean }) {
    const params = new URLSearchParams();
    params.set("tum", "1");
    if (opts?.detail) params.set("detay", "1");
    router.push(`${pathname}?${params.toString()}`);
    setDetailOpen(!!opts?.detail);
    setFilters({ ...DEFAULT_FILTERS, details: {} });
  }

  function syncListingParams(
    next: FilterState,
    opts?: { keepDetail?: boolean },
  ) {
    const tip = next.details.emlakTipi?.trim();
    const params = new URLSearchParams();
    if (tip) {
      params.set("tip", tip);
    } else if (showAllListings || !selectedTip) {
      params.set("tum", "1");
    }
    if (opts?.keepDetail ?? detailOpen) params.set("detay", "1");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div>
      <div
        className="border-b border-[color-mix(in_oklab,var(--ink)_8%,transparent)]"
        style={{
          background: `linear-gradient(120deg, ${category.accent}22, transparent 55%)`,
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          {(selectedTip || showAllListings) && (
            <button
              type="button"
              onClick={clearTip}
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--lagoon)] hover:underline"
            >
              <ChevronLeft className="size-4" />
              Tüm emlak tipleri
            </button>
          )}
          <div
            className={`flex flex-wrap items-end justify-between gap-4 ${
              selectedTip || showAllListings ? "mt-4" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <span
                className="flex size-14 items-center justify-center rounded-2xl text-white shadow-md"
                style={{ backgroundColor: category.accent }}
              >
                <CategoryIcon slug={category.slug} className="size-7" />
              </span>
              <div>
                <h1 className="hb-display text-3xl font-bold text-[var(--ink)] sm:text-4xl">
                  {selectedTip
                    ? selectedTip
                    : showAllListings
                      ? "Tüm emlak ilanları"
                      : category.name}
                </h1>
                <p className="mt-1 max-w-xl text-[var(--muted-foreground)]">
                  {selectedTip
                    ? "Seçili emlak tipine göre ilanlar"
                    : showTipIndex
                      ? "Emlak tipini seçin; sağda her tipin ilan sayısı görünür. Tüm ilanları gör veya detaylı arama ile listeye geçin."
                      : showAllListings
                        ? "Emlak kategorisindeki tüm ilanlar. Detaylı arama paneliyle daraltabilirsiniz."
                        : category.description}
                </p>
              </div>
            </div>
            <Button asChild className="bg-[var(--lagoon)] hover:bg-[#be185d]">
              <Link href="/ilan/yeni?kategori=emlak">
                <Plus className="size-4" />
                Bu kategoride ilan ver
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        {showTipIndex ? (
          <div>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="hb-display text-lg font-semibold text-[var(--ink)]">
                  Emlak tipleri
                </h2>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {!ready
                    ? "Yükleniyor…"
                    : `${tipRows.length} tip · ${listings.length} ilan`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[color-mix(in_oklab,var(--lagoon)_35%,transparent)] bg-white/80 text-[var(--lagoon)] hover:bg-[var(--mist)] hover:text-[var(--lagoon)]"
                  onClick={() => openAllListings()}
                  data-hb-all-listings
                >
                  Tüm ilanları gör
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-[color-mix(in_oklab,var(--lagoon)_35%,transparent)] bg-white/80 text-[var(--lagoon)] hover:bg-[var(--mist)] hover:text-[var(--lagoon)]"
                  onClick={() => openAllListings({ detail: true })}
                  data-hb-open-detailed-search
                >
                  Detaylı arama
                </Button>
              </div>
            </div>
            <div className="hb-surface overflow-hidden">
              <ul
                className="divide-y divide-[color-mix(in_oklab,var(--ink)_8%,transparent)]"
                data-hb-emlak-tip-list
              >
                {tipRows.map(({ tip, count }) => (
                  <li key={tip}>
                    <button
                      type="button"
                      onClick={() => openTip(tip)}
                      className="group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[color-mix(in_oklab,var(--lagoon)_6%,transparent)] sm:px-5"
                      data-hb-emlak-tip={tip}
                    >
                      <span className="min-w-0 flex-1 hb-display text-base font-semibold text-[var(--ink)] group-hover:text-[var(--lagoon)] sm:text-lg">
                        {tip}
                      </span>
                      <span
                        className="shrink-0 tabular-nums text-sm font-medium text-[var(--muted-foreground)]"
                        data-hb-emlak-tip-count={tip}
                      >
                        {ready ? count : "…"}
                      </span>
                      <ChevronRight className="size-5 shrink-0 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--lagoon)]" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <>
            <ListingFilters
              value={filtersForView}
              onChange={(next) => {
                setFilters(next);
                syncListingParams(next);
              }}
              onReset={() => {
                setFilters({ ...DEFAULT_FILTERS, details: {} });
                if (showAllListings) {
                  openAllListings({ detail: detailOpen });
                } else {
                  clearTip();
                }
              }}
              categorySlug="emlak"
              collapsible
              open={detailOpen}
              onOpenChange={(open) => {
                setDetailOpen(open);
                syncListingParams(filtersForView, { keepDetail: open });
              }}
              defaultOpen={detailFromUrl || !!selectedTip}
            />
            <div>
              <p className="mb-4 text-sm text-[var(--muted-foreground)]">
                {!ready ? "Yükleniyor…" : `${filtered.length} ilan`}
              </p>
              {!ready ? (
                <ListingsLoading />
              ) : filtered.length === 0 ? (
                <ListingsEmpty
                  title={
                    selectedTip
                      ? `${selectedTip} için ilan yok`
                      : "Emlak kategorisinde ilan yok"
                  }
                  hint="Filtreleri değiştirin veya ilk ilanı siz verin."
                />
              ) : (
                <div
                  className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  data-hb-emlak-all-listings
                >
                  {filtered.map((l) => (
                    <ListingCard key={l.id} listing={l} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
