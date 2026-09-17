import { useEffect, useMemo, useState } from "react";
import {
  CMS_UPDATED_EVENT,
  getEventBySlug,
  getFeaturedEvents,
  getHomeUpcomingEvents,
  getPublishedEvents,
  getPublishedFlashbacks,
  getPublishedNews,
  getSiteSettings,
} from "../admin/cmsStore";
import { isPastEvent } from "../data";

function useCmsVersion() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const refresh = () => setVersion((value) => value + 1);
    window.addEventListener(CMS_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CMS_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return version;
}

export function usePublishedEvents() {
  const version = useCmsVersion();

  return useMemo(
    () => ({
      events: getPublishedEvents(),
      featured: getFeaturedEvents(),
      homeUpcoming: getHomeUpcomingEvents(),
      flashbacks: getPublishedFlashbacks(),
      news: getPublishedNews(),
      site: getSiteSettings(),
    }),
    [version],
  );
}

export function flashbackForPublishedEvent(slug: string) {
  const event = getEventBySlug(slug);
  const flashback = getPublishedFlashbacks().find((item) => item.eventSlug === slug);
  if (!event || !flashback || !isPastEvent(event.date)) return undefined;
  return flashback;
}
