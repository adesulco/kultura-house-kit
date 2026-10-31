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

export { DEFAULT_MAX_TILT as D, TILT_CEILING as T, ariaLabelFor as b, clamp as c, parseMaxTilt as d, parseSheen as e, tiltFromPointer as f, parseKind as p, sheenFromTilt as s, tiltFromOrientation as t };
export type { CardKind as C, RectLike as R, Sheen as S, Tilt as a };
