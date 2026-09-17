import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import type { CmsSiteSettings } from "../admin/cmsStore";
import { editable, isPreviewFrame } from "../lib/previewBridge";

const DISMISS_KEY = "partyhbg_banner_dismissed";

function bannerKey(site: CmsSiteSettings) {
  return `${site.bannerText}|${site.bannerLink}|${site.bannerBg}|${site.bannerColor}`;
}

function BannerLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) {
  if (!to) return <span className={className}>{children}</span>;

  if (/^(https?:|mailto:|tel:)/.test(to)) {
    return (
      <a href={to} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export function SiteBanner({ site }: { site: CmsSiteSettings }) {
  const key = useMemo(() => bannerKey(site), [site]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isPreviewFrame()) {
      setDismissed(false);
      return;
    }
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === key);
    } catch {
      setDismissed(false);
    }
  }, [key]);

  if (!site.bannerEnabled || !site.bannerText.trim() || dismissed) return null;

  function dismiss() {
    setDismissed(true);
    if (isPreviewFrame()) return;
    try {
      sessionStorage.setItem(DISMISS_KEY, key);
    } catch {
      /* ignore */
    }
  }

  const style = {
    backgroundColor: site.bannerBg || "#f16cb3",
    color: site.bannerColor || "#050505",
  } as const;

  return (
    <div
      className={`site-banner site-banner--${site.bannerSize} site-banner--${site.bannerAlign}`}
      style={style}
      role="region"
      aria-label="Meddelande"
      {...editable("site:banner", "Banner")}
    >
      <div className="site-banner-inner">
        {site.bannerLink ? (
          <BannerLink to={site.bannerLink} className="site-banner-text">
            <span>{site.bannerText}</span>
            {site.bannerLinkLabel ? (
              <span className="site-banner-cta">{site.bannerLinkLabel}</span>
            ) : null}
          </BannerLink>
        ) : (
          <p className="site-banner-text">{site.bannerText}</p>
        )}

        {site.bannerDismissible ? (
          <button type="button" className="site-banner-close" onClick={dismiss} aria-label="Stäng">
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function bannerIsVisible(site: CmsSiteSettings) {
  return site.bannerEnabled && Boolean(site.bannerText.trim());
}
