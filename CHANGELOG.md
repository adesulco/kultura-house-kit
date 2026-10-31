# Changelog

## 0.1.0

First release.

- Tokens (`tokens.css`) with the v0.1 values and product accent presets: kultura, kult, kios, fancon, floorpass, gelar, fangir. FanHub sets none.
- `base.css`: type scale, buttons (3 sizes, 5 variants, pill and console), focus ring, motion rules, footer strip, card viewer.
- `footer.css` and `motion.css` for products that keep their own tokens.
- `<k-card-viewer>` (card and slab, pointer and phone tilt, holo and foil sheen, flip) and `<k-footer-strip>` custom elements.
- React wrappers: `CardViewer`, `FooterStrip`, `Button`. Tailwind preset. `ecosystem.json`.
- Lighthouse mobile check script and reusable workflow.
- Vendored `kultura-house-kit.css` and `kultura-house-kit.js` attached to the release.
- Server rendering: `renderCardViewerHTML()` and `renderCardViewerInner()`; the React `CardViewer` server-renders the stage and registers after hydration, and the element adopts server markup in place.
- The footer strip font follows `--k-font` when the page sets it (framework font loaders), else Outfit.
- The Lighthouse check fails a page that redirected to another origin (a protected preview) instead of scoring the sign-in page.
