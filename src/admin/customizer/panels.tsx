import { useEffect, useState } from "react";
import { isPastEvent } from "../../data";
import {
  slugify,
  type CmsEvent,
  type CmsFlashback,
  type CmsNews,
  type CmsState,
} from "../cmsStore";
import { ImageField, TextAreaField, TextField, ColorField, SelectField, RangeField, Toggle } from "./fields";

export type PanelProps = {
  draft: CmsState;
  update: (fn: (state: CmsState) => CmsState) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  goTo: (path: string) => void;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function uniqueSlug(base: string, taken: string[], currentId: string) {
  const root = slugify(base) || "utan-namn";
  let slug = root;
  let n = 2;
  while (taken.includes(slug) && slug !== currentId) slug = `${root}-${n++}`;
  return slug;
}

function ListRow({
  image,
  title,
  meta,
  badge,
  onClick,
}: {
  image?: string;
  title: string;
  meta: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="cz-list-row" onClick={onClick}>
      {image !== undefined ? (
        <span className="cz-list-thumb">{image ? <img src={image} alt="" /> : null}</span>
      ) : null}
      <span className="cz-list-text">
        <span className="cz-list-title">{title}</span>
        <span className="cz-list-meta">{meta}</span>
      </span>
      {badge ? <span className="cz-badge">{badge}</span> : null}
      <span className="cz-list-chevron" aria-hidden="true">
        ›
      </span>
    </button>
  );
}

/* ---------------------------------------------------------------- site --- */

export function SitePanel({ draft, update, goTo }: PanelProps) {
  const site = draft.site;
  const setSite = (patch: Partial<CmsState["site"]>) =>
    update((state) => ({ ...state, site: { ...state.site, ...patch } }));

  return (
    <div className="cz-form">
      <p className="cz-group-label">Toppbanner</p>
      <div data-cz-field="banner">
        <Toggle
          label="Visa banner högst upp"
          checked={site.bannerEnabled}
          onChange={(bannerEnabled) => setSite({ bannerEnabled })}
        />
      </div>
      <TextAreaField
        label="Text"
        field="bannerText"
        rows={2}
        value={site.bannerText}
        onChange={(bannerText) => setSite({ bannerText })}
        placeholder="Nästa fest — se biljetter"
      />
      <div className="cz-row-2">
        <TextField
          label="Länk"
          value={site.bannerLink}
          onChange={(bannerLink) => setSite({ bannerLink })}
          placeholder="/events"
          hint="Valfritt"
        />
        <TextField
          label="Länktext"
          value={site.bannerLinkLabel}
          onChange={(bannerLinkLabel) => setSite({ bannerLinkLabel })}
          placeholder="Öppna"
        />
      </div>
      <div className="cz-row-2">
        <ColorField
          label="Bakgrund"
          field="bannerBg"
          value={site.bannerBg}
          onChange={(bannerBg) => setSite({ bannerBg })}
        />
        <ColorField
          label="Textfärg"
          field="bannerColor"
          value={site.bannerColor}
          onChange={(bannerColor) => setSite({ bannerColor })}
        />
      </div>
      <div className="cz-row-2">
        <SelectField
          label="Justering"
          value={site.bannerAlign}
          onChange={(bannerAlign) =>
            setSite({ bannerAlign: bannerAlign as "left" | "center" })
          }
          options={[
            { value: "left", label: "Vänster" },
            { value: "center", label: "Centrerad" },
          ]}
        />
        <SelectField
          label="Storlek"
          value={site.bannerSize}
          onChange={(bannerSize) =>
            setSite({ bannerSize: bannerSize as "sm" | "md" | "lg" })
          }
          options={[
            { value: "sm", label: "Liten" },
            { value: "md", label: "Normal" },
            { value: "lg", label: "Stor" },
          ]}
        />
      </div>
      <Toggle
        label="Kan stängas av besökaren"
        checked={site.bannerDismissible}
        onChange={(bannerDismissible) => setSite({ bannerDismissible })}
      />
      <Toggle
        label="Följ med när man scrollar"
        checked={site.bannerSticky}
        onChange={(bannerSticky) => setSite({ bannerSticky })}
      />

      <p className="cz-group-label">Hero</p>
      <TextField
        label="Rubrik"
        field="heroTitle"
        value={site.heroTitle}
        onChange={(heroTitle) => setSite({ heroTitle })}
      />
      <RangeField
        label="Rubrikstorlek"
        field="heroTitleSize"
        value={site.heroTitleSize}
        onChange={(heroTitleSize) => setSite({ heroTitleSize })}
        min={28}
        max={120}
        unit="px"
      />
      <RangeField
        label="Rubrik maxbredd"
        field="heroTitleMaxWidth"
        value={site.heroTitleMaxWidth}
        onChange={(heroTitleMaxWidth) => setSite({ heroTitleMaxWidth })}
        min={320}
        max={1600}
        step={10}
        unit="px"
        hint="Bara rubriktexten — sajten behåller full bredd."
      />
      <div className="cz-row-2">
        <SelectField
          label="Justering"
          value={site.heroAlign}
          onChange={(heroAlign) => setSite({ heroAlign: heroAlign as "left" | "center" })}
          options={[
            { value: "left", label: "Vänster" },
            { value: "center", label: "Centrerad" },
          ]}
        />
        <RangeField
          label="Hero-höjd"
          value={site.heroHeight}
          onChange={(heroHeight) => setSite({ heroHeight })}
          min={32}
          max={90}
          unit="vh"
        />
      </div>
      <TextField
        label="Video"
        field="heroVideo"
        value={site.heroVideo}
        onChange={(heroVideo) => setSite({ heroVideo })}
        placeholder="/videos/party.mp4"
        hint="Lämna tomt för att visa bilden istället."
      />
      <ImageField
        label="Bild / poster"
        field="heroPoster"
        value={site.heroPoster}
        onChange={(heroPoster) => setSite({ heroPoster })}
        hint="Visas medan videon laddar, och på mobil."
      />

      <p className="cz-group-label">Knappar i hero</p>
      <div className="cz-row-2">
        <TextField
          label="Knapp 1"
          field="heroPrimary"
          value={site.heroPrimaryLabel}
          onChange={(heroPrimaryLabel) => setSite({ heroPrimaryLabel })}
          placeholder="Se evenemang"
        />
        <TextField
          label="Länk"
          value={site.heroPrimaryLink}
          onChange={(heroPrimaryLink) => setSite({ heroPrimaryLink })}
          placeholder="/events"
        />
      </div>
      <div className="cz-row-2">
        <TextField
          label="Knapp 2"
          field="heroSecondary"
          value={site.heroSecondaryLabel}
          onChange={(heroSecondaryLabel) => setSite({ heroSecondaryLabel })}
          placeholder="Flashback"
        />
        <TextField
          label="Länk"
          value={site.heroSecondaryLink}
          onChange={(heroSecondaryLink) => setSite({ heroSecondaryLink })}
          placeholder="/flashback"
        />
      </div>
      <p className="cz-hint-block">
        Töm knappens text för att dölja den. Länken kan vara en sida på sajten (<code>/events</code>
        ) eller en extern adress (<code>https://…</code>) som öppnas i ny flik.
      </p>

      <p className="cz-group-label">Startsidans sektioner</p>
      <RangeField
        label="Innehållsbredd"
        field="contentMaxWidth"
        value={site.contentMaxWidth}
        onChange={(contentMaxWidth) => setSite({ contentMaxWidth })}
        min={720}
        max={1920}
        step={20}
        unit="px"
        hint="Maxbredd för biljetter och nyheter. 1600+ = nästan full sajtbredd."
      />
      <RangeField
        label="Sektionsrubriker"
        field="sectionTitleSize"
        value={site.sectionTitleSize}
        onChange={(sectionTitleSize) => setSite({ sectionTitleSize })}
        min={24}
        max={56}
        unit="px"
      />
      <TextField
        label="Rubrik över biljetter"
        field="upcoming"
        value={site.upcomingTitle}
        onChange={(upcomingTitle) => setSite({ upcomingTitle })}
      />
      <TextField
        label="Antal biljetter som visas"
        type="number"
        value={String(draft.homeUpcomingLimit)}
        onChange={(value) =>
          update((state) => ({
            ...state,
            homeUpcomingLimit: Math.max(1, Math.min(24, Number(value) || 1)),
          }))
        }
      />
      <TextField
        label="Rubrik över nyheter"
        field="news"
        value={site.newsTitle}
        onChange={(newsTitle) => setSite({ newsTitle })}
      />

      <button type="button" className="cz-text-button" onClick={() => goTo("/")}>
        Visa startsidan i förhandsvisningen
      </button>
    </div>
  );
}

/* -------------------------------------------------------------- events --- */

function EventEditor({ draft, update, editingId, setEditingId, goTo }: PanelProps) {
  const event = draft.events.find((item) => item.id === editingId);
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugDraft, setSlugDraft] = useState(event?.slug ?? "");

  // The slug is only committed on blur, so references elsewhere can be remapped in one go.
  useEffect(() => {
    if (event) setSlugDraft(event.slug);
  }, [event?.slug]);

  if (!event) return null;

  const featured = draft.featuredSlugs.includes(event.slug);

  function patch(changes: Partial<CmsEvent>) {
    update((state) => ({
      ...state,
      events: state.events.map((item) => (item.id === editingId ? { ...item, ...changes } : item)),
    }));
  }

  function renameSlug(nextSlug: string) {
    const slug = uniqueSlug(
      nextSlug,
      draft.events.filter((item) => item.id !== editingId).map((item) => item.slug),
      event!.slug,
    );
    update((state) => ({
      ...state,
      events: state.events.map((item) => (item.id === editingId ? { ...item, slug } : item)),
      featuredSlugs: state.featuredSlugs.map((item) => (item === event!.slug ? slug : item)),
      flashbacks: state.flashbacks.map((item) =>
        item.eventSlug === event!.slug ? { ...item, eventSlug: slug } : item,
      ),
    }));
    goTo(`/events/${slug}`);
  }

  function remove() {
    if (!confirm(`Ta bort "${event!.title}"?`)) return;
    update((state) => ({
      ...state,
      events: state.events.filter((item) => item.id !== editingId),
      featuredSlugs: state.featuredSlugs.filter((slug) => slug !== event!.slug),
    }));
    setEditingId(null);
    goTo("/events");
  }

  return (
    <div className="cz-form">
      <TextField
        label="Titel"
        value={event.title}
        onChange={(title) => patch({ title })}
        onBlur={() => {
          if (!slugTouched) renameSlug(event.title);
        }}
      />
      <ImageField label="Bild" value={event.image} onChange={(image) => patch({ image })} />

      <div className="cz-row-2">
        <TextField label="Plats" value={event.venue} onChange={(venue) => patch({ venue })} />
        <TextField label="Datum" type="date" value={event.date} onChange={(date) => patch({ date })} />
      </div>
      <TextField label="Adress" value={event.address} onChange={(address) => patch({ address })} />
      <div className="cz-row-2">
        <TextField label="Tid" value={event.time} onChange={(time) => patch({ time })} />
        <TextField label="Pris" value={event.price} onChange={(price) => patch({ price })} />
      </div>
      <div className="cz-row-2">
        <TextField label="Ålder" value={event.age} onChange={(age) => patch({ age })} />
        <TextField label="Lineup / DJ" value={event.dj ?? ""} onChange={(dj) => patch({ dj })} />
      </div>

      <TextField
        label="Kort text"
        value={event.blurb ?? ""}
        onChange={(blurb) => patch({ blurb })}
        hint="Visas i listor och delningar."
      />
      <TextAreaField
        label="Beskrivning"
        value={event.description ?? ""}
        onChange={(description) => patch({ description })}
      />

      <Toggle
        label="Utvald widget på startsidan"
        checked={featured}
        onChange={(checked) =>
          update((state) => ({
            ...state,
            featuredSlugs: checked
              ? [...state.featuredSlugs, event.slug]
              : state.featuredSlugs.filter((slug) => slug !== event.slug),
          }))
        }
      />

      <p className="cz-group-label">Avancerat</p>
      <TextField
        label="Länkadress (slug)"
        value={slugDraft}
        onChange={(value) => {
          setSlugTouched(true);
          setSlugDraft(value);
        }}
        onBlur={() => renameSlug(slugDraft)}
        hint={`/events/${event.slug}`}
      />

      <button type="button" className="cz-text-button cz-text-button--danger" onClick={remove}>
        Ta bort biljetten
      </button>
    </div>
  );
}

export function EventsPanel(props: PanelProps) {
  const { draft, update, editingId, setEditingId, goTo } = props;

  if (editingId) return <EventEditor key={editingId} {...props} />;

  const events = [...draft.events].sort((a, b) => a.date.localeCompare(b.date));

  function create() {
    const id = `ny-fest-${Date.now().toString(36)}`;
    const event: CmsEvent = {
      id,
      slug: id,
      title: "Ny fest",
      venue: "NOISE",
      address: "Helsingborg",
      date: today(),
      time: "23.00 – 04.00",
      age: "18+",
      price: "100 kr",
      image: "/photos/party.jpg",
    };
    update((state) => ({ ...state, events: [event, ...state.events] }));
    setEditingId(id);
    goTo(`/events/${id}`);
  }

  return (
    <div className="cz-form">
      <button type="button" className="cz-button cz-button--primary" onClick={create}>
        + Ny biljett
      </button>

      <div className="cz-list">
        {events.map((event) => (
          <ListRow
            key={event.id}
            image={event.image}
            title={event.title}
            meta={`${event.date} · ${event.venue}`}
            badge={
              draft.featuredSlugs.includes(event.slug)
                ? "Utvald"
                : isPastEvent(event.date)
                  ? "Varit"
                  : undefined
            }
            onClick={() => {
              setEditingId(event.id);
              goTo(`/events/${event.slug}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- news --- */

function NewsEditor({ draft, update, editingId, setEditingId, goTo }: PanelProps) {
  const item = draft.news.find((entry) => entry.id === editingId);
  if (!item) return null;

  function patch(changes: Partial<CmsNews>) {
    update((state) => ({
      ...state,
      news: state.news.map((entry) => (entry.id === editingId ? { ...entry, ...changes } : entry)),
    }));
  }

  function remove() {
    if (!confirm(`Ta bort "${item!.title}"?`)) return;
    update((state) => ({ ...state, news: state.news.filter((entry) => entry.id !== editingId) }));
    setEditingId(null);
    goTo("/");
  }

  return (
    <div className="cz-form">
      <TextField label="Rubrik" value={item.title} onChange={(title) => patch({ title })} />
      <ImageField label="Bild" value={item.image} onChange={(image) => patch({ image })} />
      <div className="cz-row-2">
        <TextField label="Tagg" value={item.tag} onChange={(tag) => patch({ tag })} />
        <TextField label="Datum" type="date" value={item.date} onChange={(date) => patch({ date })} />
      </div>
      <TextAreaField
        label="Text"
        rows={5}
        value={item.excerpt}
        onChange={(excerpt) => patch({ excerpt })}
      />

      <button type="button" className="cz-text-button cz-text-button--danger" onClick={remove}>
        Ta bort nyheten
      </button>
    </div>
  );
}

export function NewsPanel(props: PanelProps) {
  const { draft, update, editingId, setEditingId, goTo } = props;

  if (editingId) return <NewsEditor key={editingId} {...props} />;

  const news = [...draft.news].sort((a, b) => b.date.localeCompare(a.date));

  function create() {
    const id = `nyhet-${Date.now().toString(36)}`;
    const item: CmsNews = {
      id,
      slug: id,
      title: "Ny nyhet",
      tag: "Helsingborg",
      date: today(),
      excerpt: "Skriv något kort om vad som händer.",
      image: "/photos/party.jpg",
    };
    update((state) => ({ ...state, news: [item, ...state.news] }));
    setEditingId(id);
    goTo("/");
  }

  return (
    <div className="cz-form">
      <button type="button" className="cz-button cz-button--primary" onClick={create}>
        + Ny nyhet
      </button>

      <div className="cz-list">
        {news.map((item) => (
          <ListRow
            key={item.id}
            image={item.image}
            title={item.title}
            meta={`${item.tag} · ${item.date}`}
            onClick={() => {
              setEditingId(item.id);
              goTo("/");
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- flashbacks --- */

function FlashbackEditor({ draft, update, editingId, setEditingId, goTo }: PanelProps) {
  const item = draft.flashbacks.find((entry) => entry.id === editingId);
  if (!item) return null;

  function patch(changes: Partial<CmsFlashback>) {
    update((state) => ({
      ...state,
      flashbacks: state.flashbacks.map((entry) =>
        entry.id === editingId ? { ...entry, ...changes } : entry,
      ),
    }));
  }

  function setPhotos(text: string) {
    const photos = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    patch({ photos, count: photos.length, cover: item!.cover || photos[0] || "" });
  }

  function remove() {
    if (!confirm(`Ta bort "${item!.title}"?`)) return;
    update((state) => ({
      ...state,
      flashbacks: state.flashbacks.filter((entry) => entry.id !== editingId),
    }));
    setEditingId(null);
    goTo("/flashback");
  }

  return (
    <div className="cz-form">
      <TextField label="Titel" value={item.title} onChange={(title) => patch({ title })} />
      <div className="cz-row-2">
        <TextField label="Plats" value={item.venue} onChange={(venue) => patch({ venue })} />
        <TextField label="Datum" type="date" value={item.date} onChange={(date) => patch({ date })} />
      </div>
      <ImageField label="Omslag" value={item.cover} onChange={(cover) => patch({ cover })} />
      <TextAreaField
        label="Bilder"
        rows={8}
        value={item.photos.join("\n")}
        onChange={setPhotos}
        hint={`${item.count} bilder — en URL per rad.`}
      />
      <TextField
        label="Kopplad fest (slug)"
        value={item.eventSlug}
        onChange={(eventSlug) => patch({ eventSlug })}
        hint="Visar en flashback-länk på eventsidan."
      />

      <button type="button" className="cz-text-button cz-text-button--danger" onClick={remove}>
        Ta bort flashbacken
      </button>
    </div>
  );
}

export function FlashbacksPanel(props: PanelProps) {
  const { draft, update, editingId, setEditingId, goTo } = props;

  if (editingId) return <FlashbackEditor key={editingId} {...props} />;

  const flashbacks = [...draft.flashbacks].sort((a, b) => b.date.localeCompare(a.date));

  function create() {
    const id = `flashback-${Date.now().toString(36)}`;
    const item: CmsFlashback = {
      id,
      slug: id,
      eventSlug: "",
      title: "Ny flashback",
      venue: "NOISE",
      date: today(),
      cover: "/photos/party.jpg",
      photos: [],
      count: 0,
    };
    update((state) => ({ ...state, flashbacks: [item, ...state.flashbacks] }));
    setEditingId(id);
    goTo("/flashback");
  }

  return (
    <div className="cz-form">
      <button type="button" className="cz-button cz-button--primary" onClick={create}>
        + Ny flashback
      </button>

      <div className="cz-list">
        {flashbacks.map((item) => (
          <ListRow
            key={item.id}
            image={item.cover}
            title={item.title}
            meta={`${item.venue} · ${item.count} bilder`}
            onClick={() => {
              setEditingId(item.id);
              goTo(`/flashback/${item.slug}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}
