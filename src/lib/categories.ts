import type { CategorySlug } from "./types";

export interface CategoryField {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

export interface CategoryDef {
  slug: CategorySlug;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  accent: string;
  fields: CategoryField[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: "emlak",
    name: "Emlak",
    shortName: "Emlak",
    description: "Konut, işyeri, arsa ve kiralık gayrimenkul ilanları",
    icon: "building",
    accent: "#DB2777",
    fields: [
      {
        key: "emlakTipi",
        label: "Emlak Tipi",
        type: "select",
        options: ["Daire", "Villa", "Müstakil Ev", "İşyeri", "Arsa", "Yazlık"],
        required: true,
      },
      {
        key: "ilanTipi",
        label: "İlan Tipi",
        type: "select",
        options: ["Satılık", "Kiralık", "Devren"],
        required: true,
      },
      { key: "metrekare", label: "m²", type: "number", required: true },
      {
        key: "odaSayisi",
        label: "Oda Sayısı",
        type: "select",
        options: ["1+0", "1+1", "2+1", "3+1", "4+1", "5+"],
      },
      { key: "kat", label: "Kat", type: "text", placeholder: "örn. 5 / 12" },
      {
        key: "isinma",
        label: "Isınma",
        type: "select",
        options: ["Doğalgaz", "Kombi", "Merkezi", "Klima", "Soba"],
      },
    ],
  },
  {
    slug: "vasita",
    name: "Vasıta",
    shortName: "Vasıta",
    description: "Otomobil, SUV, ticari araç ve ikinci el araç ilanları",
    icon: "car",
    accent: "#BE185D",
    fields: [
      { key: "marka", label: "Marka", type: "text", required: true },
      { key: "model", label: "Model", type: "text", required: true },
      { key: "yil", label: "Yıl", type: "number", required: true },
      { key: "km", label: "Kilometre", type: "number", required: true },
      {
        key: "yakit",
        label: "Yakıt",
        type: "select",
        options: ["Benzin", "Dizel", "LPG", "Hibrit", "Elektrik"],
        required: true,
      },
      {
        key: "vites",
        label: "Vites",
        type: "select",
        options: ["Manuel", "Otomatik", "Yarı Otomatik"],
        required: true,
      },
      {
        key: "kasa",
        label: "Kasa Tipi",
        type: "select",
        options: ["Sedan", "Hatchback", "SUV", "Station", "Coupe", "Pickup"],
      },
      { key: "renk", label: "Renk", type: "text" },
    ],
  },
  {
    slug: "motorsiklet",
    name: "Motorsiklet",
    shortName: "Motorsiklet",
    description: "Motosiklet, scooter ve ATV ilanları",
    icon: "bike",
    accent: "#EC4899",
    fields: [
      { key: "marka", label: "Marka", type: "text", required: true },
      { key: "model", label: "Model", type: "text", required: true },
      { key: "yil", label: "Yıl", type: "number", required: true },
      { key: "km", label: "Kilometre", type: "number", required: true },
      { key: "cc", label: "Motor Hacmi (cc)", type: "number", required: true },
      {
        key: "tip",
        label: "Tip",
        type: "select",
        options: ["Naked", "Sport", "Scooter", "Enduro", "Chopper", "ATV"],
      },
    ],
  },
  {
    slug: "yedek-parca",
    name: "Yedek Parça & Aksesuar",
    shortName: "Yedek Parça",
    description: "Orijinal ve yan sanayi yedek parça, lastik, aksesuar",
    icon: "wrench",
    accent: "#F472B6",
    fields: [
      {
        key: "parcaTipi",
        label: "Parça Tipi",
        type: "select",
        options: ["Motor", "Fren", "Süspansiyon", "Lastik", "Aksesuar", "Elektrik", "Kaporta"],
        required: true,
      },
      { key: "uyumluMarka", label: "Uyumlu Marka/Model", type: "text", required: true },
      {
        key: "durum",
        label: "Durum",
        type: "select",
        options: ["Sıfır", "İkinci El", "Yenilenmiş"],
        required: true,
      },
      {
        key: "orijinal",
        label: "Orijinal / Yan Sanayi",
        type: "select",
        options: ["Orijinal", "Yan Sanayi", "OEM"],
      },
    ],
  },
  {
    slug: "is-makineleri",
    name: "İş Makineleri & Sanayi",
    shortName: "İş Makineleri",
    description: "Kepçe, forklift, jeneratör ve sanayi ekipmanları",
    icon: "factory",
    accent: "#E11D48",
    fields: [
      {
        key: "makineTipi",
        label: "Makine Tipi",
        type: "select",
        options: ["Kepçe", "Forklift", "Jeneratör", "Vinç", "Traktör", "Kompresör", "Diğer"],
        required: true,
      },
      { key: "marka", label: "Marka", type: "text", required: true },
      { key: "model", label: "Model", type: "text" },
      { key: "yil", label: "Yıl", type: "number" },
      { key: "calismaSaati", label: "Çalışma Saati", type: "number" },
      {
        key: "durum",
        label: "Durum",
        type: "select",
        options: ["Sıfır", "İkinci El", "Kiralık"],
      },
    ],
  },
  {
    slug: "ustalar",
    name: "Ustalar ve Hizmetler",
    shortName: "Ustalar",
    description: "Tadilat, tesisat, elektrik ve profesyonel hizmet ilanları",
    icon: "hammer",
    accent: "#DB2777",
    fields: [
      {
        key: "hizmet",
        label: "Hizmet",
        type: "select",
        options: [
          "Boyacı",
          "Tesisatçı",
          "Elektrikçi",
          "Marangoz",
          "Klima Servisi",
          "Temizlik",
          "Nakliyat",
          "Diğer",
        ],
        required: true,
      },
      { key: "deneyim", label: "Deneyim (yıl)", type: "number" },
      { key: "hizmetAlani", label: "Hizmet Bölgesi", type: "text", placeholder: "örn. İstanbul Anadolu" },
      {
        key: "ucretTipi",
        label: "Ücret Tipi",
        type: "select",
        options: ["Saatlik", "İş Başı", "Keşif Ücretsiz", "Anlaşmalı"],
      },
    ],
  },
  {
    slug: "hayvanlar",
    name: "Hayvanlar Alemi",
    shortName: "Hayvanlar",
    description: "Evcil hayvan, çiftlik hayvanı ve pet ürünleri",
    icon: "paw",
    accent: "#F43F5E",
    fields: [
      {
        key: "tur",
        label: "Tür",
        type: "select",
        options: ["Köpek", "Kedi", "Kuş", "Balık", "Tavşan", "Çiftlik", "Diğer"],
        required: true,
      },
      { key: "irk", label: "Irk / Cins", type: "text", required: true },
      { key: "yas", label: "Yaş", type: "text", placeholder: "örn. 3 aylık" },
      {
        key: "cinsiyet",
        label: "Cinsiyet",
        type: "select",
        options: ["Erkek", "Dişi", "Belirtilmemiş"],
      },
      {
        key: "asi",
        label: "Aşı Durumu",
        type: "select",
        options: ["Tam", "Kısmi", "Yok", "Bilinmiyor"],
      },
    ],
  },
  {
    slug: "evcil-hayvan-otelleri",
    name: "Evcil Hayvan Otelleri",
    shortName: "Pet Otelleri",
    description: "Pet otel, pansiyon ve geçici bakım hizmetleri",
    icon: "hotel",
    accent: "#FB7185",
    fields: [
      { key: "tesisAdi", label: "Tesis Adı", type: "text", required: true },
      {
        key: "kabul",
        label: "Kabul Edilen",
        type: "select",
        options: ["Köpek", "Kedi", "Köpek & Kedi", "Tüm Evcil"],
        required: true,
      },
      { key: "kapasite", label: "Kapasite", type: "number" },
      { key: "gunlukUcret", label: "Günlük Ücret (bilgi)", type: "number" },
      {
        key: "hizmetler",
        label: "Ek Hizmetler",
        type: "text",
        placeholder: "örn. veteriner, oyun alanı",
      },
    ],
  },
  {
    slug: "yardimci-arayanlar",
    name: "Yardımcı Arayanlar",
    shortName: "Yardımcı",
    description: "Ev yardımcısı, gündelikçi ve temizlik personeli arayanlar",
    icon: "home-care",
    accent: "#BE185D",
    fields: [
      {
        key: "pozisyon",
        label: "Pozisyon",
        type: "select",
        options: ["Ev Yardımcısı", "Gündelikçi", "Temizlikçi", "Ütücü", "Aşçı"],
        required: true,
      },
      {
        key: "calisma",
        label: "Çalışma Şekli",
        type: "select",
        options: ["Tam Zamanlı", "Yarı Zamanlı", "Gündelik", "Yatılı"],
        required: true,
      },
      { key: "maas", label: "Maaş / Ücret Bilgisi", type: "text" },
      {
        key: "deneyimGerekli",
        label: "Deneyim",
        type: "select",
        options: ["Gerekli", "Tercihen", "Gerekmez"],
      },
    ],
  },
  {
    slug: "bakici-arayanlar",
    name: "Bakıcı Arayanlar",
    shortName: "Bakıcı",
    description: "Bebek bakıcısı, yaşlı bakımı ve hasta bakımı ilanları",
    icon: "heart",
    accent: "#E879F9",
    fields: [
      {
        key: "bakimTipi",
        label: "Bakım Tipi",
        type: "select",
        options: ["Bebek / Çocuk", "Yaşlı", "Hasta", "Engelli"],
        required: true,
      },
      {
        key: "calisma",
        label: "Çalışma Şekli",
        type: "select",
        options: ["Yatılı", "Gündüzlü", "Saatlik", "Hafta Sonu"],
        required: true,
      },
      { key: "yasAraligi", label: "Yaş Aralığı (bakılan)", type: "text" },
      {
        key: "sertifika",
        label: "Sertifika / Referans",
        type: "select",
        options: ["Gerekli", "Tercihen", "Gerekmez"],
      },
    ],
  },
  {
    slug: "ozel-ders",
    name: "Özel Ders Verenler",
    shortName: "Özel Ders",
    description: "Matematik, dil, müzik ve sınav hazırlık özel dersleri",
    icon: "book",
    accent: "#D946EF",
    fields: [
      {
        key: "ders",
        label: "Ders / Konu",
        type: "select",
        options: [
          "Matematik",
          "Fizik",
          "Kimya",
          "İngilizce",
          "Almanca",
          "Müzik",
          "YKS",
          "LGS",
          "Diğer",
        ],
        required: true,
      },
      { key: "seviye", label: "Seviye", type: "text", placeholder: "örn. Lise / Üniversite" },
      { key: "saatlikUcret", label: "Saatlik Ücret (bilgi)", type: "number" },
      {
        key: "format",
        label: "Ders Formatı",
        type: "select",
        options: ["Yüz Yüze", "Online", "Hibrit"],
      },
      { key: "deneyim", label: "Deneyim (yıl)", type: "number" },
    ],
  },
  {
    slug: "is-ilanlari",
    name: "İş İlanları",
    shortName: "İş İlanları",
    description: "Tam zamanlı, part-time ve staj pozisyonları",
    icon: "briefcase",
    accent: "#9D174D",
    fields: [
      { key: "pozisyon", label: "Pozisyon", type: "text", required: true },
      {
        key: "calisma",
        label: "Çalışma Şekli",
        type: "select",
        options: ["Tam Zamanlı", "Yarı Zamanlı", "Staj", "Freelance", "Uzaktan"],
        required: true,
      },
      { key: "sektor", label: "Sektör", type: "text" },
      { key: "maasAraligi", label: "Maaş Aralığı", type: "text", placeholder: "örn. 40.000–55.000 TL" },
      {
        key: "deneyim",
        label: "Deneyim",
        type: "select",
        options: ["0–1 yıl", "1–3 yıl", "3–5 yıl", "5+ yıl", "Fark etmez"],
      },
    ],
  },
];

export function getCategory(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryPath(slug: CategorySlug): string {
  return `/kategori/${slug}`;
}
