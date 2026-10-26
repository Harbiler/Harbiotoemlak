"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getCategory } from "@/lib/categories";
import { formatDate, formatPrice } from "@/lib/format";
import { listingNumber } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { useListings } from "@/context/listings-context";
import { useUserPrefs } from "@/context/user-prefs-context";
import { PhotoPlaceholder } from "@/components/listings/photo-placeholder";
import { SellerBadge } from "@/components/listings/seller-badge";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingsError, ListingsLoading } from "@/components/listings/listing-states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  getPetHotelAvailability,
  isPetHotelListing,
  PET_HOTEL_AVAILABILITY,
} from "@/lib/pet-hotel-availability";
import { cn } from "@/lib/utils";
import {
  Heart,
  MapPin,
  Phone,
  Pencil,
  Share2,
  Shield,
  Printer,
} from "lucide-react";

export function ListingDetailClient({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const { getById, listings, ready, updateListing } = useListings();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, addRecent } = useUserPrefs();
  const [showPhone, setShowPhone] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [copied, setCopied] = useState(false);

  const listing = getById(id);

  useEffect(() => {
    if (listing?.status === "approved") addRecent(listing.id);
  }, [listing?.id, listing?.status, addRecent]);

  const similar = useMemo(() => {
    if (!listing) return [];
    return listings
      .filter(
        (l) =>
          l.id !== listing.id &&
          l.status === "approved" &&
          (l.category === listing.category || l.city === listing.city),
      )
      .slice(0, 4);
  }, [listing, listings]);

  if (!ready) return <ListingsLoading />;
  if (!listing) {
    return <ListingsError message="İlan bulunamadı veya kaldırılmış olabilir." />;
  }

  const category = getCategory(listing.category);
  const canEdit = user && (user.role === "admin" || user.id === listing.sellerId);
  const isHiddenFromPublic =
    listing.status !== "approved" &&
    !(user && (user.role === "admin" || user.id === listing.sellerId));

  if (isHiddenFromPublic) {
    return <ListingsError message="Bu ilan henüz yayında değil." />;
  }

  const photos = listing.photos.length > 0 ? listing.photos : [`${listing.category}-1`];
  const fav = isFavorite(listing.id);
  const ilanNo = listingNumber(listing.id);
  const petAvailability = isPetHotelListing(listing)
    ? getPetHotelAvailability(listing)
    : null;
  const canToggleAvailability = Boolean(canEdit && petAvailability);

  function setAvailability(next: string) {
    const current = getById(id);
    if (!current) return;
    updateListing(current.id, {
      fields: { ...current.fields, musaitlik: next },
    });
  }

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: listing!.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* ignore cancel */
    }
  }

  return (
    <div>
      {searchParams.get("pending") === "1" && (
        <Alert className="mb-6 border-amber-300 bg-amber-50">
          <AlertTitle>İlanınız alındı</AlertTitle>
          <AlertDescription>
            Admin onayından sonra yayınlanacak. Demo için admin@harbidenbak.com ile giriş yapıp
            onaylayabilirsiniz.
          </AlertDescription>
        </Alert>
      )}

      {listing.status !== "approved" && (
        <Alert className="mb-6">
          <AlertTitle>
            Durum: {listing.status === "pending" ? "Beklemede" : "Gizli"}
          </AlertTitle>
          <AlertDescription>Bu ilanı yalnızca siz ve yöneticiler görebilir.</AlertDescription>
        </Alert>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-[var(--muted-foreground)]">
        <Link href="/" className="hover:text-[var(--lagoon)]">
          Harbiden Bak
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link href={`/kategori/${category.slug}`} className="hover:text-[var(--lagoon)]">
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[var(--ink)]">İlan no: {ilanNo}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr]">
        <div>
          <PhotoPlaceholder
            category={listing.category}
            title={listing.title}
            large
            className="aspect-[16/10] w-full rounded-2xl"
            key={photos[activePhoto]}
          />
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
            {photos.slice(0, 5).map((p, i) => (
              <button
                key={`${p}-${i}`}
                type="button"
                onClick={() => setActivePhoto(i)}
                className={`overflow-hidden rounded-lg ring-offset-2 transition ${
                  activePhoto === i ? "ring-2 ring-[var(--lagoon)]" : "opacity-80 hover:opacity-100"
                }`}
              >
                <PhotoPlaceholder
                  category={listing.category}
                  className="aspect-video"
                />
              </button>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="hb-display max-w-2xl text-3xl font-bold leading-tight text-[var(--ink)] sm:text-4xl">
                {listing.title}
              </h1>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={fav ? "Favoriden çıkar" : "Favorile"}
                  onClick={() => toggleFavorite(listing.id)}
                  className={fav ? "border-rose-300 text-rose-600" : ""}
                >
                  <Heart className={`size-4 ${fav ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" aria-label="Paylaş" onClick={share}>
                  <Share2 className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Yazdır"
                  onClick={() => window.print()}
                >
                  <Printer className="size-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <p className="hb-display text-2xl font-bold text-[var(--ink)]">
                {formatPrice(listing.price)}
              </p>
              {petAvailability && (
                <Badge
                  className={cn(
                    "text-white",
                    petAvailability === PET_HOTEL_AVAILABILITY.musait
                      ? "bg-emerald-600 hover:bg-emerald-600"
                      : "bg-stone-600 hover:bg-stone-600",
                  )}
                >
                  {petAvailability}
                </Badge>
              )}
              <Badge variant="secondary" className="gap-1">
                <MapPin className="size-3" />
                {listing.city} / {listing.district}
              </Badge>
              <SellerBadge listing={listing} />
              {category && <Badge variant="outline">{category.name}</Badge>}
            </div>
            {copied && (
              <p className="mt-2 text-xs text-[var(--lagoon)]">Bağlantı panoya kopyalandı.</p>
            )}

            {canToggleAvailability && (
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-[color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white/80 p-3">
                <p className="mr-auto text-sm font-medium text-[var(--ink)]">
                  Müsaitlik durumunu güncelle
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={cn(
                    petAvailability === PET_HOTEL_AVAILABILITY.musait &&
                      "border-emerald-600 bg-emerald-50 text-emerald-800",
                  )}
                  onClick={() => setAvailability(PET_HOTEL_AVAILABILITY.musait)}
                >
                  Müsait
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={cn(
                    petAvailability === PET_HOTEL_AVAILABILITY.dolu &&
                      "border-stone-600 bg-stone-100 text-stone-800",
                  )}
                  onClick={() => setAvailability(PET_HOTEL_AVAILABILITY.dolu)}
                >
                  Dolu
                </Button>
              </div>
            )}

            <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-[var(--ink)]/85">
              {listing.description}
            </p>
          </div>

          {Object.keys(listing.fields).length > 0 && (
            <div className="hb-surface mt-8 overflow-hidden">
              <h2 className="border-b border-[color-mix(in_oklab,var(--ink)_8%,transparent)] px-4 py-3 font-semibold text-[var(--ink)]">
                İlan özellikleri
              </h2>
              <dl className="grid sm:grid-cols-2">
                {category?.fields.map((field) => {
                  const val = listing.fields[field.key];
                  if (val === undefined || val === "") return null;
                  return (
                    <div
                      key={field.key}
                      className="grid grid-cols-2 gap-2 border-b border-[color-mix(in_oklab,var(--ink)_6%,transparent)] px-4 py-3 text-sm last:border-b-0"
                    >
                      <dt className="text-[var(--muted-foreground)]">{field.label}</dt>
                      <dd className="font-medium text-[var(--ink)]">{String(val)}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          )}

          <div className="hb-surface mt-6 p-5">
            <h2 className="font-semibold text-[var(--ink)]">Konum</h2>
            <p className="mt-2 flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--lagoon)]" />
              {listing.district}, {listing.city} — harita entegrasyonu demo sürümünde metin olarak
              gösterilir.
            </p>
            <div className="mt-4 flex h-36 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#d9ecea,#e7eef1)] text-sm text-[var(--muted-foreground)]">
              {listing.city} / {listing.district} konum önizlemesi
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="hb-surface p-5 shadow-sm">
            <p className="text-sm text-[var(--muted-foreground)]">Fiyat</p>
            <p className="hb-display mt-1 text-3xl font-bold text-[var(--ink)]">
              {formatPrice(listing.price)}
            </p>
            <div className="mt-5 border-t border-[color-mix(in_oklab,var(--ink)_8%,transparent)] pt-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[var(--ink)]">{listing.contactName}</p>
                  <div className="mt-1.5">
                    <SellerBadge listing={listing} />
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                İlan no: {ilanNo} · {formatDate(listing.createdAt)}
              </p>
              <Button
                className="mt-4 w-full bg-[var(--lagoon)] hover:bg-[#be185d]"
                onClick={() => setShowPhone(true)}
              >
                <Phone className="size-4" />
                {showPhone ? listing.contactPhone : "Telefonu göster"}
              </Button>
            </div>
          </div>

          {canEdit && (
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline">
                <Link href={`/ilan/${listing.id}/duzenle`}>
                  <Pencil className="size-4" />
                  İlanı düzenle
                </Link>
              </Button>
              {user?.role === "admin" && (
                <Button asChild variant="outline">
                  <Link href="/admin">
                    <Shield className="size-4" />
                    Admin paneli
                  </Link>
                </Button>
              )}
            </div>
          )}
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="hb-display text-2xl font-bold text-[var(--ink)]">Benzer ilanlar</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
