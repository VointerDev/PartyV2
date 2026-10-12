import type { CmsState } from "../admin/cmsStore";

const PUBLISH_TOKEN_KEY = "partyhbg_admin_publish_token";

export function setPublishToken(token: string) {
  sessionStorage.setItem(PUBLISH_TOKEN_KEY, token);
}

export function clearPublishToken() {
  sessionStorage.removeItem(PUBLISH_TOKEN_KEY);
}

export function getPublishToken() {
  return (
    sessionStorage.getItem(PUBLISH_TOKEN_KEY) ||
    (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ||
    ""
  );
}

export async function fetchPublishedCms(): Promise<CmsState | null> {
  try {
    const response = await fetch("/api/cms", {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (response.status === 404) return null;
    if (!response.ok) return null;
    return (await response.json()) as CmsState;
  } catch {
    return null;
  }
}

export async function publishCmsRemote(state: CmsState): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = getPublishToken();
  if (!token) {
    return { ok: false, error: "Saknar publiceringstoken. Logga in igen." };
  }

  try {
    const response = await fetch("/api/cms", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(state),
    });

    if (response.ok) return { ok: true };

    let message = `Kunde inte publicera (${response.status}).`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore
    }

    if (response.status === 503 || /GITHUB_TOKEN/i.test(message)) {
      message =
        "Live-publicering är inte konfigurerad. Lägg till GITHUB_TOKEN på Vercel.";
    }

    return { ok: false, error: message };
  } catch {
    return {
      ok: false,
      error: "Kunde inte nå publicerings-API:t. Kör Vercel/production för live-publicering.",
    };
  }
}
