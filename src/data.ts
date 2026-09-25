export type EventItem = {
  slug: string;
  title: string;
  venue: string;
  address: string;
  date: string;
  time: string;
  age: string;
  price: string;
  dj?: string;
  blurb?: string;
  description?: string;
  image: string;
};

export type Resident = {
  name: string;
  role: string;
  rooms: string;
  image: string;
};

export type Flashback = {
  slug: string;
  eventSlug: string;
  title: string;
  venue: string;
  date: string;
  count: number;
  cover: string;
  photos: string[];
};

export type LegalDoc = {
  id: string;
  title: string;
  body: string[];
};

export type NewsItem = {
  slug: string;
  date: string;
  tag: string;
  title: string;
  excerpt: string;
  image: string;
};

import { cercinoGalleryPool, cercinoPhotos } from "./cercinoImages";

const photos = cercinoPhotos;

export const events: EventItem[] = [
  {
    slug: "lonelordag-noise",
    title: "Lönelördag",
    venue: "NOISE",
    address: "Södra Kyrkogatan 7, Helsingborg",
    date: "2026-09-05",
    time: "23.00  05.00",
    age: "18+",
    price: "Fri entré före 00:30",
    dj: "Berchi, Noise residents",
    blurb: "Payday Saturday. Guestlist before midnight, house after.",
    description:
      "Lönelördag is the night the city gets paid. Guestlist until 00:30, then the room opens wide. Berchi and the Noise residents run house and edits until five. Same floor every month — if you know, you know.",
    image: photos.hero,
  },
  {
    slug: "after-dark-kappa",
    title: "After Dark",
    venue: "Kappa Bar",
    address: "Kullagatan, Helsingborg",
    date: "2026-09-06",
    time: "22.00  03.00",
    age: "20+",
    price: "120 kr",
    dj: "Kappa Bar residents all night",
    blurb: "Low lights, long drinks, no main-stage energy.",
    description:
      "After Dark is Kappa Bar after the lights go down. Cocktails first, deeper selections later. Smaller room, slower build, 03.00 finish. No big-room drops — just a bar that turns into a club.",
    image: photos.dj,
  },
  {
    slug: "house-session",
    title: "House Session",
    venue: "The Tivoli",
    address: "Köpenhamnskajen 1, Helsingborg",
    date: "2026-09-12",
    time: "23.00  04.00",
    age: "18+",
    price: "100 kr",
    dj: "Mira, Sol, Tivoli residents",
    blurb: "Four-to-the-floor in the old concert room.",
    image: photos.crowd,
  },
  {
    slug: "studentnatt",
    title: "Studentnatt",
    venue: "NOISE",
    address: "Södra Kyrkogatan 7, Helsingborg",
    date: "2026-09-18",
    time: "22.00  04.00",
    age: "18+",
    price: "80 kr studentleg",
    dj: "Campus, Noise residents",
    blurb: "Studentleg at the door. Same floor as Saturday.",
    image: photos.stage,
  },
  {
    slug: "vinyl-friday",
    title: "Vinyl Friday",
    venue: "The Tivoli",
    address: "Köpenhamnskajen 1, Helsingborg",
    date: "2026-09-19",
    time: "17.00  01.00",
    age: "18+",
    price: "Fri entré",
    dj: "Selma, Wax, Otto",
    blurb: "Vinyl only. Doors 17.00, last record after midnight.",
    image: photos.concert,
  },
  {
    slug: "blackout",
    title: "Blackout",
    venue: "NOC",
    address: "Bruksgatan 2, Helsingborg",
    date: "2026-09-26",
    time: "00.00  05.00",
    age: "23+",
    price: "150 kr",
    dj: "NOC residents all night",
    blurb: "23+. Darker room, later peak.",
    image: photos.club,
  },
  {
    slug: "90s-forever",
    title: "90s Forever",
    venue: "Kappa Bar",
    address: "Kullagatan, Helsingborg",
    date: "2026-10-03",
    time: "22.00  03.00",
    age: "18+",
    price: "100 kr",
    dj: "Kappa Bar residents",
    blurb: "Nothing after 1999. Dress like you mean it.",
    image: photos.dance,
  },
  {
    slug: "techno-torsdag",
    title: "Techno Torsdag",
    venue: "NOISE",
    address: "Södra Kyrkogatan 7, Helsingborg",
    date: "2026-10-09",
    time: "23.00  04.00",
    age: "18+",
    price: "80 kr",
    dj: "Berchi b2b Mira",
    blurb: "Weeknight techno. Short queue, long set.",
    image: photos.extra1,
  },
  {
    slug: "latin-night",
    title: "Latin Night",
    venue: "Kappa Bar",
    address: "Kullagatan, Helsingborg",
    date: "2026-10-17",
    time: "21.00  03.00",
    age: "18+",
    price: "120 kr",
    dj: "Sol, guest TBA",
    blurb: "Salsa into club. Earlier doors.",
    image: photos.hands,
  },
  {
    slug: "hiphop-night",
    title: "Hiphop Night",
    venue: "NOISE",
    address: "Södra Kyrkogatan 7, Helsingborg",
    date: "2026-10-24",
    time: "23.00  05.00",
    age: "18+",
    price: "100 kr",
    dj: "Campus, Otto, Noise residents",
    blurb: "Local MCs, club system, no festival set times.",
    image: photos.extra2,
  },
  {
    slug: "halloween",
    title: "Halloween",
    venue: "NOISE",
    address: "Södra Kyrkogatan 7, Helsingborg",
    date: "2026-10-31",
    time: "22.00  05.00",
    age: "18+",
    price: "150 kr",
    dj: "Berchi, Selma, Noise residents",
    blurb: "Costume at the door. Vimmel after.",
    image: photos.extra3,
  },
  {
    slug: "warehouse",
    title: "Warehouse",
    venue: "HETCH",
    address: "Redaregatan 48, Helsingborg",
    date: "2026-11-07",
    time: "23.00  06.00",
    age: "18+",
    price: "180 kr",
    dj: "Mira, Otto, HETCH residents",
    blurb: "Harbour warehouse. Harder, later, fewer phones.",
    image: photos.extra4,
  },
  {
    slug: "foam",
    title: "Skumfest",
    venue: "The Tivoli",
    address: "Köpenhamnskajen 1, Helsingborg",
    date: "2026-11-14",
    time: "22.00  03.00",
    age: "18+",
    price: "120 kr",
    dj: "Tivoli residents",
    blurb: "Foam, house, and a packed floor before the holidays.",
    image: photos.extra5,
  },
  {
    slug: "juldagen",
    title: "Juldagen",
    venue: "NOISE",
    address: "Södra Kyrkogatan 7, Helsingborg",
    date: "2026-12-25",
    time: "23.00  05.00",
    age: "18+",
    price: "200 kr",
    dj: "Berchi, Campus, Noise residents",
    blurb: "The room stays open. Christmas dinner is not an excuse.",
    image: photos.extra6,
  },
  {
    slug: "nyar",
    title: "Nyår",
    venue: "NOISE",
    address: "Södra Kyrkogatan 7, Helsingborg",
    date: "2026-12-31",
    time: "22.00  05.00",
    age: "18+",
    price: "350 kr",
    dj: "All residents, guests TBA",
    blurb: "One room, one city, until 05.00.",
    image: photos.inspark1,
  },
];

