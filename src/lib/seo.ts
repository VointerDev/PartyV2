import type { EventItem, Flashback } from "../data";

export const SITE_NAME = "PartyHBG";
export const SITE_URL = "https://partyhbg.se";
export const DEFAULT_DESCRIPTION =
  "Fest, klubb och studentkvällar i Helsingborg. Evenemang, gästlista, biljetter och flashbacks från NOISE, Tivoli, NOC och Kappa Bar.";

export function pageTitle(title: string) {
  return title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`;
}

export function absoluteUrl(path: string) {
  const base = typeof window !== "undefined" ? window.location.origin : SITE_URL;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function eventMetaDescription(event: EventItem) {
  const copy = event.description ?? event.blurb ?? "";
  return `${event.title} på ${event.venue} i Helsingborg — ${copy} Biljetter, gästlista och info för fest och nattliv.`.slice(
    0,
    160,
  );
}

export function eventJsonLd(event: EventItem) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description ?? event.blurb,
    startDate: `${event.date}T22:00:00+02:00`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: event.image,
    location: {
      "@type": "Place",
      name: event.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.address.split(",")[0]?.trim(),
        addressLocality: "Helsingborg",
        addressCountry: "SE",
      },
    },
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      price: event.price.replace(/[^\d]/g, "") || "0",
      priceCurrency: "SEK",
      url: "https://instagram.com/partyhbg",
      availability: "https://schema.org/InStock",
    },
  };
}

export function eventsListJsonLd(items: EventItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Evenemang i Helsingborg",
    description: DEFAULT_DESCRIPTION,
    itemListElement: items.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/events/${event.slug}`,
      name: event.title,
    })),
  };
}

export function flashbackMetaDescription(gallery: Flashback) {
  return `Flashback från ${gallery.title} på ${gallery.venue} i Helsingborg — ${gallery.count} bilder från fest och nattliv.`;
}
