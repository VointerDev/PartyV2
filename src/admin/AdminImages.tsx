import { type FormEvent, useState } from "react";
import { loadCms, saveCms, slugify, type CmsAsset } from "./cmsStore";

const emptyForm = {
  key: "",
  url: "",
  label: "",
};

export function AdminImages() {
  const [items, setItems] = useState(() => loadCms().assets);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function persist(next: CmsAsset[]) {
    const cms = loadCms();
    cms.assets = next;
    saveCms(cms);
    setItems(next);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function onEdit(item: CmsAsset) {
    setEditingId(item.id);
    setForm({ key: item.key, url: item.url, label: item.label });
    setMessage(null);
  }

  function onDelete(id: string) {
    if (!confirm("Ta bort denna bild?")) return;
    persist(items.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
    setMessage("Bild borttagen.");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const key = form.key.trim() || slugify(form.label || "bild");
    const payload: CmsAsset = {
      id: editingId ?? key,
      key,
      url: form.url.trim(),
      label: form.label.trim() || key,
    };

    if (editingId) {
      persist(items.map((item) => (item.id === editingId ? payload : item)));
      setMessage("Bild uppdaterad.");
    } else {
      persist([payload, ...items]);
      setMessage("Bild tillagd.");
    }

    resetForm();
  }

  return (
    <section className="admin-page">
      <p className="section-label">↳ Bilder</p>
      <h1 className="admin-page-title">Bilder</h1>
      <p className="admin-page-lead text-muted">
        Lägg till bild-URL:er som kan användas på sidan. Filuppladdning kommer med Supabase Storage.
      </p>

      <form className="admin-panel admin-form-grid" onSubmit={onSubmit}>
        <label className="admin-field">
          <span>Nyckel</span>
          <input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="hero" />
        </label>
        <label className="admin-field">
          <span>Etikett</span>
          <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        </label>
        <label className="admin-field admin-field--full">
          <span>Bild-URL</span>
          <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required />
        </label>

        <div className="admin-form-actions admin-field--full">
          <button type="submit" className="admin-button admin-button--primary">
            {editingId ? "Spara ändringar" : "Lägg till bild"}
          </button>
          {editingId ? (
            <button type="button" className="admin-button admin-button--ghost" onClick={resetForm}>
              Avbryt
            </button>
          ) : null}
        </div>
      </form>

      {message ? <p className="admin-message">{message}</p> : null}

      <div className="admin-image-grid">
        {items.map((item) => (
          <article key={item.id} className="admin-image-card">
            <img src={item.url} alt="" />
            <div className="admin-image-card-meta">
              <p>{item.label}</p>
              <p className="text-muted">{item.key}</p>
              <div className="admin-table-actions">
                <button type="button" className="admin-link-button" onClick={() => onEdit(item)}>
                  Redigera
                </button>
                <button type="button" className="admin-link-button admin-link-button--danger" onClick={() => onDelete(item.id)}>
                  Ta bort
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
