import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";

const navLinks = [
  { to: "/", label: "Hem", end: true },
  { to: "/flashback", label: "Flashback" },
  { to: "/about", label: "Om oss" },
];

const legalLinks = [
  { to: "/about#privacy", label: "Integritet" },
  { to: "/about#terms", label: "Villkor" },
  { to: "/about#cookies", label: "Cookies" },
  { to: "/about#photos", label: "Bilder" },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo className="footer-logo-img" />
            <p className="footer-tagline">
              Nattliv och fest i Helsingborg. Gästlista, studentkvällar och flashbacks.
            </p>
          </div>

          <div className="footer-col">
            <p className="footer-heading">Navigera</p>
            <ul className="footer-links">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <NavLink to={l.to} end={l.end}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <p className="footer-heading">Juridiskt</p>
            <ul className="footer-links">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <NavLink to={l.to}>{l.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <p className="footer-heading">Kontakt</p>
            <ul className="footer-links">
              <li>
                <a href="https://instagram.com/partyhbg" target="_blank" rel="noreferrer">
                  @partyhbg
                </a>
              </li>
              <li>
                <a href="https://instagram.com/cercinoofficial" target="_blank" rel="noreferrer">
                  @cercinoofficial
                </a>
              </li>
              <li>
                <a href="https://cercino.se" target="_blank" rel="noreferrer">
                  Cercino.se
                </a>
              </li>
              <li>
                <a href="mailto:hello@partyhbg.se">hello@partyhbg.se</a>
              </li>
              <li className="footer-plain">Sverige</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PartyHBG</p>
          <div className="footer-bottom-links">
            <a href="https://instagram.com/partyhbg" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <NavLink to="/events">Biljetter</NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
