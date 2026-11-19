// House rule from v0.1.4 (Ade, D10, 19 November 2026): no arrow glyphs on any Kultura site.
// A link that leaves a site says where it goes in words.
// This sweep reads every tracked text file, the built files in dist/ included, and fails
// when an arrow comes back as a character, an entity or an escape, or as a class, id or
// icon component named after an arrow, which is how a drawn one arrives.
// Not detected: an arrow drawn as an unnamed SVG path or inside an image.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import ecosystem from "../src/ecosystem.json";
import { renderFooterStripHTML } from "../src/footer-model";
import { findArrowGlyphs, findArrowNames } from "./support/arrow-glyphs";

const SKIP = [/^pnpm-lock\.yaml$/, /\.(png|jpe?g|webp|avif|ico|woff2?)$/i];
const STYLESHEETS = /\.(css|html?|svg)$/i;
const NAMED_FILES = /\.(css|html?|svg|[cm]?[jt]sx?|json)$/i;
// The sweep's own two files name arrows on purpose.
const NAME_EXEMPT = ["tests/no-arrows.test.ts", "tests/support/arrow-glyphs.ts"];

const trackedFiles = () =>
  execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
    .split("\n")
    .filter((f) => f && !SKIP.some((re) => re.test(f)));

const cp = (n: number) => String.fromCodePoint(n);

describe("arrow glyph finder", () => {
  it("finds the characters", () => {
    for (const n of [0x2190, 0x2192, 0x2197, 0x21d2, 0x2794, 0x279c, 0x27a1, 0x27f6, 0x2b05, 0x2b0e, 0x2b62, 0xffeb, 0x1f51c, 0x1f862, 0x203a, 0x00bb, 0x276f]) {
      expect(findArrowGlyphs(`Lihat semua ${cp(n)}`), `U+${n.toString(16)}`).toHaveLength(1);
    }
  });

  it("leaves the heavy plus, minus, division and loop alone", () => {
    for (const n of [0x2795, 0x2796, 0x2797, 0x27b0]) expect(findArrowGlyphs(cp(n)), `U+${n.toString(16)}`).toEqual([]);
  });

  it("finds HTML entities", () => {
    for (const name of ["rarr", "larr", "uarr", "darr", "rArr", "nearr", "rightarrow", "to", "gets", "implies", "iff", "mapsto", "rharu", "rsaquo", "raquo"]) {
      expect(findArrowGlyphs(`<a href="/x">Tiket &${name};</a>`), name).toHaveLength(1);
    }
    expect(findArrowGlyphs("&#" + "8594;")).toHaveLength(1);
    expect(findArrowGlyphs("&#" + "x2192;")).toHaveLength(1);
  });

  it("finds entities written with no closing semicolon", () => {
    expect(findArrowGlyphs("Tiket &" + "raquo</a>")).toHaveLength(1);
    expect(findArrowGlyphs("Tiket &#" + "8594</a>")).toHaveLength(1);
    expect(findArrowGlyphs("Tiket &#" + "x2192</a>")).toHaveLength(1);
  });

  it("finds a percent-encoded arrow", () => {
    expect(findArrowGlyphs("url(\"data:image/svg+xml,%3Ctext%3E%E2" + "%86%92%3C/text%3E\")")).toHaveLength(1);
  });

  it("finds CSS and JS escapes", () => {
    const slash = "\\";
    expect(findArrowGlyphs(`.more::after{content:"${slash}2192"}`, { stylesheet: true })).toHaveLength(1);
    expect(findArrowGlyphs(`.more::after{content:"${slash}002192 "}`, { stylesheet: true })).toHaveLength(1);
    expect(findArrowGlyphs(`.more::after{content:"${slash}2192next"}`, { stylesheet: true })).toHaveLength(1);
    expect(findArrowGlyphs(`.more::after{content:"${slash}bb"}`, { stylesheet: true })).toHaveLength(1);
    expect(findArrowGlyphs(`const css = ".more::after{content:'${slash}${slash}2192next'}";`)).toHaveLength(1);
    expect(findArrowGlyphs(`const label = "Tiket ${slash}u2192";`)).toHaveLength(1);
    expect(findArrowGlyphs(`const label = "Tiket ${slash}u{2192}";`)).toHaveLength(1);
    expect(findArrowGlyphs(`const label = "Tiket ${slash}xBB";`)).toHaveLength(1);
  });

  it("reports the line", () => {
    expect(findArrowGlyphs(`satu\ndua ${cp(0x2192)}\ntiga`)).toEqual([{ line: 2, what: "character U+2192" }]);
  });

  it("leaves ordinary text and code alone", () => {
    const clean = [
      "Daftar di gelar.co",
      "FanCon 26 · Gem mint 10",
      "const f = (a: number) => a + 1; if (a >= 2 && b <= 3) {}",
      "content:\"\\201C\"; /\\bbutton\\d+/ /\\bb\\b/ &amp; &middot; &#39; &#183; &copy; &tot; ?a=1&to=2",
      "transition:transform var(--k-fast)",
    ].join("\n");
    expect(findArrowGlyphs(clean)).toEqual([]);
  });

  it("finds a class, id or icon component named after an arrow", () => {
    for (const named of [
      '<span class="k-btn__arrow"></span>',
      ".icon-chevron-right{display:block}",
      ".arrow{display:block}",
      '<svg id="chevron">',
      '<i className="icon arrow" />',
      'import { ChevronRight } from "icons";',
      "<ArrowUpRight />",
      "<ArrowIcon />",
      "marker-end:url(#arrowhead)",
    ]) {
      expect(findArrowNames(named), named).toHaveLength(1);
    }
  });

  it("leaves words that only contain the letters, and the keyboard keys, alone", () => {
    const clean = [
      ".k-container--narrow{max-width:640px} /* narrow screens */",
      "font-stretch:semi-narrow",
      'if (e.key === "ArrowRight" || e.key === "ArrowLeft") flip();',
      "<p>No arrow glyphs on any site.</p>",
      ".k-btn__icon{order:1}",
    ].join("\n");
    expect(findArrowNames(clean)).toEqual([]);
  });
});

