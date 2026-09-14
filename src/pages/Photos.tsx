import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { galleries } from "../data";
import { NotFound } from "./NotFound";

export function Photos() {
  return (
    <section className="page pb-16">
      <p className="section-label">↳ Vimmel</p>
      <div className="featured-track">
        {galleries.map((gallery) => (
          <Link key={gallery.slug} to={`/vimmelbilder/${gallery.slug}`} className="featured-card">
            <img src={gallery.cover} alt="" />
            <p>
              {gallery.venue}
              <br />
              {gallery.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Gallery() {
  const { slug } = useParams();
  const [active, setActive] = useState<string | null>(null);
  const gallery = galleries.find((item) => item.slug === slug);
  if (!gallery) return <NotFound />;

  return (
    <section className="page pb-16">
      <p className="section-label">↳ {gallery.title}</p>
      <p className="mb-8 text-muted">
        {gallery.venue} · {gallery.count} photos
      </p>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
        {gallery.photos.map((src, i) => (
          <button key={src + i} type="button" onClick={() => setActive(src)} className="block">
            <img src={src} alt="" className="aspect-square w-full object-cover hover:opacity-75" />
          </button>
        ))}
      </div>
      <Link to="/vimmelbilder" className="mt-8 inline-block text-muted hover:text-white">
        ← Back
      </Link>
      {active ? (
        <button type="button" className="fixed inset-0 z-50 bg-black/95 p-6" onClick={() => setActive(null)}>
          <img src={active} alt="" className="mx-auto max-h-[92vh] w-auto object-contain" />
        </button>
      ) : null}
    </section>
  );
}
