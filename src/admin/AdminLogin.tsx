import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "./AuthProvider";

export function AdminLogin() {
  const { isAuthenticated, loading, login, mode } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/admin/edit", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const message = await login(username.trim(), password);
    setSubmitting(false);
    if (message) {
      setError(message);
      return;
    }
    navigate("/admin/edit");
  }

  return (
    <div className="admin-shell admin-center admin-login">
      <div className="admin-login-card">
        <Link to="/" className="admin-login-logo">
          <Logo className="admin-login-logo-img" />
        </Link>

        <p className="section-label">↳ Admin</p>
        <h1 className="admin-login-title">Logga in</h1>
        <p className="admin-login-lead text-muted">
          Hantera flashbacks, bilder och innehåll för PartyHBG.
        </p>

        <form className="admin-form" onSubmit={onSubmit}>
          <label className="admin-field">
            <span>Användare</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label className="admin-field">
            <span>Lösenord</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error ? <p className="admin-error">{error}</p> : null}

          <button type="submit" className="admin-button admin-button--primary" disabled={submitting}>
            {submitting ? "Loggar in…" : "Logga in"}
          </button>
        </form>

        <p className="admin-login-foot text-muted">
          {mode === "none" ? "Anslut Supabase för produktion." : null}
          <Link to="/" className="admin-back-link">
            ← Tillbaka till sidan
          </Link>
        </p>
      </div>
    </div>
  );
}
