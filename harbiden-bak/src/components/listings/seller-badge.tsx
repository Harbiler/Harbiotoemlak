import { getSellerBadge, sellerBadgeLabel, type Listing } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SellerBadge({
  listing,
  className,
}: {
  listing: Pick<Listing, "sellerType" | "sellerKurumsalType">;
  className?: string;
}) {
  const badge = getSellerBadge(listing);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        badge === "galeri" && "bg-[#be185d]/12 text-[#be185d]",
        badge === "emlak" && "bg-[#db2777]/12 text-[#9d174d]",
        badge === "bireysel" && "bg-[var(--mist)] text-[var(--muted-foreground)]",
        className,
      )}
    >
      {sellerBadgeLabel(badge)}
    </span>
  );
}
