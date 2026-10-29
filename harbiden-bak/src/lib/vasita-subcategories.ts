import type { BrandCatalog } from "@/lib/brand-models";
import { MOTORSIKLET_BRANDS, VASITA_BRANDS } from "@/lib/brand-models";

export type VasitaSubSlug =
  | "otomobil"
  | "elektrikli-araclar"
  | "arazi-suv-pickup"
  | "motorsiklet"
  | "minivan-panelvan"
  | "ticari-araclar"
  | "kiralik-araclar"
  | "deniz-araclari"
  | "hasarli-araclar"
  | "engelli-plakali"
  | "karavan"
  | "klasik-araclar"
  | "hava-araclari"
  | "atv"
  | "utv";

export interface VasitaSubcategory {
  slug: VasitaSubSlug;
  name: string;
  description: string;
  brands: BrandCatalog;
}

/** Pick a subset of models per brand from a source catalog. */
function pickModels(
  source: BrandCatalog,
  picks: Record<string, string[]>,
): BrandCatalog {
  const out: BrandCatalog = {};
  for (const [brand, models] of Object.entries(picks)) {
    const available = source[brand] ?? [];
    const chosen = models.filter((m) => available.includes(m));
    out[brand] = chosen.length ? chosen : models;
  }
  return out;
}

const ELEKTRIKLI_BRANDS: BrandCatalog = {
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  Togg: ["T10X", "T10F"],
  BMW: ["i4", "iX"],
  "Mercedes-Benz": ["EQC"],
  Volkswagen: ["ID.3", "ID.4"],
  Hyundai: ["Ioniq 5", "Kona"],
  Kia: ["EV6", "Niro"],
  Volvo: ["C40", "XC40"],
  Porsche: ["Taycan"],
  MG: ["4", "5", "Marvel R"],
  Cupra: ["Born"],
  Nissan: ["Leaf"],
  Dacia: ["Spring"],
  Audi: ["e-tron"],
  Mini: ["Cooper"],
  Opel: ["Corsa", "Mokka"],
  Peugeot: ["208", "2008"],
  Renault: ["Megane"],
  Fiat: ["500"],
  Citroën: ["Ami", "C4"],
};

const SUV_PICKUP_BRANDS: BrandCatalog = pickModels(VASITA_BRANDS, {
  Audi: ["Q3", "Q5", "Q7", "Q8"],
  BMW: ["X1", "X3", "X5", "X6"],
  "Mercedes-Benz": ["GLA", "GLC", "GLE"],
  Volkswagen: ["Tiguan", "T-Roc", "Touareg"],
  Renault: ["Captur", "Kadjar", "Austral"],
  Ford: ["Kuga", "Puma", "Ranger"],
  Toyota: ["C-HR", "RAV4", "Hilux", "Land Cruiser"],
  Honda: ["HR-V", "CR-V"],
  Hyundai: ["Tucson", "Santa Fe", "Bayon", "Kona"],
  Kia: ["Sportage", "Sorento", "Stonic"],
  Opel: ["Mokka", "Crossland", "Grandland"],
  Peugeot: ["2008", "3008", "5008"],
  Citroën: ["C5 Aircross"],
  Skoda: ["Kamiq", "Karoq", "Kodiaq"],
  Seat: ["Arona", "Ateca", "Tarraco"],
  Cupra: ["Formentor", "Ateca"],
  Volvo: ["XC40", "XC60", "XC90"],
  Dacia: ["Duster", "Jogger"],
  Nissan: ["Juke", "Qashqai", "X-Trail", "Navara"],
  Mazda: ["CX-3", "CX-30", "CX-5", "CX-60"],
  Mitsubishi: ["ASX", "Eclipse Cross", "Outlander", "L200"],
  Suzuki: ["Vitara", "S-Cross", "Jimny"],
  Jeep: ["Renegade", "Compass", "Avenger", "Wrangler", "Grand Cherokee"],
  "Land Rover": [
    "Defender",
    "Discovery",
    "Discovery Sport",
    "Range Rover Evoque",
    "Range Rover Sport",
    "Range Rover",
  ],
  Porsche: ["Cayenne", "Macan"],
  Tesla: ["Model Y", "Model X"],
  Togg: ["T10X"],
  SsangYong: ["Tivoli", "Korando", "Rexton", "Musso"],
  Chery: ["Omoda 5", "Tiggo 7", "Tiggo 8"],
  MG: ["ZS", "HS"],
  Fiat: ["Egea Cross", "Fullback"],
  Chevrolet: ["Captiva", "Trax"],
});

