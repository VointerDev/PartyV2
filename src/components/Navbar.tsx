import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Hem", end: true },
  { to: "/flashback", label: "Flashback", match: "/flashback" },
  { to: "/about", label: "Om oss" },
];

function isLinkActive(pathname: string, to: string, end?: boolean, match?: string) {
  if (end) return pathname === "/";
  if (match) return pathname === match || pathname.startsWith(`${match}/`);
  return pathname === to;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" end className="navbar-brand" onClick={() => setOpen(false)}>
          <Logo className="navbar-logo" />
        </NavLink>

        <nav className="navbar-links" aria-label="Huvudmeny">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              className={() =>
                isLinkActive(pathname, l.to, l.end, l.match) ? "navbar-link is-active" : "navbar-link"
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <NavLink to="/events" className="navbar-cta">
            Biljetter
          </NavLink>
          <button
            type="button"
            className="navbar-toggle"
            aria-expanded={open}
            aria-label={open ? "Stäng meny" : "Öppna meny"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`navbar-mobile ${open ? "is-open" : ""}`}>
        <nav className="navbar-mobile-nav" aria-label="Mobilmeny">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              className={() =>
                isLinkActive(pathname, l.to, l.end, l.match)
                  ? "navbar-mobile-link is-active"
                  : "navbar-mobile-link"
              }
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/events" className="navbar-mobile-cta" onClick={() => setOpen(false)}>
            Biljetter
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
