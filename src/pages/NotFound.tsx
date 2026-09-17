import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";

export function NotFound() {
  return (
    <section className="page street-section notfound-page">
      <PageMeta
        title="Sidan hittades inte"
        description="Sidan du söker finns inte. Gå tillbaka till PartyHBG — evenemang och fest i Helsingborg."
      />
      <p className="graffiti-tag graffiti-tag--inline" aria-hidden="true">
        LOST
      </p>
      <h1 className="glow-title glow-title--xl">404</h1>
      <p className="page-hero-copy">Den här sidan finns inte. Tillbaka till natten.</p>
      <Link to="/" className="btn-action">
        Hem
      </Link>
    </section>
  );
}
