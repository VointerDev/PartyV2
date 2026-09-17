import { type FormEvent, useState } from "react";
import { loadCms, saveCms, slugify, type CmsNews } from "./cmsStore";

const emptyForm = {
  title: "",
  tag: "Helsingborg",
  date: "",
  excerpt: "",
  image: "",
};

export function AdminNews() {
  const [items, setItems] = useState(() => loadCms().news);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function persist(next: CmsNews[]) {
    const cms = loadCms();
    cms.news = next;
    saveCms(cms);
    setItems(next);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function onEdit(item: CmsNews) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      tag: item.tag,
      date: item.date,
      excerpt: item.excerpt,
      image: item.image,
    });
    setMessage(null);
  }

  function onDelete(id: string) {
    if (!confirm("Ta bort denna nyhet?")) return;
    persist(items.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
    setMessage("Nyhet borttagen.");
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.date || !form.excerpt.trim()) {
      setMessage("Titel, datum och text krävs.");
      return;
    }

    const slug = editingId ?? slugify(`${form.title}-${form.date}`);
    const payload: CmsNews = {
      id: slug,
      slug,
      title: form.title.trim(),
      tag: form.tag.trim() || "Nyhet",
      date: form.date,
      excerpt: form.excerpt.trim(),
      image: form.image.trim() || "/photos/party.jpg",
    };

    if (editingId) {
      persist(items.map((item) => (item.id === editingId ? payload : item)));
      setMessage("Nyhet sparad — sidan uppdateras direkt.");
    } else {
      persist([payload, ...items]);
      setMessage("Nyhet skapad — sidan uppdateras direkt.");
    }

    resetForm();
  }

  return (
    <section className="admin-page">
      <p className="section-label">↳ Nyheter</p>
      <h1 className="admin-page-title">Nyheter</h1>
      <p className="admin-page-lead text-muted">
        Skapa och redigera nyheter för startsidan. Spara = uppdaterar sajten direkt.
      </p>

      {message ? <p className="admin-message">{message}</p> : null}

      <form className="admin-panel admin-form-grid" onSubmit={onSubmit}>
        <label className="admin-field">
          <span>Titel</span>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>
        <label className="admin-field">
          <span>Tagg</span>
          <input
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
            placeholder="Helsingborg"
          />
        </label>
        <label className="admin-field">
          <span>Datum</span>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </label>
        <label className="admin-field admin-field--full">
          <span>Bild-URL</span>
          <input
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="/photos/party.jpg eller https://..."
          />
        </label>
        <label className="admin-field admin-field--full">
          <span>Text</span>
          <textarea
            rows={4}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            required
          />
        </label>
        <div className="admin-form-actions admin-field--full">
          <button type="submit" className="admin-button admin-button--primary">
            {editingId ? "Spara nyhet" : "Skapa nyhet"}
          </button>
          {editingId ? (
            <button type="button" className="admin-button admin-button--ghost" onClick={resetForm}>
              Avbryt
            </button>
          ) : null}
        </div>
      </form>

      <ul className="admin-list">
        {items.map((item) => (
          <li key={item.id} className="admin-list-item">
            <div>
              <p className="admin-list-title">{item.title}</p>
              <p className="text-muted">
                {item.tag} · {item.date}
              </p>
            </div>
            <div className="admin-list-actions">
              <button type="button" className="admin-link-button" onClick={() => onEdit(item)}>
                Redigera
              </button>
              <button
                type="button"
                className="admin-link-button admin-link-button--danger"
                onClick={() => onDelete(item.id)}
              >
                Ta bort
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
