import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { PageMeta } from "../components/PageMeta";
import { legalDocs } from "../data";

export function About() {
  return (
    <section className="page about-page pb-24">
      <PageMeta
        title="Om PartyHBG — nattliv i Helsingborg"
        description="PartyHBG är nattliv, fest och studentkvällar i Helsingborg. Gästlista, biljetter och flashbacks."
        path="/about"
      />

      <div className="about-hero">
        <div className="about-hero-brand">
          <Logo className="about-logo" />
          <p className="about-location">Helsingborg · Sverige</p>
        </div>

        <div className="about-hero-copy">
          <h1 className="page-title">Om oss</h1>
          <p className="page-lead about-lead">
            PartyHBG är nattliv i Helsingborg — gästlista, evenemang och flashbacks från NOISE, Tivoli,
            NOC, Kappa Bar och HETCH.
          </p>
          <p className="about-copy text-muted">
            Vi samlar fest, klubb och studentkvällar på ett ställe. Biljetter, info och bilder från
            kvällar som redan varit.
          </p>

          <div className="about-links">
            <Link to="/events" className="text-link">
              Evenemang →
            </Link>
            <Link to="/flashback" className="text-link text-muted hover:text-white">
              Flashback →
            </Link>
            <a
              href="https://instagram.com/partyhbg"
              target="_blank"
              rel="noreferrer"
              className="text-link text-muted hover:text-white"
            >
              @partyhbg →
            </a>
            <a
              href="https://instagram.com/cercinoofficial"
              target="_blank"
              rel="noreferrer"
              className="text-link text-muted hover:text-white"
            >
              @cercinoofficial →
            </a>
          </div>
        </div>
      </div>

      <div className="about-legal" id="legal">
        <p className="section-label">↳ Juridiskt</p>
        <nav className="legal-nav" aria-label="Juridiska dokument">
          {legalDocs.map((doc) => (
            <a key={doc.id} href={`#${doc.id}`}>
              {doc.title}
            </a>
          ))}
        </nav>

        <div className="about-legal-grid">
          {legalDocs.map((doc) => (
            <section key={doc.id} id={doc.id} className="legal-block">
              <h2>{doc.title}</h2>
              {doc.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
        </div>

        <p className="about-contact text-muted">
          Frågor?{" "}
          <a href="mailto:hello@partyhbg.se" className="text-white hover:opacity-60">
            hello@partyhbg.se
          </a>
        </p>
      </div>
    </section>
  );
}
