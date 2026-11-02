"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getCategory } from "@/lib/categories";
import type { CategorySlug, Listing } from "@/lib/types";
import {
  VASITA_SUBCATEGORIES,
  vasitaSubPath,
} from "@/lib/vasita-subcategories";
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

/** All Vasıta ads, including legacy top-level motorsiklet listings. */
function allVasitaListings(
  getByCategory: (slug: CategorySlug) => Listing[],
): Listing[] {
  const vasita = getByCategory("vasita" as CategorySlug);
  const moto = getByCategory("motorsiklet" as CategorySlug);
  if (moto.length === 0) return vasita;
  const ids = new Set(vasita.map((l) => l.id));
  return [...vasita, ...moto.filter((l) => !ids.has(l.id))];
}

export function VasitaHubClient() {
  const category = getCategory("vasita")!;
  const { getByCategory, ready } = useListings();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const showAllListings = searchParams.get("tum") === "1";
  const detailFromUrl = searchParams.get("detay") === "1";
  const showSubIndex = !showAllListings;

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    details: {},
  });
  const [detailOpen, setDetailOpen] = useState(() => detailFromUrl);

  useEffect(() => {
    setDetailOpen(detailFromUrl);
  }, [detailFromUrl]);

  const listings = useMemo(
    () => allVasitaListings(getByCategory),
    [getByCategory],
  );

  const filtered = useMemo(
    () => applyFilters(listings, filters),
    [listings, filters],
  );

  function clearAll() {
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
    _next: FilterState,
    opts?: { keepDetail?: boolean },
  ) {
    const params = new URLSearchParams();
    params.set("tum", "1");
    if (opts?.keepDetail ?? detailOpen) params.set("detay", "1");
    router.replace(`${pathname}?${params.toString()}`);
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
          {showAllListings && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--lagoon)] hover:underline"
            >
              <ChevronLeft className="size-4" />
              Alt kategorilere dön
            </button>
          )}
          <div
            className={`flex flex-wrap items-end justify-between gap-4 ${
              showAllListings ? "mt-4" : ""
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
                  {showAllListings ? "Tüm vasıta ilanları" : category.name}
                </h1>
                <p className="mt-1 max-w-xl text-[var(--muted-foreground)]">
                  {showSubIndex
                    ? "Alt kategoriyi seçin; her bölümde marka ve modeller listelenir. Tüm ilanları gör veya detaylı arama ile listeye geçin."
                    : "Otomobil, motorsiklet ve diğer tüm vasıta alt kategorilerindeki ilanlar. Detaylı arama paneliyle daraltabilirsiniz."}
                </p>
              </div>
            </div>
            <Button asChild className="bg-[var(--lagoon)] hover:bg-[#be185d]">
              <Link href="/ilan/yeni?kategori=vasita">
                <Plus className="size-4" />
                Vasıta ilanı ver
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        {showSubIndex ? (
          <div>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="hb-display text-lg font-semibold text-[var(--ink)]">
                  Alt kategoriler
                </h2>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {!ready
                    ? "Yükleniyor…"
                    : `${VASITA_SUBCATEGORIES.length} alt kategori · ${listings.length} ilan`}
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
              <ul className="divide-y divide-[color-mix(in_oklab,var(--ink)_8%,transparent)]">
                {VASITA_SUBCATEGORIES.map((sub) => {
                  const brandCount = Object.keys(sub.brands).length;
                  const modelCount = Object.values(sub.brands).reduce(
                    (n, models) => n + models.length,
                    0,
                  );
                  return (
                    <li key={sub.slug}>
                      <Link
                        href={vasitaSubPath(sub.slug)}
                        className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-[color-mix(in_oklab,var(--lagoon)_6%,transparent)] sm:px-5"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="hb-display text-base font-semibold text-[var(--ink)] group-hover:text-[var(--lagoon)] sm:text-lg">
                            {sub.name}
                          </p>
                          <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                            {sub.description}
                          </p>
                          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                            {brandCount} marka · {modelCount} model
                          </p>
                        </div>
                        <ChevronRight className="size-5 shrink-0 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--lagoon)]" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          <>
            <ListingFilters
              value={filters}
              onChange={(next) => {
                setFilters(next);
                syncListingParams(next);
              }}
              onReset={() => {
                setFilters({ ...DEFAULT_FILTERS, details: {} });
                openAllListings({ detail: detailOpen });
              }}
              categorySlug="vasita"
              collapsible
              open={detailOpen}
              onOpenChange={(open) => {
                setDetailOpen(open);
                syncListingParams(filters, { keepDetail: open });
              }}
              defaultOpen={detailFromUrl}
            />
            <div>
              <p className="mb-4 text-sm text-[var(--muted-foreground)]">
                {!ready ? "Yükleniyor…" : `${filtered.length} ilan`}
              </p>
              {!ready ? (
                <ListingsLoading />
              ) : filtered.length === 0 ? (
                <ListingsEmpty
                  title="Vasıta ilanı yok"
                  hint="Filtreleri değiştirin veya ilk ilanı siz verin."
                />
              ) : (
                <div
                  className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  data-hb-vasita-all-listings
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
