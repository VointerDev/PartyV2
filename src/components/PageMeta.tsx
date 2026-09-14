import { useEffect } from "react";
import { absoluteUrl, pageTitle } from "../lib/seo";

type PageMetaProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function PageMeta({ title, description, path, image, jsonLd }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = pageTitle(title);
    const url = absoluteUrl(path ?? window.location.pathname);
    const ogImage = image ? (image.startsWith("http") ? image : absoluteUrl(image)) : absoluteUrl("/photos/full_logo_transparent.png");

    document.title = fullTitle;
    setMeta("description", description);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", url, "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:locale", "sv_SE", "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);
    setLink("canonical", url);

    const existing = document.getElementById("json-ld");
    if (jsonLd) {
      const script = existing ?? document.createElement("script");
      script.id = "json-ld";
      script.setAttribute("type", "application/ld+json");
      script.textContent = JSON.stringify(jsonLd);
      if (!existing) document.head.appendChild(script);
    } else {
      existing?.remove();
    }
  }, [title, description, path, image, jsonLd]);

  return null;
}
