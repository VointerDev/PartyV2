import { LOGO_SRC } from "../logo";
import { proxiedPhotoUrl } from "./photoProxy";

export type DownloadFormat = "jpg" | "png";
export type DownloadQuality = "high" | "medium" | "low";
export type DownloadEffect = "none" | "polaroid" | "bw" | "vintage" | "neon" | "contrast";

export type DownloadOptions = {
  withWatermark: boolean;
  format: DownloadFormat;
  quality: DownloadQuality;
  effect: DownloadEffect;
  caption?: string;
};

export const DOWNLOAD_EFFECTS: { id: DownloadEffect; label: string }[] = [
  { id: "none", label: "Original" },
  { id: "polaroid", label: "Polaroid" },
  { id: "bw", label: "Svartvitt" },
  { id: "vintage", label: "Vintage" },
  { id: "neon", label: "Neon" },
  { id: "contrast", label: "Kontrast" },
];

const QUALITY_PRESETS: Record<DownloadQuality, { scale: number; jpeg: number }> = {
  high: { scale: 1, jpeg: 0.92 },
  medium: { scale: 0.75, jpeg: 0.82 },
  low: { scale: 0.5, jpeg: 0.72 },
};

const MAX_CANVAS_EDGE = 4096;

async function loadImage(url: string): Promise<HTMLImageElement> {
  const res = await fetch(proxiedPhotoUrl(url));
  if (!res.ok) throw new Error("Could not load image");

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    throw new Error("Photo proxy unavailable");
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);

  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = objectUrl;
    });
    return img;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function outputFilename(baseFilename: string, format: DownloadFormat, effect: DownloadEffect) {
  const stem = baseFilename.replace(/\.[^.]+$/, "");
  const suffix = effect === "none" ? "" : `-${effect}`;
  return `${stem}${suffix}.${format}`;
}

function fitCanvasSize(width: number, height: number) {
  const longest = Math.max(width, height);
  if (longest <= MAX_CANVAS_EDGE) return { width, height };

  const scale = MAX_CANVAS_EDGE / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, width, height, radius);
    return;
  }

  const r = Math.min(radius, width / 2, height / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawSticker(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, logo: HTMLImageElement) {
  const logoWidth = canvas.width * 0.17;
  const logoHeight = (logo.naturalHeight / logo.naturalWidth) * logoWidth;
  const stickerPadX = Math.max(10, canvas.width * 0.012);
  const stickerPadY = Math.max(8, canvas.height * 0.01);
  const margin = Math.max(12, canvas.width * 0.018);

  const stickerW = logoWidth + stickerPadX * 2;
  const stickerH = logoHeight + stickerPadY * 2;
  const stickerX = canvas.width - stickerW - margin;
  const stickerY = canvas.height - stickerH - margin;
  const radius = Math.max(4, canvas.width * 0.006);

  ctx.save();
  ctx.translate(stickerX + stickerW / 2, stickerY + stickerH / 2);
  ctx.rotate(-0.052);
  ctx.translate(-(stickerX + stickerW / 2), -(stickerY + stickerH / 2));

  ctx.fillStyle = "rgba(0, 0, 0, 0.82)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = Math.max(1, canvas.width * 0.0015);
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = Math.max(6, canvas.width * 0.008);
  ctx.beginPath();
  roundRectPath(ctx, stickerX, stickerY, stickerW, stickerH, radius);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.stroke();

  ctx.drawImage(logo, stickerX + stickerPadX, stickerY + stickerPadY, logoWidth, logoHeight);
  ctx.restore();
}

function applyPixelEffect(ctx: CanvasRenderingContext2D, width: number, height: number, effect: DownloadEffect) {
  if (effect === "none" || effect === "polaroid") return;

  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    if (effect === "bw") {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = g = b = gray;
    } else if (effect === "vintage") {
      const nr = Math.min(255, r * 0.9 + g * 0.25 + b * 0.1);
      const ng = Math.min(255, r * 0.2 + g * 0.75 + b * 0.15);
      const nb = Math.min(255, r * 0.1 + g * 0.2 + b * 0.55);
      r = nr * 0.92 + 18;
      g = ng * 0.88 + 12;
      b = nb * 0.78 + 6;
    } else if (effect === "neon") {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const punch = Math.min(255, gray * 1.25);
      r = Math.min(255, punch * 0.55 + 90);
      g = Math.min(255, punch * 0.35 + 20);
      b = Math.min(255, punch * 0.85 + 70);
    } else if (effect === "contrast") {
      const factor = 1.35;
      r = Math.min(255, Math.max(0, (r - 128) * factor + 128));
      g = Math.min(255, Math.max(0, (g - 128) * factor + 128));
      b = Math.min(255, Math.max(0, (b - 128) * factor + 128));
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }

  ctx.putImageData(image, 0, 0);
}

function drawPolaroidFrame(
  ctx: CanvasRenderingContext2D,
  photo: HTMLImageElement,
  photoW: number,
  photoH: number,
  caption: string,
) {
  const side = Math.max(18, Math.round(photoW * 0.045));
  const bottom = Math.max(72, Math.round(photoW * 0.16));
  const canvasW = photoW + side * 2;
  const canvasH = photoH + side + bottom;

  const canvas = ctx.canvas;
  canvas.width = canvasW;
  canvas.height = canvasH;

  ctx.fillStyle = "#f5f5f3";
  ctx.fillRect(0, 0, canvasW, canvasH);

  ctx.fillStyle = "#111";
  ctx.fillRect(side, side, photoW, photoH);
  ctx.drawImage(photo, side, side, photoW, photoH);

  const label = (caption || "PartyHBG").slice(0, 42);
  ctx.fillStyle = "#2a2a2a";
  ctx.font = `${Math.max(16, Math.round(photoW * 0.045))}px "Courier New", ui-monospace, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, canvasW / 2, photoH + side + bottom * 0.55, canvasW - side * 2);
}

async function exportCanvas(canvas: HTMLCanvasElement, format: DownloadFormat, quality: DownloadQuality) {
  const preset = QUALITY_PRESETS[quality];
  const mime = format === "png" ? "image/png" : "image/jpeg";

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("Export failed"));
      },
      mime,
      format === "jpg" ? preset.jpeg : undefined,
    );
  });
}

async function renderPhoto(src: string, options: DownloadOptions) {
  const photo = await loadImage(src);
  const preset = QUALITY_PRESETS[options.quality];
  const scaled = fitCanvasSize(
    Math.max(1, Math.round(photo.naturalWidth * preset.scale)),
    Math.max(1, Math.round(photo.naturalHeight * preset.scale)),
  );

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  if (options.effect === "polaroid") {
    drawPolaroidFrame(ctx, photo, scaled.width, scaled.height, options.caption ?? "PartyHBG");
  } else {
    canvas.width = scaled.width;
    canvas.height = scaled.height;
    ctx.drawImage(photo, 0, 0, scaled.width, scaled.height);
    applyPixelEffect(ctx, scaled.width, scaled.height, options.effect);

    if (options.withWatermark) {
      const logo = await loadImage(LOGO_SRC);
      drawSticker(ctx, canvas, logo);
    }
  }

  return canvas;
}

export async function downloadPhoto(src: string, baseFilename: string, options: DownloadOptions) {
  const canvas = await renderPhoto(src, options);
  const blob = await exportCanvas(canvas, options.format, options.quality);
  triggerDownload(blob, outputFilename(baseFilename, options.format, options.effect));
}
