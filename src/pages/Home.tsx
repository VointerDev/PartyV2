import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";
import { InstagramFeed } from "../components/InstagramFeed";
import { usePublishedEvents } from "../lib/usePublishedEvents";
import { DEFAULT_DESCRIPTION } from "../lib/seo";
import { INSTAGRAM_URL } from "../lib/instagram";
import type { Flashback } from "../data";

const AVATARS = ["/photos/dj.jpg", "/photos/crowd.jpg", "/photos/dance.jpg"];

const FALLBACK_VENUES = ["HETCH", "Campus"];

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

type VenueEntry = {
  label: string;
  cover: string;
  to?: string;
};

export function Home() {
  const { site, flashbacks } = usePublishedEvents();

  const venues = useMemo(() => {
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

  return (
    <div className="spark-home">
      <PageMeta
        title="Studentfester i Helsingborg"
        description={DEFAULT_DESCRIPTION}
        path="/"
      />

      <section className="spark-hero">
        <div className="spark-hero-media" aria-hidden="true">
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
          <h1 className="spark-hero-title">
            Upptäck studentfesten{" "}
            <span className="spark-mark">genom nätter</span> som sätter Helsingborg i rörelse
          </h1>

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

      <section className="spark-venues" id="scener">
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

      <InstagramFeed />
    </div>
  );
}
