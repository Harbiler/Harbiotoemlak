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
        badge === "galeri" && "bg-[#1a567a]/12 text-[#1a567a]",
        badge === "emlak" && "bg-[#0d6e6e]/12 text-[#0a5555]",
        badge === "bireysel" && "bg-[var(--mist)] text-[var(--muted-foreground)]",
        className,
      )}
    >
      {sellerBadgeLabel(badge)}
    </span>
  );
}
