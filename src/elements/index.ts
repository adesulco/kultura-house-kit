// Registers <k-card-viewer> and <k-footer-strip> and starts .k-reveal on import (plain HTML and
// the vendored script). Safe to import on the server. React apps use @kultura/house-kit/react,
// which registers after hydration instead.
import { defineElements } from "./define";

export { KCardViewer, defineCardViewer } from "./card-viewer";
export { KFooterStrip, defineFooterStrip } from "./footer-strip";
export { initReveal } from "./reveal";
export { defineElements } from "./define";
export * from "./card-viewer-logic";

defineElements();
