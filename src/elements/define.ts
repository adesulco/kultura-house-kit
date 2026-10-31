// defineElements() with no side effect on import. The React wrapper calls it after hydration.
import { defineCardViewer } from "./card-viewer";
import { defineFooterStrip } from "./footer-strip";
import { initReveal } from "./reveal";

export function defineElements() {
  if (typeof window === "undefined" || !window.customElements) return;
  defineCardViewer();
  defineFooterStrip();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => initReveal(), { once: true });
  else initReveal();
}
