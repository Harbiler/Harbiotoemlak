/**
 * Toptancılar — wholesale trade professions (toptan meslekleri).
 * Featured hub rows mirror Vasıta brand lists (name left, listing count right).
 */

export const WHOLESALE_TRADE_FIELD = "toptanMeslek";

/** Full set used on the listing form (seller picks which wholesale trade they are). */
export const WHOLESALE_TRADES = [
  "Giyim Toptancıları",
  "Ayakkabı Toptancıları",
  "Kumaş Toptancıları",
  "Gıda Toptancıları",
  "Kozmetik Toptancıları",
  "Elektronik Toptancıları",
  "Mobilya Toptancıları",
  "Oyuncak Toptancıları",
  "Kırtasiye Toptancıları",
  "Züccaciye Toptancıları",
  "Ev Tekstili Toptancıları",
  "Çanta Toptancıları",
  "Aksesuar Toptancıları",
  "Bijuteri Toptancıları",
  "Tuhafiye Toptancıları",
  "Deri & Kundura Toptancıları",
  "Hırdavat Toptancıları",
  "Temizlik Ürünleri Toptancıları",
  "Bebek & Çocuk Ürünleri Toptancıları",
  "Spor Malzemeleri Toptancıları",
  "Halı & Kilim Toptancıları",
  "Perde & Tül Toptancıları",
  "Ambalaj Toptancıları",
  "İçecek Toptancıları",
  "Şekerleme & Kuruyemiş Toptancıları",
  "Çiçek & Süs Bitkisi Toptancıları",
  "Diğer Toptancılar",
] as const;

export type WholesaleTrade = (typeof WHOLESALE_TRADES)[number];

export type WholesaleHubSlug = "giyim" | "ayakkabi" | "kumas";

export interface WholesaleHubSubcategory {
  slug: WholesaleHubSlug;
  name: WholesaleTrade;
  description: string;
}

/**
 * Homepage / category hub rows (listing counts on the right, like brand lists).
 * Only these three appear as the primary subcategory index.
 */
export const WHOLESALE_HUB_SUBCATEGORIES: WholesaleHubSubcategory[] = [
  {
    slug: "giyim",
    name: "Giyim Toptancıları",
    description: "Konfeksiyon, hazır giyim ve toptan tekstil satışı",
  },
  {
    slug: "ayakkabi",
    name: "Ayakkabı Toptancıları",
    description: "Ayakkabı, bot ve terlik toptan ticareti",
  },
  {
    slug: "kumas",
    name: "Kumaş Toptancıları",
    description: "Dokuma, örme ve kumaş metraj toptanı",
  },
];

export function getWholesaleHub(slug: string): WholesaleHubSubcategory | undefined {
  return WHOLESALE_HUB_SUBCATEGORIES.find((s) => s.slug === slug);
}

export function wholesaleHubPath(slug: WholesaleHubSlug | string): string {
  return `/kategori/toptancilar/${slug}`;
}

export function isWholesaleTrade(value: string): value is WholesaleTrade {
  return (WHOLESALE_TRADES as readonly string[]).includes(value);
}

export function listingWholesaleTrade(
  fields: Record<string, string | number | boolean> | undefined,
): string {
  const raw = fields?.[WHOLESALE_TRADE_FIELD];
  return raw == null ? "" : String(raw);
}
