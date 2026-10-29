/** Product rule: new listings publish free for this many years from publish date. */
export const FREE_LISTING_YEARS = 1;

/** Add calendar years to an ISO timestamp (or now). */
export function addYearsIso(
  from: string | Date = new Date(),
  years: number = FREE_LISTING_YEARS,
): string {
  const d = from instanceof Date ? new Date(from.getTime()) : new Date(from);
  if (Number.isNaN(d.getTime())) {
    const fallback = new Date();
    fallback.setFullYear(fallback.getFullYear() + years);
    return fallback.toISOString();
  }
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString();
}

/** Expiry for a free publish starting at `publishedAt` (defaults to now). */
export function freeListingValidUntil(
  publishedAt: string | Date = new Date(),
): string {
  return addYearsIso(publishedAt, FREE_LISTING_YEARS);
}

export function isListingExpired(validUntil: string | undefined | null): boolean {
  if (!validUntil) return false;
  const t = new Date(validUntil).getTime();
  if (Number.isNaN(t)) return false;
  return t < Date.now();
}

export const freeListingCopy = {
  badge: "Ücretsiz",
  short: "İlan yayınlamak ücretsizdir.",
  detail: "Yayın ücretsizdir (yayın tarihinden itibaren geçerlidir).",
  publishHint:
    "Yeni ilanlar otomatik onaylanır; yayın ücretsizdir. Ücretli paket gerekmez.",
  adminNote:
    "Tüm ilanlar ücretsiz yayınlanır. Geçerlilik, yayın / onay tarihinden itibaren hesaplanır.",
} as const;
