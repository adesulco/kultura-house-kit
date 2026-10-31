import { describe, expect, it } from "vitest";
// @ts-expect-error plain ESM script without types
import * as lh from "../scripts/lighthouse-mobile.mjs";

const lhr = (score: number, lcp: number, tbt: number) => ({
  categories: { performance: { score } },
  audits: {
    "largest-contentful-paint": { numericValue: lcp },
    "total-blocking-time": { numericValue: tbt },
    "cumulative-layout-shift": { numericValue: 0.01 },
  },
});

describe("lighthouse mobile check", () => {
  it("resolves paths against the preview base URL", () => {
    expect(lh.resolveUrls({ base: "https://pr-1.vercel.app", paths: ["/", "/en", "/en"], urls: [] }))
      .toEqual(["https://pr-1.vercel.app/", "https://pr-1.vercel.app/en"]);
    expect(() => lh.resolveUrls({ base: "", paths: ["/"], urls: [] })).toThrow();
  });

  it("reads arguments and env", () => {
    const a = lh.parseArgs(["--base", "https://x.test", "--paths", "/,/e/fancon-26"], { LH_EXTRA_HEADERS: '{"x-a":"1"}' });
    expect(a.base).toBe("https://x.test");
    expect(a.paths).toEqual(["/", "/e/fancon-26"]);
    expect(a.headers).toEqual({ "x-a": "1" });
  });

  it("passes at the budget and fails just past it", () => {
    expect(lh.evaluate(lh.metricsFromLhr(lhr(0.85, 2500, 200))).pass).toBe(true);
    const r = lh.evaluate(lh.metricsFromLhr(lhr(0.84, 2501, 201)));
    expect(r.pass).toBe(false);
    expect(r.failures).toHaveLength(3);
  });

  it("fails a page that did not load", () => {
    const m = lh.metricsFromLhr({ runtimeError: { message: "NO_FCP" }, categories: {}, audits: {} });
    expect(lh.evaluate(m).pass).toBe(false);
  });

  it("writes a markdown table", () => {
    const m = lh.metricsFromLhr(lhr(0.92, 1800, 90));
    const md = lh.summaryMarkdown([{ url: "https://x.test/", metrics: m, result: lh.evaluate(m) }]);
    expect(md).toContain("### Lighthouse mobile: pass");
    expect(md).toContain("| https://x.test/ | 92 | 1.80 s | 90 ms | 0.010 | pass |");
  });

  it("takes the median of several runs", () => {
    expect(lh.median([3, 1, 2])).toBe(2);
    expect(lh.median([1, 2, 3, 4])).toBe(2.5);
  });
});
