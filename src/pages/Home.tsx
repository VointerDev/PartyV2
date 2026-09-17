import { type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { EventList } from "../components/EventList";
import { PageMeta } from "../components/PageMeta";
import { editable } from "../lib/previewBridge";
import { usePublishedEvents } from "../lib/usePublishedEvents";
import { DEFAULT_DESCRIPTION } from "../lib/seo";

function HeroLink({
  to,
  className,
  target,
  label,
  children,
}: {
  to: string;
  className: string;
  target: string;
  label: string;
  children: string;
}) {
  const marks = editable(target, label);

  if (/^(https?:|mailto:|tel:)/.test(to)) {
    return (
      <a href={to} className={className} target="_blank" rel="noreferrer" {...marks}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to || "/"} className={className} {...marks}>
      {children}
    </Link>
  );
}

export function Home() {
  const { homeUpcoming, news, site } = usePublishedEvents();

  const layoutStyle = {
    "--hero-title-size": `${site.heroTitleSize || 72}px`,
    "--hero-title-max": `${site.heroTitleMaxWidth || 900}px`,
    "--hero-height": `${site.heroHeight || 56}vh`,
    "--content-max": `${site.contentMaxWidth || 1600}px`,
    "--section-title-size": `${site.sectionTitleSize || 40}px`,
  } as CSSProperties;

  return (
    <main
      className={`home-page home-page--align-${site.heroAlign}`}
      style={layoutStyle}
    >
      <PageMeta
        title="Fest och evenemang i Helsingborg"
        description={DEFAULT_DESCRIPTION}
        path="/"
      />

      <section className="home-hero" aria-label={site.heroTitle} {...editable("site:hero", "Hero")}>
        <div className="home-hero-media" aria-hidden="true" {...editable("site:heroMedia", "Video / bild")}>
          {site.heroVideo ? (
            <video
              key={site.heroVideo}
              autoPlay
              muted
              loop
              playsInline
              poster={site.heroPoster || undefined}
              preload="metadata"
            >
              <source src={site.heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img src={site.heroPoster || "/photos/party.jpg"} alt="" />
          )}
        </div>
        <div className="home-hero-veil" aria-hidden="true" />
        <div className="home-hero-inner">
          <h1 className="home-hero-title" {...editable("site:heroTitle", "Rubrik")}>
            {site.heroTitle}
          </h1>
          <div className="home-hero-actions">
            {site.heroPrimaryLabel ? (
              <HeroLink
                to={site.heroPrimaryLink}
                className="home-hero-cta"
                target="site:heroPrimary"
                label="Knapp 1"
              >
                {site.heroPrimaryLabel}
              </HeroLink>
            ) : null}
            {site.heroSecondaryLabel ? (
              <HeroLink
                to={site.heroSecondaryLink}
                className="home-hero-ghost"
                target="site:heroSecondary"
                label="Knapp 2"
              >
                {site.heroSecondaryLabel}
              </HeroLink>
            ) : null}
          </div>
        </div>
      </section>

      <section className="page home-upcoming">
        <div className="home-upcoming-head" {...editable("site:upcoming", "Rubrik & antal biljetter")}>
          <h2>{site.upcomingTitle}</h2>
        </div>
        <EventList items={homeUpcoming} />
      </section>

      <section className="page home-news">
        <div className="home-upcoming-head" {...editable("site:news", "Rubrik för nyheter")}>
          <h2>{site.newsTitle}</h2>
        </div>
        <div className="news-grid">
          {news.map((item) => (
            <article key={item.slug} className="news-card" {...editable(`news:${item.slug}`, item.title)}>
              <div className="news-card-media">
                <img src={item.image} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="news-card-body">
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
