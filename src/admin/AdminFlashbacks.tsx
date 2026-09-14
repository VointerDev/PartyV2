import { type FormEvent, useMemo, useState } from "react";
import { loadCms, saveCms, slugify, type CmsFlashback } from "./cmsStore";

type Mode = "single" | "bulk";

const emptyForm = {
  title: "",
  venue: "",
  date: "",
  eventSlug: "",
  cover: "",
  photos: "",
};

function parseUrls(text: string) {
  return text
    .split(/\n|,|\s+/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("http"));
}

export function AdminFlashbacks() {
  const [items, setItems] = useState(() => loadCms().flashbacks);
  const [mode, setMode] = useState<Mode>("single");
  const [form, setForm] = useState(emptyForm);
  const [bulkMeta, setBulkMeta] = useState({ title: "", venue: "", date: "", eventSlug: "" });
  const [bulkUrls, setBulkUrls] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const bulkPhotoList = useMemo(() => parseUrls(bulkUrls), [bulkUrls]);

  function persist(next: CmsFlashback[]) {
    const cms = loadCms();
    cms.flashbacks = next;
    saveCms(cms);
    setItems(next);
  }

  function resetForm() {
    setForm(emptyForm);
    setBulkMeta({ title: "", venue: "", date: "", eventSlug: "" });
    setBulkUrls("");
    setEditingId(null);
    setMode("single");
  }

  function onEdit(item: CmsFlashback) {
    setEditingId(item.id);
    setMode("single");
    setForm({
      title: item.title,
      venue: item.venue,
      date: item.date,
      eventSlug: item.eventSlug,
      cover: item.cover,
      photos: item.photos.join("\n"),
    });
    setMessage(null);
  }

  function onDelete(id: string) {
    if (!confirm("Ta bort denna flashback?")) return;
    persist(items.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
    setMessage("Flashback borttagen.");
  }

  function buildFlashback(
    meta: { title: string; venue: string; date: string; eventSlug: string; cover: string },
    photos: string[],
    id?: string,
  ): CmsFlashback {
    const slug = id ?? slugify(`${meta.title}-${meta.date}`);
    const uniquePhotos = [...new Set(photos)];
    return {
      id: slug,
      slug,
      eventSlug: meta.eventSlug.trim() || slugify(meta.title),
      title: meta.title.trim(),
      venue: meta.venue.trim(),
      date: meta.date,
      cover: meta.cover.trim(),
      photos: uniquePhotos,
      count: uniquePhotos.length,
    };
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const photos = parseUrls(form.photos);

    if (!form.cover.trim()) {
      setMessage("Omslagsbild krävs.");
      return;
    }

    const payload = buildFlashback(form, photos.length ? photos : [form.cover.trim()], editingId ?? undefined);

    if (editingId) {
      persist(items.map((item) => (item.id === editingId ? payload : item)));
      setMessage(`Flashback uppdaterad med ${payload.count} bilder.`);
    } else {
      persist([payload, ...items]);
      setMessage(`Flashback skapad med ${payload.count} bilder.`);
    }

    resetForm();
  }

  function onBulkImport(e: FormEvent) {
    e.preventDefault();

    if (!bulkMeta.title.trim() || !bulkMeta.venue.trim() || !bulkMeta.date) {
      setMessage("Fyll i titel, plats och datum för massimporten.");
      return;
    }

    if (bulkPhotoList.length === 0) {
      setMessage("Klistra in minst en bild-URL.");
      return;
    }

    const payload = buildFlashback(
      { ...bulkMeta, cover: bulkPhotoList[0] },
      bulkPhotoList,
    );

    persist([payload, ...items]);
    setMessage(`Massimport klar — ${payload.count} bilder i "${payload.title}".`);
    resetForm();
  }

  function appendBulkToEditing() {
    if (!editingId) return;
    const extra = parseUrls(bulkUrls);
    if (!extra.length) {
      setMessage("Inga URL:er att lägga till.");
      return;
    }

    persist(
      items.map((item) => {
        if (item.id !== editingId) return item;
        const photos = [...new Set([...item.photos, ...extra])];
        return { ...item, photos, count: photos.length, cover: item.cover || photos[0] };
      }),
    );
    setBulkUrls("");
    setMessage(`${extra.length} bilder tillagda i galleriet.`);
  }

  return (
    <section className="admin-page">
      <p className="section-label">↳ Flashbacks</p>
      <h1 className="admin-page-title">Flashbacks</h1>
      <p className="admin-page-lead text-muted">
        Ladda upp bilder från tidigare kvällar. En flashback = ett galleri med omslag + foton.
      </p>

      <div className="admin-help">
        <p><strong>1.</strong> Fyll i titel, plats och datum</p>
        <p><strong>2.</strong> Klistra in bild-URL:er (en per rad) — eller använd massimport</p>
        <p><strong>3.</strong> Första bilden blir omslag om du inte anger en separat</p>
      </div>

      <div className="admin-mode-tabs">
        <button
          type="button"
          className={mode === "single" ? "admin-mode-tab is-active" : "admin-mode-tab"}
          onClick={() => setMode("single")}
        >
          Skapa / redigera
        </button>
        <button
          type="button"
          className={mode === "bulk" ? "admin-mode-tab is-active" : "admin-mode-tab"}
          onClick={() => setMode("bulk")}
        >
          Massimport
        </button>
      </div>

      {mode === "single" ? (
        <form className="admin-panel admin-form-grid" onSubmit={onSubmit}>
          <label className="admin-field">
            <span>Titel</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="t.ex. Studentnatt"
              required
            />
          </label>
          <label className="admin-field">
            <span>Plats</span>
            <input
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              placeholder="t.ex. NOISE"
              required
            />
          </label>
          <label className="admin-field">
            <span>Datum</span>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </label>
          <label className="admin-field">
            <span>Kopplad event-slug</span>
            <input
              value={form.eventSlug}
              onChange={(e) => setForm({ ...form, eventSlug: e.target.value })}
              placeholder="valfritt — t.ex. studentnatt"
            />
          </label>
          <label className="admin-field admin-field--full">
            <span>Omslagsbild (URL)</span>
            <input
              value={form.cover}
              onChange={(e) => setForm({ ...form, cover: e.target.value })}
              placeholder="https://..."
              required
            />
          </label>
          <label className="admin-field admin-field--full">
            <span>Galleri-bilder</span>
            <textarea
              rows={8}
              value={form.photos}
              onChange={(e) => setForm({ ...form, photos: e.target.value })}
              placeholder={"Klistra in en URL per rad:\nhttps://...\nhttps://..."}
            />
            <span className="admin-field-hint">{parseUrls(form.photos).length} bilder i listan</span>
          </label>

          <div className="admin-form-actions admin-field--full">
            <button type="submit" className="admin-button admin-button--primary">
              {editingId ? "Spara ändringar" : "Skapa flashback"}
            </button>
            {editingId ? (
              <button type="button" className="admin-button admin-button--ghost" onClick={resetForm}>
                Avbryt
              </button>
            ) : null}
          </div>
        </form>
      ) : (
        <form className="admin-panel admin-form-grid" onSubmit={onBulkImport}>
          <p className="admin-field admin-field--full admin-bulk-intro text-muted">
            Massimport skapar ett nytt galleri från många URL:er på en gång. Klistra in alla
            bildlänkar — en per rad, eller separerade med mellanslag/komma.
          </p>
          <label className="admin-field">
            <span>Titel</span>
            <input
              value={bulkMeta.title}
              onChange={(e) => setBulkMeta({ ...bulkMeta, title: e.target.value })}
              placeholder="t.ex. Lönelördag 22 aug"
              required
            />
          </label>
          <label className="admin-field">
            <span>Plats</span>
            <input
              value={bulkMeta.venue}
              onChange={(e) => setBulkMeta({ ...bulkMeta, venue: e.target.value })}
              placeholder="t.ex. NOISE"
              required
            />
          </label>
          <label className="admin-field">
            <span>Datum</span>
            <input
              type="date"
              value={bulkMeta.date}
              onChange={(e) => setBulkMeta({ ...bulkMeta, date: e.target.value })}
              required
            />
          </label>
          <label className="admin-field">
            <span>Event-slug</span>
            <input
              value={bulkMeta.eventSlug}
              onChange={(e) => setBulkMeta({ ...bulkMeta, eventSlug: e.target.value })}
              placeholder="valfritt"
            />
          </label>
          <label className="admin-field admin-field--full">
            <span>Bild-URL:er (massimport)</span>
            <textarea
              rows={12}
              value={bulkUrls}
              onChange={(e) => setBulkUrls(e.target.value)}
              placeholder={"Klistra in 10, 50 eller 100+ URL:er här...\nhttps://...\nhttps://..."}
            />
            <span className="admin-field-hint admin-field-hint--pink">
              {bulkPhotoList.length} bilder redo att importeras
            </span>
          </label>

          <div className="admin-form-actions admin-field--full">
            <button type="submit" className="admin-button admin-button--primary" disabled={bulkPhotoList.length === 0}>
              Importera {bulkPhotoList.length || ""} bilder
            </button>
            {editingId ? (
              <button type="button" className="admin-button admin-button--ghost" onClick={appendBulkToEditing}>
                Lägg till i redigerad flashback
              </button>
            ) : null}
          </div>
        </form>
      )}

      {message ? <p className="admin-message">{message}</p> : null}

      <div className="admin-subpanel">
        <h2 className="admin-subpanel-title">Alla flashbacks ({items.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titel</th>
                <th>Plats</th>
                <th>Datum</th>
                <th>Bilder</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.venue}</td>
                  <td>{item.date}</td>
                  <td>{item.photos.length}</td>
                  <td className="admin-table-actions">
                    <a href={`/flashback/${item.slug}`} target="_blank" rel="noreferrer" className="admin-link-button">
                      Visa
                    </a>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
