import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { agendaDate, isPastEvent } from "../data";
import {
  CMS_UPDATED_EVENT,
  exportCmsJson,
  importCmsJson,
  loadCms,
  resetCms,
} from "./cmsStore";
import { useAuth } from "./AuthProvider";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "God natt";
  if (hour < 10) return "God morgon";
  if (hour < 17) return "Hej";
  return "God kväll";
}

function daysUntil(iso: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${iso}T12:00:00`);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function countdownLabel(iso: string) {
  const days = daysUntil(iso);
  if (days === 0) return "Ikväll";
  if (days === 1) return "Imorgon";
  return `Om ${days} dagar`;
}

function savedLabel(updatedAt: string | null) {
  if (!updatedAt) return "Inga ändringar än";
  const diff = Date.now() - new Date(updatedAt).getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return "Sparad nyss";
  if (minutes < 60) return `Sparad för ${minutes} min sedan`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `Sparad för ${hours} tim sedan`;
  return `Sparad ${new Date(updatedAt).toLocaleDateString("sv-SE")}`;
}

export function AdminDashboard() {
  const { email } = useAuth();
  const [version, setVersion] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const refresh = () => setVersion((value) => value + 1);
    window.addEventListener(CMS_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(CMS_UPDATED_EVENT, refresh);
  }, []);

  const cms = useMemo(() => loadCms(), [version]);

  const upcoming = useMemo(
    () =>
      [...cms.events]
        .filter((event) => !isPastEvent(event.date))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [cms.events],
  );

  const next = upcoming[0];
  const latestNews = useMemo(
    () => [...cms.news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3),
    [cms.news],
  );

  const issues = useMemo(() => {
    const list: { id: string; text: string; to: string; action: string }[] = [];

    const missingImage = cms.events.filter((event) => !event.image?.trim());
    if (missingImage.length) {
      list.push({
        id: "event-image",
        text: `${missingImage.length} biljett${missingImage.length > 1 ? "er" : ""} saknar bild`,
        to: "/admin/events",
        action: "Fixa",
      });
    }

    const staleFeatured = cms.featuredSlugs.filter((slug) => {
      const event = cms.events.find((item) => item.slug === slug);
      return !event || isPastEvent(event.date);
    });
    if (staleFeatured.length) {
      list.push({
        id: "featured",
        text: `${staleFeatured.length} utvald widget visar en fest som redan varit`,
        to: "/admin/events",
        action: "Rensa",
      });
    }

    const emptyFlashbacks = cms.flashbacks.filter((item) => !item.photos.length);
    if (emptyFlashbacks.length) {
      list.push({
        id: "flashback",
        text: `${emptyFlashbacks.length} flashback utan bilder`,
        to: "/admin/flashbacks",
        action: "Ladda upp",
      });
    }

    if (!cms.news.length) {
      list.push({
        id: "news",
        text: "Inga nyheter på startsidan",
        to: "/admin/news",
        action: "Skriv en",
      });
    }

    if (!cms.site.heroVideo && !cms.site.heroPoster) {
      list.push({
        id: "hero",
        text: "Hero saknar video och bild",
        to: "/admin/settings",
        action: "Välj media",
      });
    }

    if (!upcoming.length) {
      list.push({
        id: "upcoming",
        text: "Inga kommande fester — startsidan blir tom",
        to: "/admin/events",
        action: "Lägg till",
      });
    }

    return list;
  }, [cms, upcoming.length]);

  function onExport() {
    const blob = new Blob([exportCmsJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `partyhbg-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Säkerhetskopia nedladdad.");
  }

  async function onImport(file: File) {
    try {
      importCmsJson(await file.text());
      setVersion((value) => value + 1);
      setMessage("Säkerhetskopia återställd — sajten är uppdaterad.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kunde inte läsa filen.");
    }
  }

  function onReset() {
    if (!confirm("Återställ allt innehåll till originalet? Dina ändringar försvinner.")) return;
    resetCms();
    setVersion((value) => value + 1);
    setMessage("Innehållet är återställt till originalet.");
  }

  return (
    <section className="admin-page">
      <header className="admin-dash-head">
        <div>
          <p className="section-label">↳ Översikt</p>
          <h1 className="admin-page-title">
            {greeting()}
            {email ? `, ${email}` : ""}
          </h1>
          <p className="admin-page-lead text-muted">
            Allt du ändrar här sparas direkt och syns på sajten med en gång.
          </p>
        </div>

        <div className="admin-dash-head-side">
          <span className="admin-chip">
            <i className="admin-chip-dot" aria-hidden="true" />
            {savedLabel(cms.updatedAt)}
          </span>
          <a href="/" target="_blank" rel="noreferrer" className="admin-button admin-button--primary">
            Visa sajten ↗
          </a>
        </div>
      </header>

      {message ? <p className="admin-message">{message}</p> : null}

      <div className="admin-dash-grid">
        <div className="admin-dash-main">
          {next ? (
            <article className="admin-next">
              <div className="admin-next-media">
                <img src={next.image} alt="" loading="lazy" />
              </div>
              <div className="admin-next-body">
                <p className="admin-next-label">Nästa fest · {countdownLabel(next.date)}</p>
                <h2 className="admin-next-title">{next.title}</h2>
                <p className="admin-next-meta text-muted">
                  {agendaDate(next.date)} · {next.venue} · {next.time}
                </p>
                <p className="admin-next-meta text-muted">
                  {next.price} · {next.age}
                  {cms.featuredSlugs.includes(next.slug) ? " · Utvald widget" : ""}
                </p>
                <div className="admin-next-actions">
                  <Link to="/admin/events" className="admin-button admin-button--ghost">
                    Redigera
                  </Link>
                  <a
                    href={`/events/${next.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-button admin-button--ghost"
                  >
                    Öppna sidan ↗
                  </a>
                </div>
              </div>
            </article>
          ) : (
            <article className="admin-next admin-next--empty">
              <div className="admin-next-body">
                <p className="admin-next-label">Nästa fest</p>
                <h2 className="admin-next-title">Inget planerat</h2>
                <p className="text-muted">Lägg upp en biljett så fylls startsidan igen.</p>
                <div className="admin-next-actions">
                  <Link to="/admin/events" className="admin-button admin-button--primary">
                    Ny biljett
                  </Link>
                </div>
              </div>
            </article>
          )}

          <div className="admin-stats">
            <div className="admin-stat">
              <p className="admin-stat-value">{upcoming.length}</p>
              <p className="admin-stat-label">Kommande fester</p>
              <p className="admin-stat-sub text-muted">{cms.events.length} totalt</p>
            </div>
            <div className="admin-stat">
              <p className="admin-stat-value">{cms.news.length}</p>
              <p className="admin-stat-label">Nyheter</p>
              <p className="admin-stat-sub text-muted">visas på startsidan</p>
            </div>
            <div className="admin-stat">
              <p className="admin-stat-value">{cms.flashbacks.length}</p>
              <p className="admin-stat-label">Flashbacks</p>
              <p className="admin-stat-sub text-muted">
                {cms.flashbacks.reduce((sum, item) => sum + item.photos.length, 0)} bilder
              </p>
            </div>
            <div className="admin-stat">
              <p className="admin-stat-value">{cms.homeUpcomingLimit}</p>
              <p className="admin-stat-label">Biljetter på hem</p>
              <p className="admin-stat-sub text-muted">{cms.featuredSlugs.length} utvalda</p>
            </div>
          </div>

          <section className="admin-dash-block">
            <h2 className="admin-dash-block-title">Snabbstart</h2>
            <div className="admin-quick">
              <Link to="/admin/events" className="admin-quick-card">
                <p className="admin-quick-title">Ny biljett</p>
                <p className="text-muted">Datum, plats, pris och bild för nästa fest.</p>
              </Link>
              <Link to="/admin/news" className="admin-quick-card">
                <p className="admin-quick-title">Skriv nyhet</p>
                <p className="text-muted">Syns högst upp i nyhetsflödet på startsidan.</p>
              </Link>
              <Link to="/admin/flashbacks" className="admin-quick-card">
                <p className="admin-quick-title">Nytt flashback</p>
                <p className="text-muted">Galleri från festen som varit.</p>
              </Link>
              <Link to="/admin/settings" className="admin-quick-card">
                <p className="admin-quick-title">Byt hero</p>
                <p className="text-muted">Titel, video och rubriker på startsidan.</p>
              </Link>
            </div>
          </section>

          <section className="admin-dash-block">
            <div className="admin-dash-block-head">
              <h2 className="admin-dash-block-title">Kalender</h2>
              <Link to="/admin/events" className="admin-link-button">
                Alla biljetter
              </Link>
            </div>
            <ul className="admin-schedule">
              {upcoming.slice(0, 5).map((event) => (
                <li key={event.id} className="admin-schedule-row">
                  <span className="admin-schedule-date">{agendaDate(event.date)}</span>
                  <span className="admin-schedule-title">{event.title}</span>
                  <span className="admin-schedule-venue text-muted">{event.venue}</span>
                  <span className="admin-schedule-countdown">{countdownLabel(event.date)}</span>
                </li>
              ))}
              {!upcoming.length ? <li className="text-muted">Inga kommande datum.</li> : null}
            </ul>
          </section>
        </div>

        <aside className="admin-dash-side">
          <section className="admin-dash-block">
            <h2 className="admin-dash-block-title">Att fixa</h2>
            {issues.length ? (
              <ul className="admin-issues">
                {issues.map((issue) => (
                  <li key={issue.id} className="admin-issue">
                    <span>{issue.text}</span>
                    <Link to={issue.to} className="admin-link-button">
                      {issue.action}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-issues-ok">Allt ser bra ut. Sajten är komplett.</p>
            )}
          </section>

          <section className="admin-dash-block">
            <div className="admin-dash-block-head">
              <h2 className="admin-dash-block-title">Senaste nytt</h2>
              <Link to="/admin/news" className="admin-link-button">
                Redigera
              </Link>
            </div>
            <ul className="admin-mini-list">
              {latestNews.map((item) => (
                <li key={item.id}>
                  <p className="admin-mini-title">{item.title}</p>
                  <p className="text-muted">
                    {item.tag} · {item.date}
                  </p>
                </li>
              ))}
              {!latestNews.length ? <li className="text-muted">Inga nyheter ännu.</li> : null}
            </ul>
          </section>

          <section className="admin-dash-block">
            <h2 className="admin-dash-block-title">Säkerhetskopia</h2>
            <p className="admin-dash-block-lead text-muted">
              Ladda ner allt innehåll som en fil innan du gör större ändringar. Du kan alltid läsa
              tillbaka den.
            </p>
            <div className="admin-form-actions">
              <button type="button" className="admin-button admin-button--ghost" onClick={onExport}>
                Ladda ner
              </button>
              <button
                type="button"
                className="admin-button admin-button--ghost"
                onClick={() => fileInput.current?.click()}
              >
                Återställ fil
              </button>
              <button type="button" className="admin-link-button admin-link-button--danger" onClick={onReset}>
                Nollställ allt
              </button>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onImport(file);
                e.target.value = "";
              }}
            />
          </section>
        </aside>
      </div>
    </section>
  );
}
