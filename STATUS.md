# STATUS: kultura-house-kit

Updated 1 Nov 2026 by Build. Clean stop: nothing uncommitted, no kit PR open. Plan of record: Benchmark v2, decisions DS-1 to DS-6.

## Where it stands

| Item | State |
|---|---|
| Repo `adesulco/kultura-house-kit` | Public (Ade, 31 Oct 2026). The build prompt said private; public lets every repo and Vercel install from the tag with no token |
| [#1 Tooling and CI fast tier](https://github.com/adesulco/kultura-house-kit/pull/1) | Merged 31 Oct |
| [#2 House kit v0.1](https://github.com/adesulco/kultura-house-kit/pull/2) | Merged 31 Oct, after a review pass (fixes below) |
| Tag [`v0.1.0`](https://github.com/adesulco/kultura-house-kit/releases/tag/v0.1.0) | Tagged 31 Oct on `9adda49`. Release carries `kultura-house-kit.css`, `kultura-house-kit.js`, `tokens.css`, `ecosystem.json` |
| Tag [`v0.1.1`](https://github.com/adesulco/kultura-house-kit/releases/tag/v0.1.1) | Tagged 1 Nov ([#14](https://github.com/adesulco/kultura-house-kit/pull/14)). Ade's 1 Nov decisions: red buttons fill with red-700 at every size; the strip keeps red-500 with all text 19 px bold (AA as large text); `--k-strip-max` and `--k-strip-pad` container hooks |
| Dependencies | 1 Nov: actions group, jsdom 30, TypeScript 6, ESLint 10 merged ([#12](https://github.com/adesulco/kultura-house-kit/pull/12)); major @types/node and React updates ignored on purpose (Node 22, React 18 floor) |
| Branch protection | 1 Nov: `quick` and `full` required on `main` |
| [kultura-co-id #192](https://github.com/adesulco/kultura-co-id/pull/192) | Draft, on v0.1.1. Tokens, `kultura` preset, `--accent` on red-700, footer strip in place of the bottom rule, lined up with the footer columns (28 px at 390, 72 px at 1280), Lighthouse job. Site CI and the Vercel preview are green. The `lighthouse` check fails because the preview redirects to the Vercel sign-in page, so nothing is measured: not a threshold miss, not a regression. It needs the repository secret `VERCEL_AUTOMATION_BYPASS_SECRET` (not present at 1 Nov 05:00 WIB) |
| [fancon-id #26](https://github.com/adesulco/fancon-id/pull/26) | Merged 1 Nov on v0.1.0. Install and `fancon` preset only; no visual change. The FanCon pilot moves it to v0.1.1 when it imports the kit CSS |
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

## Waiting on Ade

1. **Vercel bypass secret for kultura-co-id.** Create it in Vercel (kultura-co-id, Settings, Deployment Protection, Protection Bypass for Automation) and save it in GitHub as the repository secret `VERCEL_AUTOMATION_BYPASS_SECRET` (Settings, Secrets and variables, Actions). Then rerun the `lighthouse` check on #192.
2. **Merge kultura-co-id #192** once Lighthouse passes. Watch LCP: one manual run on the live home page measured 2.51 s against the 2.5 s limit.
3. **Delete `kultura-house-kit-old`** (Settings, Danger zone). The build login has no delete permission.

Resolved 31 Oct: install access (repo made public, so no tokens and no Actions access setting are needed).
Resolved 1 Nov (Ade): red contrast (red-700 buttons, large bold strip text), strip alignment (container hooks), branch protection, dependency updates. One commit on `main` (0ea38aa, a GitHub-side merge) shows ade@kultura.co.id as committer; Ade chose to leave it. Kit merges are done locally from now on so commits keep the no-reply address.

## Next

1. Gelar: after PR-D2 merges (planned 13 Nov). Install v0.1.1, `data-k-product="gelar"`, Outfit and JetBrains Mono only, footer strip with `entity="PT Kultura Digital Kreasi, Jakarta"`, strip hooks set to Gelar's container, Lighthouse on `/` and `/e/fancon-26`.
2. FanCon pilot (`BUILD_PROMPT_FanCon_Web_Poster_Arsip_2026-11-03.md`): bump fancon-id to v0.1.1 and import the kit CSS there.
3. KULT, FanHub (footer only), Counter and the small repos: next window.
4. FloorPass (DS-5): the `floorpass` preset ships in the kit; app adoption is the FloorPass session's call.
5. grade.kioskultura.com and the kios storefront: no PR; `docs/adoption-kioskultura.md` (now on v0.1.1) is ready for the grading session.
