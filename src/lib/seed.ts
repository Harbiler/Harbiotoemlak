import type { Listing, User } from "./types";

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();

/** Demo / bootstrap accounts — not listings. */
export const SEED_USERS: User[] = [
  {
    id: "u-admin",
    email: "admin@harbidenbak.com",
    password: "admin123",
    name: "Harbiden Bak Admin",
    phone: "0500 000 00 00",
    tcKimlikNo: "10000000146",
    address: "Caferağa Mah. Moda Cad. No:1, Kadıköy / İstanbul",
    role: "admin",
    membershipKind: "bireysel",
    createdAt: daysAgo(90),
  },
  {
    id: "u-bireysel",
    email: "ayse@ornek.com",
    password: "demo123",
    name: "Ayşe Yılmaz",
    phone: "0532 111 22 33",
    tcKimlikNo: "10000000146",
    address: "Fenerbahçe Mah. Ihlamur Sok. No:12, Kadıköy / İstanbul",
    role: "user",
    membershipKind: "bireysel",
    createdAt: daysAgo(40),
  },
  {
    id: "u-galeri",
    email: "galeri@ornek.com",
    password: "demo123",
    name: "Mehmet Kaya",
    phone: "0533 444 55 66",
    tcKimlikNo: "10000000146",
    address: "Organize Sanayi Bölgesi 3. Cad. No:45, Nilüfer / Bursa",
    role: "user",
    membershipKind: "kurumsal",
    kurumsalType: "galeri",
    companyName: "Kaya Oto Galeri",
    createdAt: daysAgo(60),
  },
  {
    id: "u-emlak",
    email: "emlak@ornek.com",
    password: "demo123",
    name: "Zeynep Demir",
    phone: "0535 777 88 99",
    tcKimlikNo: "10000000146",
    address: "Bahçelievler Mah. 7. Cad. No:8, Çankaya / Ankara",
    role: "user",
    membershipKind: "kurumsal",
    kurumsalType: "emlak",
    companyName: "Demir Emlak Ofisi",
    createdAt: daysAgo(55),
  },
];

/**
 * Former sample listing ids — stripped once on seedVersion bump so
 * user-created localStorage listings (l-<timestamp>) are preserved.
 */
export const LEGACY_SEED_LISTING_IDS: readonly string[] = [
  "l-emlak-1",
  "l-emlak-2",
  "l-emlak-3",
  "l-emlak-4",
  "l-vasita-1",
  "l-vasita-2",
  "l-moto-1",
  "l-moto-2",
  "l-parca-1",
  "l-parca-2",
  "l-vasita-3",
  "l-vasita-4",
  "l-vasita-ev-1",
  "l-vasita-suv-1",
  "l-vasita-ticari-1",
  "l-vasita-atv-1",
  "l-moto-3",
  "l-parca-3",
  "l-makine-1",
  "l-makine-2",
  "l-usta-1",
  "l-usta-2",
  "l-hayvan-1",
  "l-hayvan-2",
  "l-otel-1",
  "l-otel-2",
  "l-otel-3",
  "l-otel-4",
  "l-otel-5",
  "l-otel-6",
  "l-yardimci-1",
  "l-yardimci-2",
  "l-bakici-1",
  "l-bakici-2",
  "l-ders-1",
  "l-ders-2",
  "l-is-1",
  "l-is-2",
  "l-is-3",
  "l-toptan-giyim-1",
  "l-toptan-giyim-2",
  "l-toptan-ayakkabi-1",
  "l-toptan-kumas-1",
  "l-toptan-gida-1",
];

/** No sample listings — lists stay empty until users publish. */
export const SEED_LISTINGS: Listing[] = [];
