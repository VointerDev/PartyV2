import { Link } from "react-router-dom";
import type { EventItem } from "../data";
import { eventCategory, eventYear, groupEventsByMonth } from "../data";

export function EventList({ items }: { items: EventItem[] }) {
  const groups = groupEventsByMonth(items);

  return (
    <div className="event-list">
      <div className="list-grid list-head">
        <span>Evenemang</span>
        <span>Plats</span>
        <span>Kategori</span>
        <span className="list-year">Datum</span>
      </div>
      {groups.map((group) => (
        <section key={group.key} className="event-month-group">
          <p className="list-month">{group.label}</p>
          {group.items.map((event) => {
            const cat = eventCategory(event);
            const date = eventYear(event.date);
            return (
              <Link key={event.slug} to={`/events/${event.slug}`} className="list-row">
                <span className="list-col-event">↳ {event.title}</span>
                <span className="list-col-meta">
                  {event.venue} · {cat} · {date}
                </span>
                <span className="list-col-venue">{event.venue}</span>
                <span className="list-col-cat">{cat}</span>
                <span className="list-col-date">{date}</span>
              </Link>
            );
          })}
        </section>
      ))}
    </div>
  );
}
