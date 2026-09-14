import { Link, useNavigate, useParams } from "react-router-dom";
import { getEventBySlug } from "../admin/cmsStore";
import { PageMeta } from "../components/PageMeta";
import {
  agendaDate,
  eventCategory,
  lineupOf,
} from "../data";
import { flashbackForPublishedEvent } from "../lib/usePublishedEvents";
import { eventJsonLd, eventMetaDescription } from "../lib/seo";
import { NotFound } from "./NotFound";

export function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const event = slug ? getEventBySlug(slug) : undefined;
  if (!event) return <NotFound />;

  const flashback = flashbackForPublishedEvent(event.slug);
  const copy = event.description ?? event.blurb;
  const imageAlt = `${event.title} på ${event.venue} i Helsingborg — fest och nattliv`;

  return (
    <article className="page detail-page">
      <PageMeta
        title={`${event.title} · ${event.venue} Helsingborg`}
        description={eventMetaDescription(event)}
        path={`/events/${event.slug}`}
        image={event.image}
        jsonLd={eventJsonLd(event)}
      />

      <Link
        to="/events"
        className="detail-back-link"
        onClick={(e) => {
          if (window.history.state?.idx > 0) {
            e.preventDefault();
            navigate(-1);
          }
        }}
      >
        ← Evenemang
      </Link>
      <h1 className="section-label">↳ {event.title}</h1>

      <div className="detail-head">
        <div className="detail-intro">
          <p className="detail-venue">{event.venue}</p>
          <p className="detail-address text-muted">{event.address}</p>
          {copy ? <p className="detail-copy">{copy}</p> : null}
        </div>

        <aside className="detail-aside">
          <a
            href="https://instagram.com/partyhbg"
            target="_blank"
            rel="noreferrer"
            className="detail-tickets"
          >
            Köp biljetter →
          </a>
          {flashback ? (
            <Link to={`/flashback/${flashback.slug}`} className="detail-flashback">
              Se flashback · {flashback.count} bilder →
            </Link>
          ) : null}
        </aside>
      </div>

      <div className="detail-hero">
        <img src={event.image} alt={imageAlt} decoding="async" fetchPriority="high" />
      </div>

      <dl className="detail-facts">
        <div>
          <dt>Datum</dt>
          <dd>{agendaDate(event.date)}</dd>
        </div>
        <div>
          <dt>Tid</dt>
          <dd>{event.time}</dd>
        </div>
        <div>
          <dt>Lineup</dt>
          <dd>{lineupOf(event)}</dd>
        </div>
        <div>
          <dt>Kategori</dt>
          <dd>{eventCategory(event)}</dd>
        </div>
        <div>
          <dt>Ålder</dt>
          <dd>{event.age}</dd>
        </div>
        <div>
          <dt>Pris</dt>
          <dd>{event.price}</dd>
        </div>
      </dl>
    </article>
  );
}
