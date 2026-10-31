"use client";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// react/index.tsx
import { createElement, useEffect } from "react";

// src/button.ts
function buttonClass({ size = "default", variant = "primary", shape = "pill", mono = false } = {}) {
  const out = ["k-btn", `k-btn--${variant}`];
  if (size !== "default") out.push(`k-btn--${size}`);
  if (shape !== "pill") out.push(`k-btn--${shape}`);
  if (mono && size === "compact") out.push("k-btn--mono");
  return out.join(" ");
}

// src/ecosystem.json
var ecosystem_default = [
  { key: "kult", label: "KULT", href: "https://kult.co.id" },
  { key: "kios", label: "kioskultura.com", href: "https://kioskultura.com" },
  { key: "fangir", label: "FanGir", href: "https://fangir.com" },
  { key: "fancon", label: "FanCon", href: "https://fancon.co.id" },
  { key: "floorpass", label: "FloorPass", href: "https://floorpass.co" },
  { key: "gelar", label: "Gelar", href: "https://gelar.co" },
  { key: "fanhub", label: "fanhub.", href: "https://fanhub.id" },
  { key: "kultura", label: "Kultura", href: "https://kultura.co.id" }
];

// src/footer-model.ts
var ecosystemLinks = ecosystem_default;
var COPY = {
  id: { line: "Bagian dari ekosistem Kultura", navLabel: "Ekosistem Kultura" },
  en: { line: "Part of the Kultura ecosystem", navLabel: "Kultura ecosystem" }
};
function normaliseLang(lang) {
  return lang && lang.toLowerCase().startsWith("en") ? "en" : "id";
}
function footerStripModel(opts = {}) {
  const lang = normaliseLang(opts.lang);
  const current = opts.current?.trim().toLowerCase() || null;
  const entity = opts.entity?.trim() || null;
  return {
    lang,
    line: COPY[lang].line,
    navLabel: COPY[lang].navLabel,
    links: ecosystemLinks.filter((l) => l.key !== current),
    entity
  };
}
var escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
function renderFooterStripInner(model) {
  const links = model.links.map((l) => `<li><a class="k-footer-strip__link" href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`).join("");
  const entity = model.entity ? `<p class="k-footer-strip__entity">${escapeHtml(model.entity)}</p>` : "";
  return `<div class="k-footer-strip__inner"><p class="k-footer-strip__line">${escapeHtml(model.line)}</p><nav class="k-footer-strip__nav" aria-label="${escapeHtml(model.navLabel)}"><ul class="k-footer-strip__links">${links}</ul></nav>` + entity + `</div>`;
}

// src/elements/card-viewer-logic.ts
var DEFAULT_MAX_TILT = 8;
var TILT_CEILING = 20;
var clamp = (n, min, max) => Math.min(Math.max(n, min), max);
function parseKind(value) {
  return value === "slab" ? "slab" : "card";
}
function parseSheen(value, kind) {
  if (value === "none" || value === "holo" || value === "foil") return value;
  return kind === "slab" ? "none" : "holo";
}
function parseMaxTilt(value) {
  if (value === null || value.trim() === "") return DEFAULT_MAX_TILT;
  const n = Number(value);
  if (!Number.isFinite(n)) return DEFAULT_MAX_TILT;
  return clamp(n, 0, TILT_CEILING);
}
function tiltFromPointer(x, y, rect, maxTilt) {
  if (rect.width <= 0 || rect.height <= 0) return { rx: 0, ry: 0 };
  const nx = clamp((x - rect.left) / rect.width * 2 - 1, -1, 1);
  const ny = clamp((y - rect.top) / rect.height * 2 - 1, -1, 1);
  return { rx: round(-ny * maxTilt), ry: round(nx * maxTilt) };
}
function tiltFromOrientation(beta, gamma, baseBeta, maxTilt) {
  const span = 20;
  return {
    rx: round(clamp(-((beta - baseBeta) / span) * maxTilt, -maxTilt, maxTilt)),
    ry: round(clamp(gamma / span * maxTilt, -maxTilt, maxTilt))
  };
}
function sheenFromTilt({ rx, ry }, maxTilt) {
  const m = maxTilt || 1;
  return { angle: round(115 + ry / m * 30), x: round(50 + ry / m * 40), y: round(50 - rx / m * 40) };
}
function ariaLabelFor(alt, side) {
  return `${alt} (${side === "front" ? "depan" : "belakang"})`;
}
function round(n) {
  const r = Math.round(n * 100) / 100;
  return Object.is(r, -0) ? 0 : r;
}