const MINIVAN_BRANDS: BrandCatalog = {
  Volkswagen: ["Caddy", "Transporter"],
  Ford: ["Tourneo Custom", "Transit"],
  Renault: ["Kangoo"],
  Fiat: ["Doblo", "Fiorino"],
  Opel: ["Combo"],
  Peugeot: ["Rifter", "Partner"],
  Citroën: ["Berlingo"],
  Toyota: ["Proace"],
  Mercedes: ["Vito", "V-Class", "Citan"],
  "Mercedes-Benz": ["Vito", "V-Class", "Citan"],
  Dacia: ["Jogger"],
  Hyundai: ["Staria", "H-1"],
  Kia: ["Carnival"],
};

const TICARI_BRANDS: BrandCatalog = {
  Ford: ["Transit", "Ranger", "Tourneo Custom"],
  Volkswagen: ["Caddy", "Transporter", "Crafter"],
  Renault: ["Kangoo", "Master", "Trafic"],
  Fiat: ["Doblo", "Fiorino", "Ducato", "Fullback"],
  Mercedes: ["Sprinter", "Vito", "Citan"],
  "Mercedes-Benz": ["Sprinter", "Vito", "Citan"],
  Peugeot: ["Partner", "Boxer", "Expert"],
  Citroën: ["Berlingo", "Jumper", "Jumpy"],
  Opel: ["Combo", "Movano", "Vivaro"],
  Toyota: ["Hilux", "Proace", "Hiace"],
  Iveco: ["Daily", "Eurocargo"],
  Isuzu: ["D-Max", "NPR", "NQR"],
  Mitsubishi: ["L200", "Canter"],
  Man: ["TGE", "TGL"],
};

const DENIZ_BRANDS: BrandCatalog = {
  Yamaha: ["FX Cruiser", "VX Deluxe", "242X", "AR190"],
  SeaDoo: ["GTX", "RXT-X", "Spark", "FishPro"],
  Kawasaki: ["Ultra 310", "STX 160"],
  Bayliner: ["Element M15", "VR5", "Trophy 22"],
  Zodiac: ["Medline 6.8", "Pro 7", "Open 5.5"],
  Quicksilver: ["Activ 555", "Activ 675", "Sport 755"],
  Jeanneau: ["Cap Camarat 6.5", "Merry Fisher 795", "Leader 9"],
  Beneteau: ["Antares 8", "Flyer 8", "Oceanis 30.1"],
  Ranieri: ["Voyager 23", "Cayman 28"],
  ZodiacNautic: ["Open 6.5", "Medline 7.5"],
  Parsun: ["F15", "F40", "F60"],
  Mercury: ["15 HP", "40 HP", "60 HP", "115 HP"],
  HondaMarine: ["BF15", "BF40", "BF100"],
};

const KARAVAN_BRANDS: BrandCatalog = {
  Hobby: ["Excellent", "De Luxe", "Prestige", "OnTour"],
  Knaus: ["Sport", "Südwind", "Live I", "Van TI"],
  Fendt: ["Bianco", "Tendenza", "Apero"],
  Burstner: ["Premio", "Averso", "Lyseo"],
  Adria: ["Action", "Adora", "Alpina", "Matrix"],
  Dethleffs: ["Beduin", "C'Joy", "Globebus"],
  Hymer: ["Free", "B-ML", "Exsis"],
  Carthago: ["C-Tourer", "Chic C-Line"],
  RollerTeam: ["Zefiro", "Livingstone", "Kronos"],
  Mobilvetta: ["Kea", "K-Yacht"],
  Weinsberg: ["CaraOne", "CaraCore", "X-Cursion"],
  Swift: ["Challenger", "Escape", "Elegance"],
  Bailey: ["Unicorn", "Phoenix", "Autograph"],
  LMC: ["Style", "Musica", "Breezer"],
};

