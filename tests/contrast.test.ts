import { describe, expect, it } from "vitest";
import { AA_LARGE, AA_TEXT, contrastRatio } from "../src/contrast";
import { legacyColourMap, productPresets, tokens } from "../src/tokens";

describe("contrast maths", () => {
  it("matches known WCAG values", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
    expect(contrastRatio("#777777", "#FFFFFF")).toBeCloseTo(4.48, 2);
  });

  it("agrees with the figures quoted in the plan of record", () => {
    expect(contrastRatio(tokens["red-700"], "#FFFFFF")).toBeCloseTo(5.7, 1);
    expect(contrastRatio(tokens["red-500"], "#FFFFFF")).toBeCloseTo(4.1, 1);
    expect(contrastRatio("#C74416", "#FFFFFF")).toBeCloseTo(4.9, 1);
    expect(contrastRatio("#E8632B", "#FFFFFF")).toBeLessThan(AA_TEXT); // retired FloorPass orange, 3.4:1
    expect(contrastRatio(tokens.muted, "#FFFFFF")).toBeGreaterThanOrEqual(AA_TEXT);
  });
});

describe("product accent presets (fails under 4.5:1)", () => {
  for (const [product, preset] of Object.entries(productPresets)) {
    if (preset === null) {
      it(`${product}: keeps its own tokens`, () => expect(preset).toBeNull());
      continue;
    }
    it(`${product}: text pair ${preset.textPair.fg} on ${preset.textPair.bg} is at least 4.5:1`, () => {
      expect(contrastRatio(preset.textPair.bg, preset.textPair.fg)).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it(`${product}: accent fill ${preset.onAccent} on ${preset.accent} is at least 3:1 for large type`, () => {
      expect(contrastRatio(preset.accent, preset.onAccent)).toBeGreaterThanOrEqual(AA_LARGE);
    });
  }

  it("uses red-700 as the text pair wherever the accent is red-500", () => {
    for (const preset of Object.values(productPresets)) {
      if (preset && preset.accent === tokens["red-500"]) expect(preset.textPair.bg).toBe(tokens["red-700"]);
    }
  });
});

describe("status colours", () => {
  it("amber text and green pass on paper and on their tints", () => {
    expect(contrastRatio(tokens["amber-text"], tokens.paper)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrastRatio(tokens["amber-text"], tokens["amber-tint"])).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrastRatio(tokens.green, tokens.paper)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrastRatio(tokens.green, tokens["green-tint"])).toBeGreaterThanOrEqual(AA_TEXT);
  });
});

describe("legacy colours", () => {
  it("maps the PSA site's #C81E30 to red-700", () => {
    expect(legacyColourMap["#C81E30"]).toBe("red-700");
    expect(Math.abs(contrastRatio("#C81E30", "#FFFFFF") - contrastRatio(tokens["red-700"], "#FFFFFF"))).toBeLessThan(0.02);
  });
});