export const residents: Resident[] = [
  { name: "Berchi", role: "Resident", rooms: "NOISE", image: photos.dj },
  { name: "Mira", role: "Resident", rooms: "NOISE  Tivoli", image: photos.extra7 },
  { name: "Sol", role: "Resident", rooms: "Tivoli  Kappa", image: photos.extra8 },
  { name: "Selma", role: "Vinyl", rooms: "Tivoli", image: photos.extra9 },
  { name: "Otto", role: "Resident", rooms: "HETCH  NOC", image: photos.extra10 },
  { name: "Campus", role: "Promoter", rooms: "NOISE", image: photos.extra11 },
];

export const values = [
  {
    n: "01",
    title: "Dörren är ingen rättighet",
    body: "En biljett är ingen garanti. Vakten kan neka inträde. Kom som du vill att natten ska kännas.",
  },
  {
    n: "02",
    title: "Golvet är för alla",
    body: "Inga foton av främlingar utan ett ja. Vimmel fotas av oss, efteråt — inte över någons axel.",
  },
  {
    n: "03",
    title: "Ta hand om rummet",
    body: "Sverige är litet. Samma människor är här nästa vecka. Personal, garderob, varandra.",
  },
  {
    n: "04",
    title: "Det är mer än bara dans",
    body: "Gästlista, vimmel, residents, sena rum. PartyHBG är hur stan håller sig ute.",
  },
];

