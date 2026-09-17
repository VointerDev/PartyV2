import {
  events as seedEvents,
  flashbacks as seedFlashbacks,
  newsItems as seedNews,
  type EventItem,
  type NewsItem,
} from "../data";

export type CmsEvent = EventItem & { id: string };

export type CmsFlashback = {
  id: string;
  slug: string;
  eventSlug: string;
  title: string;
  venue: string;
  date: string;
  cover: string;
  photos: string[];
  count: number;
};

export type CmsAsset = {
  id: string;
  key: string;
  url: string;
  label: string;
};

export type CmsNews = NewsItem & { id: string };

export type CmsSiteSettings = {
  heroTitle: string;
  heroVideo: string;
  heroPoster: string;
  heroPrimaryLabel: string;
  heroPrimaryLink: string;
  heroSecondaryLabel: string;
  heroSecondaryLink: string;
  heroTitleSize: number;
  heroTitleMaxWidth: number;
  heroAlign: "left" | "center";
  heroHeight: number;
  contentMaxWidth: number;
  sectionTitleSize: number;
  upcomingTitle: string;
  newsTitle: string;
  bannerEnabled: boolean;
  bannerText: string;
  bannerLink: string;
  bannerLinkLabel: string;
  bannerBg: string;
  bannerColor: string;
  bannerAlign: "left" | "center";
  bannerSize: "sm" | "md" | "lg";
  bannerDismissible: boolean;
  bannerSticky: boolean;
};

export type CmsState = {
  events: CmsEvent[];
  featuredSlugs: string[];
  homeUpcomingLimit: number;
  flashbacks: CmsFlashback[];
  assets: CmsAsset[];
  news: CmsNews[];
  site: CmsSiteSettings;
  updatedAt: string | null;
};

export const CMS_STORAGE_KEY = "partyhbg_admin_cms";
export const CMS_UPDATED_EVENT = "partyhbg-cms-updated";

const defaultSite: CmsSiteSettings = {
  heroTitle: "PartyHBG",
  heroVideo: "/videos/party.mp4",
  heroPoster: "/photos/party.jpg",
  heroPrimaryLabel: "Se evenemang",
  heroPrimaryLink: "/events",
  heroSecondaryLabel: "Flashback",
  heroSecondaryLink: "/flashback",
  heroTitleSize: 72,
  heroTitleMaxWidth: 900,
  heroAlign: "left",
  heroHeight: 56,
  contentMaxWidth: 1600,
  sectionTitleSize: 40,
  upcomingTitle: "Kommande Fester",
  newsTitle: "Nyheter",
  bannerEnabled: false,
  bannerText: "Nästa fest — se biljetter och mer info",
  bannerLink: "/events",
  bannerLinkLabel: "Öppna",
  bannerBg: "#f16cb3",
  bannerColor: "#050505",
  bannerAlign: "center",
  bannerSize: "md",
  bannerDismissible: true,
  bannerSticky: true,
};

function seedEventsFromData(): CmsEvent[] {
  return seedEvents.map((event) => ({ ...event, id: event.slug }));
}

function seedNewsFromData(): CmsNews[] {
  return seedNews.map((item) => ({ ...item, id: item.slug }));
}

function seed(): CmsState {
  const events = seedEventsFromData();
  return {
    events,
    featuredSlugs: events.slice(0, 6).map((event) => event.slug),
    homeUpcomingLimit: 2,
    flashbacks: seedFlashbacks.map((item) => ({
      id: item.slug,
      slug: item.slug,
      eventSlug: item.eventSlug,
      title: item.title,
      venue: item.venue,
      date: item.date,
      cover: item.cover,
      photos: [...item.photos],
      count: item.count,
    })),
    assets: [],
    news: seedNewsFromData(),
    site: { ...defaultSite },
    updatedAt: null,
  };
}

