import type { CategorySlug } from "./types";

/** Brand → models for vehicle-like categories */
export type BrandCatalog = Record<string, string[]>;

export const VASITA_BRANDS: BrandCatalog = {
  Audi: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "e-tron", "e-tron GT", "TT", "R8"],
  BMW: [
    "1 Serisi",
    "2 Serisi",
    "3 Serisi",
    "4 Serisi",
    "5 Serisi",
    "6 Serisi",
    "7 Serisi",
    "8 Serisi",
    "X1",
    "X2",
    "X3",
    "X4",
    "X5",
    "X6",
    "X7",
    "Z4",
    "i4",
    "iX",
    "iX1",
    "iX3",
  ],
  "Mercedes-Benz": [
    "A Serisi",
    "B Serisi",
    "C Serisi",
    "E Serisi",
    "S Serisi",
    "CLA",
    "CLS",
    "GLA",
    "GLB",
    "GLC",
    "GLE",
    "GLS",
    "G Serisi",
    "EQA",
    "EQB",
    "EQC",
    "EQE",
    "EQS",
    "AMG GT",
  ],
  Volkswagen: [
    "Polo",
    "Golf",
    "Golf 1.5 TSI",
    "Golf GTI",
    "Jetta",
    "Passat",
    "Arteon",
    "Scirocco",
    "Beetle",
    "Tiguan",
    "T-Roc",
    "T-Cross",
    "Touareg",
    "Taigo",
    "Caddy",
    "Transporter",
    "ID.3",
    "ID.4",
    "ID.7",
  ],
  Renault: [
    "Clio",
    "Clio Joy",
    "Megane",
    "Megane E-Tech",
    "Fluence",
    "Talisman",
    "Laguna",
    "Symbol",
    "Twingo",
    "Zoe",
    "Captur",
    "Kadjar",
    "Austral",
    "Scenic",
    "Espace",
    "Kangoo",
    "Express",
    "Master",
  ],
  Fiat: [
    "Egea",
    "Egea Cross",
    "Linea",
    "Albea",
    "Palio",
    "Punto",
    "500",
    "500X",
    "500L",
    "Panda",
    "Tipo",
    "Bravo",
    "Doblo",
    "Fiorino",
    "Fullback",
  ],
  Ford: [
    "Fiesta",
    "Focus",
    "Mondeo",
    "Fusion",
    "Puma",
    "Kuga",
    "EcoSport",
    "Escape",
    "Explorer",
    "Ranger",
    "Courier",
    "Connect",
    "Transit",
    "Tourneo Custom",
    "Tourneo Connect",
    "Mustang",
    "Mustang Mach-E",
  ],
  Toyota: [
    "Corolla",
    "Corolla Hybrid",
    "Corolla Cross",
    "Auris",
    "Avensis",
    "Yaris",
    "Yaris Cross",
    "Aygo",
    "C-HR",
    "RAV4",
    "Hilux",
    "Land Cruiser",
    "Camry",
    "Prius",
    "Verso",
    "Proace",
    "bZ4X",
  ],
  Honda: ["Civic", "Civic Type R", "City", "Jazz", "Accord", "HR-V", "CR-V", "ZR-V", "e:Ny1"],
  Hyundai: [
    "i10",
    "i20",
    "i30",
    "Accent",
    "Getz",
    "Elantra",
    "Sonata",
    "Ioniq",
    "Ioniq 5",
    "Ioniq 6",
    "Bayon",
    "Kona",
    "Tucson",
    "Santa Fe",
    "ix35",
    "Matrix",
  ],
  Kia: [
    "Picanto",
    "Rio",
    "Ceed",
    "Cerato",
    "Optima",
    "Stinger",
    "Sportage",
    "Sorento",
    "Stonic",
    "XCeed",
    "Niro",
    "EV6",
    "EV9",
    "Carnival",
  ],
  Opel: [
    "Corsa",
    "Astra",
    "Insignia",
    "Vectra",
    "Adam",
    "Meriva",
    "Zafira",
    "Mokka",
    "Crossland",
    "Grandland",
    "Combo",
    "Frontera",
  ],
  Peugeot: [
    "106",
    "206",
    "207",
    "208",
    "301",
    "307",
    "308",
    "407",
    "408",
    "508",
    "2008",
    "3008",
    "5008",
    "Rifter",
    "Partner",
    "Expert",
  ],
  Citroën: [
    "C1",
    "C3",
    "C3 Aircross",
    "C4",
    "C4 X",
    "C5",
    "C5 Aircross",
    "C-Elysee",
    "Berlingo",
    "Ami",
    "ë-C4",
  ],
  Skoda: ["Fabia", "Rapid", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Yeti", "Enyaq"],
  Seat: ["Ibiza", "Leon", "Toledo", "Cordoba", "Arona", "Ateca", "Tarraco", "Alhambra"],
  Cupra: ["Formentor", "Leon", "Ateca", "Born", "Tavascan"],
  Volvo: ["S60", "S90", "V40", "V60", "V90", "XC40", "XC60", "XC90", "C40", "EX30", "EX90"],
  Dacia: ["Sandero", "Sandero Stepway", "Logan", "Duster", "Jogger", "Lodgy", "Dokker", "Spring"],
  Nissan: [
    "Micra",
    "Note",
    "Almera",
    "Pulsar",
    "Primera",
    "Juke",
    "Qashqai",
    "X-Trail",
    "Pathfinder",
    "Navara",
    "Leaf",
    "Ariya",
  ],
  Mazda: ["2", "3", "6", "CX-3", "CX-30", "CX-5", "CX-60", "CX-7", "MX-5", "RX-8"],
  Mitsubishi: ["Space Star", "Lancer", "ASX", "Eclipse Cross", "Outlander", "Pajero", "L200"],
  Suzuki: ["Swift", "Ignis", "Baleno", "Alto", "Vitara", "S-Cross", "Jimny", "SX4"],
  Jeep: ["Renegade", "Compass", "Avenger", "Wrangler", "Grand Cherokee", "Cherokee", "Gladiator"],
  "Land Rover": [
    "Defender",
    "Discovery",
    "Discovery Sport",
    "Range Rover Evoque",
    "Range Rover Velar",
    "Range Rover Sport",
    "Range Rover",
    "Freelander",
  ],
  Porsche: ["911", "718 Cayman", "718 Boxster", "Cayenne", "Macan", "Panamera", "Taycan"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  Togg: ["T10X", "T10F"],
  // TR klasik / yerel — create + otomobil marka indeksinde Şahin zorunlu.
  Tofaş: ["Şahin", "Doğan", "Kartal", "Serçe", "Murat 124", "Murat 131", "Tempra", "Tipo"],
  Anadol: ["A1", "A2", "STC-16", "Böcek"],
  Mini: ["Cooper", "Countryman", "Clubman", "Cabrio", "Paceman"],
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale", "Giulietta", "147", "156", "159"],
  Chevrolet: ["Aveo", "Spark", "Cruze", "Lacetti", "Epica", "Captiva", "Trax", "Camaro", "Corvette"],
  SsangYong: ["Tivoli", "Korando", "Rexton", "Musso", "Actyon", "Kyron"],
  Chery: ["Omoda 5", "Tiggo 7", "Tiggo 7 Pro", "Tiggo 8", "Tiggo 8 Pro", "Arrizo 8"],
  MG: ["ZS", "HS", "3", "4", "5", "Marvel R", "Cyberster"],
  BYD: ["Atto 3", "Dolphin", "Seal", "Seal U", "Sealion 7", "Han", "Tang"],
  Subaru: ["Impreza", "Legacy", "XV", "Crosstrek", "Forester", "Outback", "BRZ"],
  Lexus: ["IS", "ES", "LS", "NX", "RX", "UX", "LBX", "GX", "LX", "RZ"],
  Jaguar: ["XE", "XF", "XJ", "F-Pace", "E-Pace", "I-Pace", "F-Type"],
  DS: ["DS 3", "DS 4", "DS 5", "DS 7", "DS 9"],
  Infiniti: ["Q30", "Q50", "Q60", "QX30", "QX50", "QX70"],
  Smart: ["ForTwo", "ForFour", "#1", "#3"],
  Lada: ["Samara", "Vega", "Niva", "Kalina", "Priora", "Granta", "Vesta"],
  Geely: ["Coolray", "Emgrand", "Geometry C", "Okavango"],
  Skywell: ["ET5", "BE11"],
  DFSK: ["Glory 560", "Glory 580", "Seres 3"],
  Daihatsu: ["Sirion", "Terios", "Cuore", "Materia"],
  Proton: ["Saga", "Gen-2", "Persona", "Savvy"],
  Maserati: ["Ghibli", "Quattroporte", "Levante", "Grecale", "MC20"],
  Bentley: ["Continental GT", "Flying Spur", "Bentayga"],
  Cadillac: ["CTS", "ATS", "XT4", "XT5", "Escalade"],
  Chrysler: ["300C", "PT Cruiser", "Voyager", "Pacifica"],
  Dodge: ["Charger", "Challenger", "Durango", "Journey"],
  Saab: ["9-3", "9-5"],
  Rover: ["75", "45", "25", "Streetwise"],
  Lancia: ["Ypsilon", "Delta", "Thema", "Musa"],
};

export const MOTORSIKLET_BRANDS: BrandCatalog = {
  Yamaha: ["MT-07", "MT-09", "MT-03", "YZF-R1", "YZF-R3", "YZF-R6", "NMAX 125", "XMAX 250", "Ténéré 700", "Tracer 9"],
  Honda: ["PCX 125", "Forza 250", "CBR500R", "CBR650R", "CB500X", "CB650R", "Africa Twin", "Rebel 500", "SH 150", "ADV350"],
  Kawasaki: ["Ninja 400", "Ninja 650", "Ninja ZX-6R", "Z650", "Z900", "Versys 650", "Vulcan S", "KLX 250"],
  Suzuki: ["GSX-R600", "GSX-S750", "V-Strom 650", "SV650", "Burgman 400", "Address 110", "Katana"],
  "BMW Motorrad": ["G 310 R", "G 310 GS", "F 900 R", "F 900 XR", "R 1250 GS", "S 1000 RR", "C 400 X"],
  KTM: ["125 Duke", "390 Duke", "890 Duke", "390 Adventure", "890 Adventure", "1290 Super Adventure"],
  Ducati: ["Monster", "Panigale V2", "Panigale V4", "Multistrada V4", "Scrambler Icon", "Diavel"],
  "Harley-Davidson": ["Iron 883", "Forty-Eight", "Street Bob", "Fat Boy", "Pan America", "Sportster S"],
  Triumph: ["Trident 660", "Street Triple", "Tiger 900", "Bonneville T120", "Speed Twin", "Rocket 3"],
  Aprilia: ["RS 660", "Tuono 660", "RSV4", "SR GT 125", "SXR 50"],
  Vespa: ["Primavera 125", "Sprint 125", "GTS 300", "Elettrica"],
  Piaggio: ["Medley 125", "Beverly 300", "MP3 300", "Liberty 125"],
  CFMoto: ["300NK", "450NK", "700CL-X", "800MT"],
  Bajaj: ["Pulsar NS200", "Dominar 400", "Chetak"],
  // Keep a full TR-market TVS lineup — empty/partial maps make Model look broken in create + search.
  TVS: [
    "Apache RTR 160",
    "Apache RTR 180",
    "Apache RTR 200",
    "Apache RR 310",
    "Ntorq 125",
    "Raider 125",
    "Jupiter 125",
    "iQube",
    "Sport 100",
    "Wego 110",
  ],
  Mondial: ["100 MG", "125 Drift", "Scooty 50", "X-Treme 250"],
  RKS: ["125S", "Blazer 50", "Titanic 150"],
  Kanuni: ["Seyhan 125", "Tro 125", "Windy 50"],
  "Peugeot Motocycles": ["Tweet 125", "Django 125", "Metropolis 400"],
  Benelli: ["TNT 125", "302S", "TRK 502", "Leoncino 500"],
};

/** Parts share vehicle brands; models reused for uyumluluk */
export const YEDEK_PARCA_BRANDS: BrandCatalog = {
  ...VASITA_BRANDS,
  Genel: ["Evrensel", "205/55 R16", "195/65 R15", "225/45 R17", "Diğer ölçü"],
};

export const DETAIL_SEARCH_CATEGORIES: CategorySlug[] = [
  "emlak",
  "vasita",
  "motorsiklet",
  "yedek-parca",
];

/** Extra catalogs registered by vasita-subcategories (e.g. vasita:motorsiklet). */
const REGISTERED_CATALOGS: Record<string, BrandCatalog> = {};

export function registerBrandCatalog(key: string, catalog: BrandCatalog): void {
  REGISTERED_CATALOGS[key] = catalog;
}

export function brandCatalogFor(category: CategorySlug | string): BrandCatalog | null {
  if (category === "vasita") return VASITA_BRANDS;
  if (category === "motorsiklet") return MOTORSIKLET_BRANDS;
  if (category === "yedek-parca") return YEDEK_PARCA_BRANDS;
  if (REGISTERED_CATALOGS[category]) return REGISTERED_CATALOGS[category];
  // Hard fallback so Motorsiklet never resolves to car models via "vasita".
  if (category === "vasita:motorsiklet") return MOTORSIKLET_BRANDS;
  return null;
}

/**
 * Resolve a user/URL brand string to the canonical catalog key.
 * Exact match first, then Turkish case-insensitive (TVS / Tvs / tvs).
 * Also accepts common suffixes ("TVS Motor" → TVS).
 */
export function resolveCatalogBrand(
  catalog: BrandCatalog,
  brand: string,
): string | undefined {
  const raw = brand?.trim();
  if (!raw) return undefined;
  if (catalog[raw]) return raw;

  const lower = raw.toLocaleLowerCase("tr");
  const keys = Object.keys(catalog);
  const exactCi = keys.find((k) => k.toLocaleLowerCase("tr") === lower);
  if (exactCi) return exactCi;

  // "TVS Motor", "TVS Motors" → TVS
  const stripped = lower.replace(/\s+(motor|motors|motosiklet|moto)s?$/i, "").trim();
  if (stripped && stripped !== lower) {
    const viaSuffix = keys.find((k) => k.toLocaleLowerCase("tr") === stripped);
    if (viaSuffix) return viaSuffix;
  }

  return undefined;
}

/** Models for one brand only — never flattens the whole catalog. */
export function modelsFromCatalog(catalog: BrandCatalog, brand: string): string[] {
  if (!brand) return [];
  const key = resolveCatalogBrand(catalog, brand);
  return key ? (catalog[key] ?? []) : [];
}

export function brandNames(category: CategorySlug | string): string[] {
  const catalog = brandCatalogFor(category);
  return catalog ? Object.keys(catalog).sort((a, b) => a.localeCompare(b, "tr")) : [];
}

export function modelsForBrand(category: CategorySlug | string, brand: string): string[] {
  const catalog = brandCatalogFor(category);
  if (!catalog || !brand) return [];
  return modelsFromCatalog(catalog, brand);
}

export function supportsBrandModelSearch(category: CategorySlug | string): boolean {
  return brandCatalogFor(category) !== null;
}

export function sortedBrandNames(catalog: BrandCatalog): string[] {
  return Object.keys(catalog).sort((a, b) => a.localeCompare(b, "tr"));
}

export function supportsDetailedSearch(category: CategorySlug | string): boolean {
  return DETAIL_SEARCH_CATEGORIES.includes(category as CategorySlug);
}