export const flashbacks: Flashback[] = [
  {
    slug: "lonelordag-22-aug",
    eventSlug: "lonelordag-noise",
    title: "Lönelördag",
    venue: "NOISE",
    date: "2026-08-22",
    count: 48,
    cover: photos.hero,
    photos: cercinoGalleryPool.slice(0, 6),
  },
  {
    slug: "after-dark-15-aug",
    eventSlug: "after-dark-kappa",
    title: "After Dark",
    venue: "Kappa Bar",
    date: "2026-08-15",
    count: 36,
    cover: photos.dj,
    photos: cercinoGalleryPool.slice(2, 8),
  },
  {
    slug: "house-session-18-jul",
    eventSlug: "house-session",
    title: "House Session",
    venue: "The Tivoli",
    date: "2026-07-18",
    count: 29,
    cover: photos.crowd,
    photos: cercinoGalleryPool.slice(4, 10),
  },
  {
    slug: "studentnatt-1-aug",
    eventSlug: "studentnatt",
    title: "Studentnatt",
    venue: "NOISE",
    date: "2026-08-01",
    count: 41,
    cover: photos.stage,
    photos: cercinoGalleryPool.slice(6, 12),
  },
  {
    slug: "blackout-25-jul",
    eventSlug: "blackout",
    title: "Blackout",
    venue: "NOC",
    date: "2026-07-25",
    count: 52,
    cover: photos.club,
    photos: cercinoGalleryPool.slice(8, 14),
  },
  {
    slug: "tivoli-sommarlive",
    eventSlug: "vinyl-friday",
    title: "Vinyl Friday",
    venue: "The Tivoli",
    date: "2026-08-08",
    count: 24,
    cover: photos.concert,
    photos: cercinoGalleryPool.slice(10, 16),
  },
];

/** @deprecated use flashbacks */
export const galleries = flashbacks;

export const newsItems: NewsItem[] = [
  {
    slug: "lonelordag-noise",
    date: "2026-09-02",
    tag: "Helsingborg",
    title: "Lönelördag är tillbaka på NOISE",
    excerpt:
      "Skånes klassiska paydaykväll rullar vidare. Gästlista, residents och late night till 05.00.",
    image: cercinoPhotos.crowd,
  },
  {
    slug: "kappa-after-dark",
    date: "2026-08-28",
    tag: "Klubb",
    title: "After Dark tar över Kappa Bar",
    excerpt:
      "Söndagsnatt i Helsingborg med mörkare sound, 20+ och biljetter från 120 kr.",
    image: cercinoPhotos.club,
  },
  {
    slug: "studentnatt-skane",
    date: "2026-08-20",
    tag: "Student",
    title: "Studentnatt: hela Skåne samlas i HBG",
    excerpt:
      "Lund, Malmö och Helsingborg på samma dansgolv — biljetter och gästlista via PartyHBG.",
    image: cercinoPhotos.dance,
  },
  {
    slug: "flashback-august",
    date: "2026-08-14",
    tag: "Flashback",
    title: "Nya flashbacks från augusti",
    excerpt:
      "Bilder från NOC, Tivoli och Kappa Bar — se vilka som var där och spara dina favoriter.",
    image: cercinoPhotos.party,
  },
];

