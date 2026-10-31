import {
  ecosystemLinks,
  footerStripModel,
  normaliseLang,
  parseKind,
  parseSheen,
  renderFooterStripHTML,
  renderFooterStripInner
} from "./chunk-36ZNJCDQ.js";

// src/tokens.ts
var tokens = {
  "red-500": "#EE2F42",
  "red-700": "#C81E2F",
  "red-800": "#B0182A",
  ink: "#0A0A0A",
  paper: "#FFFFFF",
  surface: "#F4F4F4",
  line: "#E6E6E6",
  muted: "#6E6E76",
  "amber-text": "#8A5A00",
  "amber-tint": "#FFF4DE",
  "amber-line": "#F2DCA8",
  green: "#0F7A3D",
  "green-tint": "#E9F8EF",
  font: '"Outfit",system-ui,sans-serif',
  mono: '"JetBrains Mono",ui-monospace,monospace',
  "radius-pill": "9999px",
  "radius-console": "8px",
  "radius-card": "12px",
  fast: "120ms",
  base: "200ms",
  slow: "320ms",
  ease: "cubic-bezier(.2,.7,.2,1)"
};
var red = {
  accent: tokens["red-500"],
  onAccent: "#FFFFFF",
  textPair: { bg: tokens["red-700"], fg: "#FFFFFF" }
};
var productPresets = {
  kultura: red,
  kult: red,
  kios: red,
  fancon: { accent: "#EFFF42", onAccent: "#0A0A0A", textPair: { bg: "#EFFF42", fg: "#0A0A0A" } },
  floorpass: { accent: "#C74416", onAccent: "#FFFFFF", textPair: { bg: "#C74416", fg: "#FFFFFF" } },
  gelar: { accent: "#141414", onAccent: "#FFF4E1", textPair: { bg: "#141414", fg: "#FFF4E1" } },
  fangir: { accent: "#002366", onAccent: "#FFFFFF", textPair: { bg: "#002366", fg: "#FFFFFF" } },
  // FanHub keeps its own tokens (DS-2).
  fanhub: null
};
var legacyColourMap = {
  "#C81E30": "red-700"
  // PSA submission site, set 16 Oct 2026
};

