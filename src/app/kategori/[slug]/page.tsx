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
import { PetHotelLocationBar } from "@/components/listings/pet-hotel-location-bar";
import { useCustomerLocation } from "@/hooks/use-customer-location";
import { supportsDetailedSearch } from "@/lib/brand-models";
import { filterListingsWithinKm, PET_HOTEL_RADIUS_KM } from "@/lib/geo";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Hotel, Plus } from "lucide-react";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const category = getCategory(slug);
  const { getByCategory, ready } = useListings();
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS, details: {} });
  const location = useCustomerLocation();
  const isPetHotels = category?.slug === "evcil-hayvan-otelleri";
  const isCaregivers = category?.slug === "bakici-arayanlar";

  const listings = useMemo(() => {
    if (!category) return [];
    return getByCategory(category.slug as CategorySlug);
  }, [category, getByCategory]);

  const nearbyPetHotels = useMemo(() => {
    if (!isPetHotels || !location.coords) return [];
    return filterListingsWithinKm(listings, location.coords, PET_HOTEL_RADIUS_KM);
  }, [isPetHotels, listings, location.coords]);

  const filtered = useMemo(() => {
    if (isPetHotels) {
      if (!location.coords) return [];
      const next = applyFilters(nearbyPetHotels, filters);
      return [...next].sort((a, b) => a.distanceKm - b.distanceKm);
    }
    return applyFilters(listings, filters);
  }, [isPetHotels, location.coords, nearbyPetHotels, listings, filters]);

  if (!category) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h1 className="hb-display text-2xl font-bold text-[var(--ink)]">Kategori bulunamadı</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Bu kategori Harbiden Bak&apos;ta yok.
        </p>
        <Button asChild className="mt-6 bg-[var(--lagoon)] hover:bg-[#be185d]">
          <Link href="/">Ana sayfa</Link>
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
                {category.name}
              </h1>
              <p className="mt-1 max-w-xl text-[var(--muted-foreground)]">{category.description}</p>
              {isPetHotels && (
                <p className="mt-2 text-sm font-medium text-[var(--lagoon)]">
                  Müşteri konumuna {PET_HOTEL_RADIUS_KM} km mesafedeki oteller listelenir.
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {isPetHotels && (
              <Button
                asChild
                variant="outline"
                className="border-[color-mix(in_oklab,var(--lagoon)_35%,transparent)] bg-white/80 text-[var(--lagoon)] hover:bg-[var(--mist)] hover:text-[var(--lagoon)]"
              >
                <Link href="/evcil-hayvan-hoteli-ol">
                  <Hotel className="size-4" />
                  Evcil Hayvan Hoteli Ol
                </Link>
              </Button>
            )}
            {isCaregivers && (
              <Button
                asChild
                variant="outline"
                className="border-[color-mix(in_oklab,var(--lagoon)_35%,transparent)] bg-white/80 text-[var(--lagoon)] hover:bg-[var(--mist)] hover:text-[var(--lagoon)]"
              >
                <Link href="/bakici-ol">
                  <HeartHandshake className="size-4" />
                  Bakıcı Olmak İstiyorum
                </Link>
              </Button>
            )}
            <Button asChild className="bg-[var(--lagoon)] hover:bg-[#be185d]">
              <Link href={`/ilan/yeni?kategori=${category.slug}`}>
                <Plus className="size-4" />
                Bu kategoride ilan ver
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {supportsDetailedSearch(category.slug) && !isPetHotels ? (
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
          <ListingFilters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters({ ...DEFAULT_FILTERS, details: {} })}
            categorySlug={category.slug}
          />
          <div>
            <p className="mb-4 text-sm text-[var(--muted-foreground)]">
              {!ready ? "Yükleniyor…" : `${filtered.length} ilan`}
            </p>
            {!ready ? (
              <ListingsLoading />
            ) : filtered.length === 0 ? (
              <ListingsEmpty
                title={`${category.name} kategorisinde ilan yok`}
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
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[260px_1fr] sm:px-6">
          <aside className="space-y-4">
            {isPetHotels ? (
              <PetHotelLocationBar
                location={location}
                matchCount={location.coords ? nearbyPetHotels.length : undefined}
              />
            ) : (
              <ListingFilters
                value={filters}
                onChange={setFilters}
                onReset={() => setFilters({ ...DEFAULT_FILTERS, details: {} })}
                categorySlug={category.slug}
              />
            )}
          </aside>
          <div>
            <p className="mb-4 text-sm text-[var(--muted-foreground)]">
              {!ready
                ? "Yükleniyor…"
                : isPetHotels && !location.coords
                  ? "Konum bekleniyor"
                  : `${filtered.length} ilan`}
            </p>
            {!ready ? (
              <ListingsLoading />
            ) : isPetHotels && !location.coords ? (
              <ListingsEmpty
                title="Konumunuzu paylaşın"
                hint={`Evcil hayvan otellerini görmek için konumunuzu kullanın veya ilçe seçin. Yalnızca ${PET_HOTEL_RADIUS_KM} km içindeki tesisler listelenir.`}
              />
            ) : filtered.length === 0 ? (
              <ListingsEmpty
                title={
                  isPetHotels
                    ? `${PET_HOTEL_RADIUS_KM} km içinde otel bulunamadı`
                    : `${category.name} kategorisinde ilan yok`
                }
                hint={
                  isPetHotels
                    ? "Farklı bir ilçe seçin veya konumunuzu güncelleyin."
                    : "Filtreleri değiştirin veya ilk ilanı siz verin."
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
