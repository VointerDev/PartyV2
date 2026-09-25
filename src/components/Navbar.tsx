import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";

export function Navbar() {
  const { pathname } = useLocation();
  const overlay = pathname === "/";

  return (
    <header className={`spark-nav ${overlay ? "spark-nav--overlay" : "spark-nav--solid"}`}>
      <div className="spark-nav-inner">
        <Link to="/" className="spark-nav-logo" aria-label="PartyHBG hem">
          <Logo className="spark-nav-logo-img" />
        </Link>

        <nav className="spark-nav-right" aria-label="Huvudmeny">
          <Link to="/flashback" className="spark-nav-link">
            Flashback
          </Link>
          <a href="mailto:hello@partyhbg.se" className="spark-nav-link">
            Kontakta oss
          </a>
        </nav>
      </div>
    </header>
  );
}
