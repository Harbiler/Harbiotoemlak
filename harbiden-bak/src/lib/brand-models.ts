import type { CategorySlug } from "./types";

/** Brand → models for vehicle-like categories */
export type BrandCatalog = Record<string, string[]>;

export const VASITA_BRANDS: BrandCatalog = {
  Audi: ["A3", "A4", "A5", "A6", "Q3", "Q5", "Q7", "Q8", "e-tron", "TT"],
  BMW: ["1 Serisi", "2 Serisi", "3 Serisi", "4 Serisi", "5 Serisi", "X1", "X3", "X5", "X6", "i4", "iX"],
  "Mercedes-Benz": ["A Serisi", "B Serisi", "C Serisi", "E Serisi", "S Serisi", "CLA", "GLA", "GLC", "GLE", "EQC"],
  Volkswagen: ["Polo", "Golf", "Golf 1.5 TSI", "Passat", "Tiguan", "T-Roc", "Touareg", "Caddy", "Transporter", "ID.3", "ID.4"],
  Renault: ["Clio", "Clio Joy", "Megane", "Talisman", "Captur", "Kadjar", "Austral", "Symbol", "Kangoo", "Master"],
  Fiat: ["Egea", "Egea Cross", "500", "Panda", "Tipo", "Doblo", "Fiorino", "Fullback"],
  Ford: ["Fiesta", "Focus", "Mondeo", "Puma", "Kuga", "Ranger", "Transit", "Tourneo Custom", "Mustang"],
  Toyota: ["Corolla", "Corolla Hybrid", "Yaris", "C-HR", "RAV4", "Hilux", "Land Cruiser", "Camry", "Proace"],
  Honda: ["Civic", "City", "Jazz", "HR-V", "CR-V", "Accord"],
  Hyundai: ["i10", "i20", "i30", "Elantra", "Tucson", "Santa Fe", "Bayon", "Kona", "Ioniq 5"],
  Kia: ["Picanto", "Rio", "Ceed", "Cerato", "Sportage", "Sorento", "Stonic", "Niro", "EV6"],
  Opel: ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Combo"],
  Peugeot: ["208", "308", "508", "2008", "3008", "5008", "Rifter", "Partner"],
  Citroën: ["C3", "C4", "C5 Aircross", "Berlingo", "Ami"],
  Skoda: ["Fabia", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq"],
  Seat: ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"],
  Cupra: ["Formentor", "Leon", "Ateca", "Born"],
  Volvo: ["S60", "S90", "V60", "XC40", "XC60", "XC90", "C40"],
  Dacia: ["Sandero", "Logan", "Duster", "Jogger", "Spring"],
  Nissan: ["Micra", "Juke", "Qashqai", "X-Trail", "Navara", "Leaf"],
  Mazda: ["2", "3", "6", "CX-3", "CX-30", "CX-5", "CX-60"],
  Mitsubishi: ["Space Star", "ASX", "Eclipse Cross", "Outlander", "L200"],
  Suzuki: ["Swift", "Ignis", "Vitara", "S-Cross", "Jimny"],
  Jeep: ["Renegade", "Compass", "Avenger", "Wrangler", "Grand Cherokee"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover Evoque", "Range Rover Sport", "Range Rover"],
  Porsche: ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  Togg: ["T10X", "T10F"],
  Mini: ["Cooper", "Countryman", "Clubman", "Cabrio"],
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale"],
  Chevrolet: ["Aveo", "Cruze", "Captiva", "Trax", "Camaro"],
  SsangYong: ["Tivoli", "Korando", "Rexton", "Musso"],
  Chery: ["Omoda 5", "Tiggo 7", "Tiggo 8"],
  MG: ["ZS", "HS", "4", "5", "Marvel R"],
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
  TVS: ["Apache RTR 200", "Ntorq 125", "iQube"],
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

export function brandCatalogFor(category: CategorySlug | string): BrandCatalog | null {
  if (category === "vasita") return VASITA_BRANDS;
  if (category === "motorsiklet") return MOTORSIKLET_BRANDS;
  if (category === "yedek-parca") return YEDEK_PARCA_BRANDS;
  return null;
}

export function brandNames(category: CategorySlug | string): string[] {
  const catalog = brandCatalogFor(category);
  return catalog ? Object.keys(catalog).sort((a, b) => a.localeCompare(b, "tr")) : [];
}

export function modelsForBrand(category: CategorySlug | string, brand: string): string[] {
  const catalog = brandCatalogFor(category);
  if (!catalog || !brand) return [];
  return catalog[brand] ?? [];
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
