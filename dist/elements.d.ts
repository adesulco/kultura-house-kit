type CardKind = "card" | "slab";
type Sheen = "none" | "holo" | "foil";
declare const DEFAULT_MAX_TILT = 8;
declare const TILT_CEILING = 20;
declare const clamp: (n: number, min: number, max: number) => number;
declare function parseKind(value: string | null): CardKind;
declare function parseSheen(value: string | null, kind: CardKind): Sheen;
declare function parseMaxTilt(value: string | null): number;
interface Tilt {
    rx: number;
    ry: number;
}
interface RectLike {
    left: number;
    top: number;
    width: number;
    height: number;
}
/** Pointer position over the element to rotateX/rotateY, clamped to maxTilt. */
declare function tiltFromPointer(x: number, y: number, rect: RectLike, maxTilt: number): Tilt;
/** Phone orientation (degrees) relative to where it was held when enabled. 20 degrees of phone tilt reaches maxTilt. */
declare function tiltFromOrientation(beta: number, gamma: number, baseBeta: number, maxTilt: number): Tilt;
/** Sheen angle and position follow the tilt. */
declare function sheenFromTilt({ rx, ry }: Tilt, maxTilt: number): {
    angle: number;
    x: number;
    y: number;
};
declare function ariaLabelFor(alt: string, side: "front" | "back"): string;

declare const HTMLElementBase$1: typeof HTMLElement;
declare class KCardViewer extends HTMLElementBase$1 {
    static observedAttributes: string[];
    /** Frames written since connect. Read by tests to prove the loop stops on leave. */
    frames: number;
    /** True only while a pointer is over the element (or a touch drag or phone tilt is live). */
    looping: boolean;
    private card;
    private side;
    private target;
    private raf;
    private rendered;
    private orientation;
    private baseBeta;
    private visible;
    private dragStart;
    private dragged;
    private io;
    private mql;
    get parsedKind(): CardKind;
    get parsedSheen(): Sheen;
    get parsedMaxTilt(): number;
    get hasBack(): boolean;
    get currentSide(): "front" | "back";
    get reduced(): boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void;
    /** Builds the stage. Reuses a server-rendered <img> child as the front face. */
    private render;
    private face;
    /** Never upscale beyond the image's natural width. */
    private capUpscale;
    private syncA11y;
    private syncReduced;
    private onReducedChange;
    private onEnter;
    private onMove;
    private onLeave;
    private onDown;
    private onUp;
    private updateFromPointer;
    private onClick;
    private onKey;
    private isTouchDevice;
    /** Called from a tap. iOS asks for permission here; refusal falls back to drag-to-tilt. */
    enableOrientation(): void;
    private useDrag;
    private onOrientation;
    private startLoop;
    private stopLoop;
    private schedule;
    /** Return to flat over --k-slow and drop will-change. */
    private settle;
    private setTilt;
    /** Flips to the other side. Instant swap under reduced motion. */
    flip(): void;
    private applySide;
}
declare function defineCardViewer(registry?: CustomElementRegistry | undefined): void;

declare const HTMLElementBase: typeof HTMLElement;
declare class KFooterStrip extends HTMLElementBase {
    static observedAttributes: string[];
    private ready;
    connectedCallback(): void;
    attributeChangedCallback(_n: string, oldValue: string | null, newValue: string | null): void;
    private render;
}
declare function defineFooterStrip(registry?: CustomElementRegistry | undefined): void;

declare function initReveal(root?: Document): () => void;

declare function defineElements(): void;

export { DEFAULT_MAX_TILT, KCardViewer, KFooterStrip, TILT_CEILING, ariaLabelFor, clamp, defineCardViewer, defineElements, defineFooterStrip, initReveal, parseKind, parseMaxTilt, parseSheen, sheenFromTilt, tiltFromOrientation, tiltFromPointer };
export type { CardKind, RectLike, Sheen, Tilt };
