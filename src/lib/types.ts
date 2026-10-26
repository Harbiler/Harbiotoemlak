export type MembershipKind = "bireysel" | "kurumsal";
export type KurumsalType = "galeri" | "emlak";
export type UserRole = "user" | "admin";
export type ListingStatus = "pending" | "approved" | "hidden";
export type SellerBadge = "bireysel" | "galeri" | "emlak";

export type CategorySlug =
  | "emlak"
  | "vasita"
  | "motorsiklet"
  | "yedek-parca"
  | "is-makineleri"
  | "ustalar"
  | "hayvanlar"
  | "evcil-hayvan-otelleri"
  | "yardimci-arayanlar"
  | "bakici-arayanlar"
  | "ozel-ders"
  | "is-ilanlari";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
  membershipKind: MembershipKind;
  kurumsalType?: KurumsalType;
  companyName?: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  category: CategorySlug;
  title: string;
  description: string;
  price: number;
  currency: "TRY";
  city: string;
  district: string;
  photos: string[];
  contactName: string;
  contactPhone: string;
  sellerType: MembershipKind;
  /** Kurumsal alt tipi — Galeri / Emlak rozeti için */
  sellerKurumsalType?: KurumsalType;
  sellerId: string;
  status: ListingStatus;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  fields: Record<string, string | number | boolean>;
}

export interface AuthSession {
  userId: string;
}

export type PetHotelApplicationStatus = "pending" | "reviewed" | "rejected";

export interface PetHotelApplicationFile {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface PetHotelApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  idDocument: PetHotelApplicationFile;
  residenceDocument: PetHotelApplicationFile;
  status: PetHotelApplicationStatus;
  createdAt: string;
}

export function getSellerBadge(listing: Pick<Listing, "sellerType" | "sellerKurumsalType">): SellerBadge {
  if (listing.sellerType === "kurumsal" && listing.sellerKurumsalType === "galeri") return "galeri";
  if (listing.sellerType === "kurumsal" && listing.sellerKurumsalType === "emlak") return "emlak";
  return "bireysel";
}

export function sellerBadgeLabel(badge: SellerBadge): string {
  if (badge === "galeri") return "Galeri";
  if (badge === "emlak") return "Emlak";
  return "Bireysel";
}

/** İnsan okunur ilan numarası */
export function listingNumber(id: string): string {
  const digits = id.replace(/\D/g, "").slice(-6) || "100001";
  return `HRB${digits.padStart(6, "0")}`;
}
