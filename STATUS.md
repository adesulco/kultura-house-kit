# STATUS: kultura-house-kit

Updated 31 Oct 2026 by Build. Plan of record: Benchmark v2, decisions DS-1 to DS-6.

## Where it stands

| Item | State |
|---|---|
| Repo `adesulco/kultura-house-kit` | Public (Ade, 31 Oct 2026). The build prompt said private; public lets every repo and Vercel install from the tag with no token |
| [#1 Tooling and CI fast tier](https://github.com/adesulco/kultura-house-kit/pull/1) | Merged 31 Oct |
| [#2 House kit v0.1](https://github.com/adesulco/kultura-house-kit/pull/2) | Merged 31 Oct, after a review pass (fixes below) |
| Tag [`v0.1.0`](https://github.com/adesulco/kultura-house-kit/releases/tag/v0.1.0) | Tagged 31 Oct on `9adda49`. Release carries `kultura-house-kit.css`, `kultura-house-kit.js`, `tokens.css`, `ecosystem.json` |
| [kultura-co-id #192](https://github.com/adesulco/kultura-co-id/pull/192) | Draft. Tokens, `kultura` preset, `--accent` on red-700, footer strip in place of the bottom rule, Lighthouse job. Walked at 390 and 1280: no change except the strip |
| [fancon-id #26](https://github.com/adesulco/fancon-id/pull/26) | Draft. Install and `fancon` preset only |
| Gelar | Waits for PR-D2 (planned 13 Nov) |
| `adesulco/kultura-house-kit-old` | The first private copy, renamed and kept private. Its old commits carry a personal email, which is why the public repo was created fresh. Safe to delete |

## What shipped in v0.1.0

- `tokens.css` with the exact v0.1 values, byte for byte in `dist/`, and the product presets.
- `base.css`: type scale, buttons, focus ring, motion, footer strip, card viewer. `footer.css` and `motion.css` for FanHub (DS-2).
- `<k-card-viewer>` and `<k-footer-strip>`; React `CardViewer`, `FooterStrip`, `Button`; Tailwind preset; `ecosystem.json`; `renderCardViewerHTML()` and `renderFooterStripHTML()` for server templates.
- Lighthouse mobile script and the reusable `lighthouse-mobile.yml`.
- `examples/`, `docs/button-matrix.png`, `docs/examples-390.png`, `docs/examples-1280.png`, README, `docs/adoption-kioskultura.md`.

Tests: 118 unit (vitest) and 16 browser checks (Playwright at 390 and 1280), passing locally and in CI.

Review fixes before the tag (31 Oct):
- The React `CardViewer` server-renders the whole stage and registers the element after hydration. The element adopts server markup in place. Before this, a server-rendered page lost its hydration.
- `.k-reveal` stays revealed when a re-render rewrites the class list.
- `require("@kultura/house-kit/tailwind")` returns the preset.
- Phone tilt and the flipped side survive moves and reduced-motion changes.
- The footer strip font follows `--k-font`, so it uses the framework-loaded Outfit.
- The Lighthouse check fails a redirect to another origin, such as a protected preview, instead of scoring the sign-in page.
- `check:dist` also catches build files that were never committed.

## Open questions for Ade

1. **White on red-500 is 4.1:1.** The decided spec puts white text at 16 and 18 px on red-500: primary buttons at default and hero size, and the footer strip links. AA needs 4.5:1 at those sizes. Built as decided. The strip line is set at 20 px bold, which passes as large text, and compact buttons switch to red-700. Options: keep as decided, or move the strip background and the primary fill to red-700 (5.7:1). Each is a one-line change.
2. **Branch protection on `main`:** add `quick` and `full` as required checks.
3. **kultura.co.id LCP sits on the line.** One manual run on the live home page: performance 97, LCP 2.51 s against the 2.5 s limit. The workflow gates on the median of three, but the first kultura-co-id PR run may still fail on LCP for reasons unrelated to the kit.
4. **Delete `kultura-house-kit-old`** when convenient (Settings, Danger zone). The login used for builds has no delete permission.
5. **Vercel bypass secret for kultura-co-id.** Its previews sit behind deployment protection, so the Lighthouse job on #192 fails until the repository secret `VERCEL_AUTOMATION_BYPASS_SECRET` exists (Vercel, Deployment Protection, Protection Bypass for Automation).
6. **Strip alignment (v0.1.1 candidate).** At 1280 the strip text starts 32 px left of the kultura.co.id footer columns: the kit uses its own container padding. A `--k-strip-pad` hook would let each site match its grid.

Resolved 31 Oct: install access (repo made public, so no tokens and no Actions access setting are needed).

## Adoption, next

1. Gelar: after PR-D2 merges (planned 13 Nov). Install, `data-k-product="gelar"`, Outfit and JetBrains Mono only, footer strip with `entity="PT Kultura Digital Kreasi, Jakarta"`, Lighthouse on `/` and `/e/fancon-26`.
2. KULT, FanHub (footer only), Counter and the small repos: next window.
3. FloorPass (DS-5): the `floorpass` preset ships in the kit. `DESIGN_BRIEF.md` already reads #C74416 with the dated 31 Oct line; no change needed. App adoption is the FloorPass session's call.
4. grade.kioskultura.com and the kios storefront: no PR; `docs/adoption-kioskultura.md` is ready for the grading session.