// src/contrast.ts
function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m || !m[1]) throw new Error(`Not a hex colour: ${hex}`);
  let h = m[1];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(a, b) {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
var AA_TEXT = 4.5;
var AA_LARGE = 3;

// src/button.ts
var BUTTON_SIZES = ["hero", "default", "compact"];
var BUTTON_VARIANTS = ["primary", "secondary", "ghost", "accent", "danger"];
var BUTTON_SHAPES = ["pill", "console"];
function buttonClass({ size = "default", variant = "primary", shape = "pill", mono = false } = {}) {
  const out = ["k-btn", `k-btn--${variant}`];
  if (size !== "default") out.push(`k-btn--${size}`);
  if (shape !== "pill") out.push(`k-btn--${shape}`);
  if (mono && size === "compact") out.push("k-btn--mono");
  return out.join(" ");
}

// src/tailwind.ts
var colourNames = [
  "red-500",
  "red-700",
  "red-800",
  "ink",
  "paper",
  "surface",
  "line",
  "muted",
  "amber-text",
  "amber-tint",
  "amber-line",
  "green",
  "green-tint",
  "accent",
  "on-accent"
];
var fontSize = (size, lineHeight, extra = {}) => [size, { lineHeight, ...extra }];
var houseKitPreset = {
  theme: {
    extend: {
      colors: {
        k: Object.fromEntries(colourNames.map((n) => [n, `var(--k-${n})`]))
      },
      fontFamily: {
        k: ["var(--k-font)"],
        "k-mono": ["var(--k-mono)"]
      },
      fontSize: {
        "k-display": fontSize("96px", "0.95", { letterSpacing: "-0.02em", fontWeight: "800" }),
        "k-display-sm": fontSize("48px", "0.95", { letterSpacing: "-0.02em", fontWeight: "800" }),
        "k-h1": fontSize("64px", "1.02", { letterSpacing: "-0.02em", fontWeight: "800" }),
        "k-h1-sm": fontSize("40px", "1.02", { letterSpacing: "-0.02em", fontWeight: "800" }),
        "k-h2": fontSize("44px", "1.05", { letterSpacing: "-0.02em", fontWeight: "700" }),
        "k-h2-sm": fontSize("32px", "1.05", { fontWeight: "700" }),
        "k-h3": fontSize("28px", "1.15", { fontWeight: "700" }),
        "k-h3-sm": fontSize("22px", "1.15", { fontWeight: "700" }),
        "k-body": fontSize("17px", "1.5"),
        "k-body-sm": fontSize("16px", "1.5"),
        "k-small": fontSize("14px", "1.45"),
        "k-label": fontSize("12px", "1.4", { letterSpacing: "0.08em", fontWeight: "500" })
      },
      borderRadius: {
        "k-pill": "var(--k-radius-pill)",
        "k-console": "var(--k-radius-console)",
        "k-card": "var(--k-radius-card)"
      },
      transitionDuration: { "k-fast": "120ms", "k-base": "200ms", "k-slow": "320ms" },
      transitionTimingFunction: { k: "cubic-bezier(.2,.7,.2,1)" },
      screens: { "k-desktop": "640px" }
    }
  }
};
var tailwind_default = houseKitPreset;

// src/card-viewer-markup.ts
var esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function img(src, alt, loading, width, height) {
  const size = `${width === void 0 ? "" : ` width="${width}"`}${height === void 0 ? "" : ` height="${height}"`}`;
  return `<img src="${esc(src)}" alt="${esc(alt)}"${size} loading="${loading}" decoding="async" draggable="false"/>`;
}
function face(side, kind, image, label) {
  const inner = kind === "slab" ? `<div class="k-cv__label">${esc(side === "front" ? label : "")}</div><div class="k-cv__window">${image}</div>` : image;
  const sheen = side === "front" ? `<span class="k-cv__sheen" aria-hidden="true"></span>` : "";
  return `<div class="k-cv__face k-cv__face--${side}">${inner}${sheen}</div>`;
}
function renderCardViewerInner(o) {
  const kind = parseKind(o.kind ?? null);
  const front = face("front", kind, img(o.src, o.alt, o.eager ? "eager" : "lazy", o.width, o.height), o.label ?? "");
  const back = o.back ? face("back", kind, img(o.back, "", "lazy"), "") : "";
  return `<div class="k-cv__stage"><div class="k-cv__card">${front}${back}</div></div>`;
}
function cardViewerHostAttributes(o) {
  const kind = parseKind(o.kind ?? null);
  const attrs = { src: o.src, alt: o.alt };
  if (o.back) attrs.back = o.back;
  attrs.kind = kind;
  if (o.sheen) attrs.sheen = o.sheen;
  if (o.label) attrs.label = o.label;
  if (o.maxTilt !== void 0) attrs["max-tilt"] = String(o.maxTilt);
  if (o.eager) attrs.eager = "";
  attrs["data-k-kind"] = kind;
  attrs["data-k-sheen"] = parseSheen(o.sheen ?? null, kind);
  attrs["data-k-side"] = "front";
  return attrs;
}
function renderCardViewerHTML(o) {
  const attrs = Object.entries(cardViewerHostAttributes(o)).map(([k, v]) => v === "" ? k : `${k}="${esc(v)}"`).join(" ");
  return `<k-card-viewer ${attrs}>${renderCardViewerInner(o)}</k-card-viewer>`;
}
export {
  AA_LARGE,
  AA_TEXT,
  BUTTON_SHAPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  buttonClass,
  cardViewerHostAttributes,
  contrastRatio,
  ecosystemLinks,
  footerStripModel,
  hexToRgb,
  tailwind_default as houseKitPreset,
  legacyColourMap,
  normaliseLang,
  productPresets,
  relativeLuminance,
  renderCardViewerHTML,
  renderCardViewerInner,
  renderFooterStripHTML,
  renderFooterStripInner,
  tokens
};