// src/card-viewer-markup.ts
function cardViewerHostAttributes(o) {
  const kind = parseKind(o.kind ?? null);
  const attrs = { src: o.src, alt: o.alt };
  if (o.back) attrs.back = o.back;
  attrs.kind = kind;
  if (o.sheen) attrs.sheen = o.sheen;
  if (o.label) attrs.label = o.label;
  if (o.maxTilt !== void 0) attrs["max-tilt"] = String(o.maxTilt);
  if (o.eager) attrs.eager = "";
  attrs["data-k-kind"] = kind;
  attrs["data-k-sheen"] = parseSheen(o.sheen ?? null, kind);
  attrs["data-k-side"] = "front";
  return attrs;
}

// src/elements/card-viewer.ts
var HTMLElementBase = typeof HTMLElement === "undefined" ? class {
} : HTMLElement;
var reducedQuery = () => typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;
var KCardViewer = class extends HTMLElementBase {
  constructor() {
    super(...arguments);
    /** Frames written since connect. Read by tests to prove the loop stops on leave. */
    __publicField(this, "frames", 0);
    /** True only while a pointer is over the element (or a touch drag or phone tilt is live). */
    __publicField(this, "looping", false);
    __publicField(this, "card", null);
    __publicField(this, "side", "front");
    __publicField(this, "target", { rx: 0, ry: 0 });
    __publicField(this, "raf", 0);
    __publicField(this, "rendered", false);
    /** True when the stage came from the server (React or a template); then it is updated in place, never rebuilt. */
    __publicField(this, "adopted", false);
    __publicField(this, "orientation", "off");
    __publicField(this, "baseBeta", null);
    __publicField(this, "visible", true);
    __publicField(this, "dragStart", null);
    __publicField(this, "dragged", false);
    __publicField(this, "io", null);
    __publicField(this, "mql", null);
    __publicField(this, "onReducedChange", () => {
      this.syncReduced();
      this.applySide(false);
    });
    // Pointer: desktop tilt.
    __publicField(this, "onEnter", (e) => {
      if (this.reduced || e.pointerType === "touch") return;
      this.startLoop();
      this.updateFromPointer(e);
    });
    __publicField(this, "onMove", (e) => {
      if (this.reduced) return;
      if (e.pointerType === "touch") {
        if (this.orientation !== "drag" || !this.dragStart) return;
        if (Math.abs(e.clientX - this.dragStart.x) > 6 || Math.abs(e.clientY - this.dragStart.y) > 6) this.dragged = true;
      }
      if (!this.looping) return;
      this.updateFromPointer(e);
    });
    __publicField(this, "onLeave", (e) => {
      if (e.pointerType === "touch") return;
      this.settle();
    });
    __publicField(this, "onDown", (e) => {
      this.dragged = false;
      if (e.pointerType !== "touch" || this.reduced || this.orientation !== "drag") return;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.startLoop();
      this.updateFromPointer(e);
    });
    __publicField(this, "onUp", (e) => {
      if (e.pointerType !== "touch" || !this.dragStart) return;
      this.dragStart = null;
      this.settle();
    });
    // Phone: orientation after the first tap, drag-to-tilt when refused or unavailable.
    __publicField(this, "onClick", (e) => {
      if (this.dragged) {
        this.dragged = false;
        e.preventDefault();
        return;
      }
      const pointerType = e.pointerType;
      if (pointerType === "touch" || pointerType === void 0 && this.isTouchDevice()) this.enableOrientation();
      if (this.hasBack) this.flip();
    });
    __publicField(this, "onKey", (e) => {
      if (!this.hasBack) return;
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        this.flip();
      }
    });
    __publicField(this, "onOrientation", (e) => {
      if (this.reduced || !this.visible || e.beta === null || e.gamma === null) return;
      if (this.baseBeta === null) this.baseBeta = e.beta;
      this.looping = true;
      this.target = tiltFromOrientation(e.beta, e.gamma, this.baseBeta, this.parsedMaxTilt);
      this.schedule();
    });
  }
  /** The card node, looked up again if the page replaced the inner markup since. */
  get cardEl() {
    if (this.card && this.contains(this.card)) return this.card;
    this.card = this.querySelector(":scope > .k-cv__stage > .k-cv__card");
    return this.card;
  }
  get parsedKind() {
    return parseKind(this.getAttribute("kind"));
  }
  get parsedSheen() {
    return parseSheen(this.getAttribute("sheen"), this.parsedKind);
  }
  get parsedMaxTilt() {
    return parseMaxTilt(this.getAttribute("max-tilt"));
  }
  get hasBack() {
    return !!this.getAttribute("back");
  }
  get currentSide() {
    return this.side;
  }
  get reduced() {
    return !!reducedQuery()?.matches;
  }
  connectedCallback() {
    this.render();
    this.addEventListener("pointerenter", this.onEnter);
    this.addEventListener("pointermove", this.onMove);
    this.addEventListener("pointerleave", this.onLeave);
    this.addEventListener("pointerdown", this.onDown);
    this.addEventListener("pointerup", this.onUp);
    this.addEventListener("pointercancel", this.onUp);
    this.addEventListener("click", this.onClick);
    this.addEventListener("keydown", this.onKey);
    this.mql = reducedQuery();
    this.mql?.addEventListener?.("change", this.onReducedChange);
    if (typeof IntersectionObserver === "function") {
      this.io = new IntersectionObserver((entries) => {
        this.visible = entries.some((e) => e.isIntersecting);
        if (!this.visible && this.orientation === "on") this.settle();
      });
      this.io.observe(this);
    }
  }
  disconnectedCallback() {
    this.stopLoop();
    this.removeEventListener("pointerenter", this.onEnter);
    this.removeEventListener("pointermove", this.onMove);
    this.removeEventListener("pointerleave", this.onLeave);
    this.removeEventListener("pointerdown", this.onDown);
    this.removeEventListener("pointerup", this.onUp);
    this.removeEventListener("pointercancel", this.onUp);
    this.removeEventListener("click", this.onClick);
    this.removeEventListener("keydown", this.onKey);
    this.mql?.removeEventListener?.("change", this.onReducedChange);
    if (typeof window !== "undefined") window.removeEventListener("deviceorientation", this.onOrientation);
    this.orientation = "off";
    this.baseBeta = null;
    this.dragStart = null;
    this.io?.disconnect();
    this.io = null;
  }
  attributeChangedCallback(_name, oldValue, newValue) {
    if (this.rendered && oldValue !== newValue) this.render();
  }
  /**
   * Builds the stage, or adopts one already in the markup (server-rendered by the React wrapper
   * or renderCardViewerHTML). An adopted stage is only updated in place: a framework that
   * hydrated it still owns those nodes, so they are never replaced.
   */
  render() {
    const alt = this.getAttribute("alt") ?? "";
    const eager = this.hasAttribute("eager");
    if (!this.rendered && this.querySelector(":scope > .k-cv__stage > .k-cv__card .k-cv__face--front img")) this.adopted = true;
    const front = this.adopted ? this.adopt(alt, eager) : this.build(alt, eager);
    const backSrc = this.getAttribute("back");
    this.dataset.kKind = this.parsedKind;
    this.dataset.kSheen = this.parsedSheen;
    this.capUpscale(front);
    if (!backSrc) this.side = "front";
    this.syncA11y(alt);
    this.syncReduced();
    this.applySide(false);
    this.rendered = true;
  }
  adopt(alt, eager) {
    const card = this.querySelector(":scope > .k-cv__stage > .k-cv__card");
    const front = card?.querySelector(".k-cv__face--front img");
    const slab = this.parsedKind === "slab";
    const matches = !!card && !!front && !!card.querySelector(".k-cv__face--back img") === !!this.getAttribute("back") && !!card.querySelector(".k-cv__window") === slab;
    if (!card || !front || !matches) {
      this.adopted = false;
      return this.build(alt, eager);
    }
    const set = (el, name, value) => {
      if (el.getAttribute(name) !== value) el.setAttribute(name, value);
    };
    const src = this.getAttribute("src");
    if (src) set(front, "src", src);
    set(front, "alt", alt);
    set(front, "loading", eager ? "eager" : "lazy");
    set(front, "decoding", "async");
    set(front, "draggable", "false");
    const backSrc = this.getAttribute("back");
    const backImg = card.querySelector(".k-cv__face--back img");
    if (backSrc && backImg) set(backImg, "src", backSrc);
    const label = slab ? card.querySelector(".k-cv__face--front .k-cv__label") : null;
    const labelText = this.getAttribute("label") ?? "";
    if (label && label.textContent !== labelText) label.textContent = labelText;
    this.card = card;
    return front;
  }
  build(alt, eager) {
    const doc = this.ownerDocument;
    const existing = this.querySelector(":scope > img, .k-cv__face--front img");
    const front = existing ?? doc.createElement("img");
    const src = this.getAttribute("src");
    if (src && front.getAttribute("src") !== src) front.setAttribute("src", src);
    front.setAttribute("alt", alt);
    front.setAttribute("loading", eager ? "eager" : "lazy");
    front.setAttribute("decoding", "async");
    front.setAttribute("draggable", "false");
    const card = doc.createElement("div");
    card.className = "k-cv__card";
    card.append(this.face("front", front));
    const backSrc = this.getAttribute("back");
    if (backSrc) {
      const back = doc.createElement("img");
      back.setAttribute("src", backSrc);
      back.setAttribute("alt", "");
      back.setAttribute("loading", "lazy");
      back.setAttribute("decoding", "async");
      back.setAttribute("draggable", "false");
      card.append(this.face("back", back));
    }
    const stage = doc.createElement("div");
    stage.className = "k-cv__stage";
    stage.append(card);
    this.replaceChildren(stage);
    this.card = card;
    return front;
  }
  face(side, img) {
    const doc = this.ownerDocument;
    const face = doc.createElement("div");
    face.className = `k-cv__face k-cv__face--${side}`;
    if (this.parsedKind === "slab") {
      const label = doc.createElement("div");
      label.className = "k-cv__label";
      label.textContent = side === "front" ? this.getAttribute("label") ?? "" : "";
      const win = doc.createElement("div");
      win.className = "k-cv__window";
      win.append(img);
      face.append(label, win);
    } else {
      face.append(img);
    }
    if (side === "front") {
      const sheen = doc.createElement("span");
      sheen.className = "k-cv__sheen";
      sheen.setAttribute("aria-hidden", "true");
      face.append(sheen);
    }
    return face;
  }
  /** Never upscale beyond the image's natural width. */
  capUpscale(img) {
    const apply = () => {
      if (!img.naturalWidth) return;
      img.style.maxWidth = `${img.naturalWidth}px`;
      if (this.parsedKind === "card") this.style.setProperty("--k-cv-max", `${img.naturalWidth}px`);
    };
    if (img.complete) apply();
    else img.addEventListener("load", apply, { once: true });
  }
  syncA11y(alt) {
    if (this.hasBack) {
      if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", "0");
      this.setAttribute("role", "button");
      this.setAttribute("aria-pressed", String(this.side === "back"));
      this.setAttribute("aria-label", ariaLabelFor(alt, this.side));
    } else {
      if (this.getAttribute("role") === "button") this.removeAttribute("role");
      this.removeAttribute("aria-pressed");
      this.removeAttribute("aria-label");
      if (this.getAttribute("tabindex") === "0") this.removeAttribute("tabindex");
    }
  }
  syncReduced() {
    if (this.reduced) {
      this.dataset.kReduced = "";
      this.stopLoop();
      this.setTilt({ rx: 0, ry: 0 });
    } else {
      delete this.dataset.kReduced;
    }
  }
  updateFromPointer(e) {
    const stage = this.cardEl?.parentElement;
    if (!stage) return;
    this.target = tiltFromPointer(e.clientX, e.clientY, stage.getBoundingClientRect(), this.parsedMaxTilt);
    this.schedule();
  }
  isTouchDevice() {
    return typeof matchMedia === "function" && matchMedia("(hover: none) and (pointer: coarse)").matches;
  }
  /** Called from a tap. iOS asks for permission here; refusal falls back to drag-to-tilt. */
  enableOrientation() {
    if (this.reduced || this.orientation !== "off" || typeof window === "undefined") return;
    const Ctor = window.DeviceOrientationEvent;
    if (!Ctor) {
      this.orientation = "drag";
      return;
    }
    this.orientation = "pending";
    const listen = () => {
      if (!this.isConnected) {
        this.orientation = "off";
        return;
      }
      this.orientation = "on";
      window.addEventListener("deviceorientation", this.onOrientation);
      setTimeout(() => {
        if (this.baseBeta === null && this.orientation === "on") this.useDrag();
      }, 1e3);
    };
    if (typeof Ctor.requestPermission === "function") {
      Ctor.requestPermission().then((state) => state === "granted" ? listen() : this.useDrag()).catch(() => this.useDrag());
    } else {
      listen();
    }
  }
  useDrag() {
    window.removeEventListener("deviceorientation", this.onOrientation);
    this.orientation = "drag";
  }
  // Frame loop: one requestAnimationFrame at a time, only while looping.
  startLoop() {
    if (this.looping) return;
    this.looping = true;
    delete this.dataset.kState;
    const card = this.cardEl;
    if (card) card.style.willChange = "transform";
  }
  stopLoop() {
    this.looping = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
  schedule() {
    if (!this.looping || this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      if (!this.looping) return;
      this.frames++;
      this.setTilt(this.target);
    });
  }
  /** Return to flat over --k-slow and drop will-change. */
  settle() {
    this.stopLoop();
    this.dataset.kState = "settling";
    this.setTilt({ rx: 0, ry: 0 });
    const card = this.cardEl;
    const done = () => {
      if (card) card.style.willChange = "";
      if (this.dataset.kState === "settling") delete this.dataset.kState;
    };
    if (card) {
      card.addEventListener("transitionend", done, { once: true });
      setTimeout(done, 400);
    }
  }
  setTilt(t) {
    const s = this.style;
    s.setProperty("--k-rx", `${t.rx}deg`);
    s.setProperty("--k-ry", `${t.ry}deg`);
    const sheen = sheenFromTilt(t, this.parsedMaxTilt);
    s.setProperty("--k-sheen-angle", `${sheen.angle}deg`);
    s.setProperty("--k-sheen-x", `${sheen.x}%`);
    s.setProperty("--k-sheen-y", `${sheen.y}%`);
  }
  /** Flips to the other side. Instant swap under reduced motion. */
  flip() {
    if (!this.hasBack) return;
    this.side = this.side === "front" ? "back" : "front";
    this.applySide(true);
    this.syncA11y(this.getAttribute("alt") ?? "");
  }
  applySide(animate) {
    this.dataset.kSide = this.side;
    if (this.reduced) {
      this.style.setProperty("--k-flip", "0deg");
      return;
    }
    if (animate) {
      this.dataset.kState = "flipping";
      setTimeout(() => {
        if (this.dataset.kState === "flipping") delete this.dataset.kState;
      }, 360);
    }
    this.style.setProperty("--k-flip", this.side === "back" ? "180deg" : "0deg");
  }
};
__publicField(KCardViewer, "observedAttributes", ["src", "back", "alt", "kind", "sheen", "max-tilt", "eager", "label"]);
function defineCardViewer(registry = globalThis.customElements) {
  if (registry && !registry.get("k-card-viewer")) registry.define("k-card-viewer", KCardViewer);
}

