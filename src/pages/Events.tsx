import { EventList } from "../components/EventList";
import { PageMeta } from "../components/PageMeta";
import { usePublishedEvents } from "../lib/usePublishedEvents";
import { eventsListJsonLd } from "../lib/seo";

export function Events() {
  const { events } = usePublishedEvents();

  return (
    <main className="page events-page street-section">
      <PageMeta
        title="Evenemang i Helsingborg 2026–2027"
        description="Alla kommande fester och klubbevenemang i Helsingborg. Studentkvällar, gästlista, biljetter och info för NOISE, Tivoli, NOC och Kappa Bar."
        path="/events"
        jsonLd={eventsListJsonLd(events)}
      />

      <div className="page-hero-banner">
        <h1 className="glow-title glow-title--xl">Evenemang</h1>
        <p className="page-hero-copy">
          Flexibelt system. Välj kväll, köp biljett, dyk upp. Helsingborgs nattliv — samlat.
        </p>
      </div>

      <EventList items={events} />
    </main>
  );
}