function clampNum(value: unknown, min: number, max: number, fallback: number) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function normalizeSite(raw: Partial<CmsSiteSettings> | undefined): CmsSiteSettings {
  const merged = { ...defaultSite, ...(raw ?? {}) };
  return {
    ...merged,
    heroTitleSize: clampNum(merged.heroTitleSize, 28, 120, defaultSite.heroTitleSize),
    heroTitleMaxWidth: clampNum(merged.heroTitleMaxWidth, 320, 1600, defaultSite.heroTitleMaxWidth),
    heroHeight: clampNum(merged.heroHeight, 32, 90, defaultSite.heroHeight),
    contentMaxWidth: clampNum(merged.contentMaxWidth, 720, 1920, defaultSite.contentMaxWidth),
    sectionTitleSize: clampNum(merged.sectionTitleSize, 24, 56, defaultSite.sectionTitleSize),
    heroAlign: merged.heroAlign === "center" ? "center" : "left",
  };
}

function normalizeState(raw: Partial<CmsState>): CmsState {
  const base = seed();
  const events = raw.events?.length ? raw.events : base.events;
  return {
    events,
    featuredSlugs: raw.featuredSlugs?.length ? raw.featuredSlugs : base.featuredSlugs,
    homeUpcomingLimit: raw.homeUpcomingLimit ?? base.homeUpcomingLimit,
    flashbacks: raw.flashbacks?.length ? raw.flashbacks : base.flashbacks,
    assets: raw.assets ?? base.assets,
    news: raw.news?.length ? raw.news : base.news,
    site: normalizeSite(raw.site),
    updatedAt: raw.updatedAt ?? base.updatedAt,
  };
}

let previewState: CmsState | null = null;

/**
 * Live preview: the admin customizer pushes an unsaved draft into the site frame,
 * which renders from this instead of localStorage until the draft is published.
 */
export function setPreviewState(state: CmsState | null) {
  previewState = state;
  window.dispatchEvent(new Event(CMS_UPDATED_EVENT));
}

export function loadCms(): CmsState {
  if (previewState) return previewState;
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return seed();
    return normalizeState(JSON.parse(raw) as Partial<CmsState>);
  } catch {
    return seed();
  }
}

export function saveCms(state: CmsState) {
  const next = { ...state, updatedAt: new Date().toISOString() };
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CMS_UPDATED_EVENT));
  return next;
}

export function resetCms() {
  localStorage.removeItem(CMS_STORAGE_KEY);
  window.dispatchEvent(new Event(CMS_UPDATED_EVENT));
  return seed();
}

export function exportCmsJson() {
  return JSON.stringify(loadCms(), null, 2);
}

export function importCmsJson(json: string) {
  const parsed = JSON.parse(json) as Partial<CmsState>;
  if (!parsed || typeof parsed !== "object") throw new Error("Ogiltig fil.");
  if (!Array.isArray(parsed.events)) throw new Error("Filen saknar evenemang.");
  return saveCms(normalizeState(parsed));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function sortEventsByDate(items: EventItem[]) {
  return [...items].sort((a, b) => a.date.localeCompare(b.date));
}

export function getPublishedEvents(): EventItem[] {
  const { events } = loadCms();
  return sortEventsByDate(events.map(({ id: _id, ...event }) => event));
}

export function getFeaturedEvents(): EventItem[] {
  const cms = loadCms();
  const map = new Map(cms.events.map((event) => [event.slug, event]));
  const featured = cms.featuredSlugs
    .map((slug) => map.get(slug))
    .filter((event): event is CmsEvent => Boolean(event))
    .map(({ id: _id, ...event }) => event);

  if (featured.length) return featured;
  return getPublishedEvents().slice(0, 6);
}

export function getHomeUpcomingEvents(): EventItem[] {
  const cms = loadCms();
  return getPublishedEvents().slice(0, cms.homeUpcomingLimit);
}

export function getEventBySlug(slug: string): EventItem | undefined {
  return getPublishedEvents().find((event) => event.slug === slug);
}

export function getPublishedFlashbacks() {
  const { flashbacks } = loadCms();
  return flashbacks.map(({ id: _id, ...item }) => item);
}

export function getPublishedNews(): NewsItem[] {
  const { news } = loadCms();
  return [...news]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ id: _id, ...item }) => item);
}

export function getSiteSettings(): CmsSiteSettings {
  return loadCms().site;
}
