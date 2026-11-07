"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { filterListingsWithinKm, PET_HOTEL_RADIUS_KM } from "@/lib/geo";
import { Button } from "@/components/ui/button";
import { ChevronLeft, HeartHandshake, Hotel, Plus } from "lucide-react";

export function CategoryPageClient({ slug }: { slug: string }) {
  const category = getCategory(slug);
  const { getByCategory, ready } = useListings();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const showAllListings = searchParams.get("tum") === "1";
  const detailFromUrl = searchParams.get("detay") === "1";
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    details: {},
  });
  const [detailOpen, setDetailOpen] = useState(() => detailFromUrl);
  const location = useCustomerLocation();
  const isPetHotels = category?.slug === "evcil-hayvan-otelleri";
  const isCaregivers = category?.slug === "bakici-arayanlar";
  const showLanding = !isPetHotels && !showAllListings;

  useEffect(() => {
    setDetailOpen(detailFromUrl);
  }, [detailFromUrl]);

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

  if (!category) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <h1 className="hb-display text-2xl font-bold text-[var(--ink)]">
          Kategori bulunamadı
        </h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Bu kategori Harbiden Bak&apos;ta yok.
        </p>
        <Button asChild className="mt-6 bg-[var(--lagoon)] hover:bg-[#be185d]">
          <Link href="/">Ana sayfa</Link>
        </Button>
      </div>
    );
  }

  // Evcil hayvan otelleri: konum + mesafe only (no Detaylı arama panel).
  if (isPetHotels) {
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
                <p className="mt-1 max-w-xl text-[var(--muted-foreground)]">
                  {category.description}
                </p>
                <p className="mt-2 text-sm font-medium text-[var(--lagoon)]">
                  Müşteri konumuna {PET_HOTEL_RADIUS_KM} km mesafedeki oteller
                  listelenir.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
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
              <Button asChild className="bg-[var(--lagoon)] hover:bg-[#be185d]">
                <Link href={`/ilan/yeni?kategori=${category.slug}`}>
                  <Plus className="size-4" />
                  Bu kategoride ilan ver
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[260px_1fr] sm:px-6">
          <aside className="space-y-4">
            <PetHotelLocationBar
              location={location}
              matchCount={location.coords ? nearbyPetHotels.length : undefined}
            />
          </aside>
          <div>
            <p className="mb-4 text-sm text-[var(--muted-foreground)]">
              {!ready
                ? "Yükleniyor…"
                : !location.coords
                  ? "Konum bekleniyor"
                  : `${filtered.length} ilan`}
            </p>
            {!ready ? (
              <ListingsLoading />
            ) : !location.coords ? (
              <ListingsEmpty
                title="Konumunuzu paylaşın"
                hint={`Evcil hayvan otellerini görmek için konumunuzu kullanın veya ilçe seçin. Yalnızca ${PET_HOTEL_RADIUS_KM} km içindeki tesisler listelenir.`}
              />
            ) : filtered.length === 0 ? (
              <ListingsEmpty
                title={`${PET_HOTEL_RADIUS_KM} km içinde otel bulunamadı`}
                hint="Farklı bir ilçe seçin veya konumunuzu güncelleyin."
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((l) => (
                  <ListingCard
                    key={l.id}
                    listing={l}
                    distanceKm={
                      "distanceKm" in l ? (l.distanceKm as number) : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
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
          {showAllListings && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--lagoon)] hover:underline"
            >
              <ChevronLeft className="size-4" />
              {category.name} özetine dön
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
                  {showAllListings
                    ? `Tüm ${category.name.toLocaleLowerCase("tr")} ilanları`
                    : category.name}
                </h1>
                <p className="mt-1 max-w-xl text-[var(--muted-foreground)]">
                  {showLanding
                    ? `${category.description} Tüm ilanları gör veya detaylı arama ile listeye geçin.`
                    : `${category.name} kategorisindeki tüm ilanlar. Detaylı arama paneliyle daraltabilirsiniz.`}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
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
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        {showLanding ? (
          <div>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="hb-display text-lg font-semibold text-[var(--ink)]">
                  İlanlara göz atın
                </h2>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {!ready
                    ? "Yükleniyor…"
                    : `${listings.length} ilan bu kategoride`}
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
            <div className="hb-surface px-4 py-8 text-center sm:px-6" data-hb-category-landing>
              <p className="text-sm text-[var(--muted-foreground)]">
                Tüm ilanları görerek listeyi açın veya Detaylı arama ile
                filtreleri genişletin.
              </p>
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
              categorySlug={category.slug}
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
                  title={`${category.name} kategorisinde ilan yok`}
                  hint="Filtreleri değiştirin veya ilk ilanı siz verin."
                />
              ) : (
                <div
                  className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  data-hb-category-all-listings={category.slug}
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
