// Registers <k-card-viewer> and <k-footer-strip> and starts .k-reveal. Safe to import on the server.
import { defineCardViewer } from "./card-viewer";
import { defineFooterStrip } from "./footer-strip";
import { initReveal } from "./reveal";

export { KCardViewer, defineCardViewer } from "./card-viewer";
export { KFooterStrip, defineFooterStrip } from "./footer-strip";
export { initReveal } from "./reveal";
export * from "./card-viewer-logic";

export function defineElements() {
  if (typeof window === "undefined" || !window.customElements) return;
  defineCardViewer();
  defineFooterStrip();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => initReveal(), { once: true });
  else initReveal();
}

defineElements();
