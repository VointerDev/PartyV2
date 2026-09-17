import { Link, useNavigate, useParams } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";
import {
  agendaDate,
  eventCategory,
  lineupOf,
} from "../data";
import { editable } from "../lib/previewBridge";
import { flashbackForPublishedEvent, usePublishedEvents } from "../lib/usePublishedEvents";
import { eventJsonLd, eventMetaDescription } from "../lib/seo";
import { NotFound } from "./NotFound";

export function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { events } = usePublishedEvents();
  const event = events.find((item) => item.slug === slug);
  if (!event) return <NotFound />;

  const flashback = flashbackForPublishedEvent(event.slug);
  const copy = event.description ?? event.blurb;
  const imageAlt = `${event.title} på ${event.venue} i Helsingborg — fest och nattliv`;

  return (
    <article className="page detail-page" {...editable(`event:${event.slug}`, event.title)}>
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

      <div className="detail-layout">
        <div className="detail-copy-col">
          <p className="detail-kicker">{eventCategory(event)}</p>
          <h1 className="detail-title glow-title">{event.title}</h1>
          <p className="detail-venue">{event.venue}</p>
          <p className="detail-address">{event.address}</p>
          {copy ? <p className="detail-copy">{copy}</p> : null}

          <div className="detail-aside">
            <a
              href="https://instagram.com/partyhbg"
              target="_blank"
              rel="noreferrer"
              className="btn-action"
            >
              Köp biljetter
            </a>
            {flashback ? (
              <Link to={`/flashback/${flashback.slug}`} className="detail-flashback">
                Se flashback · {flashback.count} bilder →
              </Link>
            ) : null}
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
              <dt>Ålder</dt>
              <dd>{event.age}</dd>
            </div>
            <div>
              <dt>Pris</dt>
              <dd>{event.price}</dd>
            </div>
          </dl>
        </div>

        <div className="detail-media-col">
          <div className="detail-hero">
            <span className="graffiti-tag" aria-hidden="true">
              NIGHT
            </span>
            <img src={event.image} alt={imageAlt} decoding="async" fetchPriority="high" />
          </div>
        </div>
      </div>
    </article>
  );
}
