// Finds arrow glyphs in text (house rule from v0.1.4: no arrow glyphs on any Kultura site).
// Covers the characters themselves, HTML entities, percent-encoding, and CSS, JS and HTML
// numeric escapes, plus classes, ids and icon components named after an arrow.
// Code points are written as numbers so this file passes its own sweep.
// Chevrons used as arrows count (Ade, 19 November 2026). Small triangles (U+25B6 and its
// family) do not: they mark controls that open or sort.
// Not detected: an arrow drawn as an unnamed SVG path or inside an image, and ASCII
// stand-ins such as a hyphen followed by a greater-than sign. Review covers those.

/** Inclusive code point ranges that count as an arrow glyph. */
const ARROW_RANGES: readonly (readonly [number, number])[] = [
  [0x2190, 0x21ff], // Arrows
  [0x2794, 0x2794], // Dingbat arrows, without the heavy plus, minus, division and loop
  [0x2798, 0x27af],
  [0x27b1, 0x27be],
  [0x27f0, 0x27ff], // Supplemental Arrows-A
  [0x2900, 0x297f], // Supplemental Arrows-B
  [0x2b00, 0x2b11], // Miscellaneous Symbols and Arrows: the arrows, not the shapes and stars
  [0x2b30, 0x2b4c],
  [0x2b60, 0x2bb7],
  [0xffe9, 0xffec], // Halfwidth arrows
  [0x1f519, 0x1f51d], // Words with an arrow (back, end, on, soon, top)
  [0x1f800, 0x1f8ff], // Supplemental Arrows-C
  [0x2039, 0x203a], // Single angle quotes, used as chevrons
  [0x00ab, 0x00ab], // Double angle quotes, used as chevrons
  [0x00bb, 0x00bb],
  [0x276c, 0x2771], // Angle bracket ornaments, used as chevrons
];

export const isArrowCodePoint = (cp: number): boolean => ARROW_RANGES.some(([from, to]) => cp >= from && cp <= to);

const hex = (cp: number) => `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`;

// Named entities: every "...arr..." and "...arrow..." name (rarr, larr, rArr, crarr and so
// on), the other names of an arrow, and the angle quotes, which browsers also read with no
// closing semicolon.
const NAMED_ENTITY = /&(?:[a-z]*arr[a-z]*|[a-z]*arrow[a-z]*|to|gets|implies|iff|map|mapsto[a-z]*|[lr]har[ud][a-z]*|[ud]har[lr]|[lr]saquo);|&[lr]aquo;?/gi;
// Numeric forms: JS braces, JS four digits, JS two digits, HTML hex, HTML decimal.
const NUMERIC_ESCAPE = /\\u\{([0-9a-f]{1,6})\}|\\u([0-9a-f]{4})|\\x([0-9a-f]{2})|&#x([0-9a-f]{1,6});?|&#([0-9]{1,7});?/gi;
// A CSS escape is a backslash and one to six hex digits, and ends at the first other
// character. Stylesheets and markup take any length from two digits. Other files take four
// to six, so a regex word boundary followed by two hex letters is not read as an escape.
const CSS_ESCAPE = /\\([0-9a-f]{2,6})/gi;
const CSS_ESCAPE_IN_CODE = /\\([0-9a-f]{4,6})(?![0-9a-f])/gi;
// U+2190 to U+21FF as UTF-8 in a URL or data URI.
const PERCENT_ENCODED = /%E2%8[67]%[89AB][0-9A-F]/gi;

export interface ArrowFinding {
  line: number;
  what: string;
}

export interface FindOptions {
  /** True for stylesheets, HTML and SVG, where a short CSS escape is read as one. */
  stylesheet?: boolean;
}

/** Every arrow glyph in `text`, with its 1-based line. Empty when the text is clean. */
export function findArrowGlyphs(text: string, opts: FindOptions = {}): ArrowFinding[] {
  const findings: ArrowFinding[] = [];
  text.split("\n").forEach((content, i) => {
    const line = i + 1;
    for (const ch of content) {
      const cp = ch.codePointAt(0) ?? 0;
      if (isArrowCodePoint(cp)) findings.push({ line, what: `character ${hex(cp)}` });
    }
    for (const m of content.matchAll(NAMED_ENTITY)) findings.push({ line, what: `entity ${m[0]}` });
    for (const m of content.matchAll(PERCENT_ENCODED)) findings.push({ line, what: `percent-encoded ${m[0]}` });
    for (const m of content.matchAll(NUMERIC_ESCAPE)) {
      const cp = m[5] ? Number.parseInt(m[5], 10) : Number.parseInt(m[1] ?? m[2] ?? m[3] ?? m[4] ?? "", 16);
      if (isArrowCodePoint(cp)) findings.push({ line, what: `escape ${m[0]} (${hex(cp)})` });
    }
    for (const m of content.matchAll(opts.stylesheet ? CSS_ESCAPE : CSS_ESCAPE_IN_CODE)) {
      // The JS forms above already report a backslash that is followed by u or x.
      const cp = Number.parseInt(m[1] ?? "", 16);
      if (isArrowCodePoint(cp)) findings.push({ line, what: `escape ${m[0]} (${hex(cp)})` });
    }
  });
  return findings;
}

// A drawn arrow arrives under a name. Four shapes of name are read:
// a word part joined by a hyphen or underscore (k-btn__arrow, icon-chevron-right),
// a bare selector (.arrow, #chevron), a class or id attribute that holds the word,
// and an icon component (ChevronRight, ArrowUpRight, ArrowIcon).
// Words that only contain the letters (narrow) and the keyboard key names
// (ArrowLeft, ArrowRight, ArrowUp, ArrowDown) are left alone.
const WORD = "(?:arrow|chevron)s?(?:head)?";
const NAME_PATTERNS: readonly RegExp[] = [
  new RegExp(`[\\w-]*(?<![A-Za-z])${WORD}[-_][\\w-]*|[\\w-]*[-_]${WORD}(?![A-Za-z])[\\w-]*`, "g"),
  new RegExp(`[.#]${WORD}(?![\\w-])`, "g"),
  new RegExp(`\\b(?:class|className|id)=["'{\`][^"'}\`]*\\b${WORD}\\b`, "g"),
  /\bChevron[A-Z]\w*|\bArrow(?!(?:Left|Right|Up|Down)\b)[A-Z]\w*|\b\w*(?:Arrow|Chevron)s?Icon\b/g,
];

/** Classes, ids and icon components named after an arrow. */
export function findArrowNames(text: string): ArrowFinding[] {
  const findings: ArrowFinding[] = [];
  text.split("\n").forEach((content, i) => {
    const seen = new Set<string>();
    for (const re of NAME_PATTERNS) {
      for (const m of content.matchAll(re)) {
        if (seen.has(m[0])) continue;
        seen.add(m[0]);
        findings.push({ line: i + 1, what: `name ${m[0]}` });
      }
    }
  });
  return findings;
}
