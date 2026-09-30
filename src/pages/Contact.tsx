import { PageMeta } from "../components/PageMeta";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "../lib/instagram";

const EMAIL = "hello@partyhbg.se";

export function Contact() {
  return (
    <div className="spark-contact">
      <PageMeta
        title="Kontakta oss — PartyHBG"
        description="Hör av dig till PartyHBG. Mejl, Instagram och frågor om studentfester, gästlista och biljetter i Helsingborg."
        path="/kontakt"
      />

      <header className="spark-contact-head">
        <p className="spark-contact-eyebrow">PartyHBG</p>
        <h1 className="spark-section-title">
          Kontakta <span className="spark-mark">oss</span>
        </h1>
        <p className="spark-contact-lead">
          Frågor om fester, gästlista eller samarbeten? Skicka ett mejl eller skriv till oss på
          Instagram — vi svarar så fort vi kan.
        </p>
      </header>

      <div className="spark-contact-grid">
        <a href={`mailto:${EMAIL}`} className="spark-contact-item">
          <span className="spark-contact-label">Mejl</span>
          <span className="spark-contact-value">
            {EMAIL} <span aria-hidden="true">↗</span>
          </span>
        </a>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="spark-contact-item"
        >
          <span className="spark-contact-label">Instagram</span>
          <span className="spark-contact-value">
            {INSTAGRAM_HANDLE} <span aria-hidden="true">↗</span>
          </span>
        </a>

        <div className="spark-contact-item spark-contact-item--static">
          <span className="spark-contact-label">Plats</span>
          <span className="spark-contact-value">Helsingborg</span>
        </div>
      </div>

      <div className="spark-contact-actions">
        <a href={`mailto:${EMAIL}`} className="spark-btn">
          Skicka mejl <span aria-hidden="true">↗</span>
        </a>
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="spark-btn spark-btn--ghost">
          Öppna Instagram
        </a>
      </div>
    </div>
  );
}