const KLASIK_BRANDS: BrandCatalog = {
  Mercedes: ["190 SL", "W123", "Pagoda", "190E"],
  "Mercedes-Benz": ["190 SL", "W123", "Pagoda", "190E"],
  BMW: ["2002", "E30", "E36", "Isetta"],
  Volkswagen: ["Beetle", "Golf Mk1", "Golf Mk2", "T2 Bulli"],
  Porsche: ["911", "356", "914", "924"],
  Fiat: ["500", "124 Spider", "131"],
  Alfa: ["Giulia GT", "Spider", "Alfasud"],
  "Alfa Romeo": ["Giulia GT", "Spider", "Alfasud"],
  Ford: ["Mustang", "Capri", "Cortina", "Escort Mk1"],
  Chevrolet: ["Camaro", "Corvette", "Bel Air"],
  Jaguar: ["E-Type", "XK", "XJ6", "Mk2"],
  Mini: ["Classic Mini", "Moke"],
  Triumph: ["TR6", "Spitfire", "Stag"],
  MG: ["MGB", "Midget", "TD"],
  Anadol: ["A1", "A2", "STC-16"],
  Tofaş: ["Murat 124", "Serçe", "Şahin", "Doğan"],
  Renault: ["12", "R5", "R4", "Toros"],
};

const HAVA_BRANDS: BrandCatalog = {
  Cessna: ["172 Skyhawk", "182 Skylane", "152", "206"],
  Piper: ["PA-28 Cherokee", "PA-32", "Seneca", "Cub"],
  Diamond: ["DA40", "DA42", "DA62"],
  Cirrus: ["SR20", "SR22", "SF50 Vision"],
  Robinson: ["R22", "R44", "R66"],
  Bell: ["206", "407", "505"],
  AirbusHelicopters: ["H125", "H130", "H145"],
  Ultralight: ["Zenith CH750", "Kitfox", "Flight Design CT"],
  Paramotor: ["Ozone Spyder", "Dudek Nucleon", "Gin Explorer"],
  Drone: ["DJI Agras", "DJI Matrice", "Autel EVO"],
};

const ATV_BRANDS: BrandCatalog = {
  Yamaha: ["Grizzly 700", "Kodiak 450", "Raptor 700", "YFZ450"],
  Honda: ["TRX420", "TRX520", "TRX680", "FourTrax"],
  Kawasaki: ["Brute Force 750", "KFX450", "Teryx"],
  Suzuki: ["KingQuad 500", "KingQuad 750", "LT-Z400"],
  Polaris: ["Sportsman 570", "Sportsman 850", "Outlaw 70"],
  CanAm: ["Outlander 650", "Outlander 1000", "Renegade 1000", "DS 250"],
  CFMoto: ["CForce 520", "CForce 625", "CForce 1000"],
  Kymco: ["MXU 300", "MXU 500", "MXU 700"],
  TGB: ["Blade 550", "Blade 1000"],
  Hisun: ["HS 500", "Sector 750"],
  Linhai: ["LH 300", "LH 500", "LH 550"],
};

const UTV_BRANDS: BrandCatalog = {
  Polaris: ["RANGER 1000", "RZR XP 1000", "GENERAL 1000", "RANGER XP"],
  CanAm: ["Maverick X3", "Maverick Sport", "Defender HD10", "Commander"],
  Yamaha: ["Wolverine RMAX", "Viking 700", "YXZ1000R"],
  Honda: ["Pioneer 700", "Pioneer 1000", "Talon 1000"],
  Kawasaki: ["Teryx KRX", "Mule PRO-FX", "Mule SX"],
  CFMoto: ["UForce 1000", "ZForce 950", "UForce 600"],
  CubCadet: ["Challenger 750", "Challenger MX"],
  Hisun: ["Sector 1000", "Strike 1000"],
  Massimo: ["T-Boss 550", "T-Boss 1100"],
  Intimidator: ["GC1K", "GC750"],
};

