/** Static-export-safe listing URLs (query id — works for user-created listings). */
export function listingPath(id: string): string {
  return `/ilan/detay/?id=${encodeURIComponent(id)}`;
}

export function listingEditPath(id: string): string {
  return `/ilan/duzenle/?id=${encodeURIComponent(id)}`;
}
