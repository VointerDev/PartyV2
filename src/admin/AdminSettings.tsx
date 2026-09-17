import { type FormEvent, useState } from "react";
import { loadCms, saveCms, type CmsSiteSettings } from "./cmsStore";

export function AdminSettings() {
  const cms = loadCms();
  const [site, setSite] = useState<CmsSiteSettings>(() => cms.site);
  const [homeUpcomingLimit, setHomeUpcomingLimit] = useState(() => cms.homeUpcomingLimit);
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = loadCms();
    next.site = {
      ...site,
      heroTitle: site.heroTitle.trim() || "PartyHBG",
      heroVideo: site.heroVideo.trim(),
      heroPoster: site.heroPoster.trim(),
      heroPrimaryLabel: site.heroPrimaryLabel.trim(),
      heroPrimaryLink: site.heroPrimaryLink.trim() || "/events",
      heroSecondaryLabel: site.heroSecondaryLabel.trim(),
      heroSecondaryLink: site.heroSecondaryLink.trim() || "/flashback",
      upcomingTitle: site.upcomingTitle.trim() || "Kommande Fester",
      newsTitle: site.newsTitle.trim() || "Nyheter",
      bannerText: site.bannerText.trim(),
      bannerLink: site.bannerLink.trim(),
      bannerLinkLabel: site.bannerLinkLabel.trim(),
      bannerBg: site.bannerBg.trim() || "#f16cb3",
      bannerColor: site.bannerColor.trim() || "#050505",
    };
    next.homeUpcomingLimit = Math.max(1, Math.min(24, Number(homeUpcomingLimit) || 2));
    saveCms(next);
    setMessage("Inställningar sparade — sidan uppdateras direkt.");
  }

  return (
    <section className="admin-page">
      <p className="section-label">↳ Webbplats</p>
      <h1 className="admin-page-title">Inställningar</h1>
      <p className="admin-page-lead text-muted">
        Banner, hero, rubriker och hur många biljetter som visas på startsidan.
      </p>

      {message ? <p className="admin-message">{message}</p> : null}

      <form className="admin-panel admin-form-grid" onSubmit={onSubmit}>
        <label className="admin-field admin-field--full admin-field--check">
          <span>Visa toppbanner</span>
          <input
            type="checkbox"
            checked={site.bannerEnabled}
            onChange={(e) => setSite({ ...site, bannerEnabled: e.target.checked })}
          />
        </label>
        <label className="admin-field admin-field--full">
          <span>Bannertext</span>
          <input
            value={site.bannerText}
            onChange={(e) => setSite({ ...site, bannerText: e.target.value })}
          />
        </label>
        <label className="admin-field">
          <span>Bannerlänk</span>
          <input
            value={site.bannerLink}
            onChange={(e) => setSite({ ...site, bannerLink: e.target.value })}
            placeholder="/events"
          />
        </label>
        <label className="admin-field">
          <span>Bannerlänk text</span>
          <input
            value={site.bannerLinkLabel}
            onChange={(e) => setSite({ ...site, bannerLinkLabel: e.target.value })}
            placeholder="Öppna"
          />
        </label>
        <label className="admin-field">
          <span>Banner bakgrund</span>
          <input
            type="color"
            value={site.bannerBg}
            onChange={(e) => setSite({ ...site, bannerBg: e.target.value })}
          />
        </label>
        <label className="admin-field">
          <span>Banner textfärg</span>
          <input
            type="color"
            value={site.bannerColor}
            onChange={(e) => setSite({ ...site, bannerColor: e.target.value })}
          />
        </label>
        <label className="admin-field">
          <span>Banner justering</span>
          <select
            value={site.bannerAlign}
            onChange={(e) =>
              setSite({ ...site, bannerAlign: e.target.value as CmsSiteSettings["bannerAlign"] })
            }
          >
            <option value="left">Vänster</option>
            <option value="center">Centrerad</option>
          </select>
        </label>
        <label className="admin-field">
          <span>Banner storlek</span>
          <select
            value={site.bannerSize}
            onChange={(e) =>
              setSite({ ...site, bannerSize: e.target.value as CmsSiteSettings["bannerSize"] })
            }
          >
            <option value="sm">Liten</option>
            <option value="md">Normal</option>
            <option value="lg">Stor</option>
          </select>
        </label>
        <label className="admin-field admin-field--check">
          <span>Kan stängas</span>
          <input
            type="checkbox"
            checked={site.bannerDismissible}
            onChange={(e) => setSite({ ...site, bannerDismissible: e.target.checked })}
          />
        </label>
        <label className="admin-field admin-field--check">
          <span>Sticky</span>
          <input
            type="checkbox"
            checked={site.bannerSticky}
            onChange={(e) => setSite({ ...site, bannerSticky: e.target.checked })}
          />
        </label>

        <label className="admin-field admin-field--full">
          <span>Hero-titel</span>
          <input
            value={site.heroTitle}
            onChange={(e) => setSite({ ...site, heroTitle: e.target.value })}
          />
        </label>
        <label className="admin-field admin-field--full">
          <span>Hero-video (URL eller /videos/...)</span>
          <input
            value={site.heroVideo}
            onChange={(e) => setSite({ ...site, heroVideo: e.target.value })}
            placeholder="/videos/party.mp4"
          />
        </label>
        <label className="admin-field admin-field--full">
          <span>Hero-bild / poster</span>
          <input
            value={site.heroPoster}
            onChange={(e) => setSite({ ...site, heroPoster: e.target.value })}
            placeholder="/photos/party.jpg"
          />
        </label>
        <label className="admin-field">
          <span>Knapp 1: text</span>
          <input
            value={site.heroPrimaryLabel}
            onChange={(e) => setSite({ ...site, heroPrimaryLabel: e.target.value })}
            placeholder="Se evenemang"
          />
        </label>
        <label className="admin-field">
          <span>Knapp 1: länk</span>
          <input
            value={site.heroPrimaryLink}
            onChange={(e) => setSite({ ...site, heroPrimaryLink: e.target.value })}
            placeholder="/events"
          />
        </label>
        <label className="admin-field">
          <span>Knapp 2: text</span>
          <input
            value={site.heroSecondaryLabel}
            onChange={(e) => setSite({ ...site, heroSecondaryLabel: e.target.value })}
            placeholder="Flashback"
          />
        </label>
        <label className="admin-field">
          <span>Knapp 2: länk</span>
          <input
            value={site.heroSecondaryLink}
            onChange={(e) => setSite({ ...site, heroSecondaryLink: e.target.value })}
            placeholder="/flashback"
          />
        </label>
        <label className="admin-field">
          <span>Rubrik: kommande</span>
          <input
            value={site.upcomingTitle}
            onChange={(e) => setSite({ ...site, upcomingTitle: e.target.value })}
          />
        </label>
        <label className="admin-field">
          <span>Rubrik: nyheter</span>
          <input
            value={site.newsTitle}
            onChange={(e) => setSite({ ...site, newsTitle: e.target.value })}
          />
        </label>
        <label className="admin-field">
          <span>Antal biljetter på startsidan</span>
          <input
            type="number"
            min={1}
            max={24}
            value={homeUpcomingLimit}
            onChange={(e) => setHomeUpcomingLimit(Number(e.target.value))}
          />
        </label>

        {(site.heroPoster || site.heroVideo) && (
          <div className="admin-field admin-field--full">
            <span>Förhandsvisning</span>
            <div className="admin-image-preview">
              <img src={site.heroPoster || "/photos/party.jpg"} alt="" />
            </div>
          </div>
        )}

        <div className="admin-form-actions admin-field--full">
          <button type="submit" className="admin-button admin-button--primary">
            Spara ändringar
          </button>
        </div>
      </form>

      <div className="admin-help">
        <p>
          <strong>Tips:</strong> Biljetter, flashbacks och nyheter har egna sidor i menyn. Allt
          sparas lokalt i webbläsaren och syns direkt på sajten.
        </p>
      </div>
    </section>
  );
}
