// <k-footer-strip>: renders the strip when it arrives empty. Server-rendered markup is left as is.
import { footerStripModel, renderFooterStripInner } from "../footer-model";

const HTMLElementBase: typeof HTMLElement =
  typeof HTMLElement === "undefined" ? (class {} as unknown as typeof HTMLElement) : HTMLElement;

export class KFooterStrip extends HTMLElementBase {
  static observedAttributes = ["current", "entity", "lang"];
  private ready = false;

  connectedCallback() {
    this.classList.add("k-footer-strip");
    if (!this.querySelector(".k-footer-strip__inner")) this.render();
    this.ready = true;
  }

  attributeChangedCallback(_n: string, oldValue: string | null, newValue: string | null) {
    if (this.ready && oldValue !== newValue) this.render();
  }

  private render() {
    const model = footerStripModel({
      current: this.getAttribute("current"),
      entity: this.getAttribute("entity"),
      lang: this.getAttribute("lang"),
    });
    this.innerHTML = renderFooterStripInner(model);
  }
}

export function defineFooterStrip(registry: CustomElementRegistry | undefined = globalThis.customElements) {
  if (registry && !registry.get("k-footer-strip")) registry.define("k-footer-strip", KFooterStrip);
}