// src/elements/footer-strip.ts
var HTMLElementBase2 = typeof HTMLElement === "undefined" ? class {
} : HTMLElement;
var KFooterStrip = class extends HTMLElementBase2 {
  constructor() {
    super(...arguments);
    __publicField(this, "ready", false);
  }
  connectedCallback() {
    this.classList.add("k-footer-strip");
    if (!this.querySelector(".k-footer-strip__inner")) this.render();
    this.ready = true;
  }
  attributeChangedCallback(_n, oldValue, newValue) {
    if (this.ready && oldValue !== newValue) this.render();
  }
  render() {
    const model = footerStripModel({
      current: this.getAttribute("current"),
      entity: this.getAttribute("entity"),
      lang: this.getAttribute("lang")
    });
    this.innerHTML = renderFooterStripInner(model);
  }
};
__publicField(KFooterStrip, "observedAttributes", ["current", "entity", "lang"]);
function defineFooterStrip(registry = globalThis.customElements) {
  if (registry && !registry.get("k-footer-strip")) registry.define("k-footer-strip", KFooterStrip);
}

// src/elements/reveal.ts
var started = false;
function initReveal(root = document) {
  if (started || typeof IntersectionObserver !== "function") return () => {
  };
  started = true;
  const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = root.documentElement;
  const revealed = /* @__PURE__ */ new WeakSet();
  const reveal = (el) => {
    revealed.add(el);
    el.classList.add("is-revealed");
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          reveal(e.target);
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  const scan = (node) => {
    const list = node instanceof Element && node.matches(".k-reveal") ? [node] : [];
    list.push(...Array.from(node.querySelectorAll(".k-reveal:not(.is-revealed)")));
    for (const el of list) {
      if (reduced) reveal(el);
      else io.observe(el);
    }
  };
  scan(root);
  if (!reduced) html.setAttribute("data-k-motion", "");
  const mo = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === "childList") {
        r.addedNodes.forEach((n) => {
          if (n instanceof Element) scan(n);
        });
        continue;
      }
      const el = r.target;
      if (!(el instanceof Element) || !el.classList.contains("k-reveal") || el.classList.contains("is-revealed")) continue;
      if (reduced || revealed.has(el)) reveal(el);
      else io.observe(el);
    }
  });
  if (root.body) mo.observe(root.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  return () => {
    io.disconnect();
    mo.disconnect();
    html.removeAttribute("data-k-motion");
    started = false;
  };
}

