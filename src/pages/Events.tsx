import { EventList } from "../components/EventList";
import { PageMeta } from "../components/PageMeta";
import { usePublishedEvents } from "../lib/usePublishedEvents";
import { eventsListJsonLd } from "../lib/seo";

export function Events() {
  const { events } = usePublishedEvents();

  return (
    <main className="page pb-16">
      <PageMeta
        title="Evenemang i Helsingborg 2026–2027"
        description="Alla kommande fester och klubbevenemang i Helsingborg. Studentkvällar, gästlista, biljetter och info för NOISE, Tivoli, NOC och Kappa Bar."
        path="/events"
        jsonLd={eventsListJsonLd(events)}
      />

      <h1 className="page-title">Evenemang i Helsingborg</h1>
      <EventList items={events} />
    </main>
  );
}
