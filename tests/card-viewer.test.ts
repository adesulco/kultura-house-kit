// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_MAX_TILT, TILT_CEILING, ariaLabelFor, parseKind, parseMaxTilt, parseSheen, sheenFromTilt, tiltFromOrientation, tiltFromPointer,
} from "../src/elements/card-viewer-logic";
import { KCardViewer, defineCardViewer } from "../src/elements/card-viewer";

defineCardViewer();

let reduced = false;
const rafQueue: FrameRequestCallback[] = [];
const flushFrames = () => { while (rafQueue.length) rafQueue.shift()!(performance.now()); };

beforeEach(() => {
  reduced = false;
  rafQueue.length = 0;
  vi.stubGlobal("matchMedia", (q: string) => ({
    matches: q.includes("prefers-reduced-motion") ? reduced : false,
    media: q, addEventListener() {}, removeEventListener() {},
  }));
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => { rafQueue.push(cb); return rafQueue.length; });
  vi.stubGlobal("cancelAnimationFrame", () => { rafQueue.length = 0; });
});
afterEach(() => { vi.unstubAllGlobals(); document.body.innerHTML = ""; });

function mount(attrs: string, inner = "") {
  document.body.innerHTML = `<k-card-viewer ${attrs}>${inner}</k-card-viewer>`;
  const el = document.querySelector("k-card-viewer") as KCardViewer;
  const stage = el.querySelector(".k-cv__stage") as HTMLElement;
  stage.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 280, right: 200, bottom: 280, x: 0, y: 0, toJSON() {} });
  return el;
}

const pointer = (type: string, x: number, y: number, pointerType = "mouse") => {
  const e = new Event(type, { bubbles: true }) as Event & Record<string, unknown>;
  Object.assign(e, { clientX: x, clientY: y, pointerType });
  return e;
};

describe("attribute parsing", () => {
  it("parses kind, defaulting to card", () => {
    expect(parseKind("slab")).toBe("slab");
    expect(parseKind(null)).toBe("card");
    expect(parseKind("poster")).toBe("card");
  });
  it("defaults the sheen to holo for cards and none for slabs", () => {
    expect(parseSheen(null, "card")).toBe("holo");
    expect(parseSheen(null, "slab")).toBe("none");
    expect(parseSheen("foil", "slab")).toBe("foil");
    expect(parseSheen("sparkle", "card")).toBe("holo");
  });
  it("parses max-tilt with a default of 8 and clamps it", () => {
    expect(parseMaxTilt(null)).toBe(DEFAULT_MAX_TILT);
    expect(parseMaxTilt("")).toBe(8);
    expect(parseMaxTilt("abc")).toBe(8);
    expect(parseMaxTilt("12")).toBe(12);
    expect(parseMaxTilt("-4")).toBe(0);
    expect(parseMaxTilt("90")).toBe(TILT_CEILING);
  });
  it("builds the aria label in Bahasa", () => {
    expect(ariaLabelFor("Kartu JICAF", "front")).toBe("Kartu JICAF (depan)");
    expect(ariaLabelFor("Kartu JICAF", "back")).toBe("Kartu JICAF (belakang)");
  });
});

describe("tilt maths", () => {
  const rect = { left: 0, top: 0, width: 200, height: 280 };
  it("is flat at the centre", () => expect(tiltFromPointer(100, 140, rect, 8)).toEqual({ rx: 0, ry: 0 }));
  it("reaches max-tilt at the corners", () => {
    expect(tiltFromPointer(200, 0, rect, 8)).toEqual({ rx: 8, ry: 8 });
    expect(tiltFromPointer(0, 280, rect, 8)).toEqual({ rx: -8, ry: -8 });
  });
  it("clamps pointers outside the element", () => {
    expect(tiltFromPointer(5000, -5000, rect, 8)).toEqual({ rx: 8, ry: 8 });
  });
  it("clamps phone tilt", () => {
    expect(tiltFromOrientation(45, 0, 45, 8)).toEqual({ rx: 0, ry: 0 });
    expect(tiltFromOrientation(45, 90, 45, 8)).toEqual({ rx: 0, ry: 8 });
    expect(tiltFromOrientation(-30, -90, 45, 8)).toEqual({ rx: 8, ry: -8 });
  });
  it("moves the sheen angle with the tilt", () => {
    expect(sheenFromTilt({ rx: 0, ry: 0 }, 8).angle).toBe(115);
    expect(sheenFromTilt({ rx: 0, ry: 8 }, 8).angle).toBe(145);
  });
});

describe("<k-card-viewer> rendering", () => {
  it("reuses the server-rendered image as the front face", () => {
    const el = mount(`src="/a.webp" alt="Kartu A"`, `<img src="/a.webp" alt="Kartu A">`);
    const imgs = el.querySelectorAll("img");
    expect(imgs).toHaveLength(1);
    expect(imgs[0]!.closest(".k-cv__face--front")).not.toBeNull();
    expect(imgs[0]!.getAttribute("loading")).toBe("lazy");
  });
  it("loads eagerly with the eager attribute", () => {
    const el = mount(`src="/a.webp" alt="A" eager`);
    expect(el.querySelector("img")!.getAttribute("loading")).toBe("eager");
  });
  it("adds the slab frame and label area", () => {
    const el = mount(`src="/s.webp" alt="Slab" kind="slab" label="PSA 10 GEM MT"`);
    expect(el.dataset.kKind).toBe("slab");
    expect(el.dataset.kSheen).toBe("none");
    expect(el.querySelector(".k-cv__label")?.textContent).toBe("PSA 10 GEM MT");
    expect(el.querySelector(".k-cv__window img")).not.toBeNull();
  });
  it("is not focusable without a back", () => {
    const el = mount(`src="/a.webp" alt="A"`);
    expect(el.hasAttribute("tabindex")).toBe(false);
    expect(el.getAttribute("role")).toBeNull();
  });
});

