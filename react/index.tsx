// Thin React wrappers. Server output is plain HTML, so nothing shifts when the elements upgrade.
// Custom elements take `class` (React 18 does not map className on them).
import { createElement, useEffect, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { buttonClass, type ButtonShape, type ButtonSize, type ButtonVariant } from "../src/button";
import { footerStripModel } from "../src/footer-model";
import { cardViewerHostAttributes, type CardViewerMarkupOptions } from "../src/card-viewer-markup";
import { parseKind } from "../src/elements/card-viewer-logic";
import { defineElements } from "../src/elements/define";

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

export interface CardViewerProps extends CardViewerMarkupOptions {
  className?: string;
}

/**
 * Server-renders the whole stage (the same markup as renderCardViewerHTML), and registers the
 * element only after hydration. The element then adopts these nodes and updates them in place,
 * so React's tree and the DOM never disagree.
 */
export function CardViewer({ className, ...o }: CardViewerProps) {
  useEffect(() => { defineElements(); }, []);
  const kind = parseKind(o.kind ?? null);
  const slab = kind === "slab";
  const frontImg = (
    <img src={o.src} alt={o.alt} width={o.width} height={o.height} loading={o.eager ? "eager" : "lazy"} decoding="async" draggable={false} />
  );
  const backImg = o.back ? <img src={o.back} alt="" loading="lazy" decoding="async" draggable={false} /> : null;
  const face = (side: "front" | "back", img: ReactNode) => (
    <div className={`k-cv__face k-cv__face--${side}`}>
      {slab ? (
        <>
          <div className="k-cv__label">{side === "front" ? o.label ?? "" : ""}</div>
          <div className="k-cv__window">{img}</div>
        </>
      ) : img}
      {side === "front" ? <span className="k-cv__sheen" aria-hidden="true" /> : null}
    </div>
  );
  return createElement(
    "k-card-viewer",
    { class: className, ...cardViewerHostAttributes(o) },
    <div className="k-cv__stage">
      <div className="k-cv__card">
        {face("front", frontImg)}
        {backImg ? face("back", backImg) : null}
      </div>
    </div>,
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
