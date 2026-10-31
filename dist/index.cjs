"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AA_LARGE: () => AA_LARGE,
  AA_TEXT: () => AA_TEXT,
  BUTTON_SHAPES: () => BUTTON_SHAPES,
  BUTTON_SIZES: () => BUTTON_SIZES,
  BUTTON_VARIANTS: () => BUTTON_VARIANTS,
  buttonClass: () => buttonClass,
  cardViewerHostAttributes: () => cardViewerHostAttributes,
  contrastRatio: () => contrastRatio,
  ecosystemLinks: () => ecosystemLinks,
  footerStripModel: () => footerStripModel,
  hexToRgb: () => hexToRgb,
  houseKitPreset: () => tailwind_default,
  legacyColourMap: () => legacyColourMap,
  normaliseLang: () => normaliseLang,
  productPresets: () => productPresets,
  relativeLuminance: () => relativeLuminance,
  renderCardViewerHTML: () => renderCardViewerHTML,
  renderCardViewerInner: () => renderCardViewerInner,
  renderFooterStripHTML: () => renderFooterStripHTML,
  renderFooterStripInner: () => renderFooterStripInner,
  tokens: () => tokens
});
module.exports = __toCommonJS(src_exports);

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

// src/ecosystem.json
var ecosystem_default = [
  { key: "kult", label: "KULT", href: "https://kult.co.id" },
  { key: "kios", label: "kioskultura.com", href: "https://kioskultura.com" },
  { key: "fangir", label: "FanGir", href: "https://fangir.com" },
  { key: "fancon", label: "FanCon", href: "https://fancon.co.id" },
  { key: "floorpass", label: "FloorPass", href: "https://floorpass.co" },
  { key: "gelar", label: "Gelar", href: "https://gelar.co" },
  { key: "fanhub", label: "fanhub.", href: "https://fanhub.id" },
  { key: "kultura", label: "Kultura", href: "https://kultura.co.id" }
];

// src/footer-model.ts
var ecosystemLinks = ecosystem_default;
var COPY = {
  id: { line: "Bagian dari ekosistem Kultura", navLabel: "Ekosistem Kultura" },
  en: { line: "Part of the Kultura ecosystem", navLabel: "Kultura ecosystem" }
};
function normaliseLang(lang) {
  return lang && lang.toLowerCase().startsWith("en") ? "en" : "id";
}
function footerStripModel(opts = {}) {
  const lang = normaliseLang(opts.lang);
  const current = opts.current?.trim().toLowerCase() || null;
  const entity = opts.entity?.trim() || null;
  return {
    lang,
    line: COPY[lang].line,
    navLabel: COPY[lang].navLabel,
    links: ecosystemLinks.filter((l) => l.key !== current),
    entity
  };
}
var escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
function renderFooterStripInner(model) {
  const links = model.links.map((l) => `<li><a class="k-footer-strip__link" href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`).join("");
  const entity = model.entity ? `<p class="k-footer-strip__entity">${escapeHtml(model.entity)}</p>` : "";
  return `<div class="k-footer-strip__inner"><p class="k-footer-strip__line">${escapeHtml(model.line)}</p><nav class="k-footer-strip__nav" aria-label="${escapeHtml(model.navLabel)}"><ul class="k-footer-strip__links">${links}</ul></nav>` + entity + `</div>`;
}
function renderFooterStripHTML(opts = {}) {
  const model = footerStripModel(opts);
  const attrs = [
    `lang="${model.lang}"`,
    opts.current ? `current="${escapeHtml(opts.current)}"` : "",
    model.entity ? `entity="${escapeHtml(model.entity)}"` : ""
  ].filter(Boolean).join(" ");
  return `<k-footer-strip class="k-footer-strip" ${attrs}>${renderFooterStripInner(model)}</k-footer-strip>`;
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

// src/elements/card-viewer-logic.ts
function parseKind(value) {
  return value === "slab" ? "slab" : "card";
}
function parseSheen(value, kind) {
  if (value === "none" || value === "holo" || value === "foil") return value;
  return kind === "slab" ? "none" : "holo";
}

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
  houseKitPreset,
  legacyColourMap,
  normaliseLang,
  productPresets,
  relativeLuminance,
  renderCardViewerHTML,
  renderCardViewerInner,
  renderFooterStripHTML,
  renderFooterStripInner,
  tokens
});