describe("flip and accessibility", () => {
  it("is focusable with a back and flips on click, Enter and Space", () => {
    const el = mount(`src="/a.webp" back="/b.webp" alt="Kartu A"`);
    expect(el.getAttribute("tabindex")).toBe("0");
    expect(el.getAttribute("role")).toBe("button");
    expect(el.getAttribute("aria-pressed")).toBe("false");
    expect(el.getAttribute("aria-label")).toBe("Kartu A (depan)");
    el.click();
    expect(el.currentSide).toBe("back");
    expect(el.getAttribute("aria-pressed")).toBe("true");
    expect(el.getAttribute("aria-label")).toBe("Kartu A (belakang)");
    expect(el.style.getPropertyValue("--k-flip")).toBe("180deg");
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(el.currentSide).toBe("front");
    el.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    expect(el.currentSide).toBe("back");
  });
});

describe("pointer tilt and the frame loop", () => {
  it("tilts while the pointer is over and stops the loop on leave", () => {
    const el = mount(`src="/a.webp" alt="A"`);
    el.dispatchEvent(pointer("pointerenter", 200, 0));
    expect(el.looping).toBe(true);
    expect((el.querySelector(".k-cv__card") as HTMLElement).style.willChange).toBe("transform");
    flushFrames();
    expect(el.style.getPropertyValue("--k-rx")).toBe("8deg");
    expect(el.style.getPropertyValue("--k-ry")).toBe("8deg");
    el.dispatchEvent(pointer("pointermove", 0, 280));
    el.dispatchEvent(pointer("pointermove", 0, 280));
    expect(rafQueue).toHaveLength(1); // one frame at a time
    flushFrames();
    expect(el.style.getPropertyValue("--k-ry")).toBe("-8deg");
    const framesBeforeLeave = el.frames;

    el.dispatchEvent(pointer("pointerleave", 0, 0));
    expect(el.looping).toBe(false);
    expect(el.dataset.kState).toBe("settling");
    expect(el.style.getPropertyValue("--k-rx")).toBe("0deg");
    el.dispatchEvent(pointer("pointermove", 100, 100));
    flushFrames();
    expect(el.frames).toBe(framesBeforeLeave);
    expect(rafQueue).toHaveLength(0);
  });

  it("respects max-tilt", () => {
    const el = mount(`src="/a.webp" alt="A" max-tilt="4"`);
    el.dispatchEvent(pointer("pointerenter", 200, 280));
    flushFrames();
    expect(el.style.getPropertyValue("--k-rx")).toBe("-4deg");
  });
});

describe("state across moves and setting changes", () => {
  it("asks for phone tilt again after the element is moved", () => {
    let listeners = 0;
    vi.stubGlobal("DeviceOrientationEvent", class {});
    const add = window.addEventListener.bind(window);
    vi.spyOn(window, "addEventListener").mockImplementation((type: string, ...rest: unknown[]) => {
      if (type === "deviceorientation") listeners++;
      return (add as (...a: unknown[]) => void)(type, ...rest);
    });
    const el = mount(`src="/a.webp" alt="A"`);
    el.enableOrientation();
    expect(listeners).toBe(1);
    const box = document.createElement("div");
    document.body.append(box);
    box.append(el); // disconnect + reconnect
    el.enableOrientation();
    expect(listeners).toBe(2);
    vi.restoreAllMocks();
  });

  it("shows the right side when reduced motion is turned off after a flip", () => {
    let onChange: (() => void) | null = null;
    reduced = true;
    vi.stubGlobal("matchMedia", (q: string) => ({
      get matches() { return q.includes("prefers-reduced-motion") ? reduced : false; },
      media: q, addEventListener(_t: string, cb: () => void) { onChange = cb; }, removeEventListener() {},
    }));
    const el = mount(`src="/a.webp" back="/b.webp" alt="A"`);
    el.click();
    expect(el.style.getPropertyValue("--k-flip")).toBe("0deg");
    reduced = false;
    onChange!();
    expect(el.currentSide).toBe("back");
    expect(el.style.getPropertyValue("--k-flip")).toBe("180deg");
  });
});

describe("reduced motion", () => {
  it("does not tilt, hides the sheen and swaps sides instantly", () => {
    reduced = true;
    const el = mount(`src="/a.webp" back="/b.webp" alt="A"`);
    expect(el.hasAttribute("data-k-reduced")).toBe(true);
    el.dispatchEvent(pointer("pointerenter", 200, 0));
    el.dispatchEvent(pointer("pointermove", 200, 0));
    flushFrames();
    expect(el.looping).toBe(false);
    expect(el.frames).toBe(0);
    expect((el.querySelector(".k-cv__card") as HTMLElement).style.willChange).toBe("");
    el.click();
    expect(el.currentSide).toBe("back");
    expect(el.dataset.kSide).toBe("back");
    expect(el.dataset.kState).toBeUndefined();
    expect(el.style.getPropertyValue("--k-flip")).toBe("0deg");
  });
});