export const VASITA_SUBCATEGORIES: VasitaSubcategory[] = [
  {
    slug: "otomobil",
    name: "Otomobil",
    description: "Sedan, hatchback ve coupe binek araçlar",
    brands: VASITA_BRANDS,
  },
  {
    slug: "elektrikli-araclar",
    name: "Elektrikli Araçlar",
    description: "Tam elektrikli ve plug-in hibrit binek araçlar",
    brands: ELEKTRIKLI_BRANDS,
  },
  {
    slug: "arazi-suv-pickup",
    name: "Arazi, SUV & Pickup",
    description: "SUV, crossover, arazi ve pickup modelleri",
    brands: SUV_PICKUP_BRANDS,
  },
  {
    slug: "motorsiklet",
    name: "Motorsiklet",
    description: "Motosiklet, scooter ve naked modeller",
    brands: MOTORSIKLET_BRANDS,
  },
  {
    slug: "minivan-panelvan",
    name: "Minivan & Panelvan",
    description: "Aile minivanları ve panelvanlar",
    brands: MINIVAN_BRANDS,
  },
  {
    slug: "ticari-araclar",
    name: "Ticari Araçlar",
    description: "Kamyonet, van ve hafif ticari araçlar",
    brands: TICARI_BRANDS,
  },
  {
    slug: "kiralik-araclar",
    name: "Kiralık Araçlar",
    description: "Günlük, haftalık ve uzun dönem kiralık araçlar",
    brands: VASITA_BRANDS,
  },
  {
    slug: "deniz-araclari",
    name: "Deniz Araçları",
    description: "Tekne, jet ski ve deniz motorları",
    brands: DENIZ_BRANDS,
  },
  {
    slug: "hasarli-araclar",
    name: "Hasarlı Araçlar",
    description: "Hasar kayıtlı, pert ve eksperli araçlar",
    brands: VASITA_BRANDS,
  },
  {
    slug: "engelli-plakali",
    name: "Engelli Plakalı Araçlar",
    description: "Engelli plakalı ve ÖTV muafiyetli araçlar",
    brands: VASITA_BRANDS,
  },
  {
    slug: "karavan",
    name: "Karavan",
    description: "Çekme karavan, motokaravan ve kamp araçları",
    brands: KARAVAN_BRANDS,
  },
  {
    slug: "klasik-araclar",
    name: "Klasik Araçlar",
    description: "Koleksiyonluk ve klasik otomobiller",
    brands: KLASIK_BRANDS,
  },
  {
    slug: "hava-araclari",
    name: "Hava Araçları",
    description: "Uçak, helikopter ve ultralight araçlar",
    brands: HAVA_BRANDS,
  },
  {
    slug: "atv",
    name: "ATV",
    description: "Dört teker arazi motosikletleri",
    brands: ATV_BRANDS,
  },
  {
    slug: "utv",
    name: "UTV",
    description: "Yan yana oturmalı arazi araçları (side-by-side)",
    brands: UTV_BRANDS,
  },
];

export function getVasitaSubcategory(
  slug: string,
): VasitaSubcategory | undefined {
  return VASITA_SUBCATEGORIES.find((s) => s.slug === slug);
}

export function vasitaSubPath(slug: VasitaSubSlug | string): string {
  return `/kategori/vasita/${slug}`;
}

/** Catalog key used by progressive-enhancement Marka→Model script. */
export function vasitaCatalogKey(subSlug: string): string {
  return `vasita:${subSlug}`;
}

export function allVasitaBrandCatalogs(): Record<string, BrandCatalog> {
  const out: Record<string, BrandCatalog> = {
    vasita: VASITA_BRANDS,
  };
  for (const sub of VASITA_SUBCATEGORIES) {
    out[vasitaCatalogKey(sub.slug)] = sub.brands;
  }
  return out;
}
