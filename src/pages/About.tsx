import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";
import { legalDocs } from "../data";

export function About() {
  return (
    <section className="page about-page street-section">
      <PageMeta
        title="Om PartyHBG — nattliv i Helsingborg"
        description="PartyHBG är nattliv, fest och studentkvällar i Helsingborg. Gästlista, biljetter och flashbacks."
        path="/about"
      />

      <div className="page-hero-banner">
        <h1 className="glow-title glow-title--xl">Om oss</h1>
      </div>

      <div className="about-split">
        <div className="about-split-media">
          <span className="graffiti-tag graffiti-tag--neon" aria-hidden="true">
            PARTY
          </span>
          <img
            src="/photos/crowd.jpg"
            alt="Crowd på fest i Helsingborg"
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="about-split-copy">
          <p className="about-statement">
            Vi kör{" "}
            <span className="marker-word">gästlista</span>
            {" "}direkt på plats eller via sajten med{" "}
            <span className="neon-word">biljetter</span>.
          </p>
          <p className="about-copy">
            PartyHBG är nattliv i Helsingborg — evenemang och flashbacks från NOISE, Tivoli, NOC,
            Kappa Bar och HETCH. Fest, klubb och studentkvällar på ett ställe.
          </p>
          <div className="about-links">
            <Link to="/events" className="btn-action">
              Evenemang
            </Link>
            <Link to="/flashback" className="street-more">
              Flashback →
            </Link>
          </div>
        </div>
      </div>

      <div className="about-legal" id="legal">
        <h2 className="glow-title">Regler</h2>
        <div className="rules-layout">
          <nav className="rules-nav" aria-label="Juridiska dokument">
            {legalDocs.map((doc) => (
              <a key={doc.id} href={`#${doc.id}`} className="rules-nav-item">
                {doc.title}
                <span aria-hidden="true">→</span>
              </a>
            ))}
          </nav>
          <div className="about-legal-grid">
            {legalDocs.map((doc) => (
              <section key={doc.id} id={doc.id} className="legal-block">
                <h3>{doc.title}</h3>
                {doc.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </section>
            ))}
          </div>
        </div>

        <p className="about-contact">
          Frågor?{" "}
          <a href="mailto:hello@partyhbg.se">hello@partyhbg.se</a>
        </p>
      </div>
    </section>
  );
}
