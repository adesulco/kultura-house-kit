// <k-card-viewer>: one card or slab, large, tilting with the pointer or the phone.
import {
  ariaLabelFor, parseKind, parseMaxTilt, parseSheen, sheenFromTilt, tiltFromOrientation, tiltFromPointer,
  type CardKind, type Sheen, type Tilt,
} from "./card-viewer-logic";

const HTMLElementBase: typeof HTMLElement =
  typeof HTMLElement === "undefined" ? (class {} as unknown as typeof HTMLElement) : HTMLElement;

const reducedQuery = () =>
  typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;

type OrientationCtor = { requestPermission?: () => Promise<"granted" | "denied"> };

export class KCardViewer extends HTMLElementBase {
  static observedAttributes = ["src", "back", "alt", "kind", "sheen", "max-tilt", "eager", "label"];

  /** Frames written since connect. Read by tests to prove the loop stops on leave. */
  frames = 0;
  /** True only while a pointer is over the element (or a touch drag or phone tilt is live). */
  looping = false;

  private card: HTMLElement | null = null;
  private side: "front" | "back" = "front";
  private target: Tilt = { rx: 0, ry: 0 };
  private raf = 0;
  private rendered = false;
  private orientation: "off" | "pending" | "on" | "drag" = "off";
  private baseBeta: number | null = null;
  private visible = true;
  private dragStart: { x: number; y: number } | null = null;
  private dragged = false;
  private io: IntersectionObserver | null = null;
  private mql: MediaQueryList | null = null;

