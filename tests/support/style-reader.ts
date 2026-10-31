// A small style reader: resolves the declared styles of an element from a stylesheet
// (cascade by specificity and order, custom property inheritance, var() fallbacks).
// jsdom does not compute cascaded styles or custom properties, so the button tests use this.
import postcss, { type Rule } from "postcss";

interface Decl { prop: string; value: string; spec: number; order: number; important: boolean }
interface ParsedRule { selectors: string[]; decls: { prop: string; value: string; important: boolean }[]; media: string | null; order: number }

export interface ReaderOptions { desktop?: boolean; reducedMotion?: boolean }

export function specificity(selector: string): number {
  let s = selector.replace(/::?(before|after|placeholder|marker)/g, "");
  s = s.replace(/:where\([^)]*\)/g, "");
  let a = 0, b = 0, c = 0;
  s = s.replace(/:(not|is)\(([^)]*)\)/g, (_m, _k, inner: string) => {
    const sp = specificity(inner);
    a += Math.floor(sp / 10000); b += Math.floor((sp % 10000) / 100); c += sp % 100;
    return "";
  });
  a += (s.match(/#[\w-]+/g) ?? []).length;
  b += (s.match(/\.[\w-]+/g) ?? []).length + (s.match(/\[[^\]]+\]/g) ?? []).length + (s.match(/:(?!:)[\w-]+(\([^)]*\))?/g) ?? []).length;
  c += (s.replace(/\[[^\]]+\]/g, "").match(/(^|[\s>+~(])[a-z][\w-]*/gi) ?? []).length;
  return a * 10000 + b * 100 + c;
}

export function parseSheet(css: string): ParsedRule[] {
  const out: ParsedRule[] = [];
  let order = 0;
  postcss.parse(css).walkRules((rule: Rule) => {
    const parent = rule.parent;
    const media = parent && parent.type === "atrule" && (parent as postcss.AtRule).name === "media" ? (parent as postcss.AtRule).params : null;
    const decls: ParsedRule["decls"] = [];
    rule.walkDecls((d) => { decls.push({ prop: d.prop, value: d.value, important: d.important }); });
    out.push({ selectors: rule.selectors, decls, media, order: order++ });
  });
  return out;
}

function mediaApplies(media: string | null, opts: ReaderOptions): boolean {
  if (!media) return true;
  if (/min-width:\s*640px/.test(media)) return !!opts.desktop;
  if (/prefers-reduced-motion:\s*reduce/.test(media)) return !!opts.reducedMotion;
  return false;
}

function safeMatches(el: Element, selector: string): boolean {
  if (/:(hover|active|focus|focus-visible|defined)\b/.test(selector)) return false;
  try { return el.matches(selector); } catch { return false; }
}

function declared(el: Element, rules: ParsedRule[], opts: ReaderOptions): Map<string, Decl> {
  const winners = new Map<string, Decl>();
  for (const r of rules) {
    if (!mediaApplies(r.media, opts)) continue;
    let best = -1;
    for (const sel of r.selectors) if (safeMatches(el, sel)) best = Math.max(best, specificity(sel));
    if (best < 0) continue;
    for (const d of r.decls) {
      const prev = winners.get(d.prop);
      const cand: Decl = { prop: d.prop, value: d.value, spec: best, order: r.order, important: d.important };
      if (!prev || (cand.important && !prev.important) || (cand.important === prev.important && (cand.spec > prev.spec || (cand.spec === prev.spec && cand.order >= prev.order)))) {
        winners.set(d.prop, cand);
      }
    }
  }
  return winners;
}

export function readStyles(el: Element, css: string, opts: ReaderOptions = {}) {
  const rules = parseSheet(css);
  const chain: Element[] = [];
  for (let n: Element | null = el; n; n = n.parentElement) chain.unshift(n);
  const vars = new Map<string, string>();
  let own = new Map<string, Decl>();
  for (const node of chain) {
    own = declared(node, rules, opts);
    for (const [prop, d] of own) if (prop.startsWith("--")) vars.set(prop, d.value);
  }
  const resolve = (value: string, depth = 0): string => {
    if (depth > 10) return value;
    return value.replace(/var\((--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, (_m, name: string, fallback?: string) => {
      const v = vars.get(name);
      return resolve(v !== undefined ? v : (fallback ?? "").trim(), depth + 1);
    });
  };
  return (prop: string): string | undefined => {
    const d = own.get(prop);
    return d ? resolve(d.value).trim() : undefined;
  };
}
