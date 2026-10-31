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

export {
  ecosystemLinks,
  normaliseLang,
  footerStripModel,
  renderFooterStripInner,
  renderFooterStripHTML
};
