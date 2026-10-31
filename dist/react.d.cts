import * as react from 'react';
import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

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
declare function buttonClass({ size, variant, shape, mono }?: ButtonClassOptions): string;

interface FooterStripProps {
    current?: string;
    entity?: string;
    lang?: "id" | "en";
    className?: string;
}
declare function FooterStrip({ current, entity, lang, className }: FooterStripProps): react.ReactElement<{
    class: string;
    current: string | undefined;
    entity: string | undefined;
    lang: "id" | "en";
}, string | react.JSXElementConstructor<any>>;
interface CardViewerProps {
    src: string;
    alt: string;
    back?: string;
    kind?: "card" | "slab";
    sheen?: "none" | "holo" | "foil";
    maxTilt?: number;
    eager?: boolean;
    /** Slab label text (kind="slab"). */
    label?: string;
    width?: number;
    height?: number;
    className?: string;
}
declare function CardViewer({ src, alt, back, kind, sheen, maxTilt, eager, label, width, height, className }: CardViewerProps): react.ReactElement<{
    class: string | undefined;
    src: string;
    alt: string;
    back: string | undefined;
    kind: "card" | "slab";
    sheen: "none" | "holo" | "foil" | undefined;
    label: string | undefined;
    "max-tilt": string | undefined;
    eager: string | undefined;
}, string | react.JSXElementConstructor<any>>;
type CommonButtonProps = {
    size?: ButtonSize;
    variant?: ButtonVariant;
    shape?: ButtonShape;
    mono?: boolean;
    icon?: ReactNode;
    children?: ReactNode;
};
type ButtonProps = (CommonButtonProps & {
    href?: undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>) | (CommonButtonProps & {
    href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>);
declare function Button({ size, variant, shape, mono, icon, children, className, ...rest }: ButtonProps): react.JSX.Element;

export { Button, CardViewer, FooterStrip, buttonClass };
export type { ButtonProps, CardViewerProps, FooterStripProps };
