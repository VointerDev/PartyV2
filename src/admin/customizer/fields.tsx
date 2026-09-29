import { useRef, useState, type ReactNode } from "react";
import { fileToCompressedDataUrl } from "../imageUpload";

export function Field({
  label,
  hint,
  field,
  children,
}: {
  label: string;
  hint?: string;
  field?: string;
  children: ReactNode;
}) {
  return (
    <label className="cz-field" data-cz-field={field}>
      <span className="cz-field-label">{label}</span>
      {children}
      {hint ? <em className="cz-field-hint">{hint}</em> : null}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  onBlur,
  hint,
  field,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  hint?: string;
  field?: string;
  placeholder?: string;
  type?: "text" | "date" | "number";
}) {
  return (
    <Field label={label} hint={hint} field={field}>
      <input
        className="cz-input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  hint,
  field,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  field?: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint} field={field}>
      <textarea
        className="cz-input cz-textarea"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function ImageField({
  label,
  value,
  onChange,
  hint,
  field,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  field?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploaded = value.startsWith("data:");

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      onChange(await fileToCompressedDataUrl(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Uppladdningen misslyckades.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cz-field" data-cz-field={field}>
      <span className="cz-field-label">{label}</span>

      <div className="cz-image-row">
        <div className="cz-image-thumb">
          {value ? <img src={value} alt="" /> : <span>Tom</span>}
        </div>
        <div className="cz-image-actions">
          <button
            type="button"
            className="cz-button cz-button--small"
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            {busy ? "Laddar…" : "Ladda upp"}
          </button>
          {value ? (
            <button type="button" className="cz-text-button" onClick={() => onChange("")}>
              Ta bort
            </button>
          ) : null}
        </div>
      </div>

      <input
        className="cz-input"
        value={uploaded ? "Uppladdad bild" : value}
        disabled={uploaded}
        placeholder="/photos/party.jpg eller https://…"
        onChange={(e) => onChange(e.target.value)}
      />

      {error ? <em className="cz-field-hint cz-field-hint--error">{error}</em> : null}
      {hint && !error ? <em className="cz-field-hint">{hint}</em> : null}

      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function PhotosField({
  label,
  value,
  onChange,
  hint,
  field,
}: {
  label: string;
  value: string[];
  onChange: (photos: string[]) => void;
  hint?: string;
  field?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function importFiles(files: FileList | File[]) {
    const list = [...files].filter((file) => file.type.startsWith("image/"));
    if (!list.length) {
      setError("Inga bildfiler valda.");
      return;
    }

    setBusy(true);
    setError(null);
    const next = [...value];

    try {
      for (let i = 0; i < list.length; i += 1) {
        setProgress(`Laddar ${i + 1}/${list.length}…`);
        next.push(await fileToCompressedDataUrl(list[i], 1200, 0.72));
      }
      onChange(next);
      setProgress(`${list.length} bilder tillagda.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Uppladdningen misslyckades.");
      setProgress(null);
    } finally {
      setBusy(false);
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function clearAll() {
    if (!value.length) return;
    if (!confirm(`Ta bort alla ${value.length} bilder?`)) return;
    onChange([]);
    setProgress(null);
  }

  return (
    <div className="cz-field" data-cz-field={field}>
      <span className="cz-field-label">{label}</span>

      <div
        className={`cz-photos-drop ${dragOver ? "is-over" : ""} ${busy ? "is-busy" : ""}`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) void importFiles(e.dataTransfer.files);
        }}
      >
        <p className="cz-photos-drop-title">
          {busy ? progress || "Laddar…" : "Släpp bilder här eller ladda upp flera"}
        </p>
        <p className="cz-photos-drop-sub">JPG, PNG, WEBP — flera filer samtidigt</p>
        <div className="cz-image-actions">
          <button
            type="button"
            className="cz-button cz-button--small"
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            {busy ? "Laddar…" : "Massimportera"}
          </button>
          {value.length ? (
            <button type="button" className="cz-text-button" disabled={busy} onClick={clearAll}>
              Rensa alla
            </button>
          ) : null}
        </div>
      </div>

      {value.length ? (
        <div className="cz-photos-grid">
          {value.map((src, index) => (
            <div key={`${index}-${src.slice(0, 24)}`} className="cz-photos-item">
              <img src={src} alt="" />
              <button
                type="button"
                className="cz-photos-remove"
                aria-label={`Ta bort bild ${index + 1}`}
                onClick={() => removeAt(index)}
              >
                ×
              </button>
              {index === 0 ? <span className="cz-photos-badge">Omslag</span> : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="cz-photos-empty">Inga bilder ännu.</p>
      )}

      {error ? <em className="cz-field-hint cz-field-hint--error">{error}</em> : null}
      {!error && (progress || hint) ? (
        <em className="cz-field-hint">{progress || hint}</em>
      ) : null}

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) void importFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="cz-toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <i aria-hidden="true" />
    </label>
  );
}

function toHex(value: string, fallback: string) {
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const [, a, b, c] = trimmed;
    return `#${a}${a}${b}${b}${c}${c}`;
  }
  return fallback;
}

export function ColorField({
  label,
  value,
  onChange,
  hint,
  field,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  field?: string;
}) {
  const hex = toHex(value, "#f16cb3");

  return (
    <Field label={label} hint={hint} field={field}>
      <div className="cz-color-row">
        <input
          className="cz-color-swatch"
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
        />
        <input
          className="cz-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#f16cb3"
        />
      </div>
    </Field>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  field,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  field?: string;
}) {
  return (
    <Field label={label} field={field}>
      <select className="cz-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = "",
  hint,
  field,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
  field?: string;
}) {
  return (
    <Field label={label} hint={hint} field={field}>
      <div className="cz-range-row">
        <input
          className="cz-range"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span className="cz-range-value">
          {value}
          {unit}
        </span>
      </div>
    </Field>
  );
}
