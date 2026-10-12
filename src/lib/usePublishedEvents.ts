import { useEffect, useMemo, useState } from "react";
import {
  applyPublishedCms,
  CMS_UPDATED_EVENT,
  getEventBySlug,
  getFeaturedEvents,
  getHomeUpcomingEvents,
  getNavPages,
  getPublishedEvents,
  getPublishedFlashbacks,
  getPublishedNews,
  getPublishedPages,
  getSiteSettings,
} from "../admin/cmsStore";
import { isPastEvent } from "../data";
import { isPreviewFrame } from "./previewBridge";
import { fetchPublishedCms } from "./cmsRemote";

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

  useEffect(() => {
    // Don't overwrite admin drafts or the live preview iframe.
    if (isPreviewFrame()) return;
    if (window.location.pathname.startsWith("/admin")) return;

    let active = true;
    fetchPublishedCms().then((remote) => {
      if (!active || !remote) return;
      applyPublishedCms(remote);
    });
    return () => {
      active = false;
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
      pages: getPublishedPages(),
      navPages: getNavPages(),
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
