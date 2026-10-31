// JavaScript mirror of tokens.css. tests/tokens.test.ts keeps the two identical.

export const tokens = {
  "red-500": "#EE2F42",
  "red-700": "#C81E2F",
  "red-800": "#B0182A",
  ink: "#0A0A0A",
  paper: "#FFFFFF",
  surface: "#F4F4F4",
  line: "#E6E6E6",
  muted: "#6E6E76",
  "amber-text": "#8A5A00",
  "amber-tint": "#FFF4DE",
  "amber-line": "#F2DCA8",
  green: "#0F7A3D",
  "green-tint": "#E9F8EF",
  font: '"Outfit",system-ui,sans-serif',
  mono: '"JetBrains Mono",ui-monospace,monospace',
  "radius-pill": "9999px",
  "radius-console": "8px",
  "radius-card": "12px",
  fast: "120ms",
  base: "200ms",
  slow: "320ms",
  ease: "cubic-bezier(.2,.7,.2,1)",
} as const;

export type TokenName = keyof typeof tokens;

export type ProductKey = "kultura" | "kult" | "kios" | "fancon" | "floorpass" | "gelar" | "fangir" | "fanhub";

export interface AccentPreset {
  /** Value of --k-accent. */
  accent: string;
  /** Value of --k-on-accent. */
  onAccent: string;
  /**
   * The pair that carries text at body and button sizes. For the red presets the
   * accent (red-500) is a fill and large-type colour only; text-size red uses red-700.
   */
  textPair: { bg: string; fg: string };
}

const red: AccentPreset = {
  accent: tokens["red-500"],
  onAccent: "#FFFFFF",
  textPair: { bg: tokens["red-700"], fg: "#FFFFFF" },
};

export const productPresets: Record<Exclude<ProductKey, "fanhub">, AccentPreset> & { fanhub: null } = {
  kultura: red,
  kult: red,
  kios: red,
  fancon: { accent: "#EFFF42", onAccent: "#0A0A0A", textPair: { bg: "#EFFF42", fg: "#0A0A0A" } },
  floorpass: { accent: "#C74416", onAccent: "#FFFFFF", textPair: { bg: "#C74416", fg: "#FFFFFF" } },
  gelar: { accent: "#141414", onAccent: "#FFF4E1", textPair: { bg: "#141414", fg: "#FFF4E1" } },
  fangir: { accent: "#002366", onAccent: "#FFFFFF", textPair: { bg: "#002366", fg: "#FFFFFF" } },
  // FanHub keeps its own tokens (DS-2).
  fanhub: null,
};

/** Retired or drifted values and the token they map to. */
export const legacyColourMap: Record<string, TokenName> = {
  "#C81E30": "red-700", // PSA submission site, set 16 Oct 2026
};
