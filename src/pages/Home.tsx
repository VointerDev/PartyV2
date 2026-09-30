import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";
import { InstagramFeed } from "../components/InstagramFeed";
import { SiteBanner } from "../components/SiteBanner";
import { usePublishedEvents } from "../lib/usePublishedEvents";
import { DEFAULT_DESCRIPTION } from "../lib/seo";
import { INSTAGRAM_URL } from "../lib/instagram";
import { editable } from "../lib/previewBridge";
import type { Flashback } from "../data";

const AVATARS = ["/photos/dj.jpg", "/photos/crowd.jpg", "/photos/dance.jpg"];
const FALLBACK_VENUES = ["HETCH", "Campus"];
/** Set to true to show the venues / scener block again. */
const SHOW_VENUES = false;
const DEFAULT_HERO_TITLE =
  "Upptäck studentfesten [[genom nätter]] som sätter Helsingborg i rörelse";

function resolveHeroTitle(raw: string) {
  const title = raw.trim();
  if (!title || /^partyhbg$/i.test(title)) return DEFAULT_HERO_TITLE;
  return title;
}

function venueKey(venue: string) {
  return venue.trim().toLowerCase();
}

function latestFlashbackByVenue(flashbacks: Flashback[]) {
  const map = new Map<string, Flashback>();

  for (const item of [...flashbacks].sort((a, b) => b.date.localeCompare(a.date))) {
    const key = venueKey(item.venue);
    if (!map.has(key)) map.set(key, item);
  }

  return map;
}

/** Renders CMS hero title. Wrap highlighted words in [[like this]]. */
function renderHeroTitle(title: string): ReactNode[] {
  const parts = title.split(/(\[\[[\s\S]*?\]\])/g).filter(Boolean);
  return parts.map((part, index) => {
    const mark = part.match(/^\[\[([\s\S]*?)\]\]$/);
    if (mark) {
      return (
        <span key={index} className="spark-mark">
          {mark[1]}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function CtaLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) {
  if (!to.trim()) return null;
  if (/^(https?:|mailto:|tel:)/.test(to)) {
    return (
      <a href={to} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

type VenueEntry = {
  label: string;
  cover: string;
  to?: string;
};

export function Home() {
  const { site, flashbacks } = usePublishedEvents();

  const venues = useMemo(() => {
    if (!SHOW_VENUES) return [] as VenueEntry[];
    const byVenue = latestFlashbackByVenue(flashbacks);
    const entries: VenueEntry[] = [];
    const seen = new Set<string>();

    for (const item of [...flashbacks].sort((a, b) => b.date.localeCompare(a.date))) {
      const key = venueKey(item.venue);
      if (seen.has(key)) continue;
      seen.add(key);
      const latest = byVenue.get(key)!;
      entries.push({
        label: `${latest.venue}, Helsingborg`,
        cover: latest.cover,
        to: `/flashback/${latest.slug}`,
      });
    }

    for (const name of FALLBACK_VENUES) {
      const key = venueKey(name);
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({
        label: `${name}, Helsingborg`,
        cover: "/photos/club.jpg",
        to: "/flashback",
      });
    }

    entries.push({
      label: "Fler scener snart",
      cover: "/photos/stage.jpg",
    });

    return entries;
  }, [flashbacks]);

  const [activeVenue, setActiveVenue] = useState(0);
  const active = venues[activeVenue] ?? venues[0];

  const heroTitle = resolveHeroTitle(site.heroTitle);
  const heroStyle = {
    "--spark-hero-title-size": `${site.heroTitleSize}px`,
    "--spark-hero-title-max": `${site.heroTitleMaxWidth}px`,
    "--spark-hero-height": `${site.heroHeight}vh`,
  } as CSSProperties;

  const showPrimary = Boolean(site.heroPrimaryLabel.trim());
  const showSecondary = Boolean(site.heroSecondaryLabel.trim());

  return (
    <div className="spark-home">
      <PageMeta
        title="Studentfester i Helsingborg"
        description={DEFAULT_DESCRIPTION}
        path="/"
      />

      <SiteBanner site={site} />

      <section
        className={`spark-hero ${site.heroAlign === "center" ? "is-center" : ""}`}
        style={heroStyle}
        {...editable("site:hero", "Hero")}
      >
        <div
          className="spark-hero-media"
          aria-hidden="true"
          {...editable("site:heroMedia", "Hero-media")}
        >
          {site.heroVideo ? (
            <video
              key={site.heroVideo}
              autoPlay
              muted
              loop
              playsInline
              poster={site.heroPoster || "/photos/party.jpg"}
              preload="metadata"
            >
              <source src={site.heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img src={site.heroPoster || "/photos/party.jpg"} alt="" />
          )}
        </div>
        <div className="spark-hero-veil" aria-hidden="true" />

        <div className="spark-hero-content">
          <h1 className="spark-hero-title" {...editable("site:heroTitle", "Hero-rubrik")}>
            {renderHeroTitle(heroTitle)}
          </h1>

          {showPrimary || showSecondary ? (
            <div className="spark-hero-actions">
              {showPrimary ? (
                <span {...editable("site:heroPrimary", "Hero-knapp 1")}>
                  <CtaLink to={site.heroPrimaryLink} className="spark-btn">
                    {site.heroPrimaryLabel} <span aria-hidden="true">↗</span>
                  </CtaLink>
                </span>
              ) : null}
              {showSecondary ? (
                <span {...editable("site:heroSecondary", "Hero-knapp 2")}>
                  <CtaLink to={site.heroSecondaryLink} className="spark-btn spark-btn--ghost">
                    {site.heroSecondaryLabel}
                  </CtaLink>
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="spark-hero-bottom">
            <p className="spark-hero-lead">
              Studentfester, klubbkvällar och lönelördagar — gästlista, biljetter och det som händer
              efter midnatt. För dig som vill ut.
            </p>

            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="spark-feature">
              <div className="spark-avatars" aria-hidden="true">
                {AVATARS.map((src) => (
                  <img key={src} src={src} alt="" />
                ))}
                <span>+120</span>
              </div>
              <p className="spark-feature-title">
                Lönelördag på NOISE <span aria-hidden="true">↗</span>
              </p>
            </a>
          </div>
        </div>
      </section>

      {SHOW_VENUES ? (
        <section className="spark-venues" id="scener" {...editable("site:upcoming", "Scener")}>
          <div className="spark-venues-grid">
            <div className="spark-venues-left">
              <div className="spark-venues-photo">
                <img
                  key={active?.cover}
                  src={active?.cover || "/photos/club.jpg"}
                  alt={active ? `Flashback från ${active.label}` : "Klubbscen i Helsingborg"}
                />
              </div>
            </div>

            <div className="spark-venues-right">
              <ul className="spark-venue-list">
                {venues.map((venue, i) => {
                  const isActive = i === activeVenue;
                  const className = isActive ? "is-active" : undefined;
                  const label = (
                    <>
                      {venue.label}
                      {isActive ? <span aria-hidden="true"> →</span> : null}
                    </>
                  );

                  return (
                    <li key={venue.label}>
                      {venue.to ? (
                        <Link
                          to={venue.to}
                          className={className}
                          onMouseEnter={() => setActiveVenue(i)}
                          onFocus={() => setActiveVenue(i)}
                        >
                          {label}
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className={className}
                          onMouseEnter={() => setActiveVenue(i)}
                          onFocus={() => setActiveVenue(i)}
                          onClick={() => setActiveVenue(i)}
                        >
                          {label}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <InstagramFeed />
    </div>
  );
}
