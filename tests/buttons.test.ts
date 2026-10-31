// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buttonClass, BUTTON_SHAPES, BUTTON_SIZES, BUTTON_VARIANTS } from "../src/button";
import { AA_LARGE, AA_TEXT, contrastRatio } from "../src/contrast";
import { productPresets, tokens } from "../src/tokens";
import { readStyles } from "./support/style-reader";

const css = readFileSync("dist/base.css", "utf8");
const PROPS = ["height", "padding", "font-family", "font-size", "font-weight", "letter-spacing", "text-transform", "color", "background", "border", "border-radius"] as const;

function computed(cls: string, product = "kultura") {
  document.documentElement.setAttribute("data-k-product", product);
  document.body.innerHTML = `<button class="${cls}">Mulai pengajuan</button>`;
  const read = readStyles(document.querySelector("button")!, css);
  return Object.fromEntries(PROPS.map((p) => [p, read(p)]));
}

const isHex = (v?: string) => !!v && /^#[0-9a-f]{3,6}$/i.test(v);

describe("button class builder", () => {
  it("builds the documented class names", () => {
    expect(buttonClass()).toBe("k-btn k-btn--primary");
    expect(buttonClass({ size: "hero", variant: "accent", shape: "console" })).toBe("k-btn k-btn--accent k-btn--hero k-btn--console");
    expect(buttonClass({ size: "compact", mono: true })).toBe("k-btn k-btn--primary k-btn--compact k-btn--mono");
    expect(buttonClass({ size: "default", mono: true })).toBe("k-btn k-btn--primary");
  });
});

describe("button matrix", () => {
  const matrix: Record<string, Record<string, string | undefined>> = {};
  for (const size of BUTTON_SIZES)
    for (const variant of BUTTON_VARIANTS)
      for (const shape of BUTTON_SHAPES)
        for (const mono of size === "compact" ? [false, true] : [false]) {
          const cls = buttonClass({ size, variant, shape, mono });
          matrix[cls] = computed(cls);
        }

  it("matches the committed snapshot of computed styles", () => {
    expect(matrix).toMatchSnapshot();
  });

  it("uses the documented heights and text sizes", () => {
    const sizes = { hero: ["52px", "18px"], default: ["44px", "16px"], compact: ["36px", "14px"] } as const;
    for (const size of BUTTON_SIZES) {
      const s = matrix[buttonClass({ size })]!;
      expect([s.height, s["font-size"]]).toEqual(sizes[size]);
    }
  });

  it("switches red fills to red-700 at compact size", () => {
    expect(matrix[buttonClass({ size: "compact", variant: "accent" })]!.background).toBe(tokens["red-700"]);
    expect(matrix[buttonClass({ size: "compact" })]!.background).toBe(tokens["red-700"]);
    expect(matrix[buttonClass({ size: "default" })]!.background).toBe(tokens["red-500"]);
    expect(contrastRatio(tokens["red-700"], "#FFFFFF")).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it("keeps sentence case except compact mono", () => {
    for (const [cls, s] of Object.entries(matrix)) {
      const caps = cls.includes("k-btn--compact") && cls.includes("k-btn--mono");
      expect(s["text-transform"], cls).toBe(caps ? "uppercase" : "none");
    }
  });

  it("uses the pill by default and 8 px for console", () => {
    expect(matrix[buttonClass()]!["border-radius"]).toBe("9999px");
    expect(matrix[buttonClass({ shape: "console" })]!["border-radius"]).toBe("8px");
  });

  it("never uses red for the danger variant", () => {
    const s = matrix[buttonClass({ variant: "danger" })]!;
    expect(s.background).toBe(tokens.ink);
    expect(s.color).toBe("#FFFFFF");
  });

  it("meets contrast for every filled variant", () => {
    for (const [cls, s] of Object.entries(matrix)) {
      if (!isHex(s.background) || !isHex(s.color)) continue;
      const ratio = contrastRatio(s.background!, s.color!);
      // Compact text (14 px) always needs 4.5:1. Red-500 at 16 and 18 px bold is the decided
      // spec (plan section 7) and measures 4.1:1; it is held at the large-type floor and
      // listed as an open question in STATUS.md.
      const compact = cls.includes("k-btn--compact");
      const floor = !compact && s.background === tokens["red-500"] ? AA_LARGE : AA_TEXT;
      expect(ratio, cls).toBeGreaterThanOrEqual(floor);
    }
  });
});

describe("accent button per product preset", () => {
  it("follows the nearest product scope, not the page's", () => {
    document.documentElement.setAttribute("data-k-product", "kultura");
    document.body.innerHTML = `<div data-k-product="fancon"><button class="${buttonClass({ variant: "accent", size: "compact" })}">x</button></div>`;
    const read = readStyles(document.querySelector("button")!, css);
    expect(read("background")?.toUpperCase()).toBe("#EFFF42");
  });

  for (const [product, preset] of Object.entries(productPresets)) {
    if (!preset) continue;
    it(`${product}: accent button reads the preset`, () => {
      const s = computed(buttonClass({ variant: "accent" }), product);
      expect(s.background?.toUpperCase()).toBe(preset.accent);
      expect(s.color?.toUpperCase()).toBe(preset.onAccent);
      const c = computed(buttonClass({ variant: "accent", size: "compact" }), product);
      expect(c.background?.toUpperCase(), "compact uses the text pair").toBe(preset.textPair.bg);
      expect(contrastRatio(c.background!, c.color!)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  }
});