describe("no arrow glyphs in the kit", () => {
  const files = trackedFiles();

  it("reads the sources, the examples and the built files", () => {
    for (const f of ["README.md", "examples/index.html", "src/css/buttons.css", "src/footer-model.ts", "react/index.tsx", "dist/base.css", "dist/kultura-house-kit.js"]) {
      expect(files).toContain(f);
    }
  });

  it("has none in any tracked text file", () => {
    const problems: string[] = [];
    for (const file of files) {
      let text: string;
      try {
        text = readFileSync(file, "utf8");
      } catch {
        continue;
      }
      const named = NAMED_FILES.test(file) && !NAME_EXEMPT.includes(file);
      const found = [...findArrowGlyphs(text, { stylesheet: STYLESHEETS.test(file) }), ...(named ? findArrowNames(text) : [])];
      for (const f of found) problems.push(`${file}:${f.line}: ${f.what}`);
    }
    expect(problems).toEqual([]);
  });

  it("has none in the rendered footer strip, in either language", () => {
    for (const lang of ["id", "en"]) {
      for (const current of [null, ...ecosystem.map((l) => l.key)]) {
        const html = renderFooterStripHTML({ lang, current, entity: "PT Kultura Digital Kreasi, Jakarta" });
        expect(findArrowGlyphs(html)).toEqual([]);
        expect(findArrowNames(html)).toEqual([]);
      }
    }
  });

  it("keeps the strip's link labels to words", () => {
    for (const l of ecosystem) expect(l.label, l.key).toMatch(/^[\p{L}\p{N}][\p{L}\p{N} .&-]*$/u);
  });
});
