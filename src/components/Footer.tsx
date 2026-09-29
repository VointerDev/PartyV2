import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "../lib/instagram";

export function Footer() {
  return (
    <footer className="spark-footer">
      <div className="spark-footer-inner">
        <Link to="/" className="spark-footer-logo-link" aria-label="PartyHBG hem">
          <Logo className="spark-footer-logo" />
        </Link>

        <h2 className="spark-section-title spark-footer-title">
          Helsingborgs <span className="spark-mark">studentfester</span>
        </h2>

        <div className="spark-footer-row">
          <p className="spark-footer-lead">
            Studentnätter, gästlista och biljetter — fester för dem som pluggar, festar och stannar
            kvar till stängning.
          </p>

          <nav className="spark-footer-nav" aria-label="Sidfot">
            <Link to="/flashback">Flashback</Link>
            <a href="/#instagram">Instagram</a>
            <a href="mailto:hello@partyhbg.se">Kontakta oss</a>
          </nav>
        </div>

        <div className="spark-footer-actions">
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="spark-btn">
            Följ {INSTAGRAM_HANDLE} <span aria-hidden="true">↗</span>
          </a>
          <a href="mailto:hello@partyhbg.se" className="spark-btn spark-btn--ghost">
            Mejla oss
          </a>
        </div>

        <p className="spark-footer-copy">© {new Date().getFullYear()} PartyHBG</p>
      </div>
    </footer>
  );
}
