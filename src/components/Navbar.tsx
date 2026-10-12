import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { usePublishedEvents } from "../lib/usePublishedEvents";

export function Navbar() {
  const { pathname } = useLocation();
  const { navPages } = usePublishedEvents();
  const overlay = pathname === "/";

  return (
    <header className={`spark-nav ${overlay ? "spark-nav--overlay" : "spark-nav--solid"}`}>
      <div className="spark-nav-inner">
        <Link to="/" className="spark-nav-logo" aria-label="PartyHBG hem">
          <Logo className="spark-nav-logo-img" />
        </Link>

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
          <Link to="/kontakt" className="spark-btn">
            Kontakta oss
          </Link>
        </nav>
      </div>
    </header>
  );
}
