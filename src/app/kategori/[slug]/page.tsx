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
import { Button } from "@/components/ui/button";
import { Hotel, Plus } from "lucide-react";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const category = getCategory(slug);
  const { getByCategory, ready } = useListings();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const listings = useMemo(() => {
    if (!category) return [];
    return getByCategory(category.slug as CategorySlug);
  }, [category, getByCategory]);

  const filtered = useMemo(() => applyFilters(listings, filters), [listings, filters]);

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
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {category.slug === "evcil-hayvan-otelleri" && (
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
        <aside>
          <ListingFilters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </aside>
        <div>
          <p className="mb-4 text-sm text-[var(--muted-foreground)]">
            {ready ? `${filtered.length} ilan` : "Yükleniyor…"}
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
    </div>
  );
}
