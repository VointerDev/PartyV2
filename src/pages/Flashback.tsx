import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import { Link, useParams } from "react-router-dom";
import { WatermarkedImage } from "../components/WatermarkedImage";
import {
  DOWNLOAD_EFFECTS,
  downloadPhoto,
  type DownloadEffect,
  type DownloadFormat,
  type DownloadQuality,
} from "../lib/downloadPhoto";
import { slugify } from "../admin/cmsStore";
import { PageMeta } from "../components/PageMeta";
import type { Flashback } from "../data";
import { agendaDate, eventYear } from "../data";
import { editable } from "../lib/previewBridge";
import { usePublishedEvents } from "../lib/usePublishedEvents";
import { flashbackMetaDescription } from "../lib/seo";
import { NotFound } from "./NotFound";

function photoFilename(gallery: Flashback, index: number) {
  return `${slugify(gallery.title)}-${index + 1}.jpg`;
}

async function sharePhoto(gallery: Flashback) {
  const shareData = {
    title: `${gallery.title} · PartyHBG`,
    text: `Flashback från ${gallery.title} på ${gallery.venue} i Helsingborg`,
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (err) {
      if ((err as Error).name === "AbortError") return false;
    }
  }

  await navigator.clipboard.writeText(window.location.href);
  return true;
}

