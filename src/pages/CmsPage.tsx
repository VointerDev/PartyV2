import { type CSSProperties, type ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";
import { editable } from "../lib/previewBridge";
import { usePublishedEvents } from "../lib/usePublishedEvents";
import type { CmsSection } from "../admin/cmsStore";

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

function SectionButton({ label, href }: { label: string; href: string }) {
  if (!label.trim() || !href.trim()) return null;
  const external = /^(https?:|mailto:|tel:)/i.test(href);
  const className = "spark-btn";
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {label}
    </Link>
  );
}

function SectionBlock({
  pageId,
  section,
}: {
  pageId: string;
  section: CmsSection;
}) {
  const alignStyle: CSSProperties | undefined =
    section.align === "center" ? { textAlign: "center", justifyItems: "center" } : undefined;

  const props = editable(`page-section:${pageId}:${section.id}`, sectionTypeLabel(section.type));

  if (section.type === "spacer") {
    return <div className="cms-section cms-section--spacer" style={{ height: section.height }} {...props} />;
  }

  if (section.type === "heading") {
    return (
      <div className="cms-section cms-section--heading" style={alignStyle} {...props}>
        <h1 className="spark-section-title">{renderMarkedTitle(section.title || "Rubrik")}</h1>
      </div>
    );
  }

  if (section.type === "text") {
    return (
      <div className="cms-section cms-section--text" style={alignStyle} {...props}>
        <p className="cms-section-body">{section.body}</p>
      </div>
    );
  }

  if (section.type === "image") {
    if (!section.image) return null;
    return (
      <div className="cms-section cms-section--image" style={alignStyle} {...props}>
        <img src={section.image} alt="" />
      </div>
    );
  }

  if (section.type === "buttons") {
    return (
      <div className="cms-section cms-section--buttons" style={alignStyle} {...props}>
        <div className="cms-section-actions">
          <SectionButton label={section.primaryLabel} href={section.primaryLink} />
          <SectionButton label={section.secondaryLabel} href={section.secondaryLink} />
        </div>
      </div>
    );
  }

  return null;
}

function sectionTypeLabel(type: CmsSection["type"]) {
  switch (type) {
    case "heading":
      return "Rubrik";
    case "text":
      return "Text";
    case "image":
      return "Bild";
    case "buttons":
      return "Knappar";
    case "spacer":
      return "Mellanrum";
    default:
      return "Sektion";
  }
}

export function CmsPage() {
  const { slug = "" } = useParams();
  const { pages, site } = usePublishedEvents();
  const page = pages.find((item) => item.slug === slug);

  if (!page) return <Navigate to="/" replace />;

  return (
    <div
      className="cms-page"
      style={{ ["--spark-content-max" as string]: `${site.contentMaxWidth}px` }}
      {...editable(`page:${page.id}`, page.title)}
    >
      <PageMeta title={`${page.title} — PartyHBG`} description={page.title} path={`/${page.slug}`} />

      <div className="cms-page-inner">
        {page.sections.map((section) => (
          <SectionBlock key={section.id} pageId={page.id} section={section} />
        ))}
      </div>
    </div>
  );
}
