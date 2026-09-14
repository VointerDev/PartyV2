import { Link } from "react-router-dom";
import type { EventItem } from "../data";

export function FeaturedSlider({ items }: { items: EventItem[] }) {
  return (
    <div className="featured-slider">
      <div className="featured-slider-viewport">
        <div className="featured-slider-track">
          {items.map((event, index) => (
            <Link key={event.slug} to={`/events/${event.slug}`} data-slide className="featured-slide">
              <img
                src={event.image}
                alt={`${event.title} på ${event.venue} i Helsingborg`}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "auto"}
              />
              <p>
                PartyHBG x {event.venue}
                <br />
                {event.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
