import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { AdminSitePreview } from "./AdminSitePreview";
import { useAuth } from "./AuthProvider";

const links = [
  { to: "/admin/dashboard", label: "Översikt", end: true },
  { to: "/admin/events", label: "Biljetter" },
  { to: "/admin/flashbacks", label: "Flashbacks" },
  { to: "/admin/news", label: "Nyheter" },
  { to: "/admin/images", label: "Bilder" },
  { to: "/admin/settings", label: "Webbplats" },
];

export function AdminLayout() {
  const { email, logout, mode } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin", { replace: true });
  }

  return (
    <div className="admin-shell admin-app admin-app--with-preview">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Logo className="admin-sidebar-logo" />
        </div>
        <p className="admin-sidebar-label">Admin</p>

        <nav className="admin-nav">
          <NavLink to="/admin/edit" className="admin-nav-link admin-nav-link--accent">
            Redigera live
          </NavLink>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "admin-nav-link is-active" : "admin-nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <p className="admin-user text-muted">{email}</p>
          <p className="admin-mode text-muted">{mode === "supabase" ? "Supabase" : "Lokal session"}</p>
          <button type="button" className="admin-button admin-button--ghost" onClick={handleLogout}>
            Logga ut
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>

      <aside className="admin-preview-panel">
        <AdminSitePreview />
      </aside>
    </div>
  );
}
