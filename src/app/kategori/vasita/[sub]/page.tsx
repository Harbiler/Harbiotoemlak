"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { getCategory } from "@/lib/categories";
import type { CategorySlug } from "@/lib/types";
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
import {
  getVasitaSubcategory,
  VASITA_SUBCATEGORIES,
  vasitaSubPath,
} from "@/lib/vasita-subcategories";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";

function matchesVasitaSub(
  listing: { category: string; fields?: Record<string, string | number | boolean> },
  subSlug: string,
): boolean {
  const alt = String(listing.fields?.altKategori ?? "");
  if (alt === subSlug) return true;
  // Legacy motorsiklet top-level listings appear under Vasıta → Motorsiklet
  if (subSlug === "motorsiklet" && listing.category === "motorsiklet") return true;
  return false;
}

export default function VasitaSubcategoryPage({
  params,
}: {
  params: Promise<{ sub: string }>;
}) {
  const { sub: subSlug } = use(params);
  const sub = getVasitaSubcategory(subSlug);
  const category = getCategory("vasita")!;
  const { getByCategory, ready } = useListings();
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    details: {},
  });

  const listings = useMemo(() => {
    if (!sub) return [];
    const vasita = getByCategory("vasita" as CategorySlug);
    const fromVasita = vasita.filter((l) => matchesVasitaSub(l, sub.slug));
    if (sub.slug === "motorsiklet") {
      const moto = getByCategory("motorsiklet" as CategorySlug);
      const ids = new Set(fromVasita.map((l) => l.id));
      return [...fromVasita, ...moto.filter((l) => !ids.has(l.id))];
    }
    // Fallback: older vasita ads without altKategori show under Otomobil
    if (sub.slug === "otomobil") {
      const untagged = vasita.filter((l) => !l.fields?.altKategori);
      const ids = new Set(fromVasita.map((l) => l.id));
      return [...fromVasita, ...untagged.filter((l) => !ids.has(l.id))];
    }
    return fromVasita;
  }, [sub, getByCategory]);

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
          Bu vasıta alt kategorisi Harbiden Bak&apos;ta yok.
        </p>
        <Button asChild className="mt-6 bg-[var(--lagoon)] hover:bg-[#be185d]">
          <Link href="/kategori/vasita">Vasıta kategorilerine dön</Link>
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
            href="/kategori/vasita"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--lagoon)] hover:underline"
          >
            <ChevronLeft className="size-4" />
            Tüm vasıta kategorileri
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
                  Vasıta
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
              <Link href={`/ilan/yeni?kategori=vasita&alt=${sub.slug}`}>
                <Plus className="size-4" />
                Bu kategoride ilan ver
              </Link>
            </Button>
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto pb-1">
            {VASITA_SUBCATEGORIES.map((s) => (
              <Link
                key={s.slug}
                href={vasitaSubPath(s.slug)}
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

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <ListingFilters
          value={filters}
          onChange={setFilters}
          onReset={() => setFilters({ ...DEFAULT_FILTERS, details: {} })}
          categorySlug="vasita"
          vasitaSub={sub.slug}
        />
        <div>
          <p className="mb-4 text-sm text-[var(--muted-foreground)]">
            {!ready ? "Yükleniyor…" : `${filtered.length} ilan`}
          </p>
          {!ready ? (
            <ListingsLoading />
          ) : filtered.length === 0 ? (
            <ListingsEmpty
              title={`${sub.name} kategorisinde ilan yok`}
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
