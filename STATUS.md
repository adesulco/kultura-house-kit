# STATUS: kultura-house-kit

Updated 31 Oct 2026 by Build. Plan of record: Benchmark v2, decisions DS-1 to DS-6.

## Where it stands

| Item | State |
|---|---|
| Repo `adesulco/kultura-house-kit` | Public (Ade, 31 Oct 2026). The build prompt said private; public lets every repo and Vercel install from the tag with no token |
| [#1 Tooling and CI fast tier](https://github.com/adesulco/kultura-house-kit/pull/1) | Draft. Adds required check `quick` |
| [#2 House kit v0.1](https://github.com/adesulco/kultura-house-kit/pull/2) | Draft, stacked on #1. Sections 2 to 9 built and tested. Adds required check `full` |
| Tag `v0.1.0` | Not yet. Cut after #1 and #2 merge; the release workflow attaches the vendored CSS and JS |
| Adoption PRs | Not opened. The build prompt allows them only after the tag exists |
| `adesulco/kultura-house-kit-old` | The first private copy, renamed and kept private. Its old commits carry a personal email, which is why the public repo was created fresh. Safe to delete |

## What shipped in #2

- `tokens.css` with the exact v0.1 values, byte for byte in `dist/`, and the product presets.
- `base.css`: type scale, buttons, focus ring, motion, footer strip, card viewer. `footer.css` and `motion.css` for FanHub (DS-2).
- `<k-card-viewer>` and `<k-footer-strip>`; React `CardViewer`, `FooterStrip`, `Button`; Tailwind preset; `ecosystem.json`.
- Lighthouse mobile script and the reusable `lighthouse-mobile.yml`.
- `examples/`, `docs/button-matrix.png`, `docs/examples-390.png`, `docs/examples-1280.png`, README, `docs/adoption-kioskultura.md`.

Tests: 103 unit (vitest) and 16 browser checks (Playwright at 390 and 1280), all passing locally and in CI.

## Open questions for Ade

1. **White on red-500 is 4.1:1.** The decided spec puts white text at 16 and 18 px on red-500: primary buttons at default and hero size, and the footer strip links. AA needs 4.5:1 at those sizes. Built as decided. The strip line is set at 20 px bold, which passes as large text, and compact buttons switch to red-700. Options: keep as decided, or move the strip background and the primary fill to red-700 (5.7:1). Each is a one-line change.
2. **Branch protection on `main`:** add `quick` and `full` as required checks.
3. **kultura.co.id LCP sits on the line.** One manual run on the live home page: performance 97, LCP 2.51 s against the 2.5 s limit. The workflow gates on the median of three, but the first kultura-co-id PR run may still fail on LCP for reasons unrelated to the kit.
4. **Delete `kultura-house-kit-old`** when convenient (Settings, Danger zone). The login used for builds has no delete permission.

Resolved 31 Oct: install access (repo made public, so no tokens and no Actions access setting are needed).

## Adoption plan (after the tag)

1. `adesulco/kultura-co-id` (draft): add the dependency in `nextjs/`; set `data-k-product="kultura"` on `<html>` in the locale layout; import `@kultura/house-kit/tokens.css` and `@kultura/house-kit/footer.css` before `styles/kultura.css`. Not `base.css`: the site already has its own `.k-btn` (21 rules) and `--k-ink`, `--k-paper`, `--k-surface`, `--k-font`, and `base.css` would change them. Values of the shared names already match. Map `--accent` (#C81E2F) to `var(--k-red-700)`. Replace the red `<div class="k-rule">` under the footer with `<FooterStrip current="kultura" entity="PT Kios Gemar Kreasi" lang={locale} />`. Add the Lighthouse job on `/` and `/en`. Walk 390 and 1280.
2. `adesulco/fancon-id` (draft): install, `data-k-product="fancon"`. The FanCon pilot session swaps its local tokens for the kit.
3. Gelar: waits for PR-D2 (planned 13 Nov).
4. KULT, FanHub (footer only), Counter and the small repos: next window.
5. FloorPass (DS-5): the `floorpass` preset ships in the kit. `DESIGN_BRIEF.md` already reads #C74416 with the dated 31 Oct line; no change needed.
6. grade.kioskultura.com and the kios storefront: no PR; `docs/adoption-kioskultura.md` is ready for the grading session.
