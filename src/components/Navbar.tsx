import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { usePublishedEvents } from "../lib/usePublishedEvents";

export function Navbar() {
  const { pathname } = useLocation();
  const { navPages } = usePublishedEvents();
  const isHome = pathname === "/";

  // Home hero already carries the brand + contact CTAs.
  if (isHome && navPages.length === 0) return null;

  return (
    <header className={`spark-nav ${isHome ? "spark-nav--overlay" : "spark-nav--solid"}`}>
      <div className="spark-nav-inner">
        {!isHome ? (
          <Link to="/" className="spark-nav-logo" aria-label="PartyHBG hem">
            <Logo className="spark-nav-logo-img" />
          </Link>
        ) : (
          <span />
        )}

        <nav className="spark-nav-right" aria-label="Huvudmeny">
          {navPages.map((page) => (
            <Link
              key={page.id}
              to={`/${page.slug}`}
              className={`spark-nav-link${pathname === `/${page.slug}` ? " is-active" : ""}`}
            >
              {page.navLabel}
            </Link>
          ))}
          {!isHome ? (
            <Link to="/kontakt" className="spark-btn">
              Kontakta oss
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
