import { type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { usePublishedEvents } from "../lib/usePublishedEvents";
import { editable } from "../lib/previewBridge";

function renderMarkedTitle(title: string): ReactNode[] {
  const parts = title.split(/(\[\[[\s\S]*?\]\])/g).filter(Boolean);
  return parts.map((part, index) => {
    const mark = part.match(/^\[\[([\s\S]*?)\]\]$/);
    if (mark) {
      return (
        <span key={index} className="spark-mark">
          {mark[1]}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function FooterButton({
  label,
  href,
  style,
  editTarget,
  editLabel,
}: {
  label: string;
  href: string;
  style: CSSProperties;
  editTarget: string;
  editLabel: string;
}) {
  if (!label.trim() || !href.trim()) return null;

  const className = "spark-btn spark-footer-btn";
  const external = /^(https?:|mailto:|tel:)/i.test(href);
  const content = label.replace(/\s*↗\s*$/, "").trim();
  const showArrow = /↗/.test(label) || external;

  const inner = (
    <>
      {content}
      {showArrow ? <span aria-hidden="true">↗</span> : null}
    </>
  );

  return (
    <span {...editable(editTarget, editLabel)}>
      {external ? (
        <a href={href} target="_blank" rel="noreferrer" className={className} style={style}>
          {inner}
        </a>
      ) : (
        <Link to={href} className={className} style={style}>
          {inner}
        </Link>
      )}
    </span>
  );
}

export function Footer() {
  const { site } = usePublishedEvents();

  return (
    <footer className="spark-footer" {...editable("site:footer", "Sidfot")}>
      <div className="spark-footer-inner">
        <Link to="/" className="spark-footer-logo-link" aria-label="PartyHBG hem">
          <Logo className="spark-footer-logo" />
        </Link>

        <h2
          className="spark-section-title spark-footer-title"
          {...editable("site:footerTitle", "Sidfotsrubrik")}
        >
          {renderMarkedTitle(site.footerTitle)}
        </h2>

        <div className="spark-footer-row">
          <p className="spark-footer-lead" {...editable("site:footerLead", "Sidfotstext")}>
            {site.footerLead}
          </p>

          <nav className="spark-footer-nav" aria-label="Sidfot">
            <a href="/#instagram">Instagram</a>
            <Link to="/flashback">Flashback</Link>
            <Link to="/kontakt">Kontakta oss</Link>
          </nav>
        </div>

        <div className="spark-footer-actions">
          <FooterButton
            label={site.footerPrimaryLabel}
            href={site.footerPrimaryLink}
            editTarget="site:footerPrimary"
            editLabel="Sidfotsknapp 1"
            style={{
              background: site.footerPrimaryBg,
              color: site.footerPrimaryColor,
              border: `1px solid ${site.footerPrimaryBorder}`,
            }}
          />
          <FooterButton
            label={site.footerSecondaryLabel}
            href={site.footerSecondaryLink}
            editTarget="site:footerSecondary"
            editLabel="Sidfotsknapp 2"
            style={{
              background: site.footerSecondaryBg,
              color: site.footerSecondaryColor,
              border: `1px solid ${site.footerSecondaryBorder}`,
            }}
          />
        </div>

        <p className="spark-footer-copy">© {new Date().getFullYear()} PartyHBG</p>
      </div>
    </footer>
  );
}