export const legalDocs: LegalDoc[] = [
  {
    id: "privacy",
    title: "Integritetspolicy",
    body: [
      "PartyHBG behandlar personuppgifter när du anmäler dig till gästlista, nyhetsbrev eller köper biljetter via våra partners.",
      "Vi sparar namn, e-post och eventpreferenser. Uppgifterna sparas i 24 månader om du inte ber oss radera dem tidigare.",
      "Bilder från event kan dyka upp i Flashback-gallerier. Säg till personalen i dörren om du inte vill bli fotograferad.",
      "Kontakt: privacy@partyhbg.se",
    ],
  },
  {
    id: "terms",
    title: "Användarvillkor",
    body: [
      "Biljetter säljs via partnerplattformar. En biljett garanterar inte inträde — lokalens säkerhet har sista ordet.",
      "Du måste uppfylla åldersgränsen på eventsidan. Giltig legitimation krävs.",
      "Vi förbehåller oss rätten att neka inträde vid beteende som sätter andra eller lokalen i risk.",
      "Ingen vidareförsäljning över ordinarie pris. Missbruk av gästlistplatser kan leda till permanent avstängning.",
    ],
  },
  {
    id: "cookies",
    title: "Cookiepolicy",
    body: [
      "Sidan använder nödvändiga cookies för navigering och valfri analys för att förstå trafik.",
      "Vi säljer inte cookiedata till tredje part.",
      "Du kan stänga av icke-nödvändiga cookies i webbläsarens inställningar när som helst.",
    ],
  },
  {
    id: "photos",
    title: "Bild- och flashbackpolicy",
    body: [
      "PartyHBG-fotografer dokumenterar event för Flashback-gallerier och sociala kanaler.",
      "Om du syns på en bild och vill ha den borttagen, mejla flashback@partyhbg.se med datum och en beskrivning.",
      "Fotografera inte andra gäster utan samtycke. Golvet är till för dans, inte för att dokumentera främlingar.",
    ],
  },
];

export { photos };

export function isPastEvent(isoDate: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDay = new Date(`${isoDate}T12:00:00`);
  eventDay.setHours(0, 0, 0, 0);
  return eventDay < today;
}

export function flashbackForEvent(slug: string) {
  const event = events.find((item) => item.slug === slug);
  const flashback = flashbacks.find((item) => item.eventSlug === slug);
  if (!event || !flashback || !isPastEvent(event.date)) return undefined;
  return flashback;
}

export function dayNum(iso: string) {
  return new Date(`${iso}T12:00:00`).getDate().toString().padStart(2, "0");
}

export function monthShort(iso: string) {
  return new Date(`${iso}T12:00:00`)
    .toLocaleDateString("sv-SE", { month: "short" })
    .replace(".", "")
    .toUpperCase();
}

export function agendaDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  const week = d.toLocaleDateString("sv-SE", { weekday: "short" }).replace(".", "").toUpperCase();
  const day = d.getDate().toString().padStart(2, "0");
  const month = d
    .toLocaleDateString("sv-SE", { month: "short" })
    .replace(".", "")
    .toUpperCase()
    .slice(0, 3);
  return `${week} ${day} ${month}`;
}

export function lineupOf(event: EventItem) {
  return event.dj ?? `${event.venue} residents`;
}

export function eventCategory(event: EventItem) {
  const title = event.title.toLowerCase();
  if (title.includes("techno")) return "Techno";
  if (title.includes("house") || title.includes("vinyl")) return "House";
  if (title.includes("warehouse") || title.includes("blackout")) return "Sent";
  if (title.includes("student")) return "Student";
  if (title.includes("halloween") || title.includes("nyår") || title.includes("jul") || title.includes("skum")) {
    return "Special";
  }
  if (title.includes("latin") || title.includes("hiphop") || title.includes("90s")) return "Klubb";
  return "Klubb";
}

export function eventYear(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  const month = d.toLocaleDateString("sv-SE", { month: "short" }).replace(".", "");
  const day = d.getDate();
  return `${day} ${month}`;
}

export function monthGroupKey(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthGroupLabel(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  const month = d.toLocaleDateString("sv-SE", { month: "long" });
  const label = month.charAt(0).toUpperCase() + month.slice(1);
  return `${label} ${d.getFullYear()}`;
}

export function groupEventsByMonth(items: EventItem[]) {
  const groups: { key: string; label: string; items: EventItem[] }[] = [];

  for (const event of items) {
    const key = monthGroupKey(event.date);
    const label = monthGroupLabel(event.date);
    const last = groups.at(-1);

    if (last?.key === key) {
      last.items.push(event);
    } else {
      groups.push({ key, label, items: [event] });
    }
  }

  return groups;
}
