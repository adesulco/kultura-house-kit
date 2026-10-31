import {
  houseKitPreset
} from "./chunk-RBEHMU77.js";
import {
  ecosystemLinks,
  footerStripModel,
  normaliseLang,
  renderFooterStripHTML,
  renderFooterStripInner
} from "./chunk-KBEUQRKC.js";
import "./chunk-PKBMQBKP.js";

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
export {
  AA_LARGE,
  AA_TEXT,
  BUTTON_SHAPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  buttonClass,
  contrastRatio,
  ecosystemLinks,
  footerStripModel,
  hexToRgb,
  houseKitPreset,
  legacyColourMap,
  normaliseLang,
  productPresets,
  relativeLuminance,
  renderFooterStripHTML,
  renderFooterStripInner,
  tokens
};
