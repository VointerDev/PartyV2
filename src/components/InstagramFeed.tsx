import { useEffect, useState } from "react";
import BeholdWidget from "@behold/react";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "../lib/instagram";

const FEED_ID = (import.meta.env.VITE_BEHOLD_FEED_ID as string | undefined)?.trim();

type BeholdPost = {
  id: string;
  permalink: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | string;
  mediaUrl?: string;
  prunedCaption?: string;
  sizes?: {
    medium?: { mediaUrl?: string };
    small?: { mediaUrl?: string };
  };
};

type FeedState =
  | { status: "idle" | "loading" }
  | { status: "ready"; posts: BeholdPost[] }
  | { status: "widget" };

export function InstagramFeed() {
  const [state, setState] = useState<FeedState>(
    FEED_ID ? { status: "loading" } : { status: "idle" },
  );

  useEffect(() => {
    if (!FEED_ID) return;

    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch(`https://feeds.behold.so/${FEED_ID}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          setState({ status: "widget" });
          return;
        }

        const data = (await res.json()) as { posts?: BeholdPost[] };
        const posts = data.posts ?? [];
        setState(posts.length ? { status: "ready", posts } : { status: "widget" });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setState({ status: "widget" });
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  return (
    <section className="spark-instagram" id="instagram">
      <div className="spark-instagram-head">
        <div>
          <h2 className="spark-section-title">{INSTAGRAM_HANDLE}</h2>
        </div>
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="spark-btn">
          Öppna Instagram <span aria-hidden="true">↗</span>
        </a>
      </div>

      {!FEED_ID ? <SetupHint /> : null}

      {state.status === "loading" ? (
        <div className="spark-ig-grid spark-ig-grid--skeleton" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="spark-ig-cell spark-ig-cell--skeleton" />
          ))}
        </div>
      ) : null}

      {state.status === "ready" ? (
        <div className="spark-ig-grid">
          {state.posts.map((post) => {
            const thumb =
              post.sizes?.medium?.mediaUrl ||
              post.sizes?.small?.mediaUrl ||
              post.mediaUrl ||
              "";

            return (
              <a
                key={post.id}
                href={post.permalink || INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="spark-ig-cell"
              >
                {post.mediaType === "VIDEO" && post.mediaUrl ? (
                  <video
                    poster={thumb}
                    src={post.mediaUrl}
                    muted
                    playsInline
                    loop
                    autoPlay
                  />
                ) : (
                  <img src={thumb} alt={post.prunedCaption || "Instagram"} loading="lazy" />
                )}
              </a>
            );
          })}
        </div>
      ) : null}

      {state.status === "widget" && FEED_ID ? (
        <div className="spark-ig-widget">
          <BeholdWidget feedId={FEED_ID} />
        </div>
      ) : null}
    </section>
  );
}

function SetupHint() {
  return (
    <div className="spark-ig-setup">
      <p className="spark-ig-setup-title">Koppla Instagram en gång (gratis, ca 3 min)</p>
      <ol>
        <li>
          Gå till{" "}
          <a href="https://behold.so" target="_blank" rel="noreferrer">
            behold.so
          </a>{" "}
          och skapa ett konto
        </li>
        <li>
          Lägg till källa och anslut{" "}
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
            {INSTAGRAM_HANDLE}
          </a>{" "}
          (kontot måste vara Företag eller Skapare)
        </li>
        <li>Skapa flöde → Användare → välj Widget eller JSON</li>
        <li>
          Öppna inbäddningskod → kopiera <strong>feed-ID</strong>
        </li>
        <li>
          Klistra in i projektets <code>.env</code>:
        </li>
      </ol>
      <pre>VITE_BEHOLD_FEED_ID=ditt-feed-id</pre>
      <p>
        Starta om med <code>npm run dev</code>. Därefter syns varje nytt Instagram-inlägg här
        automatiskt.
      </p>
    </div>
  );
}
