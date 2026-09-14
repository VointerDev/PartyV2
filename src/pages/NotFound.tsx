import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";

export function NotFound() {
  return (
    <section className="page pb-16">
      <PageMeta
        title="Sidan hittades inte"
        description="Sidan du söker finns inte. Gå tillbaka till PartyHBG — evenemang och fest i Helsingborg."
      />
      <h1 className="section-label">↳ 404</h1>
      <Link to="/" className="text-link text-muted hover:text-white">
        ← Hem
      </Link>
    </section>
  );
}
