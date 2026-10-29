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
  /** T.C. Kimlik No — 11 hane (yeni kayıtlarda zorunlu) */
  tcKimlikNo?: string;
  /** Açık adres (yeni kayıtlarda zorunlu) */
  address?: string;
  role: UserRole;
  membershipKind: MembershipKind;
  kurumsalType?: KurumsalType;
  companyName?: string;
  createdAt: string;
}

/** T.C. Kimlik No: yalnızca 11 rakam. */
export function isValidTcKimlikNo(value: string): boolean {
  return /^\d{11}$/.test(value.trim());
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
  /** Yayın geçerlilik bitişi (ISO). Yeni ilanlar yayın tarihinden itibaren 1 yıl ücretsiz. */
  validUntil: string;
  fields: Record<string, string | number | boolean>;
  /**
   * Kimlik ön/arka veya pasaport (localStorage data URL).
   * Bakıcı Arayanlar ilanlarında zorunlu; genel ilan özelliklerinde gösterilmez.
   */
  identityDocs?: ListingIdentityDocs;
}

export interface AuthSession {
  userId: string;
}

export type PetHotelApplicationStatus = "pending" | "reviewed" | "rejected";
export type CaregiverApplicationStatus = "pending" | "reviewed" | "rejected";

export interface PetHotelApplicationFile {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

/** Shared uploaded file payload for partner applications. */
export type ApplicationFile = PetHotelApplicationFile;

/** Kimlik / pasaport yüklemeleri — public özellik listesinde yer almaz. */
export interface ListingIdentityDocs {
  idFront?: ApplicationFile;
  idBack?: ApplicationFile;
  passport?: ApplicationFile;
}

export interface PetHotelApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  /** Tesis / başvuran adresi (yeni başvurularda zorunlu) */
  address?: string;
  idDocument: PetHotelApplicationFile;
  residenceDocument: PetHotelApplicationFile;
  status: PetHotelApplicationStatus;
  createdAt: string;
}

export interface CaregiverApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  /** Örn. Türkmenistanlı, Türkiyeli */
  vatandaslik: string;
  residenceDocument: ApplicationFile;
  criminalRecordDocument: ApplicationFile;
  profilePhoto: ApplicationFile;
  /** Kimlik ön — pasaport yoksa ön+arka zorunlu */
  idFront?: ApplicationFile;
  /** Kimlik arka — pasaport yoksa ön+arka zorunlu */
  idBack?: ApplicationFile;
  /** Pasaport — kimlik ön+arka yerine yeterli */
  passport?: ApplicationFile;
  status: CaregiverApplicationStatus;
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
