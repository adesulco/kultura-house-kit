var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

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

// src/elements/card-viewer-logic.ts
var DEFAULT_MAX_TILT = 8;
var TILT_CEILING = 20;
var clamp = (n, min, max) => Math.min(Math.max(n, min), max);
function parseKind(value) {
  return value === "slab" ? "slab" : "card";
}
function parseSheen(value, kind) {
  if (value === "none" || value === "holo" || value === "foil") return value;
  return kind === "slab" ? "none" : "holo";
}
function parseMaxTilt(value) {
  if (value === null || value.trim() === "") return DEFAULT_MAX_TILT;
  const n = Number(value);
  if (!Number.isFinite(n)) return DEFAULT_MAX_TILT;
  return clamp(n, 0, TILT_CEILING);
}
function tiltFromPointer(x, y, rect, maxTilt) {
  if (rect.width <= 0 || rect.height <= 0) return { rx: 0, ry: 0 };
  const nx = clamp((x - rect.left) / rect.width * 2 - 1, -1, 1);
  const ny = clamp((y - rect.top) / rect.height * 2 - 1, -1, 1);
  return { rx: round(-ny * maxTilt), ry: round(nx * maxTilt) };
}
function tiltFromOrientation(beta, gamma, baseBeta, maxTilt) {
  const span = 20;
  return {
    rx: round(clamp(-((beta - baseBeta) / span) * maxTilt, -maxTilt, maxTilt)),
    ry: round(clamp(gamma / span * maxTilt, -maxTilt, maxTilt))
  };
}
function sheenFromTilt({ rx, ry }, maxTilt) {
  const m = maxTilt || 1;
  return { angle: round(115 + ry / m * 30), x: round(50 + ry / m * 40), y: round(50 - rx / m * 40) };
}
function ariaLabelFor(alt, side) {
  return `${alt} (${side === "front" ? "depan" : "belakang"})`;
}
function round(n) {
  const r = Math.round(n * 100) / 100;
  return Object.is(r, -0) ? 0 : r;
}

export {
  __publicField,
  ecosystemLinks,
  normaliseLang,
  footerStripModel,
  renderFooterStripInner,
  renderFooterStripHTML,
  DEFAULT_MAX_TILT,
  TILT_CEILING,
  clamp,
  parseKind,
  parseSheen,
  parseMaxTilt,
  tiltFromPointer,
  tiltFromOrientation,
  sheenFromTilt,
  ariaLabelFor
};