  get parsedKind(): CardKind { return parseKind(this.getAttribute("kind")); }
  get parsedSheen(): Sheen { return parseSheen(this.getAttribute("sheen"), this.parsedKind); }
  get parsedMaxTilt(): number { return parseMaxTilt(this.getAttribute("max-tilt")); }
  get hasBack(): boolean { return !!this.getAttribute("back"); }
  get currentSide(): "front" | "back" { return this.side; }
  get reduced(): boolean { return !!reducedQuery()?.matches; }

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
    this.io?.disconnect();
    this.io = null;
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
    if (this.rendered && oldValue !== newValue) this.render();
  }

  /** Builds the stage. Reuses a server-rendered <img> child as the front face. */
  private render() {
    const doc = this.ownerDocument;
    const alt = this.getAttribute("alt") ?? "";
    const eager = this.hasAttribute("eager");
    const existing = this.querySelector<HTMLImageElement>(":scope > img, .k-cv__face--front img");
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

    this.dataset.kKind = this.parsedKind;
    this.dataset.kSheen = this.parsedSheen;
    this.capUpscale(front);
    if (!backSrc) this.side = "front";
    this.syncA11y(alt);
    this.syncReduced();
    this.applySide(false);
    this.rendered = true;
  }

  private face(side: "front" | "back", img: HTMLImageElement): HTMLElement {
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
  private capUpscale(img: HTMLImageElement) {
    const apply = () => {
      if (!img.naturalWidth) return;
      img.style.maxWidth = `${img.naturalWidth}px`;
      if (this.parsedKind === "card") this.style.setProperty("--k-cv-max", `${img.naturalWidth}px`);
    };
    if (img.complete) apply();
    else img.addEventListener("load", apply, { once: true });
  }

  private syncA11y(alt: string) {
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

  private syncReduced() {
    if (this.reduced) {
      this.dataset.kReduced = "";
      this.stopLoop();
      this.setTilt({ rx: 0, ry: 0 });
    } else {
      delete this.dataset.kReduced;
    }
  }

  private onReducedChange = () => this.syncReduced();

  // Pointer: desktop tilt.
  private onEnter = (e: PointerEvent) => {
    if (this.reduced || e.pointerType === "touch") return;
    this.startLoop();
    this.updateFromPointer(e);
  };

  private onMove = (e: PointerEvent) => {
    if (this.reduced) return;
    if (e.pointerType === "touch") {
      if (this.orientation !== "drag" || !this.dragStart) return;
      if (Math.abs(e.clientX - this.dragStart.x) > 6 || Math.abs(e.clientY - this.dragStart.y) > 6) this.dragged = true;
    }
    if (!this.looping) return;
    this.updateFromPointer(e);
  };

  private onLeave = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    this.settle();
  };

  private onDown = (e: PointerEvent) => {
    this.dragged = false;
    if (e.pointerType !== "touch" || this.reduced || this.orientation !== "drag") return;
    this.dragStart = { x: e.clientX, y: e.clientY };
    this.startLoop();
    this.updateFromPointer(e);
  };

  private onUp = (e: PointerEvent) => {
    if (e.pointerType !== "touch" || !this.dragStart) return;
    this.dragStart = null;
    this.settle();
  };

  private updateFromPointer(e: PointerEvent) {
    const stage = this.card?.parentElement;
    if (!stage) return;
    this.target = tiltFromPointer(e.clientX, e.clientY, stage.getBoundingClientRect(), this.parsedMaxTilt);
    this.schedule();
  }

  // Phone: orientation after the first tap, drag-to-tilt when refused or unavailable.
  private onClick = (e: MouseEvent) => {
    if (this.dragged) { this.dragged = false; e.preventDefault(); return; }
    const pointerType = (e as PointerEvent).pointerType;
    if (pointerType === "touch" || (pointerType === undefined && this.isTouchDevice())) this.enableOrientation();
    if (this.hasBack) this.flip();
  };

  private onKey = (e: KeyboardEvent) => {
    if (!this.hasBack) return;
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      this.flip();
    }
  };

  private isTouchDevice() {
    return typeof matchMedia === "function" && matchMedia("(hover: none) and (pointer: coarse)").matches;
  }

  /** Called from a tap. iOS asks for permission here; refusal falls back to drag-to-tilt. */
  enableOrientation() {
    if (this.reduced || this.orientation !== "off" || typeof window === "undefined") return;
    const Ctor = (window as unknown as { DeviceOrientationEvent?: OrientationCtor }).DeviceOrientationEvent;
    if (!Ctor) { this.orientation = "drag"; return; }
    this.orientation = "pending";
    const listen = () => {
      this.orientation = "on";
      window.addEventListener("deviceorientation", this.onOrientation);
      // Some browsers expose the API but never fire events (desktop, some WebViews).
      setTimeout(() => { if (this.baseBeta === null && this.orientation === "on") this.useDrag(); }, 1000);
    };
    if (typeof Ctor.requestPermission === "function") {
      Ctor.requestPermission().then((state) => (state === "granted" ? listen() : this.useDrag())).catch(() => this.useDrag());
    } else {
      listen();
    }
  }

  private useDrag() {
    window.removeEventListener("deviceorientation", this.onOrientation);
    this.orientation = "drag";
  }

  private onOrientation = (e: DeviceOrientationEvent) => {
    if (this.reduced || !this.visible || e.beta === null || e.gamma === null) return;
    if (this.baseBeta === null) this.baseBeta = e.beta;
    this.looping = true;
    this.target = tiltFromOrientation(e.beta, e.gamma, this.baseBeta, this.parsedMaxTilt);
    this.schedule();
  };

  // Frame loop: one requestAnimationFrame at a time, only while looping.
  private startLoop() {
    if (this.looping) return;
    this.looping = true;
    delete this.dataset.kState;
    if (this.card) this.card.style.willChange = "transform";
  }

  private stopLoop() {
    this.looping = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private schedule() {
    if (!this.looping || this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      if (!this.looping) return;
      this.frames++;
      this.setTilt(this.target);
    });
  }

  /** Return to flat over --k-slow and drop will-change. */
  private settle() {
    this.stopLoop();
    this.dataset.kState = "settling";
    this.setTilt({ rx: 0, ry: 0 });
    const card = this.card;
    const done = () => {
      if (card) card.style.willChange = "";
      if (this.dataset.kState === "settling") delete this.dataset.kState;
    };
    if (card) {
      card.addEventListener("transitionend", done, { once: true });
      setTimeout(done, 400);
    }
  }

  private setTilt(t: Tilt) {
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

  private applySide(animate: boolean) {
    this.dataset.kSide = this.side;
    if (this.reduced) {
      this.style.setProperty("--k-flip", "0deg");
      return;
    }
    if (animate) {
      this.dataset.kState = "flipping";
      setTimeout(() => { if (this.dataset.kState === "flipping") delete this.dataset.kState; }, 360);
    }
    this.style.setProperty("--k-flip", this.side === "back" ? "180deg" : "0deg");
  }
}

export function defineCardViewer(registry: CustomElementRegistry | undefined = globalThis.customElements) {
  if (registry && !registry.get("k-card-viewer")) registry.define("k-card-viewer", KCardViewer);
}