type LightboxProps = {
  gallery: Flashback;
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

function Lightbox({ gallery, activeIndex, onClose, onPrev, onNext }: LightboxProps) {
  const [shareLabel, setShareLabel] = useState("Dela");
  const [showWatermark, setShowWatermark] = useState(true);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>("jpg");
  const [downloadQuality, setDownloadQuality] = useState<DownloadQuality>("high");
  const [downloadEffect, setDownloadEffect] = useState<DownloadEffect>("polaroid");
  const [downloading, setDownloading] = useState(false);
  const touchX = useRef<number | null>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const activeSrc = gallery.photos[activeIndex];
  const filename = photoFilename(gallery, activeIndex);

  useEffect(() => {
    setShareLabel("Dela");
    setDownloadOpen(false);
  }, [activeIndex]);

  useEffect(() => {
    if (!downloadOpen) return;

    function onPointerDown(e: MouseEvent) {
      if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) {
        setDownloadOpen(false);
      }
    }

    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [downloadOpen]);

  useEffect(() => {
    const scrollY = window.scrollY;
    document.documentElement.classList.add("lightbox-open");
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("lightbox-open");
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [onClose, onNext, onPrev]);

  async function handleShare() {
    const ok = await sharePhoto(gallery);
    if (ok && !navigator.share) {
      setShareLabel("Länk kopierad");
      window.setTimeout(() => setShareLabel("Dela"), 2000);
    }
  }

  function onTouchStart(e: TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: TouchEvent) {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(delta) > 48) {
      if (delta > 0) onPrev();
      else onNext();
    }
    touchX.current = null;
  }

  async function handleDownload(withWatermark: boolean) {
    setDownloading(true);
    try {
      await downloadPhoto(activeSrc, filename, {
        withWatermark: downloadEffect === "polaroid" ? false : withWatermark,
        format: downloadFormat,
        quality: downloadQuality,
        effect: downloadEffect,
        caption: gallery.title,
      });
      setDownloadOpen(false);
    } catch {
      window.alert("Kunde inte ladda ner bilden. Försök igen.");
    } finally {
      setDownloading(false);
    }
  }

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer">
      <button type="button" className="lightbox-backdrop" onClick={onClose} aria-label="Close" tabIndex={-1} />

      <div className="lightbox-shell">
        <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div
          className="lightbox-stage"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button type="button" className="lightbox-nav lightbox-nav--prev" onClick={onPrev} aria-label="Previous">
            ←
          </button>

          <figure className="lightbox-figure">
            <WatermarkedImage src={activeSrc} alt="" fit="contain" showWatermark={showWatermark} />
          </figure>

          <button type="button" className="lightbox-nav lightbox-nav--next" onClick={onNext} aria-label="Next">
            →
          </button>
        </div>

        <footer className="lightbox-bar">
          <div className="lightbox-meta">
            <p className="lightbox-counter">
              {activeIndex + 1} / {gallery.photos.length}
            </p>
            <p className="lightbox-title">
              {gallery.title} · {gallery.venue}
            </p>
          </div>

          <div className="lightbox-actions">
            <label className="lightbox-toggle">
              <span className="lightbox-toggle-label">Stämpel</span>
              <span className="ios-switch">
                <input
                  type="checkbox"
                  checked={showWatermark}
                  onChange={(e) => setShowWatermark(e.target.checked)}
                />
                <span className="ios-switch-slider" />
              </span>
            </label>

            <div className="lightbox-download" ref={downloadRef}>
              <button
                type="button"
                className="lightbox-action lightbox-action--pink"
                aria-expanded={downloadOpen}
                onClick={() => setDownloadOpen((value) => !value)}
              >
                Ladda ner
              </button>
              {downloadOpen ? (
                <div className="lightbox-download-menu" role="dialog" aria-label="Nedladdningsalternativ">
                  <p className="lightbox-download-heading">Effekt</p>
                  <div className="lightbox-effect-grid">
                    {DOWNLOAD_EFFECTS.map((effect) => (
                      <button
                        key={effect.id}
                        type="button"
                        className={downloadEffect === effect.id ? "is-active" : undefined}
                        onClick={() => setDownloadEffect(effect.id)}
                      >
                        {effect.label}
                      </button>
                    ))}
                  </div>

                  <p className="lightbox-download-heading">Format</p>
                  <div className="lightbox-segmented">
                    <button
                      type="button"
                      className={downloadFormat === "jpg" ? "is-active" : undefined}
                      onClick={() => setDownloadFormat("jpg")}
                    >
                      JPG
                    </button>
                    <button
                      type="button"
                      className={downloadFormat === "png" ? "is-active" : undefined}
                      onClick={() => setDownloadFormat("png")}
                    >
                      PNG
                    </button>
                  </div>

                  <p className="lightbox-download-heading">Kvalitet</p>
                  <div className="lightbox-segmented lightbox-segmented--3">
                    <button
                      type="button"
                      className={downloadQuality === "high" ? "is-active" : undefined}
                      onClick={() => setDownloadQuality("high")}
                    >
                      Hög
                    </button>
                    <button
                      type="button"
                      className={downloadQuality === "medium" ? "is-active" : undefined}
                      onClick={() => setDownloadQuality("medium")}
                    >
                      Medium
                    </button>
                    <button
                      type="button"
                      className={downloadQuality === "low" ? "is-active" : undefined}
                      onClick={() => setDownloadQuality("low")}
                    >
                      Låg
                    </button>
                  </div>

                  <button
                    type="button"
                    className="lightbox-download-confirm"
                    disabled={downloading}
                    onClick={() => handleDownload(showWatermark)}
                  >
                    {downloading ? "Laddar ner…" : "Ladda ner bild"}
                  </button>
                  {downloadEffect !== "polaroid" ? (
                    <button
                      type="button"
                      className="lightbox-download-option"
                      disabled={downloading}
                      onClick={() => handleDownload(false)}
                    >
                      Utan stämpel
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>

            <button type="button" className="lightbox-action" onClick={handleShare}>
              {shareLabel}
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
}

export function Flashback() {
  const { flashbacks } = usePublishedEvents();

  return (
    <div className="spark-flashback">
      <PageMeta
        title="Flashback — bilder från studentfester i Helsingborg"
        description="Flashbacks och vimmelbilder från studentfester i Helsingborg. Se bilder från NOISE, Tivoli, NOC och Kappa Bar."
        path="/flashback"
      />

      <header className="spark-flashback-head">
        <h1 className="spark-section-title">
          Flash<span className="spark-mark">back</span>
        </h1>
        <p className="spark-flashback-lead">
          Bilder från nätter som redan brunnit. Öppna en fest och spara dina favoriter.
        </p>
      </header>

      <ul className="spark-flashback-index">
        {flashbacks.map((item) => (
          <li key={item.slug}>
            <Link to={`/flashback/${item.slug}`} className="spark-flashback-index-link">
              <span className="spark-flashback-index-title">{item.title}</span>
              <span className="spark-flashback-index-meta">
                {item.venue} · {item.count} bilder · {eventYear(item.date)}
              </span>
              <span className="spark-flashback-index-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="spark-flashback-covers">
        {flashbacks.map((item) => (
          <Link
            key={item.slug}
            to={`/flashback/${item.slug}`}
            className="spark-flashback-cover"
            {...editable(`flashback:${item.slug}`, item.title)}
          >
            <img
              src={item.cover}
              alt={`${item.title} på ${item.venue} i Helsingborg`}
              loading="lazy"
              decoding="async"
            />
            <div className="spark-flashback-cover-meta">
              <p>{item.title}</p>
              <p>
                {item.venue} · {agendaDate(item.date)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function FlashbackGallery() {
  const { slug } = useParams();
  const { flashbacks } = usePublishedEvents();
  const gallery = flashbacks.find((item) => item.slug === slug);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => {
    if (gallery && activeIndex !== null) {
      setActiveIndex((activeIndex - 1 + gallery.photos.length) % gallery.photos.length);
    }
  }, [activeIndex, gallery]);
  const next = useCallback(() => {
    if (gallery && activeIndex !== null) {
      setActiveIndex((activeIndex + 1) % gallery.photos.length);
    }
  }, [activeIndex, gallery]);

  if (!gallery) return <NotFound />;

  return (
    <div
      className="spark-flashback"
      {...editable(`flashback:${gallery.slug}`, gallery.title)}
    >
      <PageMeta
        title={`${gallery.title} · Flashback Helsingborg`}
        description={flashbackMetaDescription(gallery)}
        path={`/flashback/${gallery.slug}`}
        image={gallery.cover}
      />

      <header className="spark-flashback-hero">
        <div className="spark-flashback-hero-media" aria-hidden="true">
          <img src={gallery.cover} alt="" />
        </div>
        <div className="spark-flashback-hero-veil" aria-hidden="true" />
        <div className="spark-flashback-hero-content">
          <h1 className="spark-flashback-hero-title">{gallery.title}</h1>
          <div className="spark-flashback-chips">
            <span>{gallery.venue}</span>
            <span>{gallery.count} bilder</span>
            <span>{agendaDate(gallery.date)}</span>
          </div>
        </div>
      </header>

      <div className="spark-flashback-photos">
        {gallery.photos.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="spark-flashback-photo"
          >
            <img
              src={src}
              alt={`${gallery.title} bild ${i + 1}`}
              loading={i > 3 ? "lazy" : "eager"}
              decoding="async"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <Lightbox gallery={gallery} activeIndex={activeIndex} onClose={close} onPrev={prev} onNext={next} />
      ) : null}
    </div>
  );
}
