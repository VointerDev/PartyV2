import { useEffect, useState } from "react";
import { isPastEvent } from "../../data";
import {
  emptyPage,
  emptySection,
  RESERVED_PAGE_SLUGS,
  slugify,
  type CmsEvent,
  type CmsFlashback,
  type CmsNews,
  type CmsPage,
  type CmsSection,
  type CmsSectionType,
  type CmsState,
} from "../cmsStore";
import { ImageField, PhotosField, TextAreaField, TextField, ColorField, SelectField, RangeField, Toggle } from "./fields";

export type PanelProps = {
  draft: CmsState;
  update: (fn: (state: CmsState) => CmsState) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  goTo: (path: string) => void;
  focusField?: string | null;
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
        hint="Markera text med [[dubbla hakparenteser]] för rosa highlight."
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
          max={100}
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
          placeholder="Kontakta oss"
        />
        <TextField
          label="Länk"
          value={site.heroSecondaryLink}
          onChange={(heroSecondaryLink) => setSite({ heroSecondaryLink })}
          placeholder="/kontakt"
        />
      </div>
      <div className="cz-row-2">
        <TextField
          label="Knapp 3"
          field="heroTertiary"
          value={site.heroTertiaryLabel}
          onChange={(heroTertiaryLabel) => setSite({ heroTertiaryLabel })}
          placeholder="Flashback"
        />
        <TextField
          label="Länk"
          value={site.heroTertiaryLink}
          onChange={(heroTertiaryLink) => setSite({ heroTertiaryLink })}
          placeholder="/flashback"
        />
      </div>
      <p className="cz-hint-block">
        Töm knappens text för att dölja den. Länken kan vara en sida på sajten (<code>/kontakt</code>
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

      <p className="cz-group-label">Sidfot</p>
      <TextAreaField
        label="Sidfotsrubrik"
        field="footerTitle"
        rows={2}
        value={site.footerTitle}
        onChange={(footerTitle) => setSite({ footerTitle })}
        hint="Markera med [[så här]] för rosa bakgrund."
      />
      <TextAreaField
        label="Sidfotstext"
        field="footerLead"
        rows={3}
        value={site.footerLead}
        onChange={(footerLead) => setSite({ footerLead })}
      />

      <p className="cz-group-label">Sidfotsknapp 1</p>
      <div data-cz-field="footerPrimary">
        <TextField
          label="Text"
          value={site.footerPrimaryLabel}
          onChange={(footerPrimaryLabel) => setSite({ footerPrimaryLabel })}
        />
        <TextField
          label="Länk"
          value={site.footerPrimaryLink}
          onChange={(footerPrimaryLink) => setSite({ footerPrimaryLink })}
          placeholder="https://… eller /kontakt"
        />
        <div className="cz-row-2">
          <ColorField
            label="Bakgrund"
            value={site.footerPrimaryBg}
            onChange={(footerPrimaryBg) => setSite({ footerPrimaryBg })}
          />
          <ColorField
            label="Textfärg"
            value={site.footerPrimaryColor}
            onChange={(footerPrimaryColor) => setSite({ footerPrimaryColor })}
          />
        </div>
        <ColorField
          label="Kantfärg"
          value={site.footerPrimaryBorder}
          onChange={(footerPrimaryBorder) => setSite({ footerPrimaryBorder })}
        />
      </div>

      <p className="cz-group-label">Sidfotsknapp 2</p>
      <div data-cz-field="footerSecondary">
        <TextField
          label="Text"
          value={site.footerSecondaryLabel}
          onChange={(footerSecondaryLabel) => setSite({ footerSecondaryLabel })}
        />
        <TextField
          label="Länk"
          value={site.footerSecondaryLink}
          onChange={(footerSecondaryLink) => setSite({ footerSecondaryLink })}
          placeholder="https://… eller /kontakt"
        />
        <div className="cz-row-2">
          <ColorField
            label="Bakgrund"
            value={site.footerSecondaryBg}
            onChange={(footerSecondaryBg) => setSite({ footerSecondaryBg })}
          />
          <ColorField
            label="Textfärg"
            value={site.footerSecondaryColor}
            onChange={(footerSecondaryColor) => setSite({ footerSecondaryColor })}
          />
        </div>
        <ColorField
          label="Kantfärg"
          value={site.footerSecondaryBorder}
          onChange={(footerSecondaryBorder) => setSite({ footerSecondaryBorder })}
        />
      </div>

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

  function setPhotos(photos: string[]) {
    patch({
      photos,
      count: photos.length,
      cover: item!.cover || photos[0] || "",
    });
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
      <PhotosField
        label="Bilder"
        value={item.photos}
        onChange={setPhotos}
        hint={`${item.photos.length} bilder — ladda upp flera samtidigt eller dra in dem.`}
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

/* -------------------------------------------------------------- pages --- */

const SECTION_TYPES: { value: CmsSectionType; label: string }[] = [
  { value: "heading", label: "Rubrik" },
  { value: "text", label: "Text" },
  { value: "image", label: "Bild" },
  { value: "buttons", label: "Knappar" },
  { value: "spacer", label: "Mellanrum" },
];

function sectionMeta(section: CmsSection) {
  const label = SECTION_TYPES.find((item) => item.value === section.type)?.label || section.type;
  if (section.type === "heading") return `${label} · ${section.title || "utan text"}`;
  if (section.type === "text") return `${label} · ${(section.body || "").slice(0, 40)}`;
  if (section.type === "image") return `${label}`;
  if (section.type === "buttons") return `${label} · ${section.primaryLabel || "knapp"}`;
  return `${label} · ${section.height}px`;
}

function PageEditor({ draft, update, editingId, setEditingId, goTo, focusField }: PanelProps) {
  const page = draft.pages.find((item) => item.id === editingId);
  const [sectionId, setSectionId] = useState<string | null>(null);

  useEffect(() => {
    setSectionId(null);
  }, [editingId]);

  useEffect(() => {
    if (!focusField?.startsWith("page-section-")) return;
    const id = focusField.replace(/^page-section-/, "");
    if (page?.sections.some((item) => item.id === id)) setSectionId(id);
  }, [focusField, page]);

  if (!page) return null;

  const section = page.sections.find((item) => item.id === sectionId) || null;

  function patchPage(changes: Partial<CmsPage>) {
    update((state) => ({
      ...state,
      pages: state.pages.map((item) => (item.id === editingId ? { ...item, ...changes } : item)),
    }));
  }

  function patchSection(changes: Partial<CmsSection>) {
    if (!sectionId) return;
    update((state) => ({
      ...state,
      pages: state.pages.map((item) =>
        item.id !== editingId
          ? item
          : {
              ...item,
              sections: item.sections.map((entry) =>
                entry.id === sectionId ? { ...entry, ...changes } : entry,
              ),
            },
      ),
    }));
  }

  function addSection(type: CmsSectionType) {
    const next = emptySection(type);
    patchPage({ sections: [...page!.sections, next] });
    setSectionId(next.id);
  }

  function moveSection(id: string, dir: -1 | 1) {
    const list = [...page!.sections];
    const index = list.findIndex((item) => item.id === id);
    const target = index + dir;
    if (index < 0 || target < 0 || target >= list.length) return;
    const [item] = list.splice(index, 1);
    list.splice(target, 0, item);
    patchPage({ sections: list });
  }

  function removeSection(id: string) {
    if (!confirm("Ta bort sektionen?")) return;
    patchPage({ sections: page!.sections.filter((item) => item.id !== id) });
    if (sectionId === id) setSectionId(null);
  }

  function removePage() {
    if (!confirm(`Ta bort sidan "${page!.title}"?`)) return;
    update((state) => ({
      ...state,
      pages: state.pages.filter((item) => item.id !== editingId),
    }));
    setEditingId(null);
    goTo("/");
  }

  function setSlug(value: string) {
    const next = slugify(value);
    if (!next || RESERVED_PAGE_SLUGS.has(next)) return;
    const taken = draft.pages.some((item) => item.id !== page!.id && item.slug === next);
    if (taken) return;
    patchPage({ slug: next });
    goTo(`/${next}`);
  }

  if (section) {
    return (
      <div className="cz-form">
        <button type="button" className="cz-text-button" onClick={() => setSectionId(null)}>
          ‹ Tillbaka till sidans sektioner
        </button>

        <SelectField
          label="Typ"
          value={section.type}
          onChange={(type) => patchSection({ type: type as CmsSectionType })}
          options={SECTION_TYPES}
        />
        <SelectField
          label="Justering"
          value={section.align}
          onChange={(align) => patchSection({ align: align as "left" | "center" })}
          options={[
            { value: "left", label: "Vänster" },
            { value: "center", label: "Centrerad" },
          ]}
        />

        {section.type === "heading" ? (
          <TextAreaField
            label="Rubrik"
            field={`page-section-${section.id}-title`}
            rows={2}
            value={section.title}
            onChange={(title) => patchSection({ title })}
            hint="Markera med [[så här]] för rosa bakgrund."
          />
        ) : null}

        {section.type === "text" ? (
          <TextAreaField
            label="Text"
            field={`page-section-${section.id}-body`}
            rows={6}
            value={section.body}
            onChange={(body) => patchSection({ body })}
          />
        ) : null}

        {section.type === "image" ? (
          <ImageField
            label="Bild"
            field={`page-section-${section.id}-image`}
            value={section.image}
            onChange={(image) => patchSection({ image })}
          />
        ) : null}

        {section.type === "buttons" ? (
          <>
            <TextField
              label="Knapp 1 text"
              value={section.primaryLabel}
              onChange={(primaryLabel) => patchSection({ primaryLabel })}
            />
            <TextField
              label="Knapp 1 länk"
              value={section.primaryLink}
              onChange={(primaryLink) => patchSection({ primaryLink })}
            />
            <TextField
              label="Knapp 2 text"
              value={section.secondaryLabel}
              onChange={(secondaryLabel) => patchSection({ secondaryLabel })}
            />
            <TextField
              label="Knapp 2 länk"
              value={section.secondaryLink}
              onChange={(secondaryLink) => patchSection({ secondaryLink })}
            />
          </>
        ) : null}

        {section.type === "spacer" ? (
          <RangeField
            label="Höjd"
            value={section.height}
            onChange={(height) => patchSection({ height })}
            min={8}
            max={240}
            step={4}
            unit="px"
          />
        ) : null}

        <button type="button" className="cz-text-button cz-text-button--danger" onClick={() => removeSection(section.id)}>
          Ta bort sektion
        </button>
      </div>
    );
  }

  return (
    <div className="cz-form">
      <TextField
        label="Sidtitel"
        value={page.title}
        onChange={(title) => {
          patchPage({ title, navLabel: page.navLabel === page.title ? title : page.navLabel });
        }}
      />
      <TextField
        label="URL-slug"
        value={page.slug}
        onChange={setSlug}
        hint={`Sidan syns på /${page.slug}`}
      />
      <TextField
        label="Menynamn"
        value={page.navLabel}
        onChange={(navLabel) => patchPage({ navLabel })}
      />
      <Toggle
        label="Visa i toppmenyn"
        checked={page.showInNav}
        onChange={(showInNav) => patchPage({ showInNav })}
      />

      <p className="cz-group-label">Sektioner</p>
      <div className="cz-row-2">
        {SECTION_TYPES.map((item) => (
          <button
            key={item.value}
            type="button"
            className="cz-button cz-button--small"
            onClick={() => addSection(item.value)}
          >
            + {item.label}
          </button>
        ))}
      </div>

      <div className="cz-list">
        {page.sections.map((item, index) => (
          <div key={item.id} className="cz-page-section-row">
            <ListRow
              title={SECTION_TYPES.find((entry) => entry.value === item.type)?.label || item.type}
              meta={sectionMeta(item)}
              onClick={() => setSectionId(item.id)}
            />
            <div className="cz-page-section-move">
              <button type="button" className="cz-text-button" disabled={index === 0} onClick={() => moveSection(item.id, -1)}>
                ↑
              </button>
              <button
                type="button"
                className="cz-text-button"
                disabled={index === page.sections.length - 1}
                onClick={() => moveSection(item.id, 1)}
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="cz-text-button" onClick={() => goTo(`/${page.slug}`)}>
        Visa sidan i förhandsvisningen
      </button>
      <button type="button" className="cz-text-button cz-text-button--danger" onClick={removePage}>
        Ta bort sida
      </button>
    </div>
  );
}

export function PagesPanel({ draft, update, editingId, setEditingId, goTo, focusField }: PanelProps) {
  if (editingId) {
    return (
      <PageEditor
        draft={draft}
        update={update}
        editingId={editingId}
        setEditingId={setEditingId}
        goTo={goTo}
        focusField={focusField}
      />
    );
  }

  function createPage() {
    const page = emptyPage(`Ny sida ${draft.pages.length + 1}`);
    let slug = page.slug;
    let n = 2;
    while (
      RESERVED_PAGE_SLUGS.has(slug) ||
      draft.pages.some((item) => item.slug === slug)
    ) {
      slug = `${page.slug}-${n++}`;
    }
    const next = { ...page, slug };
    update((state) => ({ ...state, pages: [...state.pages, next] }));
    setEditingId(next.id);
    goTo(`/${next.slug}`);
  }

  return (
    <div className="cz-form">
      <button type="button" className="cz-button" onClick={createPage}>
        + Ny sida
      </button>

      <div className="cz-list">
        {draft.pages.map((page) => (
          <ListRow
            key={page.id}
            title={page.title}
            meta={`/${page.slug} · ${page.sections.length} sektioner`}
            badge={page.showInNav ? "Meny" : undefined}
            onClick={() => {
              setEditingId(page.id);
              goTo(`/${page.slug}`);
            }}
          />
        ))}
      </div>

      {!draft.pages.length ? (
        <p className="cz-field-hint">Skapa en sida och bygg den med rubrik, text, bild, knappar eller mellanrum.</p>
      ) : null}
    </div>
  );
}
