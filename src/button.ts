// Class builder for the house buttons, for templates outside React.

export type ButtonSize = "hero" | "default" | "compact";
export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "danger";
export type ButtonShape = "pill" | "console";

export interface ButtonClassOptions {
  size?: ButtonSize;
  variant?: ButtonVariant;
  shape?: ButtonShape;
  /** Mono caps label. Only takes effect with the compact size. */
  mono?: boolean;
}

export const BUTTON_SIZES: ButtonSize[] = ["hero", "default", "compact"];
export const BUTTON_VARIANTS: ButtonVariant[] = ["primary", "secondary", "ghost", "accent", "danger"];
export const BUTTON_SHAPES: ButtonShape[] = ["pill", "console"];

export function buttonClass({ size = "default", variant = "primary", shape = "pill", mono = false }: ButtonClassOptions = {}): string {
  const out = ["k-btn", `k-btn--${variant}`];
  if (size !== "default") out.push(`k-btn--${size}`);
  if (shape !== "pill") out.push(`k-btn--${shape}`);
  if (mono && size === "compact") out.push("k-btn--mono");
  return out.join(" ");
}
