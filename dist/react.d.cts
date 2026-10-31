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

type CardKind = "card" | "slab";
type Sheen = "none" | "holo" | "foil";

interface CardViewerMarkupOptions {
    src: string;
    alt: string;
    back?: string;
    kind?: CardKind;
    sheen?: Sheen;
    maxTilt?: number;
    eager?: boolean;
    /** Slab label text (kind="slab"). */
    label?: string;
    width?: number;
    height?: number;
}

declare function defineElements(): void;

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
interface CardViewerProps extends CardViewerMarkupOptions {
    className?: string;
}
/**
 * Server-renders the whole stage (the same markup as renderCardViewerHTML), and registers the
 * element only after hydration. The element then adopts these nodes and updates them in place,
 * so React's tree and the DOM never disagree.
 */
declare function CardViewer({ className, ...o }: CardViewerProps): react.ReactElement<{
    class: string | undefined;
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

export { Button, CardViewer, FooterStrip, buttonClass, defineElements };
export type { ButtonProps, CardViewerProps, FooterStripProps };
