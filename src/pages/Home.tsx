import { Link } from "react-router-dom";
import { EventList } from "../components/EventList";
import { FeaturedSlider } from "../components/FeaturedSlider";
import { LogoScroller } from "../components/LogoScroller";
import { PageMeta } from "../components/PageMeta";
import { usePublishedEvents } from "../lib/usePublishedEvents";
import { DEFAULT_DESCRIPTION } from "../lib/seo";

export function Home() {
  const { featured, homeUpcoming } = usePublishedEvents();

  return (
    <main>
      <PageMeta
        title="Fest och evenemang i Helsingborg"
        description={DEFAULT_DESCRIPTION}
        path="/"
      />

      <section className="pb-20">
        <FeaturedSlider items={featured} />
        <LogoScroller />
      </section>

      <section className="page pb-20">
        <p className="section-label">↳ Kommande</p>
        <EventList items={homeUpcoming} />
        <Link to="/events" className="text-link mt-8 text-muted hover:text-white">
          Alla evenemang i Helsingborg →
        </Link>
      </section>
    </main>
  );
}
