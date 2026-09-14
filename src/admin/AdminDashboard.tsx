import { Link } from "react-router-dom";
import { loadCms } from "./cmsStore";

export function AdminDashboard() {
  const cms = loadCms();

  return (
    <section className="admin-page">
      <p className="section-label">↳ Översikt</p>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-lead text-muted">
        Välkommen till PartyHBG admin. Skapa evenemang, widgets och flashbacks — se resultatet i
        förhandsvisningen till höger.
      </p>

      <div className="admin-stats">
        <div className="admin-stat">
          <p className="admin-stat-value">{cms.events.length}</p>
          <p className="admin-stat-label">Evenemang</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-value">{cms.featuredSlugs.length}</p>
          <p className="admin-stat-label">Widgets</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-value">{cms.flashbacks.length}</p>
          <p className="admin-stat-label">Flashbacks</p>
        </div>
        <div className="admin-stat">
          <p className="admin-stat-value">{cms.assets.length}</p>
          <p className="admin-stat-label">Bilder</p>
        </div>
      </div>

      <div className="admin-quick">
        <Link to="/admin/events" className="admin-quick-card">
          <p className="admin-quick-title">Evenemang</p>
          <p className="text-muted">Skapa event och välj vilka som blir stora widgets på startsidan.</p>
        </Link>
        <Link to="/admin/flashbacks" className="admin-quick-card">
          <p className="admin-quick-title">Flashbacks</p>
          <p className="text-muted">Lägg till gallerier och uppdatera foton efter event.</p>
        </Link>
        <Link to="/admin/images" className="admin-quick-card">
          <p className="admin-quick-title">Bilder</p>
          <p className="text-muted">Hantera bild-URL:er som används på sidan.</p>
        </Link>
      </div>
    </section>
  );
}
