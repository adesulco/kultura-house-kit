import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { productPresets, tokens } from "../src/tokens";

const css = readFileSync("src/css/tokens.css", "utf8");
const rootBlock = /:root\{([\s\S]*?)\n\}/.exec(css)?.[1] ?? "";
const declared = (block: string) =>
  Object.fromEntries(Array.from(block.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/--k-([\w-]+):([^;]+);/g), (m) => [m[1], (m[2] ?? "").trim()]));

describe("tokens.css", () => {
  const root = declared(rootBlock);

  it("declares every token with the exact v0.1 value", () => {
    for (const [name, value] of Object.entries(tokens)) expect(root[name], name).toBe(value);
  });

  it("declares nothing that the JS mirror lacks, apart from the accent slot", () => {
    const extra = Object.keys(root).filter((k) => !(k in tokens));
    expect(extra.sort()).toEqual(["accent", "on-accent"]);
    expect(root.accent).toBe("var(--k-red-500)");
    expect(root["on-accent"]).toBe("#FFFFFF");
  });

  it("matches the build prompt values that are named final", () => {
    expect(tokens["red-500"]).toBe("#EE2F42");
    expect(tokens["red-700"]).toBe("#C81E2F");
    expect(tokens["red-800"]).toBe("#B0182A");
    expect(tokens.muted).toBe("#6E6E76");
    expect(tokens.ease).toBe("cubic-bezier(.2,.7,.2,1)");
  });

  it("sets each product preset in CSS to the JS preset", () => {
    for (const [product, preset] of Object.entries(productPresets)) {
      const block = new RegExp(`\\[data-k-product="${product}"\\][^{]*\\{([^}]*)\\}`).exec(css)?.[1];
      if (preset === null) {
        expect(block, `${product} sets no accent (DS-2)`).toBeUndefined();
        continue;
      }
      expect(block, product).toBeDefined();
      const d = declared(block ?? "");
      expect(d.accent, product).toBe(preset.accent);
      expect(d["on-accent"], product).toBe(preset.onAccent);
    }
  });

  it("ships dist/tokens.css byte for byte", () => {
    expect(readFileSync("dist/tokens.css", "utf8")).toBe(css.trimEnd() + "\n");
  });
});
