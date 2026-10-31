// @vitest-environment jsdom
import { act, createElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CardViewer, type CardViewerProps } from "../react/index";
import { renderCardViewerHTML, renderCardViewerInner } from "../src/card-viewer-markup";
import { defineCardViewer, type KCardViewer } from "../src/elements/card-viewer";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
afterEach(() => { document.body.innerHTML = ""; });

const cases: Record<string, CardViewerProps> = {
  card: { src: "/a.webp", alt: "Kartu A", width: 300, height: 420 },
  "card with back": { src: "/a.webp", alt: "Kartu A", back: "/b.webp", eager: true },
  slab: { src: "/s.webp", alt: "Slab", kind: "slab", label: "PSA 10 GEM MT", back: "/sb.webp" },
};

async function hydrate(props: CardViewerProps) {
  const container = document.createElement("div");
  container.innerHTML = renderToString(createElement(CardViewer, props));
  document.body.append(container);
  const img = container.querySelector("img")!;
  const logged: string[] = [];
  const recoverable: unknown[] = [];
  const spy = vi.spyOn(console, "error").mockImplementation((...a: unknown[]) => { logged.push(a.map(String).join(" ")); });
  let root: ReturnType<typeof hydrateRoot> | undefined;
  await act(async () => {
    root = hydrateRoot(container, createElement(CardViewer, props), { onRecoverableError: (e) => recoverable.push(e) });
  });
  return { container, img, logged, recoverable, root: root!, done: () => spy.mockRestore() };
}

// Order matters: the first test runs before anything registered <k-card-viewer>.
describe("hydration", () => {
  it("hydrates cleanly and registers the element afterwards", async () => {
    expect(customElements.get("k-card-viewer")).toBeUndefined();
    const props = cases["card with back"]!;
    const h = await hydrate(props);
    expect(h.recoverable).toEqual([]);
    expect(h.logged).toEqual([]);
    expect(customElements.get("k-card-viewer")).toBeDefined();
    const el = h.container.querySelector("k-card-viewer") as KCardViewer;
    expect(el.querySelector("img")).toBe(h.img); // adopted, not rebuilt
    expect(el.getAttribute("role")).toBe("button");

    // A prop change after hydration updates the same nodes.
    await act(async () => { h.root.render(createElement(CardViewer, { ...props, src: "/a2.webp" })); });
    expect(el.querySelector(".k-cv__face--front img")).toBe(h.img);
    expect(h.img.getAttribute("src")).toBe("/a2.webp");
    expect(h.logged).toEqual([]);
    h.done();
    await act(async () => h.root.unmount());
  });

  it("keeps the server tree even when the element upgraded before hydration", async () => {
    defineCardViewer(); // already registered by the previous test; kept explicit for the worst case
    const h = await hydrate(cases.slab!);
    // No mismatch and no client re-render; at most React's development note about the
    // attributes the element added to its own host.
    expect(h.recoverable).toEqual([]);
    expect(h.logged.filter((l) => !l.includes("Extra attributes from the server"))).toEqual([]);
    expect(h.container.querySelector("img")).toBe(h.img);
    h.done();
    await act(async () => h.root.unmount());
  });
});

describe("card viewer server markup", () => {
  for (const [name, props] of Object.entries(cases)) {
    it(`React and the string renderer agree (${name})`, () => {
      const host = document.createElement("div");
      host.innerHTML = renderToStaticMarkup(createElement(CardViewer, props));
      expect(host.firstElementChild!.innerHTML).toBe(renderCardViewerInner(props).replace(/\/>/g, ">"));
      const fromString = document.createElement("div");
      fromString.innerHTML = renderCardViewerHTML(props);
      for (const a of ["data-k-kind", "data-k-sheen", "data-k-side", "kind", "src", "alt"]) {
        expect(host.firstElementChild!.getAttribute(a)).toBe(fromString.firstElementChild!.getAttribute(a));
      }
    });
  }

  it("is adopted by the element in place, not rebuilt", () => {
    document.body.innerHTML = renderCardViewerHTML(cases["card with back"]!);
    const img = document.querySelector("img")!;
    const stage = document.querySelector(".k-cv__stage")!;
    defineCardViewer();
    const el = document.querySelector("k-card-viewer") as KCardViewer;
    expect(el.querySelector(".k-cv__stage")).toBe(stage);
    expect(el.querySelector("img")).toBe(img);
    expect(el.getAttribute("role")).toBe("button");
  });
});
