export { default as houseKitPreset } from './tailwind.cjs';

declare const tokens: {
    readonly "red-500": "#EE2F42";
    readonly "red-700": "#C81E2F";
    readonly "red-800": "#B0182A";
    readonly ink: "#0A0A0A";
    readonly paper: "#FFFFFF";
    readonly surface: "#F4F4F4";
    readonly line: "#E6E6E6";
    readonly muted: "#6E6E76";
    readonly "amber-text": "#8A5A00";
    readonly "amber-tint": "#FFF4DE";
    readonly "amber-line": "#F2DCA8";
    readonly green: "#0F7A3D";
    readonly "green-tint": "#E9F8EF";
    readonly font: "\"Outfit\",system-ui,sans-serif";
    readonly mono: "\"JetBrains Mono\",ui-monospace,monospace";
    readonly "radius-pill": "9999px";
    readonly "radius-console": "8px";
    readonly "radius-card": "12px";
    readonly fast: "120ms";
    readonly base: "200ms";
    readonly slow: "320ms";
    readonly ease: "cubic-bezier(.2,.7,.2,1)";
};
type TokenName = keyof typeof tokens;
type ProductKey = "kultura" | "kult" | "kios" | "fancon" | "floorpass" | "gelar" | "fangir" | "fanhub";
interface AccentPreset {
    /** Value of --k-accent. */
    accent: string;
    /** Value of --k-on-accent. */
    onAccent: string;
    /**
     * The pair that carries text at body and button sizes. For the red presets the
     * accent (red-500) is a fill and large-type colour only; text-size red uses red-700.
     */
    textPair: {
        bg: string;
        fg: string;
    };
}
declare const productPresets: Record<Exclude<ProductKey, "fanhub">, AccentPreset> & {
    fanhub: null;
};
/** Retired or drifted values and the token they map to. */
declare const legacyColourMap: Record<string, TokenName>;

declare function hexToRgb(hex: string): [number, number, number];
declare function relativeLuminance(hex: string): number;
declare function contrastRatio(a: string, b: string): number;
/** AA thresholds: 4.5 for body text, 3 for large text (24 px, or 18.66 px bold) and UI fills. */
declare const AA_TEXT = 4.5;
declare const AA_LARGE = 3;

type ButtonSize = "hero" | "default" | "compact";
type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "danger";
type ButtonShape = "pill" | "console";
interface ButtonClassOptions {
    size?: ButtonSize;
    variant?: ButtonVariant;
    shape?: ButtonShape;
    /** Mono caps label. Only takes effect with the compact size. */
    mono?: boolean;
}
declare const BUTTON_SIZES: ButtonSize[];
declare const BUTTON_VARIANTS: ButtonVariant[];
declare const BUTTON_SHAPES: ButtonShape[];
declare function buttonClass({ size, variant, shape, mono }?: ButtonClassOptions): string;

interface EcosystemLink {
    key: string;
    label: string;
    href: string;
}
interface FooterStripOptions {
    /** Key of the product rendering the strip; its own link is hidden. */
    current?: string | null;
    /** Legal entity line, e.g. "PT Kultura Digital Kreasi, Jakarta". */
    entity?: string | null;
    /** "id" (default) or "en". */
    lang?: string | null;
}
interface FooterStripModel {
    lang: "id" | "en";
    line: string;
    navLabel: string;
    links: EcosystemLink[];
    entity: string | null;
}
declare const ecosystemLinks: readonly EcosystemLink[];
declare function normaliseLang(lang: string | null | undefined): "id" | "en";
declare function footerStripModel(opts?: FooterStripOptions): FooterStripModel;
/** Inner markup of the strip. Used by the element and by server renderers outside React. */
declare function renderFooterStripInner(model: FooterStripModel): string;
/** Full element markup, ready for server rendering. */
declare function renderFooterStripHTML(opts?: FooterStripOptions): string;

export { AA_LARGE, AA_TEXT, BUTTON_SHAPES, BUTTON_SIZES, BUTTON_VARIANTS, buttonClass, contrastRatio, ecosystemLinks, footerStripModel, hexToRgb, legacyColourMap, normaliseLang, productPresets, relativeLuminance, renderFooterStripHTML, renderFooterStripInner, tokens };
export type { AccentPreset, ButtonClassOptions, ButtonShape, ButtonSize, ButtonVariant, EcosystemLink, FooterStripModel, FooterStripOptions, ProductKey, TokenName };
