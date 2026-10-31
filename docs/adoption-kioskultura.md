# Adoption: grade.kioskultura.com and the kios storefront

These repos are Nuxt (Vue) on GitLab and are read-only for now, so they take the kit as vendored files, not a package. The grading session picks this up when its repos are open for writes. grade.kioskultura.com is the reference implementation (DS-1), so the expected visual change is small.

## Files

From the GitHub release `v0.1.0` of `adesulco/kultura-house-kit`, download:

- `kultura-house-kit.css`: tokens, type scale, buttons, focus, motion, footer strip and card viewer, minified
- `kultura-house-kit.js`: registers `<k-card-viewer>` and `<k-footer-strip>` and starts `.k-reveal` (one file, no dependencies)
- `ecosystem.json`: the footer links, for reference

```bash
gh release download v0.1.0 -R adesulco/kultura-house-kit -p 'kultura-house-kit.*' -D assets/vendor/house-kit
```

Commit them under `assets/vendor/house-kit/` with a one-line `VERSION` file holding `v0.1.0`.

## Steps

1. Load the CSS once, before the app's own styles, in `nuxt.config.ts`: `css: ["~/assets/vendor/house-kit/kultura-house-kit.css", ...]`.
2. Set the product on `<html>`: `app.head.htmlAttrs: { lang: "id", "data-k-product": "kios" }`.
3. Load the elements script on the client only, for example a `plugins/house-kit.client.ts` that imports `~/assets/vendor/house-kit/kultura-house-kit.js`.
4. Tell Vue the `k-` tags are custom elements: `vue.compilerOptions.isCustomElement: (tag) => tag.startsWith("k-")`.
5. Red: replace `#C81E30` with `var(--k-red-700)` (#C81E2F). The two are visually identical; the kit keeps one text-safe red. Fills that use `#EE2F42` become `var(--k-red-500)`.
6. Buttons: map the existing pill to `.k-btn .k-btn--primary` (hero 52 px, default 44 px). The "+ NEW SUBMISSION" pill is 12 px uppercase today; use `.k-btn--compact` at 14 px, sentence case, in one language per page (benchmark 6.7).
7. Footer: below the existing footer add `<k-footer-strip current="kios" entity="PT Kios Gemar Kreasi"></k-footer-strip>`. For server rendering, the markup can be produced at build time with `renderFooterStripHTML()` from the package, or written out by hand from `ecosystem.json`.
8. Slab hero and tracking page (benchmark 6.7, P6): `<k-card-viewer kind="slab" src="..." alt="..." label="PSA 10 · Gem mint" eager><img src="..." alt="..."></k-card-viewer>`. Keep the `<img>` child so the page has the image before the script runs. In a server-rendered Vue page, do not let Vue hydrate the element: the client script upgrades it first and replaces the `<img>` with the stage. Either wrap it in `<ClientOnly>` with the same `<img>` as the `#fallback`, or give the element its stage markup from `renderCardViewerInner()` (generated at build time) through `v-html`; the element adopts that markup and only updates it in place.
9. Walk the pages at 390 and 1280. Run the Lighthouse check by hand until the repo is on GitHub Actions:

```bash
node scripts/lighthouse-mobile.mjs https://grade.kioskultura.com/ https://grade.kioskultura.com/lacak
```

## Updating

Download the next tag's files over the vendored ones and update `VERSION`. Tokens are stable within 0.x minor releases; breaking changes are listed in the kit's CHANGELOG.