// src/elements/define.ts
function defineElements() {
  if (typeof window === "undefined" || !window.customElements) return;
  defineCardViewer();
  defineFooterStrip();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => initReveal(), { once: true });
  else initReveal();
}

// react/index.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function FooterStrip({ current, entity, lang = "id", className }) {
  const m = footerStripModel({ current, entity, lang });
  return createElement(
    "k-footer-strip",
    { class: ["k-footer-strip", className].filter(Boolean).join(" "), current, entity: m.entity ?? void 0, lang: m.lang },
    /* @__PURE__ */ jsxs("div", { className: "k-footer-strip__inner", children: [
      /* @__PURE__ */ jsx("p", { className: "k-footer-strip__line", children: m.line }),
      /* @__PURE__ */ jsx("nav", { className: "k-footer-strip__nav", "aria-label": m.navLabel, children: /* @__PURE__ */ jsx("ul", { className: "k-footer-strip__links", children: m.links.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { className: "k-footer-strip__link", href: l.href, children: l.label }) }, l.key)) }) }),
      m.entity ? /* @__PURE__ */ jsx("p", { className: "k-footer-strip__entity", children: m.entity }) : null
    ] })
  );
}
function CardViewer({ className, ...o }) {
  useEffect(() => {
    defineElements();
  }, []);
  const kind = parseKind(o.kind ?? null);
  const slab = kind === "slab";
  const frontImg = /* @__PURE__ */ jsx("img", { src: o.src, alt: o.alt, width: o.width, height: o.height, loading: o.eager ? "eager" : "lazy", decoding: "async", draggable: false });
  const backImg = o.back ? /* @__PURE__ */ jsx("img", { src: o.back, alt: "", loading: "lazy", decoding: "async", draggable: false }) : null;
  const face = (side, img) => /* @__PURE__ */ jsxs("div", { className: `k-cv__face k-cv__face--${side}`, children: [
    slab ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "k-cv__label", children: side === "front" ? o.label ?? "" : "" }),
      /* @__PURE__ */ jsx("div", { className: "k-cv__window", children: img })
    ] }) : img,
    side === "front" ? /* @__PURE__ */ jsx("span", { className: "k-cv__sheen", "aria-hidden": "true" }) : null
  ] });
  return createElement(
    "k-card-viewer",
    { class: className, ...cardViewerHostAttributes(o) },
    /* @__PURE__ */ jsx("div", { className: "k-cv__stage", children: /* @__PURE__ */ jsxs("div", { className: "k-cv__card", children: [
      face("front", frontImg),
      backImg ? face("back", backImg) : null
    ] }) })
  );
}
function Button({ size, variant, shape, mono, icon, children, className, ...rest }) {
  const cls = [buttonClass({ size, variant, shape, mono }), className].filter(Boolean).join(" ");
  const content = /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("span", { children }),
    icon ? /* @__PURE__ */ jsx("span", { className: "k-btn__icon", "aria-hidden": "true", children: icon }) : null
  ] });
  if ("href" in rest && rest.href !== void 0) {
    return /* @__PURE__ */ jsx("a", { className: cls, ...rest, children: content });
  }
  const { type = "button", ...buttonRest } = rest;
  return /* @__PURE__ */ jsx("button", { type, className: cls, ...buttonRest, children: content });
}
export {
  Button,
  CardViewer,
  FooterStrip,
  buttonClass,
  defineElements
};
