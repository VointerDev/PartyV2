import { Link } from "react-router-dom";
import { photos } from "../data";

export function News() {
  return (
    <article className="page pb-16">
      <p className="section-label">↳ News</p>
      <div className="grid gap-10 md:grid-cols-2">
        <img src={photos.crowd} alt="" className="aspect-[4/5] w-full object-cover" />
        <div>
          <p className="text-muted">24 Aug 2026</p>
          <h1 className="mt-4 text-[15px] leading-snug">Interview Helsingborg x PartyHBG</h1>
          <div className="mt-8 space-y-4 leading-relaxed text-muted">
            <p>
              Helsingborg is not a satellite of Malmö or Copenhagen. It has its own rooms, its own
              payday Saturdays, its own 05.00.
            </p>
            <p>
              PartyHBG started as a guestlist and a camera. Then it became the residents, the vimmel
              after, the door that knows your name.
            </p>
          </div>
          <Link to="/" className="mt-8 inline-block hover:opacity-60">
            ← Back
          </Link>
        </div>
      </div>
    </article>
  );
}
