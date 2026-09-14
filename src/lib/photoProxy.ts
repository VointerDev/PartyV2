export function isSameOriginUrl(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  if (src.startsWith("data:") || src.startsWith("blob:")) return true;

  try {
    return new URL(src, window.location.origin).origin === window.location.origin;
  } catch {
    return false;
  }
}

/** Same-origin URL so canvas export works for external flashback photos. */
export function proxiedPhotoUrl(src: string): string {
  if (isSameOriginUrl(src)) return src;
  return `/__photo?url=${encodeURIComponent(src)}`;
}
