import { events as seedEvents, flashbacks as seedFlashbacks, type EventItem } from "../data";

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

export type CmsState = {
  events: CmsEvent[];
  featuredSlugs: string[];
  homeUpcomingLimit: number;
  flashbacks: CmsFlashback[];
  assets: CmsAsset[];
};

export const CMS_STORAGE_KEY = "partyhbg_admin_cms";
export const CMS_UPDATED_EVENT = "partyhbg-cms-updated";

function seedEventsFromData(): CmsEvent[] {
  return seedEvents.map((event) => ({ ...event, id: event.slug }));
}

function seed(): CmsState {
  const events = seedEventsFromData();
  return {
    events,
    featuredSlugs: events.slice(0, 6).map((event) => event.slug),
    homeUpcomingLimit: 8,
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
  };
}

export function loadCms(): CmsState {
  try {
    const raw = localStorage.getItem(CMS_STORAGE_KEY);
    if (!raw) return seed();
    return normalizeState(JSON.parse(raw) as Partial<CmsState>);
  } catch {
    return seed();
  }
}

export function saveCms(state: CmsState) {
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(CMS_UPDATED_EVENT));
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
