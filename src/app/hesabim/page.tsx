"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useListings } from "@/context/listings-context";
import { ListingsLoading } from "@/components/listings/listing-states";
import { ListingCard } from "@/components/listings/listing-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AccountPage() {
  const { user, ready, logout } = useAuth();
  const { listings, ready: listingsReady } = useListings();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/giris?next=/hesabim");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ListingsLoading />
      </div>
    );
  }

  const mine = listings.filter((l) => l.sellerId === user.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="hb-display text-3xl font-bold text-[var(--ink)]">
            Hesabım
          </h1>
          <p className="mt-1 text-stone-600">{user.email}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="secondary">
              {user.membershipKind === "kurumsal" ? "Kurumsal" : "Bireysel"}
            </Badge>
            {user.kurumsalType === "galeri" && <Badge>Galeri</Badge>}
            {user.kurumsalType === "emlak" && <Badge>Emlak</Badge>}
            {user.role === "admin" && <Badge className="bg-teal-800">Admin</Badge>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="bg-[var(--lagoon)] hover:bg-[#0a5a5a]">
            <Link href="/ilan/yeni">İlan Ver</Link>
          </Button>
          {user.role === "admin" && (
            <Button asChild variant="outline">
              <Link href="/admin">Admin Paneli</Link>
            </Button>
          )}
          <Button variant="ghost" onClick={logout}>
            Çıkış Yap
          </Button>
        </div>
      </div>

      <div className="mt-6 hb-surface p-5 text-sm">
        <p>
          <span className="text-stone-500">Ad:</span> {user.name}
        </p>
        <p className="mt-1">
          <span className="text-stone-500">Telefon:</span> {user.phone}
        </p>
        {user.companyName && (
          <p className="mt-1">
            <span className="text-stone-500">Firma:</span> {user.companyName}
          </p>
        )}
      </div>

      <h2 className="mt-10 hb-display text-2xl font-bold text-[var(--ink)]">
        İlanlarım
      </h2>
      <div className="mt-4">
        {!listingsReady ? (
          <ListingsLoading />
        ) : mine.length === 0 ? (
          <p className="text-sm text-stone-500">Henüz ilanınız yok.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((l) => (
              <div key={l.id} className="relative">
                <ListingCard listing={l} />
                <Badge
                  className="absolute left-3 top-3 z-10"
                  variant={
                    l.status === "approved"
                      ? "default"
                      : l.status === "pending"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {l.status === "approved"
                    ? "Yayında"
                    : l.status === "pending"
                      ? "Onay bekliyor"
                      : "Gizli"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
