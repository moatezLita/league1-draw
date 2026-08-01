/**
 * Ligue Professionnelle 1 — saison 2026/2027 (16 clubs).
 *
 * Composition confirmée après la saison 2025/2026 :
 *  - Relégués en LP2 : JS Kairouan, AS Soliman, AS Gabès
 *  - Promus de LP2  : ES Hammam Sousse (gr. A), PS Sakiet Eddaïer (gr. B),
 *                     CS Hammam Lif (barrage)
 *
 * ⚠️  Ce fichier est la SEULE source de vérité de l'application.
 *     Corriger un nom, une couleur, un stade ou ajouter un logo se fait ici,
 *     rien d'autre à toucher dans le code.
 */

export type Region =
  | "grand-tunis"
  | "nord"
  | "sahel"
  | "sfax"
  | "sud"
  | "sud-ouest";

export interface Team {
  /** identifiant court, stable, utilisé dans les URLs de partage */
  id: string;
  /** sigle affiché dans l'écusson généré */
  abbr: string;
  name: string;
  nameAr: string;
  city: string;
  cityAr: string;
  region: Region;
  stadium: string;
  stadiumAr: string;
  /** identifiant du stade — deux clubs avec le même `venue` ne peuvent pas recevoir le même jour */
  venue: string;
  /** agglomération — sert au plafond de matchs simultanés dans la même ville */
  metro: string;
  colors: { primary: string; secondary: string; text: string };
  founded: number;
  lat: number;
  lon: number;
  /**
   * Chemin optionnel vers un vrai logo, ex. "/logos/est.png".
   * Laisser vide => écusson vectoriel généré (aucune image à charger, 0 ko).
   */
  logo?: string;
}

