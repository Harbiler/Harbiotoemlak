"use client";

import Link from "next/link";
import { useListings } from "@/context/listings-context";
import { useUserPrefs } from "@/context/user-prefs-context";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingsEmpty, ListingsLoading } from "@/components/listings/listing-states";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const { listings, ready } = useListings();
  const { favorites, ready: prefsReady } = useUserPrefs();

  const favListings = favorites
    .map((id) => listings.find((l) => l.id === id))
    .filter(Boolean) as typeof listings;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="hb-display text-3xl font-bold text-[var(--ink)]">Favorilerim</h1>
      <p className="mt-1 text-[var(--muted-foreground)]">
        Beğendiğiniz ilanlar tarayıcınızda saklanır.
      </p>

      <div className="mt-8">
        {!ready || !prefsReady ? (
          <ListingsLoading />
        ) : favListings.length === 0 ? (
          <ListingsEmpty
            title="Henüz favori ilan yok"
            hint="İlan detayında kalp ikonuna tıklayarak favorilere ekleyin."
            showCta={false}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>

      {favListings.length === 0 && (
        <div className="mt-4">
          <Button asChild className="bg-[var(--lagoon)] hover:bg-[#be185d]">
            <Link href="/ara">İlanlara göz at</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
