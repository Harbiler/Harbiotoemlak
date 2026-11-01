import { freeListingValidUntil, isListingExpired } from "./listing-validity";
import type { Listing, ListingPaymentStatus, MembershipKind } from "./types";

export type PaymentBucket = "due" | "free" | "paid";

/** Resolve effective payment state for admin / UI. */
export function resolvePaymentStatus(
  listing: Pick<Listing, "paymentStatus" | "validUntil">,
): ListingPaymentStatus {
  if (listing.paymentStatus === "paid") return "paid";
  if (listing.paymentStatus === "due") return "due";
  // Launch rule + default: free until validUntil; then due.
  if (isListingExpired(listing.validUntil)) return "due";
  return "free";
}

export function paymentStatusLabel(status: ListingPaymentStatus): string {
  if (status === "paid") return "Ücretli";
  if (status === "due") return "Vadesi geldi";
  return "Ücretsiz";
}

/** Pending/due = needs admin attention (not paid, free window expired). */
export function isPaymentDue(
  listing: Pick<Listing, "paymentStatus" | "validUntil">,
): boolean {
  return resolvePaymentStatus(listing) === "due";
}

export function paymentBucket(
  listing: Pick<Listing, "paymentStatus" | "validUntil">,
): PaymentBucket {
  const s = resolvePaymentStatus(listing);
  if (s === "paid") return "paid";
  if (s === "due") return "due";
  return "free";
}

/** Patch when admin marks Ücretsiz — refresh 1-year free window. */
export function markListingFreePatch(): Partial<Listing> {
  const now = new Date().toISOString();
  return {
    paymentStatus: "free",
    paidAt: undefined,
    validUntil: freeListingValidUntil(now),
  };
}

/** Patch when admin marks Ücretli / paid. */
export function markListingPaidPatch(): Partial<Listing> {
  const now = new Date().toISOString();
  return {
    paymentStatus: "paid",
    paidAt: now,
  };
}

export function listingsForSellerKind(
  listings: Listing[],
  kind: MembershipKind,
): Listing[] {
  return listings.filter((l) => l.sellerType === kind);
}

export const paymentAdminCopy = {
  tabNote:
    "Açılış kuralı: tüm ilanlar yayın tarihinden itibaren 1 yıl ücretsizdir. Vadesi gelen veya bekleyen ödemeleri Bireysel / Kurumsal olarak yönetin.",
  freeButton: "Ücretsiz",
  paidButton: "Ücretli",
  emptyDue: "Bekleyen veya vadesi gelen ödeme yok.",
} as const;
