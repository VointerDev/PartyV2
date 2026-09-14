import { type FormEvent, useState } from "react";
import {
  loadCms,
  saveCms,
  slugify,
  type CmsEvent,
} from "./cmsStore";

const emptyForm = {
  title: "",
  slug: "",
  venue: "",
  address: "Helsingborg",
  date: "",
  time: "23.00  04.00",
  age: "18+",
  price: "100 kr",
  dj: "",
  blurb: "",
  description: "",
  image: "",
};

export function AdminEvents() {
  const [cms, setCms] = useState(() => loadCms());
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const events = [...cms.events].sort((a, b) => a.date.localeCompare(b.date));

  function persist(next: typeof cms) {
    saveCms(next);
    setCms(next);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function onEdit(event: CmsEvent) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      slug: event.slug,
      venue: event.venue,
      address: event.address,
      date: event.date,
      time: event.time,
      age: event.age,
      price: event.price,
      dj: event.dj ?? "",
      blurb: event.blurb ?? "",
      description: event.description ?? "",
      image: event.image,
    });
    setMessage(null);
  }

  function onDelete(id: string) {
    if (!confirm("Ta bort detta evenemang?")) return;
    const event = cms.events.find((item) => item.id === id);
    persist({
      ...cms,
      events: cms.events.filter((item) => item.id !== id),
      featuredSlugs: cms.featuredSlugs.filter((slug) => slug !== event?.slug),
    });
    if (editingId === id) resetForm();
    setMessage("Evenemang borttaget.");
  }

  function toggleFeatured(slug: string) {
    const isFeatured = cms.featuredSlugs.includes(slug);
    persist({
      ...cms,
      featuredSlugs: isFeatured
        ? cms.featuredSlugs.filter((item) => item !== slug)
        : [...cms.featuredSlugs, slug],
    });
  }

  function moveFeatured(slug: string, direction: -1 | 1) {
    const index = cms.featuredSlugs.indexOf(slug);
    if (index < 0) return;
    const next = [...cms.featuredSlugs];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    persist({ ...cms, featuredSlugs: next });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.image.trim()) {
      setMessage("Bild-URL krävs.");
      return;
    }

    const slug = form.slug.trim() || slugify(form.title);
    const payload: CmsEvent = {
      id: editingId ?? slug,
      slug,
      title: form.title.trim(),
      venue: form.venue.trim(),
      address: form.address.trim(),
      date: form.date,
      time: form.time.trim(),
      age: form.age.trim(),
      price: form.price.trim(),
      image: form.image.trim(),
      dj: form.dj.trim() || undefined,
      blurb: form.blurb.trim() || undefined,
      description: form.description.trim() || undefined,
    };

    const nextEvents = editingId
      ? cms.events.map((item) => (item.id === editingId ? payload : item))
      : [payload, ...cms.events];

    const nextFeatured = editingId
      ? cms.featuredSlugs.map((item) => (item === cms.events.find((e) => e.id === editingId)?.slug ? slug : item))
      : cms.featuredSlugs;

    persist({
      ...cms,
      events: nextEvents,
      featuredSlugs: nextFeatured,
    });

    setMessage(editingId ? "Evenemang uppdaterat." : "Evenemang skapat.");
    resetForm();
  }

  return (
    <section className="admin-page">
      <p className="section-label">↳ Evenemang</p>
      <h1 className="admin-page-title">Evenemang & widgets</h1>
      <p className="admin-page-lead text-muted">
        Skapa grundläggande event som syns i listor, och markera vilka som ska vara stora widgets på
        startsidan.
      </p>

      <form className="admin-panel admin-form-grid" onSubmit={onSubmit}>
        <label className="admin-field">
          <span>Titel</span>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </label>
        <label className="admin-field">
          <span>Slug</span>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="auto från titel"
          />
        </label>
        <label className="admin-field">
          <span>Plats</span>
          <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required />
        </label>
        <label className="admin-field">
          <span>Adress</span>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        </label>
        <label className="admin-field">
          <span>Datum</span>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        </label>
        <label className="admin-field">
          <span>Tid</span>
          <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
        </label>
        <label className="admin-field">
          <span>Ålder</span>
          <input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
        </label>
        <label className="admin-field">
          <span>Pris</span>
          <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        </label>
        <label className="admin-field admin-field--full">
          <span>Lineup / DJ</span>
          <input value={form.dj} onChange={(e) => setForm({ ...form, dj: e.target.value })} />
        </label>
        <label className="admin-field admin-field--full">
          <span>Kort text (blurb)</span>
          <input value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} />
        </label>
        <label className="admin-field admin-field--full">
          <span>Beskrivning</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <label className="admin-field admin-field--full">
          <span>Bild (URL)</span>
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
        </label>

        <div className="admin-form-actions admin-field--full">
          <button type="submit" className="admin-button admin-button--primary">
            {editingId ? "Spara ändringar" : "Skapa evenemang"}
          </button>
          {editingId ? (
            <button type="button" className="admin-button admin-button--ghost" onClick={resetForm}>
              Avbryt
            </button>
          ) : null}
        </div>
      </form>

      {message ? <p className="admin-message">{message}</p> : null}

      <div className="admin-subpanel">
        <h2 className="admin-subpanel-title">Stora widgets (startsida)</h2>
        <p className="text-muted admin-subpanel-lead">
          Markerade event visas som stora kort i karusellen. Ordningen styr hur de visas.
        </p>
        <ul className="admin-featured-list">
          {cms.featuredSlugs.map((slug) => {
            const event = cms.events.find((item) => item.slug === slug);
            if (!event) return null;
            return (
              <li key={slug} className="admin-featured-item">
                <span>{event.title}</span>
                <div className="admin-featured-actions">
                  <button type="button" className="admin-link-button" onClick={() => moveFeatured(slug, -1)}>
                    ↑
                  </button>
                  <button type="button" className="admin-link-button" onClick={() => moveFeatured(slug, 1)}>
                    ↓
                  </button>
                  <button type="button" className="admin-link-button admin-link-button--danger" onClick={() => toggleFeatured(slug)}>
                    Ta bort
                  </button>
                </div>
              </li>
            );
          })}
          {!cms.featuredSlugs.length ? <li className="text-muted">Inga widgets valda ännu.</li> : null}
        </ul>
      </div>

      <div className="admin-subpanel">
        <label className="admin-field admin-field--inline">
          <span>Antal på startsidan (kommande)</span>
          <input
            type="number"
            min={1}
            max={20}
            value={cms.homeUpcomingLimit}
            onChange={(e) =>
              persist({ ...cms, homeUpcomingLimit: Math.max(1, Number(e.target.value) || 8) })
            }
          />
        </label>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titel</th>
              <th>Plats</th>
              <th>Datum</th>
              <th>Widget</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {events.map((event) => {
              const featured = cms.featuredSlugs.includes(event.slug);
              return (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.venue}</td>
                  <td>{event.date}</td>
                  <td>
                    <button
                      type="button"
                      className={featured ? "admin-pill admin-pill--active" : "admin-pill"}
                      onClick={() => toggleFeatured(event.slug)}
                    >
                      {featured ? "Utvald" : "Lägg till"}
                    </button>
                  </td>
                  <td className="admin-table-actions">
                    <a href={`/events/${event.slug}`} target="_blank" rel="noreferrer" className="admin-link-button">
                      Visa
                    </a>
                    <button type="button" className="admin-link-button" onClick={() => onEdit(event)}>
                      Redigera
                    </button>
                    <button
                      type="button"
                      className="admin-link-button admin-link-button--danger"
                      onClick={() => onDelete(event.id)}
                    >
                      Ta bort
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
