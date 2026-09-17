import { Link } from "react-router-dom";
import type { EventItem } from "../data";
import { agendaDate, groupEventsByMonth } from "../data";
import { editable } from "../lib/previewBridge";

function ticketSerial(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return String(hash % 100000).padStart(5, "0");
}

export function EventList({
  items,
  featuredSlug,
}: {
  items: EventItem[];
  featuredSlug?: string;
}) {
  const groups = groupEventsByMonth(items);
  let index = 0;

  return (
    <div className="ticket-board">
      {groups.map((group) => (
        <section key={group.key} className="ticket-month">
          <p className="ticket-month-label">{group.label}</p>
          <div className="ticket-grid">
            {group.items.map((event) => {
              const featured = featuredSlug
                ? event.slug === featuredSlug
                : index++ === 0;
              const serial = ticketSerial(event.slug);
              return (
                <Link
                  key={event.slug}
                  to={`/events/${event.slug}`}
                  className={featured ? "ticket ticket--hot" : "ticket"}
                  {...editable(`event:${event.slug}`, event.title)}
                >
                  <div className="ticket-main">
                    <div className="ticket-watermark" aria-hidden="true">
                      PHBG
                    </div>

                    <div className="ticket-brand">
                      <span>PartyHBG</span>
                      <span className="ticket-chip">{event.age}</span>
                    </div>

                    <div className="ticket-core">
                      <h3 className="ticket-title">{event.title}</h3>
                      <p className="ticket-meta">
                        {event.venue}
                        <span aria-hidden="true"> · </span>
                        {agendaDate(event.date)}
                        <span aria-hidden="true"> · </span>
                        {event.time}
                      </p>
                    </div>

                    <div className="ticket-footer">
                      <p className="ticket-serial">No. {serial}</p>
                    </div>

                    <span className="ticket-stamp" aria-hidden="true">
                      Valid
                    </span>
                  </div>

                  <div className="ticket-stub">
                    <span className="ticket-admit">Admit one</span>
                    <span className="ticket-price">{event.price}</span>
                    <span className="ticket-barcode" aria-hidden="true" />
                    <span className="ticket-stub-serial">{serial}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
