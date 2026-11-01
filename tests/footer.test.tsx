// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ecosystem from "../src/ecosystem.json";
import { KFooterStrip, defineFooterStrip } from "../src/elements/footer-strip";
import { footerStripModel, renderFooterStripHTML } from "../src/footer-model";
import { FooterStrip } from "../react/index";

defineFooterStrip();

describe("ecosystem.json", () => {
  it("is the v0.1 list in order", () => {
    expect(ecosystem.map((l) => l.key)).toEqual(["kult", "kios", "fangir", "fancon", "floorpass", "gelar", "fanhub", "kultura"]);
    for (const l of ecosystem) expect(l.href).toMatch(/^https:\/\//);
  });
});

describe("footer model", () => {
  it("defaults to Bahasa", () => {
    expect(footerStripModel().line).toBe("Bagian dari ekosistem Kultura");
  });
  it("switches to English from the lang attribute", () => {
    expect(footerStripModel({ lang: "en" }).line).toBe("Part of the Kultura ecosystem");
    expect(footerStripModel({ lang: "en-US" }).lang).toBe("en");
  });
  it("hides the current product's own link", () => {
    const keys = footerStripModel({ current: "gelar" }).links.map((l) => l.key);
    expect(keys).not.toContain("gelar");
    expect(keys).toHaveLength(7);
  });
  it("prints the entity line", () => {
    expect(footerStripModel({ entity: " PT Kultura Digital Kreasi, Jakarta " }).entity).toBe("PT Kultura Digital Kreasi, Jakarta");
    expect(footerStripModel({}).entity).toBeNull();
  });
  it("escapes the entity in server HTML", () => {
    expect(renderFooterStripHTML({ entity: "<b>x</b>" })).toContain("&lt;b&gt;x&lt;/b&gt;");
  });
  it("uses no em dashes in customer copy", () => {
    for (const lang of ["id", "en"]) expect(renderFooterStripHTML({ lang })).not.toMatch(/—/);
  });
});

describe("<k-footer-strip>", () => {
  it("renders itself when empty", () => {
    document.body.innerHTML = `<k-footer-strip current="kultura" entity="PT Kios Gemar Kreasi"></k-footer-strip>`;
    const el = document.querySelector("k-footer-strip") as KFooterStrip;
    expect(el.querySelector(".k-footer-strip__line")?.textContent).toBe("Bagian dari ekosistem Kultura");
    expect(el.querySelectorAll("a")).toHaveLength(7);
    expect(el.querySelector(".k-footer-strip__entity")?.textContent).toBe("PT Kios Gemar Kreasi");
    expect(el.classList.contains("k-footer-strip")).toBe(true);
  });

  it("leaves server-rendered markup alone (no layout shift)", () => {
    const html = renderToStaticMarkup(<FooterStrip current="fancon" entity="PT Fancon Kultura Kreasi" lang="en" />);
    document.body.innerHTML = html;
    const el = document.querySelector("k-footer-strip")!;
    expect(el.innerHTML).toBe(new DOMParser().parseFromString(html, "text/html").querySelector("k-footer-strip")!.innerHTML);
  });

  it("re-renders when an attribute changes after upgrade", () => {
    document.body.innerHTML = `<k-footer-strip></k-footer-strip>`;
    const el = document.querySelector("k-footer-strip")!;
    el.setAttribute("lang", "en");
    expect(el.querySelector(".k-footer-strip__line")?.textContent).toBe("Part of the Kultura ecosystem");
  });
});

describe("React <FooterStrip>", () => {
  it("renders the same markup as the string renderer", () => {
    const opts = { current: "kultura", entity: "PT Kios Gemar Kreasi", lang: "id" as const };
    const react = renderToStaticMarkup(<FooterStrip {...opts} />);
    const parse = (s: string) => new DOMParser().parseFromString(s, "text/html").querySelector("k-footer-strip")!;
    expect(parse(react).innerHTML).toBe(parse(renderFooterStripHTML(opts)).innerHTML);
    expect(parse(react).getAttribute("class")).toBe("k-footer-strip");
    expect(parse(react).getAttribute("current")).toBe("kultura");
  });
});

describe("footer strip font", () => {
  it("follows --k-font when the page sets it, else Outfit", async () => {
    const { readFileSync } = await import("node:fs");
    const { readStyles } = await import("./support/style-reader");
    const css = readFileSync(`${process.cwd()}/src/css/footer-strip.css`, "utf8");
    document.body.innerHTML = `<div class="k"><k-footer-strip></k-footer-strip></div>`;
    const strip = document.querySelector("k-footer-strip")!;
    expect(readStyles(strip, css)("font-family")).toBe(`"Outfit",system-ui,sans-serif`);
    const withFont = `${css}\n.k{--k-font:var(--font-outfit),system-ui,sans-serif}\n:root{--font-outfit:"__Outfit_a1b2c3"}`;
    expect(readStyles(strip, withFont)("font-family")).toBe(`"__Outfit_a1b2c3",system-ui,sans-serif`);
  });
});

describe("footer strip contrast and grid", () => {
  const load = async () => {
    const { readFileSync } = await import("node:fs");
    const { readStyles } = await import("./support/style-reader");
    const { contrastRatio, AA_LARGE } = await import("../src/contrast");
    return { css: readFileSync(`${process.cwd()}/src/css/footer-strip.css`, "utf8"), readStyles, contrastRatio, AA_LARGE };
  };

  it("sets every text at large size, since white on red-500 is 4.1:1", async () => {
    const { css, readStyles, contrastRatio, AA_LARGE } = await load();
    document.body.innerHTML = renderFooterStripHTML({ entity: "PT Kios Gemar Kreasi" });
    const strip = document.querySelector("k-footer-strip")!;
    const bg = readStyles(strip, css)("--k-strip-bg")!;
    const fg = readStyles(strip, css)("--k-strip-fg")!;
    expect(contrastRatio(bg, fg)).toBeGreaterThanOrEqual(AA_LARGE);
    for (const sel of [".k-footer-strip__line", ".k-footer-strip__link", ".k-footer-strip__entity"]) {
      const read = readStyles(strip.querySelector(sel)!, css);
      const px = parseFloat(read("font-size")!);
      const weight = Number(read("font-weight"));
      // WCAG large text: 24 px, or 18.66 px (14 pt) and bold.
      expect(px >= 24 || (px >= 18.66 && weight >= 700), sel).toBe(true);
    }
  });

  it("takes the site's container through --k-strip-max and --k-strip-pad", async () => {
    const { css, readStyles } = await load();
    document.body.innerHTML = `<div class="k">${renderFooterStripHTML({})}</div>`;
    const inner = document.querySelector(".k-footer-strip__inner")!;
    expect(readStyles(inner, css)("max-width")).toBe("1280px");
    expect(readStyles(inner, css)("padding")).toBe("24px 16px");
    expect(readStyles(inner, css, { desktop: true })("padding")).toBe("28px 32px");
    const site = `${css}\n.k{--k-strip-max:1200px;--k-strip-pad:64px}`;
    expect(readStyles(inner, site)("max-width")).toBe("1200px");
    expect(readStyles(inner, site, { desktop: true })("padding")).toBe("28px 64px");
  });
});
