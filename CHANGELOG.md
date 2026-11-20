# Changelog

## 0.1.3

- Footer strip: the FanCon link goes to `https://fancon.id`, FanCon's domain from 9 November 2026 (FanCon web decisions 9 Nov 2026, #2). `fancon.co.id` keeps a permanent redirect to it. Merge only once `fancon.id` answers.

## 0.1.2

- Lighthouse check: the Vercel bypass secret is no longer sent as a header. Lighthouse added that header to every request, so the secret reached third-party hosts such as image CDNs. Before each run the script now opens Vercel's bypass link on the preview host in a throwaway tab, which sets a cookie for that host only, then measures the clean URL. Error text has the secret redacted. The workflow passes it as `LH_VERCEL_BYPASS`.
- Footer strip: the store link reads "Kultura Store", the current name ("Kios Kultura" is retired). The link is unchanged.
- README and workflow header: callers pin the kit workflow to a commit, pass only the bypass secret, and measure `/en` and `/id`.

## 0.1.1

- Red buttons fill with red-700 at every size; red-500 with white text was 4.1:1. The accent variant takes each preset's text-safe pair at every size.
- Footer strip: links and the entity line are 19 px bold, so all its white-on-red-500 text is large (AA at 3:1).
- Footer strip: `--k-strip-max` and `--k-strip-pad` let a site match its own container.
- Lighthouse workflow checks out the v0.1.1 script by default.

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
