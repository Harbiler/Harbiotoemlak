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
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    q: searchParams.get("q") ?? "",
  }));
  const [category, setCategory] = useState(searchParams.get("kategori") ?? "all");

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
    return applyFilters(base, filters);
  }, [approved, category, filters]);

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
          <ListingFilters
            value={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
          />
        </aside>

        <div>
          <p className="mb-4 text-sm text-[var(--muted-foreground)]">
            {ready ? `${filtered.length} ilan bulundu` : "Yükleniyor…"}
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
