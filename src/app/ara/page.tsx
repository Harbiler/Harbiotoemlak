"use client";

import { Suspense, useMemo, useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useListings } from "@/context/listings-context";
import { NAV_CATEGORIES } from "@/lib/categories";
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
import { PetHotelLocationBar } from "@/components/listings/pet-hotel-location-bar";
import { useCustomerLocation } from "@/hooks/use-customer-location";
import { filterListingsWithinKm, PET_HOTEL_RADIUS_KM } from "@/lib/geo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { HEPSI, isHepsi } from "@/lib/filter-all";

function SearchInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { listings, ready } = useListings();
  const location = useCustomerLocation();
  const showAllListings = searchParams.get("tum") === "1";
  const detailFromUrl = searchParams.get("detay") === "1";
  const [detailOpen, setDetailOpen] = useState(detailFromUrl);
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    details: {},
    q: searchParams.get("q") ?? "",
  }));
  const [category, setCategory] = useState(
    searchParams.get("kategori") ?? HEPSI,
  );
  const categoryValue = isHepsi(category) ? HEPSI : category;
  const isPetHotels = categoryValue === "evcil-hayvan-otelleri";

  const categoryItems = useMemo(() => {
    const map: Record<string, string> = { [HEPSI]: "Tüm kategoriler" };
    for (const c of NAV_CATEGORIES) map[c.slug] = c.name;
    return map;
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setFilters((f) => ({ ...f, q }));
    const k = searchParams.get("kategori");
    if (k) setCategory(k);
  }, [searchParams]);

  useEffect(() => {
    setDetailOpen(detailFromUrl);
  }, [detailFromUrl]);

  const replaceParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  function onDetailOpenChange(next: boolean) {
    setDetailOpen(next);
    replaceParams((params) => {
      if (showAllListings) params.set("tum", "1");
      if (next) params.set("detay", "1");
      else params.delete("detay");
    });
  }

  function onCategoryChange(next: string) {
    setCategory(next ?? HEPSI);
    setFilters((f) => ({ ...f, details: {} }));
  }

  const approved = useMemo(
    () => listings.filter((l) => l.status === "approved"),
    [listings],
  );

  const filtered = useMemo(() => {
    const base = isHepsi(categoryValue)
      ? approved
      : approved.filter((l) => l.category === categoryValue);

    if (isPetHotels) {
      if (!location.coords) return [];
      const nearby = filterListingsWithinKm(base, location.coords, PET_HOTEL_RADIUS_KM);
      const next = applyFilters(nearby, filters);
      return [...next].sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return applyFilters(base, filters);
  }, [approved, categoryValue, filters, isPetHotels, location.coords]);

  const useCollapsibleSearch = showAllListings || detailFromUrl;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="hb-display text-3xl font-bold text-[var(--ink)] sm:text-4xl">
          {showAllListings ? "Tüm ilanlar" : "İlan ara"}
        </h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          {showAllListings
            ? "Harbiden Bak'taki tüm yayındaki ilanlar. Detaylı arama paneliyle daraltabilirsiniz."
            : "Kelime, konum, fiyat ve satıcı tipine göre filtreleyin."}
        </p>
      </div>

      {categoryValue === "emlak" ? (
        <div className="mt-10 space-y-8">
          <div className="hb-surface max-w-xs space-y-2 p-4">
            <Label>Kategori</Label>
            <Select
              value={categoryValue}
              onValueChange={(v) => onCategoryChange(v ?? HEPSI)}
              items={categoryItems}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Tüm kategoriler" />
              </SelectTrigger>
              <SelectContent className="z-[200]">
                <SelectItem value={HEPSI}>Tüm kategoriler</SelectItem>
                {NAV_CATEGORIES.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ListingFilters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ ...DEFAULT_FILTERS, details: {}, q: filters.q })}
            categorySlug="emlak"
            collapsible={useCollapsibleSearch}
            open={useCollapsibleSearch ? detailOpen : undefined}
            onOpenChange={useCollapsibleSearch ? onDetailOpenChange : undefined}
            defaultOpen={!useCollapsibleSearch || detailOpen}
          />
          <div>
            <p className="mb-4 text-sm text-[var(--muted-foreground)]">
              {!ready ? "Yükleniyor…" : `${filtered.length} ilan bulundu`}
              {filters.q ? (
                <>
                  {" "}
                  · “<span className="text-[var(--ink)]">{filters.q}</span>”
                </>
              ) : null}
            </p>
            {!ready ? (
              <ListingsLoading />
            ) : filtered.length === 0 ? (
              <ListingsEmpty
                title="Aramanıza uygun ilan yok"
                hint="Farklı anahtar kelime veya daha geniş filtreler deneyin."
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
        <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-4">
            <div className="hb-surface space-y-2 p-4">
              <Label>Kategori</Label>
              <Select
                value={categoryValue}
                onValueChange={(v) => onCategoryChange(v ?? HEPSI)}
                items={categoryItems}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Tüm kategoriler" />
                </SelectTrigger>
                <SelectContent className="z-[200]">
                  <SelectItem value={HEPSI}>Tüm kategoriler</SelectItem>
                  {NAV_CATEGORIES.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isPetHotels && (
              <PetHotelLocationBar
                location={location}
                matchCount={
                  location.coords
                    ? filterListingsWithinKm(
                        approved.filter((l) => l.category === "evcil-hayvan-otelleri"),
                        location.coords,
                        PET_HOTEL_RADIUS_KM,
                      ).length
                    : undefined
                }
              />
            )}
            <ListingFilters
              value={filters}
              onChange={setFilters}
              onReset={() => setFilters({ ...DEFAULT_FILTERS, details: {}, q: filters.q })}
              categorySlug={isHepsi(categoryValue) ? undefined : categoryValue}
              collapsible={useCollapsibleSearch}
              open={useCollapsibleSearch ? detailOpen : undefined}
              onOpenChange={useCollapsibleSearch ? onDetailOpenChange : undefined}
              defaultOpen={!useCollapsibleSearch || detailOpen}
            />
          </aside>

          <div>
            <p className="mb-4 text-sm text-[var(--muted-foreground)]">
              {!ready
                ? "Yükleniyor…"
                : isPetHotels && !location.coords
                  ? "Konum bekleniyor"
                  : `${filtered.length} ilan bulundu`}
              {filters.q ? (
                <>
                  {" "}
                  · “<span className="text-[var(--ink)]">{filters.q}</span>”
                </>
              ) : null}
            </p>
            {!ready ? (
              <ListingsLoading />
            ) : isPetHotels && !location.coords ? (
              <ListingsEmpty
                title="Konumunuzu paylaşın"
                hint={`Pet oteller yalnızca konumunuza ${PET_HOTEL_RADIUS_KM} km mesafede listelenir.`}
              />
            ) : filtered.length === 0 ? (
              <ListingsEmpty
                title={
                  isPetHotels
                    ? `${PET_HOTEL_RADIUS_KM} km içinde otel yok`
                    : "Aramanıza uygun ilan yok"
                }
                hint={
                  isPetHotels
                    ? "Farklı bir ilçe seçin veya konumunuzu güncelleyin."
                    : "Farklı anahtar kelime veya daha geniş filtreler deneyin."
                }
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((l) => (
                  <ListingCard
                    key={l.id}
                    listing={l}
                    distanceKm={"distanceKm" in l ? (l.distanceKm as number) : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <ListingsLoading />
        </div>
      }
    >
      <SearchInner />
    </Suspense>
  );
}
