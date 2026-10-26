import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatPrice, formatRelative } from "@/lib/format";
import { PhotoPlaceholder } from "./photo-placeholder";
import { SellerBadge } from "./seller-badge";
import { getSellerBadge } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceKm } from "@/lib/geo";
import { MapPin } from "lucide-react";

export function ListingCard({
  listing,
  distanceKm,
}: {
  listing: Listing;
  distanceKm?: number;
}) {
  const badge = getSellerBadge(listing);
  const isCorporate = badge !== "bireysel";

  return (
    <Link
      href={`/ilan/${listing.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border bg-white/90 transition duration-300",
        "hover:-translate-y-1 hover:shadow-[0_12px_40px_-16px_rgba(11,42,51,0.25)]",
        isCorporate
          ? "border-[color-mix(in_oklab,#0d6e6e_22%,transparent)] ring-1 ring-[color-mix(in_oklab,#0d6e6e_8%,transparent)]"
          : "border-[color-mix(in_oklab,#0b2a33_8%,transparent)]",
      )}
    >
      <div className="relative overflow-hidden">
        <PhotoPlaceholder
          category={listing.category}
          title={listing.title}
          className="aspect-[16/10] w-full transition duration-500 ease-out group-hover:scale-[1.03]"
        />
        {listing.featured && (
          <span className="absolute bottom-2 left-2 rounded-md bg-[var(--lagoon)]/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
            Öne çıkan
          </span>
        )}
        {typeof distanceKm === "number" && (
          <span className="absolute right-2 top-2 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-[var(--lagoon)] shadow-sm">
            {formatDistanceKm(distanceKm)}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <MapPin className="size-3 shrink-0" />
            <span className="truncate">
              {listing.city} / {listing.district}
              {typeof distanceKm === "number" ? ` · ${formatDistanceKm(distanceKm)}` : ""}
            </span>
          </p>
          <SellerBadge listing={listing} />
        </div>
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--ink)] transition group-hover:text-[var(--lagoon)]">
          {listing.title}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <p className="hb-display text-lg font-bold tracking-tight text-[var(--ink)]">
            {formatPrice(listing.price)}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            {formatRelative(listing.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}
