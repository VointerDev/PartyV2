import { type FormEvent, useState } from "react";
import { PageMeta } from "../components/PageMeta";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "../lib/instagram";

const EMAIL = "hello@partyhbg.se";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedEmail || !trimmedMessage) return;

    const subject = encodeURIComponent(`Meddelande från ${trimmedName}`);
    const body = encodeURIComponent(
      `${trimmedMessage}\n\n—\n${trimmedName}\n${trimmedEmail}`,
    );

    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div className="spark-contact">
      <PageMeta
        title="Kontakta oss — PartyHBG"
        description="Hör av dig till PartyHBG. Mejl, Instagram och frågor om studentfester, gästlista och biljetter i Helsingborg."
        path="/kontakt"
      />

      <header className="spark-contact-head">
        <p className="spark-contact-eyebrow">PartyHBG</p>
        <h1 className="spark-section-title">
          Kontakta <span className="spark-mark">oss</span>
        </h1>
        <p className="spark-contact-lead">
          Har du frågor om fester, gästlista eller samarbeten? Skriv ett meddelande
          här — vi återkommer så snart vi kan.
        </p>
      </header>

      <div className="spark-contact-body">
        <form className="spark-contact-form" onSubmit={onSubmit}>
          <label className="spark-contact-field">
            <span className="spark-contact-label">Namn</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ditt namn"
            />
          </label>

          <label className="spark-contact-field">
            <span className="spark-contact-label">E-post</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="namn@mail.se"
            />
          </label>

          <label className="spark-contact-field spark-contact-field--full">
            <span className="spark-contact-label">Meddelande</span>
            <textarea
              name="message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Vad vill du höra av dig om?"
            />
          </label>

          <div className="spark-contact-form-actions">
            <button type="submit" className="spark-btn">
              Skicka meddelande
            </button>
            {sent ? (
              <p className="spark-contact-form-note">
                Öppnar din e-postapp — skicka därifrån för att nå oss.
              </p>
            ) : null}
          </div>
        </form>

        <div className="spark-contact-grid">
          <a href={`mailto:${EMAIL}`} className="spark-contact-item">
            <span className="spark-contact-label">Mejl</span>
            <span className="spark-contact-value">
              {EMAIL} <span aria-hidden="true">↗</span>
            </span>
          </a>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="spark-contact-item"
          >
            <span className="spark-contact-label">Instagram</span>
            <span className="spark-contact-value">
              {INSTAGRAM_HANDLE} <span aria-hidden="true">↗</span>
            </span>
          </a>

          <div className="spark-contact-item spark-contact-item--static">
            <span className="spark-contact-label">Plats</span>
            <span className="spark-contact-value">Helsingborg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
