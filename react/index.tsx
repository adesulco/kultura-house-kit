// Thin React wrappers. Server output is plain HTML, so nothing shifts when the elements upgrade.
// Custom elements take `class` (React 18 does not map className on them).
import { createElement, useEffect, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { buttonClass, type ButtonShape, type ButtonSize, type ButtonVariant } from "../src/button";
import { footerStripModel } from "../src/footer-model";
import { defineElements } from "../src/elements/index";

export interface FooterStripProps {
  current?: string;
  entity?: string;
  lang?: "id" | "en";
  className?: string;
}

export function FooterStrip({ current, entity, lang = "id", className }: FooterStripProps) {
  const m = footerStripModel({ current, entity, lang });
  return createElement(
    "k-footer-strip",
    { class: ["k-footer-strip", className].filter(Boolean).join(" "), current, entity: m.entity ?? undefined, lang: m.lang },
    <div className="k-footer-strip__inner">
      <p className="k-footer-strip__line">{m.line}</p>
      <nav className="k-footer-strip__nav" aria-label={m.navLabel}>
        <ul className="k-footer-strip__links">
          {m.links.map((l) => (
            <li key={l.key}>
              <a className="k-footer-strip__link" href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      {m.entity ? <p className="k-footer-strip__entity">{m.entity}</p> : null}
    </div>,
  );
}

export interface CardViewerProps {
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

export function CardViewer({ src, alt, back, kind = "card", sheen, maxTilt, eager, label, width, height, className }: CardViewerProps) {
  useEffect(() => { defineElements(); }, []);
  return createElement(
    "k-card-viewer",
    {
      class: className,
      src,
      alt,
      back,
      kind,
      sheen,
      label,
      "max-tilt": maxTilt === undefined ? undefined : String(maxTilt),
      eager: eager ? "" : undefined,
    },
    <img src={src} alt={alt} width={width} height={height} loading={eager ? "eager" : "lazy"} decoding="async" />,
  );
}

type CommonButtonProps = {
  size?: ButtonSize;
  variant?: ButtonVariant;
  shape?: ButtonShape;
  mono?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
};

export type ButtonProps =
  | (CommonButtonProps & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  | (CommonButtonProps & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>);

export function Button({ size, variant, shape, mono, icon, children, className, ...rest }: ButtonProps) {
  const cls = [buttonClass({ size, variant, shape, mono }), className].filter(Boolean).join(" ");
  const content = (
    <>
      <span>{children}</span>
      {icon ? <span className="k-btn__icon" aria-hidden="true">{icon}</span> : null}
    </>
  );
  if ("href" in rest && rest.href !== undefined) {
    return <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{content}</a>;
  }
  const { type = "button", ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button type={type} className={cls} {...buttonRest}>{content}</button>;
}

export { buttonClass };
