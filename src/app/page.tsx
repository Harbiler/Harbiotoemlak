"use client";

import Link from "next/link";
import { HomeHero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingsLoading, ListingsEmpty } from "@/components/listings/listing-states";
import { useListings } from "@/context/listings-context";
import { useUserPrefs } from "@/context/user-prefs-context";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { listings, ready } = useListings();
  const { recent } = useUserPrefs();
  const featured = listings
    .filter((l) => l.status === "approved")
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
    .slice(0, 6);
  const recentListings = recent
    .map((id) => listings.find((l) => l.id === id && l.status === "approved"))
    .filter(Boolean)
    .slice(0, 4) as typeof listings;

  return (
    <>
      <HomeHero />
      <CategoryGrid />
      <section className="border-t border-[color-mix(in_oklab,var(--ink)_6%,transparent)] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="hb-display text-3xl font-bold text-[var(--ink)]">
                Öne çıkan ilanlar
              </h2>
              <p className="mt-1 text-[var(--muted-foreground)]">
                Harbiden Bak&apos;ta yayında olan seçilmiş fırsatlar.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/ara">Tüm ilanlarda ara</Link>
            </Button>
          </div>
          <div className="mt-10">
            {!ready ? (
              <ListingsLoading />
            ) : featured.length === 0 ? (
              <ListingsEmpty />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {recentListings.length > 0 && (
        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="hb-display text-2xl font-bold text-[var(--ink)]">
              Son görüntülenenler
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recentListings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        </section>
      )}

    </>
  );
}
