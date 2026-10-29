import type { Listing } from "./types";

export type Coordinates = { lat: number; lng: number };

/** Approximate district centers used for distance checks */
export const DISTRICT_COORDS: Record<string, Record<string, Coordinates>> = {
  İstanbul: {
    Kadıköy: { lat: 40.9901, lng: 29.0291 },
    Beşiktaş: { lat: 41.0422, lng: 29.0067 },
    Üsküdar: { lat: 41.0228, lng: 29.015 },
    Şişli: { lat: 41.0602, lng: 28.9877 },
    Bakırköy: { lat: 40.981, lng: 28.872 },
    Ataşehir: { lat: 40.9833, lng: 29.1278 },
    Maltepe: { lat: 40.9351, lng: 29.1309 },
    Beylikdüzü: { lat: 41.002, lng: 28.641 },
    Kartal: { lat: 40.8889, lng: 29.187 },
    Sarıyer: { lat: 41.1667, lng: 29.057 },
  },
  Ankara: {
    Çankaya: { lat: 39.9208, lng: 32.8541 },
    Keçiören: { lat: 39.986, lng: 32.864 },
    Yenimahalle: { lat: 39.966, lng: 32.78 },
    Etimesgut: { lat: 39.946, lng: 32.663 },
    Mamak: { lat: 39.934, lng: 32.918 },
    Sincan: { lat: 39.972, lng: 32.576 },
  },
  İzmir: {
    Konak: { lat: 38.4192, lng: 27.1287 },
    Karşıyaka: { lat: 38.462, lng: 27.115 },
    Bornova: { lat: 38.463, lng: 27.22 },
    Buca: { lat: 38.386, lng: 27.178 },
    Bayraklı: { lat: 38.462, lng: 27.166 },
    Çiğli: { lat: 38.497, lng: 27.06 },
  },
  Bursa: {
    Nilüfer: { lat: 40.213, lng: 28.984 },
    Osmangazi: { lat: 40.195, lng: 29.06 },
    Yıldırım: { lat: 40.186, lng: 29.1 },
    Mudanya: { lat: 40.376, lng: 28.883 },
  },
  Antalya: {
    Muratpaşa: { lat: 36.887, lng: 30.709 },
    Konyaaltı: { lat: 36.866, lng: 30.637 },
    Kepez: { lat: 36.926, lng: 30.724 },
    Lara: { lat: 36.848, lng: 30.79 },
    Alanya: { lat: 36.544, lng: 31.999 },
  },
  Adana: {
    Seyhan: { lat: 36.991, lng: 35.331 },
    Çukurova: { lat: 37.05, lng: 35.28 },
    Yüreğir: { lat: 36.98, lng: 35.36 },
  },
  Konya: {
    Selçuklu: { lat: 37.92, lng: 32.5 },
    Meram: { lat: 37.85, lng: 32.45 },
    Karatay: { lat: 37.87, lng: 32.55 },
  },
  Gaziantep: {
    Şahinbey: { lat: 37.05, lng: 37.35 },
    Şehitkamil: { lat: 37.1, lng: 37.38 },
  },
  Kocaeli: {
    İzmit: { lat: 40.765, lng: 29.941 },
    Gebze: { lat: 40.803, lng: 29.431 },
    Başiskele: { lat: 40.7, lng: 29.9 },
  },
  Eskişehir: {
    Odunpazarı: { lat: 39.766, lng: 30.526 },
    Tepebaşı: { lat: 39.79, lng: 30.51 },
  },
  Muğla: {
    Bodrum: { lat: 37.034, lng: 27.4305 },
    Fethiye: { lat: 36.621, lng: 29.116 },
    Marmaris: { lat: 36.855, lng: 28.274 },
  },
  Trabzon: {
    Ortahisar: { lat: 41.0027, lng: 39.7168 },
    Akçaabat: { lat: 41.021, lng: 39.571 },
  },
};

export const PET_HOTEL_RADIUS_KM = 15;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function distanceKm(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function coordsForPlace(city: string, district: string): Coordinates | null {
  return DISTRICT_COORDS[city]?.[district] ?? null;
}

export function listingCoords(listing: Pick<Listing, "city" | "district">): Coordinates | null {
  return coordsForPlace(listing.city, listing.district);
}

export type ListingWithDistance = Listing & { distanceKm: number };

export function filterListingsWithinKm(
  listings: Listing[],
  origin: Coordinates,
  radiusKm = PET_HOTEL_RADIUS_KM,
): ListingWithDistance[] {
  return listings
    .map((listing) => {
      const coords = listingCoords(listing);
      if (!coords) return null;
      const d = distanceKm(origin, coords);
      if (d > radiusKm) return null;
      return { ...listing, distanceKm: d };
    })
    .filter((x): x is ListingWithDistance => x !== null)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(km < 10 ? 1 : 0)} km`;
}
