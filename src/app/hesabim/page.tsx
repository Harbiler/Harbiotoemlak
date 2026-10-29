"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useListings } from "@/context/listings-context";
import { isValidTcKimlikNo } from "@/lib/types";
import { ListingsLoading } from "@/components/listings/listing-states";
import { ListingCard } from "@/components/listings/listing-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getPetHotelAvailability,
  isPetHotelListing,
  PET_HOTEL_AVAILABILITY,
} from "@/lib/pet-hotel-availability";
import { cn } from "@/lib/utils";

export default function AccountPage() {
  const { user, ready, logout, updateUser } = useAuth();
  const { listings, ready: listingsReady, updateListing } = useListings();
  const router = useRouter();

  const [tcKimlikNo, setTcKimlikNo] = useState("");
  const [address, setAddress] = useState("");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !user) router.replace("/giris?next=/hesabim");
  }, [ready, user, router]);

  useEffect(() => {
    if (!user) return;
    setTcKimlikNo(user.tcKimlikNo ?? "");
    setAddress(user.address ?? "");
  }, [user]);

  if (!ready || !user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ListingsLoading />
      </div>
    );
  }

  const mine = listings.filter((l) => l.sellerId === user.id);

  function setAvailability(listingId: string, next: string) {
    const listing = listings.find((l) => l.id === listingId);
    if (!listing || !isPetHotelListing(listing)) return;
    updateListing(listingId, {
      fields: { ...listing.fields, musaitlik: next },
    });
  }

  function onSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setProfileMsg(null);
    setProfileError(null);
    const tc = tcKimlikNo.trim();
    if (!isValidTcKimlikNo(tc)) {
      setProfileError("T.C. Kimlik No 11 haneli olmalıdır.");
      return;
    }
    if (!address.trim()) {
      setProfileError("Adres zorunludur.");
      return;
    }
    updateUser(user.id, { tcKimlikNo: tc, address: address.trim() });
    setProfileMsg("Profil kaydedildi.");
  }

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
            {user.role === "admin" && <Badge className="bg-pink-700">Admin</Badge>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild className="bg-[var(--lagoon)] hover:bg-[#be185d]">
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

        <form onSubmit={onSaveProfile} className="mt-5 space-y-4 border-t border-pink-900/10 pt-5">
          <p className="text-sm font-medium text-stone-800">Üyelik bilgileri</p>
          {profileError && (
            <Alert variant="destructive">
              <AlertDescription>{profileError}</AlertDescription>
            </Alert>
          )}
          {profileMsg && (
            <Alert>
              <AlertDescription>{profileMsg}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="hesabim-tc">T.C. Kimlik No</Label>
            <Input
              id="hesabim-tc"
              className="mt-1.5 max-w-sm"
              value={tcKimlikNo}
              onChange={(e) => setTcKimlikNo(e.target.value.replace(/\D/g, "").slice(0, 11))}
              required
              inputMode="numeric"
              autoComplete="off"
              maxLength={11}
              minLength={11}
              pattern="\d{11}"
            />
          </div>
          <div>
            <Label htmlFor="hesabim-address">Adres</Label>
            <Textarea
              id="hesabim-address"
              className="mt-1.5 max-w-xl"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              placeholder="Açık adres (il, ilçe, mahalle, sokak, no)"
            />
          </div>
          <Button type="submit" size="sm" className="bg-[var(--lagoon)] hover:bg-[#be185d]">
            Kaydet
          </Button>
        </form>
      </div>

      <h2 className="mt-10 hb-display text-2xl font-bold text-[var(--ink)]">
        İlanlarım
      </h2>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
        Yayın ücretsizdir. Evcil hayvan oteli ilanlarınızda müsaitlik durumunu
        buradan değiştirebilirsiniz.
      </p>
      <div className="mt-4">
        {!listingsReady ? (
          <ListingsLoading />
        ) : mine.length === 0 ? (
          <p className="text-sm text-stone-500">Henüz ilanınız yok.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((l) => {
              const availability = isPetHotelListing(l)
                ? getPetHotelAvailability(l)
                : null;
              return (
                <div key={l.id} className="relative space-y-2">
                  <div className="relative">
                    <ListingCard listing={l} />
                    <Badge
                      className="absolute right-3 top-3 z-10"
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
                  {availability && (
                    <div className="hb-surface flex items-center gap-2 p-2">
                      <p className="mr-auto text-xs font-medium text-[var(--muted-foreground)]">
                        Müsaitlik
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className={cn(
                          "h-8",
                          availability === PET_HOTEL_AVAILABILITY.musait &&
                            "border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900",
                        )}
                        onClick={() =>
                          setAvailability(l.id, PET_HOTEL_AVAILABILITY.musait)
                        }
                      >
                        Müsait
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className={cn(
                          "h-8",
                          availability === PET_HOTEL_AVAILABILITY.dolu &&
                            "border-stone-600 bg-stone-100 text-stone-800 hover:bg-stone-200 hover:text-stone-900",
                        )}
                        onClick={() =>
                          setAvailability(l.id, PET_HOTEL_AVAILABILITY.dolu)
                        }
                      >
                        Dolu
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
