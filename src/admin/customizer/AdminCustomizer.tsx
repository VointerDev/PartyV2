import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../components/Logo";
import { PREVIEW_CHANNEL, type PreviewToFrame, type PreviewToParent } from "../../lib/previewBridge";
import { publishCmsRemote } from "../../lib/cmsRemote";
import { loadCms, saveCms, type CmsState } from "../cmsStore";
import {
  EventsPanel,
  FlashbacksPanel,
  NewsPanel,
  PagesPanel,
  SitePanel,
  type PanelProps,
} from "./panels";

type SectionId = "site" | "events" | "news" | "flashbacks" | "pages";
type Device = "desktop" | "tablet" | "mobile";

const devices: { id: Device; label: string; width: number | null }[] = [
  { id: "desktop", label: "Dator", width: null },
  { id: "tablet", label: "Platta", width: 834 },
  { id: "mobile", label: "Mobil", width: 390 },
];

/** Maps a clicked region of the hero/home page to the field that controls it. */
const siteFields: Record<string, string> = {
  hero: "heroTitle",
  heroTitle: "heroTitle",
  heroMedia: "heroVideo",
  heroPrimary: "heroPrimary",
  heroSecondary: "heroSecondary",
  heroTertiary: "heroTertiary",
  heroTitleSize: "heroTitleSize",
  upcoming: "upcoming",
  news: "news",
  banner: "banner",
  footer: "footerTitle",
  footerTitle: "footerTitle",
  footerLead: "footerLead",
  footerPrimary: "footerPrimary",
  footerSecondary: "footerSecondary",
};

const panels: Record<SectionId, ComponentType<PanelProps>> = {
  site: SitePanel,
  events: EventsPanel,
  news: NewsPanel,
  flashbacks: FlashbacksPanel,
  pages: PagesPanel,
};

