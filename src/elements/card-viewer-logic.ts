// Pure helpers for <k-card-viewer>, kept separate so they are unit-testable.

export type CardKind = "card" | "slab";
export type Sheen = "none" | "holo" | "foil";

export const DEFAULT_MAX_TILT = 8;
export const TILT_CEILING = 20;

export const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export function parseKind(value: string | null): CardKind {
  return value === "slab" ? "slab" : "card";
}

export function parseSheen(value: string | null, kind: CardKind): Sheen {
  if (value === "none" || value === "holo" || value === "foil") return value;
  return kind === "slab" ? "none" : "holo";
}

export function parseMaxTilt(value: string | null): number {
  if (value === null || value.trim() === "") return DEFAULT_MAX_TILT;
  const n = Number(value);
  if (!Number.isFinite(n)) return DEFAULT_MAX_TILT;
  return clamp(n, 0, TILT_CEILING);
}

export interface Tilt {
  rx: number;
  ry: number;
}

export interface RectLike {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Pointer position over the element to rotateX/rotateY, clamped to maxTilt. */
export function tiltFromPointer(x: number, y: number, rect: RectLike, maxTilt: number): Tilt {
  if (rect.width <= 0 || rect.height <= 0) return { rx: 0, ry: 0 };
  const nx = clamp(((x - rect.left) / rect.width) * 2 - 1, -1, 1);
  const ny = clamp(((y - rect.top) / rect.height) * 2 - 1, -1, 1);
  return { rx: round(-ny * maxTilt), ry: round(nx * maxTilt) };
}

/** Phone orientation (degrees) relative to where it was held when enabled. 20 degrees of phone tilt reaches maxTilt. */
export function tiltFromOrientation(beta: number, gamma: number, baseBeta: number, maxTilt: number): Tilt {
  const span = 20;
  return {
    rx: round(clamp(-((beta - baseBeta) / span) * maxTilt, -maxTilt, maxTilt)),
    ry: round(clamp((gamma / span) * maxTilt, -maxTilt, maxTilt)),
  };
}

/** Sheen angle and position follow the tilt. */
export function sheenFromTilt({ rx, ry }: Tilt, maxTilt: number): { angle: number; x: number; y: number } {
  const m = maxTilt || 1;
  return { angle: round(115 + (ry / m) * 30), x: round(50 + (ry / m) * 40), y: round(50 - (rx / m) * 40) };
}

export function ariaLabelFor(alt: string, side: "front" | "back"): string {
  return `${alt} (${side === "front" ? "depan" : "belakang"})`;
}

function round(n: number): number {
  const r = Math.round(n * 100) / 100;
  return Object.is(r, -0) ? 0 : r;
}
