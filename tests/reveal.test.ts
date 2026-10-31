// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initReveal } from "../src/elements/reveal";

let observed: Element[] = [];
let fire: (el: Element) => void = () => {};
let stop: () => void = () => {};
const tick = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
  observed = [];
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
  vi.stubGlobal("IntersectionObserver", class {
    constructor(private cb: IntersectionObserverCallback) { fire = (el) => this.cb([{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry], this as unknown as IntersectionObserver); }
    observe(el: Element) { observed.push(el); }
    unobserve() {}
    disconnect() {}
  });
});
afterEach(() => { stop(); vi.unstubAllGlobals(); document.body.innerHTML = ""; });

describe(".k-reveal", () => {
  it("stays revealed when a re-render rewrites the class list", async () => {
    document.body.innerHTML = `<section class="k-reveal">A</section>`;
    stop = initReveal();
    const el = document.querySelector("section")!;
    fire(el);
    expect(el.classList.contains("is-revealed")).toBe(true);
    el.className = "k-reveal is-active"; // what a framework re-render does
    await tick();
    expect(el.classList.contains("is-revealed")).toBe(true);
  });

  it("watches an existing element that gains k-reveal later", async () => {
    document.body.innerHTML = `<section>B</section>`;
    stop = initReveal();
    const el = document.querySelector("section")!;
    el.className = "k-reveal";
    await tick();
    expect(observed).toContain(el);
  });
});
