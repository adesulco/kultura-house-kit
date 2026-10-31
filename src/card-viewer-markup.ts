// Server markup for <k-card-viewer>: the same stage the element builds, so a server-rendered
// page shows the card before any script runs and the element adopts it instead of rebuilding.
import { parseKind, parseSheen, type CardKind, type Sheen } from "./elements/card-viewer-logic";

export interface CardViewerMarkupOptions {
  src: string;
  alt: string;
  back?: string;
  kind?: CardKind;
  sheen?: Sheen;
  maxTilt?: number;
  eager?: boolean;
  /** Slab label text (kind="slab"). */
  label?: string;
  width?: number;
  height?: number;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function img(src: string, alt: string, loading: "eager" | "lazy", width?: number, height?: number): string {
  const size = `${width === undefined ? "" : ` width="${width}"`}${height === undefined ? "" : ` height="${height}"`}`;
  return `<img src="${esc(src)}" alt="${esc(alt)}"${size} loading="${loading}" decoding="async" draggable="false"/>`;
}

function face(side: "front" | "back", kind: CardKind, image: string, label: string): string {
  const inner = kind === "slab"
    ? `<div class="k-cv__label">${esc(side === "front" ? label : "")}</div><div class="k-cv__window">${image}</div>`
    : image;
  const sheen = side === "front" ? `<span class="k-cv__sheen" aria-hidden="true"></span>` : "";
  return `<div class="k-cv__face k-cv__face--${side}">${inner}${sheen}</div>`;
}

/** Inner HTML of the element: stage, card, front face and (with a back) the back face. */
export function renderCardViewerInner(o: CardViewerMarkupOptions): string {
  const kind = parseKind(o.kind ?? null);
  const front = face("front", kind, img(o.src, o.alt, o.eager ? "eager" : "lazy", o.width, o.height), o.label ?? "");
  const back = o.back ? face("back", kind, img(o.back, "", "lazy"), "") : "";
  return `<div class="k-cv__stage"><div class="k-cv__card">${front}${back}</div></div>`;
}

/** Host attributes the element would set itself, so upgrading changes nothing visible. */
export function cardViewerHostAttributes(o: CardViewerMarkupOptions): Record<string, string> {
  const kind = parseKind(o.kind ?? null);
  const attrs: Record<string, string> = { src: o.src, alt: o.alt };
  if (o.back) attrs.back = o.back;
  attrs.kind = kind;
  if (o.sheen) attrs.sheen = o.sheen;
  if (o.label) attrs.label = o.label;
  if (o.maxTilt !== undefined) attrs["max-tilt"] = String(o.maxTilt);
  if (o.eager) attrs.eager = "";
  attrs["data-k-kind"] = kind;
  attrs["data-k-sheen"] = parseSheen(o.sheen ?? null, kind);
  attrs["data-k-side"] = "front";
  return attrs;
}

/** The whole element as an HTML string, for templates that cannot run React. */
export function renderCardViewerHTML(o: CardViewerMarkupOptions): string {
  const attrs = Object.entries(cardViewerHostAttributes(o))
    .map(([k, v]) => (v === "" ? k : `${k}="${esc(v)}"`))
    .join(" ");
  return `<k-card-viewer ${attrs}>${renderCardViewerInner(o)}</k-card-viewer>`;
}
