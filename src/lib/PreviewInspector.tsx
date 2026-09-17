import { useEffect, useState } from "react";
import { isPreviewFrame, PREVIEW_CHANNEL, type PreviewToFrame } from "./previewBridge";

type Box = { top: number; left: number; width: number; height: number; label: string };

/**
 * Renders a hover outline over every [data-cz-target] region while the admin
 * customizer has select mode on, and turns a click into an "edit this" message.
 */
export function PreviewInspector() {
  const [enabled, setEnabled] = useState(true);
  const [box, setBox] = useState<Box | null>(null);

  useEffect(() => {
    if (!isPreviewFrame()) return;

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as PreviewToFrame | undefined;
      if (!data || data.channel !== PREVIEW_CHANNEL || data.action !== "selectMode") return;
      setEnabled(data.enabled);
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!isPreviewFrame() || !enabled) {
      setBox(null);
      return;
    }

    let current: HTMLElement | null = null;

    function measure(el: HTMLElement) {
      const rect = el.getBoundingClientRect();
      setBox({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        label: el.dataset.czLabel || "Redigera",
      });
    }

    function targetFrom(node: EventTarget | null) {
      return node instanceof Element
        ? node.closest<HTMLElement>("[data-cz-target]")
        : null;
    }

    function onPointerMove(e: PointerEvent) {
      const el = targetFrom(e.target);
      if (el === current) return;
      current = el;
      if (el) measure(el);
      else setBox(null);
    }

    function onClick(e: MouseEvent) {
      const el = targetFrom(e.target);
      if (!el?.dataset.czTarget) return;
      e.preventDefault();
      e.stopPropagation();
      window.parent.postMessage(
        { channel: PREVIEW_CHANNEL, action: "edit", target: el.dataset.czTarget },
        window.location.origin,
      );
    }

    function onReposition() {
      if (current?.isConnected) measure(current);
      else {
        current = null;
        setBox(null);
      }
    }

    function onLeave() {
      current = null;
      setBox(null);
    }

    document.addEventListener("pointermove", onPointerMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    document.documentElement.classList.add("cz-inspect");

    return () => {
      document.removeEventListener("pointermove", onPointerMove, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
      document.documentElement.classList.remove("cz-inspect");
    };
  }, [enabled]);

  if (!box) return null;

  return (
    <div
      className="cz-hover"
      aria-hidden="true"
      style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
    >
      <span className="cz-hover-label">{box.label}</span>
    </div>
  );
}