export function AdminCustomizer() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(() => loadCms());
  const [draft, setDraft] = useState(saved);
  const [section, setSection] = useState<SectionId | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [device, setDevice] = useState<Device>("desktop");
  const [path, setPath] = useState("/");
  const [status, setStatus] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [selectMode, setSelectMode] = useState(true);
  const [focusField, setFocusField] = useState<string | null>(null);
  const body = useRef<HTMLDivElement>(null);

  const frame = useRef<HTMLIFrameElement>(null);
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const selectModeRef = useRef(selectMode);
  selectModeRef.current = selectMode;

  const post = useCallback((message: PreviewToFrame) => {
    frame.current?.contentWindow?.postMessage(message, window.location.origin);
  }, []);

  const pushState = useCallback(
    (state: CmsState) => post({ channel: PREVIEW_CHANNEL, action: "state", state }),
    [post],
  );

  const goTo = useCallback(
    (next: string) => {
      setPath(next);
      post({ channel: PREVIEW_CHANNEL, action: "navigate", path: next });
    },
    [post],
  );

  const openTarget = useCallback(
    (target: string) => {
      const [kind, key, sectionKey] = target.split(":");
      const state = draftRef.current;

      if (kind === "site") {
        setSection("site");
        setEditingId(null);
        setFocusField(siteFields[key] ?? null);
        return;
      }

      if (kind === "event") {
        const event = state.events.find((item) => item.slug === key);
        if (!event) return;
        setSection("events");
        setEditingId(event.id);
        return;
      }

      if (kind === "news") {
        const item = state.news.find((entry) => entry.slug === key);
        if (!item) return;
        setSection("news");
        setEditingId(item.id);
        return;
      }

      if (kind === "flashback") {
        const item = state.flashbacks.find((entry) => entry.slug === key);
        if (!item) return;
        setSection("flashbacks");
        setEditingId(item.id);
        return;
      }

      if (kind === "page") {
        const page = state.pages.find((item) => item.id === key);
        if (!page) return;
        setSection("pages");
        setEditingId(page.id);
        goTo(`/${page.slug}`);
        return;
      }

      if (kind === "page-section") {
        const page = state.pages.find((item) => item.id === key);
        if (!page) return;
        setSection("pages");
        setEditingId(page.id);
        setFocusField(sectionKey ? `page-section-${sectionKey}` : null);
        goTo(`/${page.slug}`);
      }
    },
    [goTo],
  );

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as PreviewToParent | undefined;
      if (!data || data.channel !== PREVIEW_CHANNEL) return;
      if (data.action === "ready") {
        pushState(draftRef.current);
        post({ channel: PREVIEW_CHANNEL, action: "selectMode", enabled: selectModeRef.current });
      }
      if (data.action === "route") setPath(data.path);
      if (data.action === "edit") openTarget(data.target);
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [openTarget, post, pushState]);

  useEffect(() => {
    pushState(draft);
  }, [draft, pushState]);

  useEffect(() => {
    post({ channel: PREVIEW_CHANNEL, action: "selectMode", enabled: selectMode });
  }, [post, selectMode]);

  useEffect(() => {
    if (!focusField) return;

    const frameId = requestAnimationFrame(() => {
      const target = body.current?.querySelector<HTMLElement>(`[data-cz-field="${focusField}"]`);
      setFocusField(null);
      if (!target) return;

      target.scrollIntoView({ block: "center", behavior: "smooth" });
      target.querySelector<HTMLInputElement>("input:not([type=file]), textarea")?.focus();
      target.classList.add("is-flash");
      window.setTimeout(() => target.classList.remove("is-flash"), 1400);
    });

    return () => cancelAnimationFrame(frameId);
  }, [focusField]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = useCallback((fn: (state: CmsState) => CmsState) => setDraft(fn), []);

  const previewPages = useMemo(
    () => [
      { path: "/", label: "Hem" },
      { path: "/kontakt", label: "Kontakt" },
      ...draft.pages.map((page) => ({ path: `/${page.slug}`, label: page.navLabel || page.title })),
    ],
    [draft.pages],
  );

  const sections: { id: SectionId; title: string; sub: string; path: string; scroll?: string }[] = [
    {
      id: "site",
      title: "Startsida & hero",
      sub: "Banner, hero, rubriker",
      path: "/",
      scroll: ".spark-hero",
    },
    {
      id: "pages",
      title: "Sidor",
      sub: draft.pages.length ? `${draft.pages.length} sidor` : "Skapa nya sidor",
      path: draft.pages[0] ? `/${draft.pages[0].slug}` : "/",
    },
    {
      id: "events",
      title: "Biljetter",
      sub: `${draft.events.length} fester`,
      path: "/",
    },
    {
      id: "news",
      title: "Nyheter",
      sub: `${draft.news.length} inlägg`,
      path: "/",
      scroll: ".spark-instagram",
    },
    {
      id: "flashbacks",
      title: "Flashbacks",
      sub: `${draft.flashbacks.length} gallerier`,
      path: "/flashback",
    },
  ];

  function openSection(id: SectionId) {
    const config = sections.find((item) => item.id === id);
    setSection(id);
    setEditingId(null);
    if (config) {
      goTo(config.path);
      if (config.scroll) {
        window.setTimeout(
          () => post({ channel: PREVIEW_CHANNEL, action: "scroll", selector: config.scroll! }),
          450,
        );
      }
    }
  }

  function back() {
    if (editingId) setEditingId(null);
    else setSection(null);
  }

  async function publish() {
    if (publishing) return;
    setPublishing(true);
    try {
      const next = saveCms(draft);
      setSaved(next);
      setDraft(next);
      setStatus("Publicerar till live-sajten…");

      const remote = await publishCmsRemote(next);
      if (remote.ok) {
        setStatus("Publicerat — live-sajten är uppdaterad.");
      } else {
        setStatus(`Sparat lokalt. Live: ${remote.error}`);
      }
    } catch {
      setStatus("Kunde inte spara. Bilderna tar för mycket plats.");
    } finally {
      setPublishing(false);
      window.setTimeout(() => setStatus(null), 5000);
    }
  }

  function revert() {
    if (!confirm("Kasta ändringarna sedan du senast publicerade?")) return;
    setDraft(saved);
    setStatus("Ändringarna är borttagna.");
    window.setTimeout(() => setStatus(null), 2500);
  }

  const activeSection = section ? sections.find((item) => item.id === section) : null;
  const Panel = section ? panels[section] : null;

  const editingTitle = (() => {
    if (!editingId) return null;
    if (section === "events") return draft.events.find((item) => item.id === editingId)?.title;
    if (section === "news") return draft.news.find((item) => item.id === editingId)?.title;
    if (section === "flashbacks") return draft.flashbacks.find((item) => item.id === editingId)?.title;
    if (section === "pages") return draft.pages.find((item) => item.id === editingId)?.title;
    return null;
  })();

  const frameWidth = devices.find((item) => item.id === device)?.width;

  return (
    <div className="cz">
      <aside className="cz-panel">
        <header className="cz-head">
          <Logo className="cz-logo" />
          <button
            type="button"
            className="cz-close"
            aria-label="Stäng redigeraren"
            onClick={() => {
              if (dirty && !confirm("Du har opublicerade ändringar. Stäng ändå?")) return;
              navigate("/admin/dashboard");
            }}
          >
            ✕
          </button>
        </header>

        {activeSection ? (
          <div className="cz-crumb">
            <button type="button" className="cz-back" onClick={back}>
              ‹ Tillbaka
            </button>
            <p className="cz-crumb-title">{editingTitle ?? activeSection.title}</p>
          </div>
        ) : null}

        <div className="cz-body" ref={body}>
          {Panel && section ? (
            <Panel
              draft={draft}
              update={update}
              editingId={editingId}
              setEditingId={setEditingId}
              goTo={goTo}
              focusField={focusField}
            />
          ) : (
            <nav className="cz-sections">
              {sections.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="cz-section"
                  onClick={() => openSection(item.id)}
                >
                  <span className="cz-list-text">
                    <span className="cz-list-title">{item.title}</span>
                    <span className="cz-list-meta">{item.sub}</span>
                  </span>
                  <span className="cz-list-chevron" aria-hidden="true">
                    ›
                  </span>
                </button>
              ))}

              <button
                type="button"
                className="cz-section cz-section--muted"
                onClick={() => {
                  if (dirty && !confirm("Du har opublicerade ändringar. Lämna ändå?")) return;
                  navigate("/admin/dashboard");
                }}
              >
                <span className="cz-list-text">
                  <span className="cz-list-title">Fler verktyg</span>
                  <span className="cz-list-meta">Översikt, bilder, säkerhetskopia</span>
                </span>
                <span className="cz-list-chevron" aria-hidden="true">
                  ›
                </span>
              </button>
            </nav>
          )}
        </div>

        <footer className="cz-foot">
          {status ? <p className="cz-status">{status}</p> : null}
          <div className="cz-foot-actions">
            <button
              type="button"
              className="cz-button cz-button--primary"
              disabled={!dirty || publishing}
              onClick={() => void publish()}
            >
              {publishing ? "Publicerar…" : dirty ? "Publicera" : "Allt är publicerat"}
            </button>
            <button type="button" className="cz-text-button" disabled={!dirty} onClick={revert}>
              Ångra
            </button>
          </div>
        </footer>
      </aside>

      <section className="cz-stage">
        <div className="cz-stage-bar">
          <div className="cz-pages">
            {previewPages.map((page) => (
              <button
                key={page.path}
                type="button"
                className={path === page.path ? "cz-page is-active" : "cz-page"}
                onClick={() => goTo(page.path)}
              >
                {page.label}
              </button>
            ))}
          </div>

          <div className="cz-stage-right">
            <button
              type="button"
              className={selectMode ? "cz-select-toggle is-active" : "cz-select-toggle"}
              onClick={() => setSelectMode((value) => !value)}
              title="Klicka på sajten för att redigera den delen"
            >
              <span className="cz-select-dot" aria-hidden="true" />
              Peka & redigera
            </button>

            <div className="cz-devices">
              {devices.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={device === item.id ? "cz-device is-active" : "cz-device"}
                  onClick={() => setDevice(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <a href={path} target="_blank" rel="noreferrer" className="cz-open">
              Öppna ↗
            </a>
          </div>
        </div>

        <div className="cz-frame-wrap">
          <iframe
            ref={frame}
            src="/"
            title="Förhandsvisning av sajten"
            className="cz-frame"
            style={frameWidth ? { width: frameWidth, maxWidth: "100%" } : undefined}
          />
        </div>
      </section>
    </div>
  );
}