export const TEAMS: Team[] = [
  {
    id: "est",
    abbr: "EST",
    name: "Espérance Sportive de Tunis",
    nameAr: "الترجي الرياضي التونسي",
    city: "Tunis",
    cityAr: "تونس",
    region: "grand-tunis",
    stadium: "Stade Hammadi Agrebi (Radès)",
    stadiumAr: "ملعب حمادي العقربي (رادس)",
    venue: "rades",
    metro: "Grand Tunis",
    colors: { primary: "#D50032", secondary: "#FFC72C", text: "#FFFFFF" },
    founded: 1919,
    lat: 36.767,
    lon: 10.276,
  },
  {
    id: "ca",
    abbr: "CA",
    name: "Club Africain",
    nameAr: "النادي الإفريقي",
    city: "Tunis",
    cityAr: "تونس",
    region: "grand-tunis",
    stadium: "Stade Hammadi Agrebi (Radès)",
    stadiumAr: "ملعب حمادي العقربي (رادس)",
    venue: "rades",
    metro: "Grand Tunis",
    colors: { primary: "#C8102E", secondary: "#FFFFFF", text: "#FFFFFF" },
    founded: 1920,
    lat: 36.767,
    lon: 10.276,
  },
  {
    id: "css",
    abbr: "CSS",
    name: "Club Sportif Sfaxien",
    nameAr: "النادي الرياضي الصفاقسي",
    city: "Sfax",
    cityAr: "صفاقس",
    region: "sfax",
    stadium: "Stade Taïeb Mhiri",
    stadiumAr: "ملعب الطيب المهيري",
    venue: "taieb-mhiri",
    metro: "Sfax",
    colors: { primary: "#111111", secondary: "#FFFFFF", text: "#FFFFFF" },
    founded: 1928,
    lat: 34.74,
    lon: 10.76,
  },
  {
    id: "st",
    abbr: "ST",
    name: "Stade Tunisien",
    nameAr: "الملعب التونسي",
    city: "Le Bardo",
    cityAr: "باردو",
    region: "grand-tunis",
    stadium: "Stade Hédi Enneifer",
    stadiumAr: "ملعب الهادي النيفر",
    venue: "hedi-enneifer",
    metro: "Grand Tunis",
    colors: { primary: "#00843D", secondary: "#D50032", text: "#FFFFFF" },
    founded: 1948,
    lat: 36.808,
    lon: 10.14,
  },
  {
    id: "usm",
    abbr: "USM",
    name: "Union Sportive Monastirienne",
    nameAr: "الاتحاد الرياضي المنستيري",
    city: "Monastir",
    cityAr: "المنستير",
    region: "sahel",
    stadium: "Stade Mustapha Ben Jannet",
    stadiumAr: "ملعب مصطفى بن جنات",
    venue: "ben-jannet",
    metro: "Monastir",
    colors: { primary: "#0B4EA2", secondary: "#FFFFFF", text: "#FFFFFF" },
    founded: 1923,
    lat: 35.777,
    lon: 10.826,
  },
  {
    id: "ess",
    abbr: "ESS",
    name: "Étoile Sportive du Sahel",
    nameAr: "النجم الرياضي الساحلي",
    city: "Sousse",
    cityAr: "سوسة",
    region: "sahel",
    stadium: "Stade Olympique de Sousse",
    stadiumAr: "الملعب الأولمبي بسوسة",
    venue: "olympique-sousse",
    metro: "Sousse",
    colors: { primary: "#E2001A", secondary: "#FFFFFF", text: "#FFFFFF" },
    founded: 1925,
    lat: 35.832,
    lon: 10.63,
  },
  {
    id: "esz",
    abbr: "ESZ",
    name: "Espérance Sportive de Zarzis",
    nameAr: "الترجي الرياضي بجرجيس",
    city: "Zarzis",
    cityAr: "جرجيس",
    region: "sud",
    stadium: "Complexe Abdessalem Kazouz",
    stadiumAr: "ملعب عبد السلام كازوز",
    venue: "kazouz",
    metro: "Zarzis",
    colors: { primary: "#D50032", secondary: "#FFC72C", text: "#FFFFFF" },
    founded: 1934,
    lat: 33.504,
    lon: 11.112,
  },
  {
    id: "esm",
    abbr: "ESM",
    name: "ES Métlaoui",
    nameAr: "النجم الرياضي بالمتلوي",
    city: "Métlaoui",
    cityAr: "المتلوي",
    region: "sud-ouest",
    stadium: "Stade Municipal de Métlaoui",
    stadiumAr: "الملعب البلدي بالمتلوي",
    venue: "metlaoui",
    metro: "Métlaoui",
    colors: { primary: "#F2B705", secondary: "#D50032", text: "#111111" },
    founded: 1950,
    lat: 34.322,
    lon: 8.4,
  },
  {
    id: "jso",
    abbr: "JSO",
    name: "Jeunesse Sportive El Omrane",
    nameAr: "الشبيبة الرياضية بالعمران",
    city: "Tunis",
    cityAr: "تونس",
    region: "grand-tunis",
    stadium: "Stade Chedly Zouiten",
    stadiumAr: "ملعب الشاذلي زويتن",
    venue: "chedly-zouiten",
    metro: "Grand Tunis",
    colors: { primary: "#1B5E20", secondary: "#FFFFFF", text: "#FFFFFF" },
    founded: 1939,
    lat: 36.81,
    lon: 10.17,
  },
  {
    id: "usbg",
    abbr: "USBG",
    name: "Union Sportive de Ben Guerdane",
    nameAr: "الاتحاد الرياضي ببن قردان",
    city: "Ben Guerdane",
    cityAr: "بن قردان",
    region: "sud",
    stadium: "Stade 7 Mars",
    stadiumAr: "ملعب 7 مارس",
    venue: "7-mars",
    metro: "Ben Guerdane",
    colors: { primary: "#F2B705", secondary: "#0B4EA2", text: "#111111" },
    founded: 1930,
    lat: 33.138,
    lon: 11.22,
  },
  {
    id: "asm",
    abbr: "ASM",
    name: "Avenir Sportif de La Marsa",
    nameAr: "المستقبل الرياضي بالمرسى",
    city: "La Marsa",
    cityAr: "المرسى",
    region: "grand-tunis",
    stadium: "Stade Abdelaziz Chtioui",
    stadiumAr: "ملعب عبد العزيز الشتيوي",
    venue: "chtioui",
    metro: "Grand Tunis",
    colors: { primary: "#111111", secondary: "#FFFFFF", text: "#FFFFFF" },
    founded: 1939,
    lat: 36.878,
    lon: 10.325,
  },
  {
    id: "cab",
    abbr: "CAB",
    name: "Club Athlétique Bizertin",
    nameAr: "النادي الرياضي البنزرتي",
    city: "Bizerte",
    cityAr: "بنزرت",
    region: "nord",
    stadium: "Stade 15 Octobre",
    stadiumAr: "ملعب 15 أكتوبر",
    venue: "15-octobre",
    metro: "Bizerte",
    colors: { primary: "#F2C300", secondary: "#111111", text: "#111111" },
    founded: 1928,
    lat: 37.274,
    lon: 9.873,
  },
  {
    id: "ob",
    abbr: "OB",
    name: "Olympique de Béja",
    nameAr: "الأولمبي الباجي",
    city: "Béja",
    cityAr: "باجة",
    region: "nord",
    stadium: "Stade Boujemaa Kmiti",
    stadiumAr: "ملعب بوجمعة الكميتي",
    venue: "kmiti",
    metro: "Béja",
    colors: { primary: "#C8102E", secondary: "#111111", text: "#FFFFFF" },
    founded: 1928,
    lat: 36.726,
    lon: 9.185,
  },
  {
    id: "eshs",
    abbr: "ESHS",
    name: "ES Hammam Sousse",
    nameAr: "أمل حمام سوسة",
    city: "Hammam Sousse",
    cityAr: "حمام سوسة",
    region: "sahel",
    stadium: "Stade Bouali Lahouar",
    stadiumAr: "ملعب بوعلي لهوار",
    venue: "bouali-lahouar",
    metro: "Sousse",
    colors: { primary: "#F2C300", secondary: "#111111", text: "#111111" },
    founded: 1954,
    lat: 35.86,
    lon: 10.594,
  },
  {
    id: "psse",
    abbr: "PSSE",
    name: "PS Sakiet Eddaïer",
    nameAr: "التقدم الرياضي بساقية الدائر",
    city: "Sakiet Eddaïer",
    cityAr: "ساقية الدائر",
    region: "sfax",
    stadium: "Stade Municipal de Sakiet Eddaïer",
    stadiumAr: "الملعب البلدي بساقية الدائر",
    venue: "sakiet-eddaier",
    metro: "Sfax",
    colors: { primary: "#0B4EA2", secondary: "#FFFFFF", text: "#FFFFFF" },
    founded: 1965,
    lat: 34.8,
    lon: 10.74,
  },
  {
    id: "cshl",
    abbr: "CSHL",
    name: "CS Hammam Lif",
    nameAr: "النادي الرياضي بحمام الأنف",
    city: "Hammam Lif",
    cityAr: "حمام الأنف",
    region: "grand-tunis",
    stadium: "Stade Bou Kornine",
    stadiumAr: "ملعب بوقرنين",
    venue: "bou-kornine",
    metro: "Grand Tunis",
    colors: { primary: "#00843D", secondary: "#FFFFFF", text: "#FFFFFF" },
    founded: 1944,
    lat: 36.729,
    lon: 10.339,
  },
];

