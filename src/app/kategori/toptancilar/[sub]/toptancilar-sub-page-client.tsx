"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getCategory } from "@/lib/categories";
import type { CategorySlug } from "@/lib/types";
import {
  WHOLESALE_HUB_SUBCATEGORIES,
  WHOLESALE_TRADE_FIELD,
  getWholesaleHub,
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
import { ChevronLeft, Plus } from "lucide-react";

export function ToptancilarSubPageClient({ subSlug }: { subSlug: string }) {
  const category = getCategory("toptancilar")!;
  const sub = getWholesaleHub(subSlug);
  const { getByCategory, ready } = useListings();
  const [filters, setFilters] = useState<FilterState>(() => {
    const details: Record<string, string> = {};
    if (sub) details[WHOLESALE_TRADE_FIELD] = sub.name;
    return { ...DEFAULT_FILTERS, details };
  });

  const listings = useMemo(() => {
    const all = getByCategory("toptancilar" as CategorySlug);
    if (!sub) return [];
    return all.filter((l) => listingWholesaleTrade(l.fields) === sub.name);
  }, [getByCategory, sub]);

  const filtered = useMemo(
    () => applyFilters(listings, filters),
    [listings, filters],
  );

  if (!sub) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h1 className="hb-display text-2xl font-bold text-[var(--ink)]">
          Alt kategori bulunamadı
        </h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Bu toptancı alt kategorisi Harbiden Bak&apos;ta yok.
        </p>
        <Button asChild className="mt-6 bg-[var(--lagoon)] hover:bg-[#be185d]">
          <Link href="/kategori/toptancilar">Toptancılar kategorisine dön</Link>
        </Button>
      </div>
    );
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
          <Link
            href="/kategori/toptancilar"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--lagoon)] hover:underline"
          >
            <ChevronLeft className="size-4" />
            Tüm toptan meslekleri
          </Link>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-start gap-4">
              <span
                className="flex size-14 items-center justify-center rounded-2xl text-white shadow-md"
                style={{ backgroundColor: category.accent }}
              >
                <CategoryIcon slug={category.slug} className="size-7" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--lagoon)]">
                  Toptancılar
                </p>
                <h1 className="hb-display text-3xl font-bold text-[var(--ink)] sm:text-4xl">
                  {sub.name}
                </h1>
                <p className="mt-1 max-w-xl text-[var(--muted-foreground)]">
                  {sub.description}
                </p>
              </div>
            </div>
            <Button asChild className="bg-[var(--lagoon)] hover:bg-[#be185d]">
              <Link
                href={`/ilan/yeni?kategori=toptancilar&meslek=${encodeURIComponent(sub.name)}`}
              >
                <Plus className="size-4" />
                Bu kategoride ilan ver
              </Link>
            </Button>
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {WHOLESALE_HUB_SUBCATEGORIES.map((s) => (
              <Link
                key={s.slug}
                href={wholesaleHubPath(s.slug)}
                className={
                  s.slug === sub.slug
                    ? "shrink-0 rounded-lg bg-[var(--lagoon)] px-3 py-1.5 text-sm font-medium text-white"
                    : "shrink-0 rounded-lg bg-white/80 px-3 py-1.5 text-sm font-medium text-[var(--ink)] ring-1 ring-[color-mix(in_oklab,var(--ink)_10%,transparent)] hover:bg-[var(--mist)]"
                }
              >
                {s.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[260px_1fr] sm:px-6">
        <aside>
          <ListingFilters
            value={filters}
            onChange={setFilters}
            onReset={() =>
              setFilters({
                ...DEFAULT_FILTERS,
                details: { [WHOLESALE_TRADE_FIELD]: sub.name },
              })
            }
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
              title={`${sub.name} ilanı yok`}
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
    </div>
  );
}
