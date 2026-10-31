// One model for the footer strip, shared by the custom element, the React wrapper
// and the HTML string renderer (for Vue/Nuxt or vendored use).
import ecosystem from "./ecosystem.json";

export interface EcosystemLink {
  key: string;
  label: string;
  href: string;
}

export interface FooterStripOptions {
  /** Key of the product rendering the strip; its own link is hidden. */
  current?: string | null;
  /** Legal entity line, e.g. "PT Kultura Digital Kreasi, Jakarta". */
  entity?: string | null;
  /** "id" (default) or "en". */
  lang?: string | null;
}

export interface FooterStripModel {
  lang: "id" | "en";
  line: string;
  navLabel: string;
  links: EcosystemLink[];
  entity: string | null;
}

export const ecosystemLinks: readonly EcosystemLink[] = ecosystem;

const COPY = {
  id: { line: "Bagian dari ekosistem Kultura", navLabel: "Ekosistem Kultura" },
  en: { line: "Part of the Kultura ecosystem", navLabel: "Kultura ecosystem" },
} as const;

export function normaliseLang(lang: string | null | undefined): "id" | "en" {
  return lang && lang.toLowerCase().startsWith("en") ? "en" : "id";
}

export function footerStripModel(opts: FooterStripOptions = {}): FooterStripModel {
  const lang = normaliseLang(opts.lang);
  const current = opts.current?.trim().toLowerCase() || null;
  const entity = opts.entity?.trim() || null;
  return {
    lang,
    line: COPY[lang].line,
    navLabel: COPY[lang].navLabel,
    links: ecosystemLinks.filter((l) => l.key !== current),
    entity,
  };
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Inner markup of the strip. Used by the element and by server renderers outside React. */
export function renderFooterStripInner(model: FooterStripModel): string {
  const links = model.links
    .map((l) => `<li><a class="k-footer-strip__link" href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`)
    .join("");
  const entity = model.entity ? `<p class="k-footer-strip__entity">${escapeHtml(model.entity)}</p>` : "";
  return (
    `<div class="k-footer-strip__inner">` +
    `<p class="k-footer-strip__line">${escapeHtml(model.line)}</p>` +
    `<nav class="k-footer-strip__nav" aria-label="${escapeHtml(model.navLabel)}"><ul class="k-footer-strip__links">${links}</ul></nav>` +
    entity +
    `</div>`
  );
}

/** Full element markup, ready for server rendering. */
export function renderFooterStripHTML(opts: FooterStripOptions = {}): string {
  const model = footerStripModel(opts);
  const attrs = [
    `lang="${model.lang}"`,
    opts.current ? `current="${escapeHtml(opts.current)}"` : "",
    model.entity ? `entity="${escapeHtml(model.entity)}"` : "",
  ].filter(Boolean).join(" ");
  return `<k-footer-strip class="k-footer-strip" ${attrs}>${renderFooterStripInner(model)}</k-footer-strip>`;
}