/**
 * Écussons officiels présents dans `public/logos`.
 *
 * Ce sont les emblèmes des clubs, utilisés ici à seule fin d'identification
 * éditoriale. Un club absent de cette table garde l'écusson vectoriel généré
 * à partir de ses couleurs — c'est le cas du PS Sakiet Eddaïer, qui n'a pas
 * de source libre exploitable. Pour en ajouter un : déposer le fichier dans
 * `public/logos/` et l'inscrire ici.
 */
const LOGOS: Record<string, string> = {
  est: "/logos/est.png",
  ca: "/logos/ca.png",
  css: "/logos/css.png",
  st: "/logos/st.png",
  usm: "/logos/usm.png",
  ess: "/logos/ess.png",
  esz: "/logos/esz.png",
  esm: "/logos/esm.png",
  jso: "/logos/jso.png",
  usbg: "/logos/usbg.png",
  asm: "/logos/asm.png",
  cab: "/logos/cab.png",
  ob: "/logos/ob.png",
  eshs: "/logos/eshs.png",
  cshl: "/logos/cshl.png",
};

for (const t of TEAMS) {
  if (LOGOS[t.id]) t.logo = LOGOS[t.id];
}

export const TEAM_BY_ID: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.id, t]),
);

/**
 * Affiches à protéger : jamais lors de la 1re ni de la dernière journée,
 * et jamais deux d'entre elles le même week-end.
 */
export const DERBIES: Array<{ a: string; b: string; label: string; tier: 1 | 2 }> = [
  { a: "est", b: "ca", label: "Derby de Tunis", tier: 1 },
  { a: "est", b: "css", label: "Le Classico", tier: 1 },
  { a: "ca", b: "css", label: "CA – CSS", tier: 1 },
  { a: "est", b: "ess", label: "EST – ESS", tier: 1 },
  { a: "ca", b: "ess", label: "CA – ESS", tier: 1 },
  { a: "css", b: "ess", label: "CSS – ESS", tier: 2 },
  { a: "ess", b: "usm", label: "Derby du Sahel", tier: 2 },
  { a: "ess", b: "eshs", label: "Derby de Sousse", tier: 2 },
  { a: "css", b: "psse", label: "Derby de Sfax", tier: 2 },
  { a: "esz", b: "usbg", label: "Derby du Sud", tier: 2 },
  { a: "st", b: "ca", label: "ST – CA", tier: 2 },
  { a: "st", b: "est", label: "ST – EST", tier: 2 },
];

/** Distance orthodromique en km — sert à limiter les enchaînements de longs déplacements. */
export function distanceKm(a: Team, b: Team): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
