import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EventList } from "../components/EventList";
import { Logo } from "../components/Logo";
import {
  CMS_UPDATED_EVENT,
  getHomeUpcomingEvents,
  getPublishedEvents,
  getPublishedNews,
  getSiteSettings,
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
  const upcoming = getHomeUpcomingEvents();
  const news = getPublishedNews();
  const site = getSiteSettings();

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
              <div className="admin-preview-hero">
                <img src={site.heroPoster || "/photos/party.jpg"} alt="" />
                <p className="admin-preview-hero-title">{site.heroTitle}</p>
              </div>
              <p className="admin-preview-section">
                ↳ {site.upcomingTitle} · {upcoming.length} st
              </p>
              <div className="admin-preview-list">
                <EventList items={upcoming} />
              </div>
              <p className="admin-preview-section">
                ↳ {site.newsTitle} · {news.length} st
              </p>
              <ul className="admin-preview-news">
                {news.slice(0, 3).map((item) => (
                  <li key={item.slug}>
                    <strong>{item.title}</strong>
                    <span className="text-muted">{item.excerpt}</span>
                  </li>
                ))}
              </ul>
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
        {cms.news.length} nyheter · {events.length} biljetter · {cms.flashbacks.length} flashbacks
      </p>
    </div>
  );
}
