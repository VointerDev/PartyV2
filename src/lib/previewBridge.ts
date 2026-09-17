import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setPreviewState, type CmsState } from "../admin/cmsStore";

export const PREVIEW_CHANNEL = "partyhbg-preview";

export type PreviewToFrame =
  | { channel: typeof PREVIEW_CHANNEL; action: "state"; state: CmsState }
  | { channel: typeof PREVIEW_CHANNEL; action: "navigate"; path: string }
  | { channel: typeof PREVIEW_CHANNEL; action: "scroll"; selector: string }
  | { channel: typeof PREVIEW_CHANNEL; action: "selectMode"; enabled: boolean };

export type PreviewToParent =
  | { channel: typeof PREVIEW_CHANNEL; action: "ready" }
  | { channel: typeof PREVIEW_CHANNEL; action: "route"; path: string }
  | { channel: typeof PREVIEW_CHANNEL; action: "edit"; target: string };

/** Marks a region of the site as clickable-to-edit inside the admin preview frame. */
export function editable(target: string, label: string) {
  return { "data-cz-target": target, "data-cz-label": label };
}

export function isPreviewFrame() {
  return typeof window !== "undefined" && window.parent !== window;
}

function toParent(message: PreviewToParent) {
  window.parent.postMessage(message, window.location.origin);
}

export function useCmsPreviewBridge() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isPreviewFrame()) return;

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as PreviewToFrame | undefined;
      if (!data || data.channel !== PREVIEW_CHANNEL) return;

      if (data.action === "state") {
        setPreviewState(data.state);
      } else if (data.action === "navigate") {
        if (data.path !== window.location.pathname) navigate(data.path);
      } else if (data.action === "scroll") {
        document
          .querySelector(data.selector)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    window.addEventListener("message", onMessage);
    document.documentElement.classList.add("is-preview-frame");
    toParent({ channel: PREVIEW_CHANNEL, action: "ready" });

    return () => {
      window.removeEventListener("message", onMessage);
      document.documentElement.classList.remove("is-preview-frame");
    };
  }, [navigate]);

  useEffect(() => {
    if (!isPreviewFrame()) return;
    toParent({ channel: PREVIEW_CHANNEL, action: "route", path: location.pathname });
  }, [location.pathname]);
}
