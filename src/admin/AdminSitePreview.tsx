import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EventList } from "../components/EventList";
import { FeaturedSlider } from "../components/FeaturedSlider";
import { Logo } from "../components/Logo";
import { LogoScroller } from "../components/LogoScroller";
import {
  CMS_UPDATED_EVENT,
  getFeaturedEvents,
  getHomeUpcomingEvents,
  getPublishedEvents,
  loadCms,
} from "./cmsStore";

type PreviewTab = "home" | "events";

export function AdminSitePreview() {
  const [tab, setTab] = useState<PreviewTab>("home");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const refresh = () => setVersion((value) => value + 1);
    window.addEventListener(CMS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(CMS_UPDATED_EVENT, refresh);
  }, []);

  const cms = loadCms();
  const events = getPublishedEvents();
  const featured = getFeaturedEvents();
  const upcoming = getHomeUpcomingEvents();

  return (
    <div className="admin-preview" key={version}>
      <div className="admin-preview-head">
        <p className="admin-preview-label">Förhandsvisning</p>
        <a href="/" target="_blank" rel="noreferrer" className="admin-preview-open">
          Öppna sidan ↗
        </a>
      </div>

      <div className="admin-preview-frame">
        <header className="admin-preview-navbar">
          <Logo className="admin-preview-logo" />
          <nav className="admin-preview-nav" aria-label="Förhandsvisning">
            <button
              type="button"
              className={tab === "home" ? "is-active" : undefined}
              onClick={() => setTab("home")}
            >
              Hem
            </button>
            <button
              type="button"
              className={tab === "events" ? "is-active" : undefined}
              onClick={() => setTab("events")}
            >
              Evenemang
            </button>
            <Link to="/flashback" target="_blank" rel="noreferrer">
              Flashback
            </Link>
            <Link to="/about" target="_blank" rel="noreferrer">
              Om oss
            </Link>
          </nav>
        </header>

        <div className="admin-preview-body">
          {tab === "home" ? (
            <>
              <p className="admin-preview-section">↳ Utvalt · {featured.length} widgets</p>
              <FeaturedSlider items={featured} />
              <LogoScroller />
              <p className="admin-preview-section">↳ Kommande · {upcoming.length} event</p>
              <div className="admin-preview-list">
                <EventList items={upcoming} />
              </div>
            </>
          ) : (
            <>
              <p className="admin-preview-section">↳ Alla evenemang · {events.length} st</p>
              <div className="admin-preview-list">
                <EventList items={events} />
              </div>
            </>
          )}
        </div>
      </div>

      <p className="admin-preview-foot text-muted">
        {cms.featuredSlugs.length} utvalda · {events.length} event totalt
      </p>
    </div>
  );
}
