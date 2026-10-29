import type { Listing } from "@/lib/types";

export const PET_HOTEL_AVAILABILITY = {
  musait: "Müsait",
  dolu: "Dolu",
} as const;

export type PetHotelAvailability =
  (typeof PET_HOTEL_AVAILABILITY)[keyof typeof PET_HOTEL_AVAILABILITY];

export function isPetHotelListing(
  listing: Pick<Listing, "category">,
): boolean {
  return listing.category === "evcil-hayvan-otelleri";
}

export function getPetHotelAvailability(
  listing: Pick<Listing, "category" | "fields">,
): PetHotelAvailability {
  if (!isPetHotelListing(listing)) return PET_HOTEL_AVAILABILITY.musait;
  const raw = String(listing.fields.musaitlik ?? "").trim();
  if (raw === PET_HOTEL_AVAILABILITY.dolu) return PET_HOTEL_AVAILABILITY.dolu;
  return PET_HOTEL_AVAILABILITY.musait;
}

export function isPetHotelAvailable(
  listing: Pick<Listing, "category" | "fields">,
): boolean {
  return getPetHotelAvailability(listing) === PET_HOTEL_AVAILABILITY.musait;
}
