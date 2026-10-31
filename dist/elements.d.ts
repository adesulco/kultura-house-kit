import { C as CardKind, S as Sheen } from './card-viewer-logic-m3dOgi8_.js';
export { D as DEFAULT_MAX_TILT, R as RectLike, T as TILT_CEILING, a as Tilt, b as ariaLabelFor, c as clamp, p as parseKind, d as parseMaxTilt, e as parseSheen, s as sheenFromTilt, t as tiltFromOrientation, f as tiltFromPointer } from './card-viewer-logic-m3dOgi8_.js';

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
    /** True when the stage came from the server (React or a template); then it is updated in place, never rebuilt. */
    private adopted;
    private orientation;
    private baseBeta;
    private visible;
    private dragStart;
    private dragged;
    private io;
    private mql;
    /** The card node, looked up again if the page replaced the inner markup since. */
    private get cardEl();
    get parsedKind(): CardKind;
    get parsedSheen(): Sheen;
    get parsedMaxTilt(): number;
    get hasBack(): boolean;
    get currentSide(): "front" | "back";
    get reduced(): boolean;
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Builds the stage, or adopts one already in the markup (server-rendered by the React wrapper
     * or renderCardViewerHTML). An adopted stage is only updated in place: a framework that
     * hydrated it still owns those nodes, so they are never replaced.
     */
    private render;
    private adopt;
    private build;
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

export { CardKind, KCardViewer, KFooterStrip, Sheen, defineCardViewer, defineElements, defineFooterStrip, initReveal };
