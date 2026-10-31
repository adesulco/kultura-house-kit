import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import preset from "../src/tailwind";
import { houseKitPreset } from "../src/index";

describe("tailwind preset", () => {
  it("require() of the CommonJS build returns the preset itself", () => {
    const req = createRequire(import.meta.url);
    const cjs = req("../dist/tailwind.cjs") as { theme?: { extend?: Record<string, unknown> } };
    expect(cjs.theme?.extend).toBeDefined();
    expect(cjs.theme!.extend!.colors).toEqual(preset.theme.extend.colors);
  });
  it("is the same object from the default import and the package index", () => {
    expect(houseKitPreset).toBe(preset);
  });
});
