"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useListings } from "@/context/listings-context";
import { CATEGORIES } from "@/lib/categories";
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

function SearchInner() {
  const searchParams = useSearchParams();
  const { listings, ready } = useListings();
  const location = useCustomerLocation();
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    q: searchParams.get("q") ?? "",
  }));
  const [category, setCategory] = useState(searchParams.get("kategori") ?? "all");
  const isPetHotels = category === "evcil-hayvan-otelleri";

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setFilters((f) => ({ ...f, q }));
    const k = searchParams.get("kategori");
    if (k) setCategory(k);
  }, [searchParams]);

  const approved = useMemo(
    () => listings.filter((l) => l.status === "approved"),
    [listings],
  );

  const filtered = useMemo(() => {
    const base =
      category === "all" ? approved : approved.filter((l) => l.category === category);

    if (isPetHotels) {
      if (!location.coords) return [];
      const nearby = filterListingsWithinKm(base, location.coords, PET_HOTEL_RADIUS_KM);
      const next = applyFilters(nearby, filters);
      return [...next].sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return applyFilters(base, filters);
  }, [approved, category, filters, isPetHotels, location.coords]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="hb-display text-3xl font-bold text-[var(--ink)] sm:text-4xl">
          İlan ara
        </h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Kelime, konum, fiyat ve satıcı tipine göre filtreleyin.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <div className="hb-surface space-y-2 p-4">
            <Label>Kategori</Label>
            <Select value={category} onValueChange={(v) => setCategory(v ?? "all")}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Tüm kategoriler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm kategoriler</SelectItem>
                {CATEGORIES.map((c) => (
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
            onReset={() => setFilters(DEFAULT_FILTERS)}
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
