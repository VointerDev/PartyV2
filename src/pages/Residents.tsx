import { Link } from "react-router-dom";
import { residents } from "../data";

export function Residents() {
  return (
    <section className="page pb-16">
      <p className="section-label">↳ Residents</p>
      <div className="featured-track">
        {residents.map((person) => (
          <div key={person.name} className="featured-card">
            <img src={person.image} alt="" />
            <p>
              {person.name}
              <br />
              {person.rooms}
            </p>
          </div>
        ))}
      </div>
      <Link to="/vimmelbilder" className="mt-8 inline-block text-muted hover:text-white">
        Vimmel →
      </Link>
    </section>
  );
}
