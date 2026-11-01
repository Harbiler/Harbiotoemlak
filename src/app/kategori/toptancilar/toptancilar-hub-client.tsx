"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getCategory } from "@/lib/categories";
import type { CategorySlug } from "@/lib/types";
import {
  WHOLESALE_HUB_SUBCATEGORIES,
  listingWholesaleTrade,
  wholesaleHubPath,
} from "@/lib/wholesale-trades";
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
import { ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

export function ToptancilarHubClient() {
  const category = getCategory("toptancilar")!;
  const { getByCategory, ready } = useListings();
  const searchParams = useSearchParams();
  const showAll = searchParams.get("tum") === "1";
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    details: {},
  });

  const listings = useMemo(
    () => getByCategory("toptancilar" as CategorySlug),
    [getByCategory],
  );

  const hubRows = useMemo(() => {
    const counts = new Map<string, number>();
    for (const listing of listings) {
      const trade = listingWholesaleTrade(listing.fields);
      if (!trade) continue;
      counts.set(trade, (counts.get(trade) ?? 0) + 1);
    }
    return WHOLESALE_HUB_SUBCATEGORIES.map((sub) => ({
      ...sub,
      count: counts.get(sub.name) ?? 0,
    }));
  }, [listings]);

  const filtered = useMemo(
    () => applyFilters(listings, filters),
    [listings, filters],
  );

  return (
    <div>
      <div
        className="border-b border-[color-mix(in_oklab,var(--ink)_8%,transparent)]"
        style={{
          background: `linear-gradient(120deg, ${category.accent}22, transparent 55%)`,
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-12 sm:px-6">
          <div className="flex items-start gap-4">
            <span
              className="flex size-14 items-center justify-center rounded-2xl text-white shadow-md"
              style={{ backgroundColor: category.accent }}
            >
              <CategoryIcon slug={category.slug} className="size-7" />
            </span>
            <div>
              <h1 className="hb-display text-3xl font-bold text-[var(--ink)] sm:text-4xl">
                {showAll ? "Tüm toptancı ilanları" : category.name}
              </h1>
              <p className="mt-1 max-w-xl text-[var(--muted-foreground)]">
                {showAll
                  ? "Tüm toptan mesleklerindeki ilanlar. Filtrelerle daraltabilirsiniz."
                  : "Alt kategoriyi seçin; sağda her toptan mesleğinin ilan sayısı görünür."}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {showAll ? (
              <Button
                asChild
                variant="outline"
                className="border-[color-mix(in_oklab,var(--lagoon)_35%,transparent)] bg-white/80 text-[var(--lagoon)] hover:bg-[var(--mist)] hover:text-[var(--lagoon)]"
              >
                <Link href="/kategori/toptancilar">Meslek listesine dön</Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="border-[color-mix(in_oklab,var(--lagoon)_35%,transparent)] bg-white/80 text-[var(--lagoon)] hover:bg-[var(--mist)] hover:text-[var(--lagoon)]"
              >
                <Link href="/kategori/toptancilar?tum=1">Tüm ilanları göster</Link>
              </Button>
            )}
            <Button asChild className="bg-[var(--lagoon)] hover:bg-[#be185d]">
              <Link href="/ilan/yeni?kategori=toptancilar">
                <Plus className="size-4" />
                Toptancı ilanı ver
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {showAll ? (
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[260px_1fr] sm:px-6">
          <aside>
            <ListingFilters
              value={filters}
              onChange={setFilters}
              onReset={() => setFilters({ ...DEFAULT_FILTERS, details: {} })}
              categorySlug="toptancilar"
            />
          </aside>
          <div>
            <p className="mb-4 text-sm text-[var(--muted-foreground)]">
              {!ready ? "Yükleniyor…" : `${filtered.length} ilan`}
            </p>
            {!ready ? (
              <ListingsLoading />
            ) : filtered.length === 0 ? (
              <ListingsEmpty
                title="Toptancı ilanı yok"
                hint="Filtreleri değiştirin veya ilk ilanı siz verin."
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="mb-4">
            <h2 className="hb-display text-lg font-semibold text-[var(--ink)]">
              Toptan meslekleri
            </h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              {!ready
                ? "Yükleniyor…"
                : `${hubRows.length} alt kategori · ${listings.length} ilan`}
            </p>
          </div>
          <div className="hb-surface overflow-hidden">
            <ul
              className="divide-y divide-[color-mix(in_oklab,var(--ink)_8%,transparent)]"
              data-hb-wholesale-hub
            >
              {hubRows.map((sub) => (
                <li key={sub.slug}>
                  <Link
                    href={wholesaleHubPath(sub.slug)}
                    className="group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[color-mix(in_oklab,var(--lagoon)_6%,transparent)] sm:px-5"
                    data-hb-wholesale-trade={sub.name}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="hb-display text-base font-semibold text-[var(--ink)] group-hover:text-[var(--lagoon)] sm:text-lg">
                        {sub.name}
                      </p>
                      <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                        {sub.description}
                      </p>
                    </div>
                    <span
                      className="shrink-0 tabular-nums text-sm font-medium text-[var(--muted-foreground)]"
                      data-hb-wholesale-count={sub.slug}
                    >
                      {ready ? sub.count : "…"}
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--lagoon)]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs text-[var(--muted-foreground)]">
            İlan verirken gıda, kozmetik, elektronik, mobilya ve diğer toptan
            mesleklerinden de seçebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}
