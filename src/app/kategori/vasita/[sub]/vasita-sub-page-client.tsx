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
import {
  getVasitaSubcategory,
  VASITA_SUBCATEGORIES,
  vasitaSubPath,
} from "@/lib/vasita-subcategories";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

/** Otomobil, Elektrikli, Motorsiklet & Arazi/SUV/Pickup land on a vertical brand index (Sahibinden-style), not a listing grid. */
const BRAND_INDEX_SUBS = new Set([
  "otomobil",
  "elektrikli-araclar",
  "motorsiklet",
  "arazi-suv-pickup",
]);

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

function listingBrand(listing: Listing): string {
  return String(listing.fields?.marka ?? "").trim();
}

export function VasitaSubPageClient({ subSlug }: { subSlug: string }) {
  const sub = getVasitaSubcategory(subSlug);
  const category = getCategory("vasita")!;
  const { getByCategory, ready } = useListings();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedBrand = (searchParams.get("marka") ?? "").trim();
  const showAllListings = searchParams.get("tum") === "1";
  const detailFromUrl = searchParams.get("detay") === "1";
  const showBrandIndex =
    !!sub &&
    BRAND_INDEX_SUBS.has(sub.slug) &&
    !selectedBrand &&
    !showAllListings;
  const useCollapsibleSearch = !!sub && BRAND_INDEX_SUBS.has(sub.slug);

  const [filters, setFilters] = useState<FilterState>(() => {
    const details: Record<string, string> = {};
    if (selectedBrand) details.marka = selectedBrand;
    return { ...DEFAULT_FILTERS, details };
  });
  const [detailOpen, setDetailOpen] = useState(
    () => detailFromUrl || !!selectedBrand,
  );

  useEffect(() => {
    if (!useCollapsibleSearch) return;
    setDetailOpen(detailFromUrl || !!selectedBrand);
  }, [detailFromUrl, selectedBrand, useCollapsibleSearch]);

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

  const brandRows = useMemo(() => {
    if (!sub || !BRAND_INDEX_SUBS.has(sub.slug)) return [];
    const counts = new Map<string, number>();
    for (const listing of listings) {
      const brand = listingBrand(listing);
      if (!brand) continue;
      counts.set(brand, (counts.get(brand) ?? 0) + 1);
    }
    const catalogBrands = Object.keys(sub.brands);
    const known = new Set(catalogBrands.map((b) => b.toLocaleLowerCase("tr")));
    const extras = [...counts.keys()]
      .filter((b) => !known.has(b.toLocaleLowerCase("tr")))
      .sort((a, b) => a.localeCompare(b, "tr"));
    return [...catalogBrands, ...extras].map((brand) => ({
      brand,
      count: counts.get(brand) ??
        // Case-insensitive match for seeded variants
        [...counts.entries()].find(
          ([k]) => k.toLocaleLowerCase("tr") === brand.toLocaleLowerCase("tr"),
        )?.[1] ??
        0,
    }));
  }, [sub, listings]);

  const filtersForView = useMemo(() => {
    if (!selectedBrand) return filters;
    if (filters.details.marka === selectedBrand) return filters;
    return {
      ...filters,
      details: { ...filters.details, marka: selectedBrand },
    };
  }, [filters, selectedBrand]);

  const filtered = useMemo(
    () => applyFilters(listings, filtersForView),
    [listings, filtersForView],
  );

  function openBrand(brand: string) {
    const params = new URLSearchParams();
    params.set("marka", brand);
    router.push(`${pathname}?${params.toString()}`);
    setDetailOpen(true);
    setFilters((prev) => ({
      ...prev,
      details: { ...prev.details, marka: brand, model: "" },
    }));
  }

  function clearBrand() {
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
    const marka = next.details.marka?.trim();
    const params = new URLSearchParams();
    if (marka) {
      params.set("marka", marka);
    } else if (showAllListings || !selectedBrand) {
      // Stay on “Tüm ilanlar” when no marka is selected
      params.set("tum", "1");
    }
    if (opts?.keepDetail ?? detailOpen) params.set("detay", "1");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

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
                  {selectedBrand
                    ? selectedBrand
                    : showAllListings
                      ? `Tüm ${sub.name.toLocaleLowerCase("tr")} ilanları`
                      : sub.name}
                </h1>
                <p className="mt-1 max-w-xl text-[var(--muted-foreground)]">
                  {selectedBrand
                    ? `${sub.name} · markaya göre ilanlar`
                    : showBrandIndex
                      ? "Markayı seçin; sağda her markanın ilan sayısı görünür. Tüm ilanlar veya detaylı arama ile listeye geçin."
                      : showAllListings
                        ? `${sub.name} kategorisindeki tüm ilanlar. Detaylı arama paneliyle daraltabilirsiniz.`
                        : sub.description}
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
        {showBrandIndex ? (
          <div>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="hb-display text-lg font-semibold text-[var(--ink)]">
                  Markalar
                </h2>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {!ready
                    ? "Yükleniyor…"
                    : `${brandRows.length} marka · ${listings.length} ilan`}
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
                  Tüm ilanlar
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
                data-hb-brand-list={sub.slug}
              >
                {brandRows.map(({ brand, count }) => (
                  <li key={brand}>
                    <button
                      type="button"
                      onClick={() => openBrand(brand)}
                      className="group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[color-mix(in_oklab,var(--lagoon)_6%,transparent)] sm:px-5"
                    >
                      <span className="min-w-0 flex-1 hb-display text-base font-semibold text-[var(--ink)] group-hover:text-[var(--lagoon)] sm:text-lg">
                        {brand}
                      </span>
                      <span
                        className="shrink-0 tabular-nums text-sm font-medium text-[var(--muted-foreground)]"
                        data-hb-brand-count={brand}
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
            {BRAND_INDEX_SUBS.has(sub.slug) && (selectedBrand || showAllListings) && (
              <button
                type="button"
                onClick={clearBrand}
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--lagoon)] hover:underline"
              >
                <ChevronLeft className="size-4" />
                Tüm {sub.name.toLocaleLowerCase("tr")} markaları
              </button>
            )}
            <ListingFilters
              value={filtersForView}
              onChange={(next) => {
                setFilters(next);
                if (useCollapsibleSearch) {
                  syncListingParams(next);
                } else {
                  const marka = next.details.marka?.trim();
                  const params = new URLSearchParams(searchParams.toString());
                  if (marka) params.set("marka", marka);
                  else params.delete("marka");
                  const qs = params.toString();
                  router.replace(qs ? `${pathname}?${qs}` : pathname);
                }
              }}
              onReset={() => {
                setFilters({ ...DEFAULT_FILTERS, details: {} });
                if (useCollapsibleSearch && showAllListings) {
                  openAllListings({ detail: detailOpen });
                } else {
                  clearBrand();
                }
              }}
              categorySlug="vasita"
              vasitaSub={sub.slug}
              collapsible={useCollapsibleSearch}
              open={useCollapsibleSearch ? detailOpen : undefined}
              onOpenChange={
                useCollapsibleSearch
                  ? (open) => {
                      setDetailOpen(open);
                      syncListingParams(filtersForView, { keepDetail: open });
                    }
                  : undefined
              }
              defaultOpen={detailFromUrl || !!selectedBrand}
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
                    selectedBrand
                      ? `${selectedBrand} için ilan yok`
                      : `${sub.name} kategorisinde ilan yok`
                  }
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
          </>
        )}
      </div>
    </div>
  );
}
