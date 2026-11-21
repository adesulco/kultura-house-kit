# STATUS: kultura-house-kit

Updated 21 Nov 2026 by Build. Plan of record: Benchmark v2, decisions DS-1 to DS-6.

## Start here: clean stop, Saturday 21 November 2026

The house kit session stopped on 21 November 2026, on Ade's word. No kit work is in progress. The next session reads this block first.

- **`main` is clean** at `30eaa22`, the merge of #24. CI on `main` passed for both merges. Nothing is uncommitted.
- **v0.1.4 is released.** Ade merged [#20](https://github.com/adesulco/kultura-house-kit/pull/20) (v0.1.3) and [#24](https://github.com/adesulco/kultura-house-kit/pull/24) (v0.1.4) on 20 November 2026 and tagged `v0.1.4` on `30eaa22`. The release carries its four files: `kultura-house-kit.css`, `kultura-house-kit.js`, `tokens.css`, `ecosystem.json`.
- **v0.1.3 has no tag of its own.** Its change (the strip's FanCon link to `https://fancon.id`) ships inside v0.1.4. Products install `#v0.1.4`, never `#v0.1.3`.
- **The arrow rule** (Ade, D10, 19 November 2026): no arrow glyphs on any Kultura site; a link that leaves a site says where it goes in words. It is in the README "Do not" list. A chevron used as an arrow counts as an arrow; a small triangle does not, because it marks a control that opens or sorts. `tests/no-arrows.test.ts` sweeps every tracked text file, `dist/` included. It runs on the kit only; each product needs its own copy.
- **FanCon** is off the kit's type and buttons (Ade, 19 November 2026) and uses only the footer strip and the motion and performance rules, as FanHub does. fancon.id keeps the kit's type and buttons until step 2 of its redesign is live, planned for Friday 11 December 2026. **Removing the `fancon` preset is planned for a January 2027 release.** No code has changed for it yet.
- **kultura.co.id homepage note**, `04_Digital/FanCon_Web/blocks_2026-11-19/kultura-co-id-homepage.md`, to be taken up on Monday 7 December 2026. Only the top bar (`nextjs/components/redesign/KAnnouncement.tsx`) loses its arrows, with kultura.co.id's release of Tuesday 5 January 2027. The other files that carry an arrow (78 under `nextjs/` on its `main` on 19 November) are swept in the homepage redesign's next release after that, as one pull request with the kit's arrow test copied in. No homepage session was running on 21 November.
- **[kultura-co-id #192](https://github.com/adesulco/kultura-co-id/pull/192)** is still a draft on v0.1.2. It moves to `#v0.1.4` and pins its Lighthouse workflow to the v0.1.4 commit; the bypass secret item under "Waiting on Ade" still applies.
- **Open in this repo:** Dependabot's #22 (minor and patch group) and #23 (jsdom 31). Neither was reviewed in this session.
- **Rules.** Never push to `main`; open the PR and stop, and Ade merges or asks Build to. Commits use the no-reply address `265466687+adesulco@users.noreply.github.com` (Ade, 19 November 2026: the kultura.co.id address is for private repositories only). No tool or AI naming anywhere.

## Earlier stop: 10 November 2026 (superseded by the block above)

The house kit session stopped on 10 November 2026, on Ade's word. No kit work is in progress. The next session reads this block first.

- **`main` is clean.** It carries v0.1.2 plus Dependabot's minor and patch group ([#17](https://github.com/adesulco/kultura-house-kit/pull/17), merged 10 Nov, no tag). Nothing is uncommitted.
- **Open kit PR: [#20](https://github.com/adesulco/kultura-house-kit/pull/20), v0.1.3, draft.** The strip's FanCon link goes to `https://fancon.id` (FanCon web decisions 9 Nov 2026, #2). Merge it once `fancon.id` serves the site, then tag `v0.1.3` on the merge commit. On 10 Nov `https://fancon.id/` already answered 307 to `/en` with the FanCon site, but `fancon.co.id` did not yet redirect to it.
- **[kultura-co-id #192](https://github.com/adesulco/kultura-co-id/pull/192), draft on v0.1.2.**
  - Reviewed 7 and 8 Nov; site CI and preview are green. Lighthouse measures nothing until Ade adds the secret (still absent 10 Nov).
  - Once the secret exists and #20 is tagged: move #192 to `#v0.1.3`, pin `lighthouse.yml` to the v0.1.3 commit, rerun, and mark it ready. Ade merges.
  - kultura-co-id's open PRs #195 to #198 also edit its `STATUS.md`, so whichever merges second needs a small rebase.
- **FanCon pilot.** It uses v0.1.2 on the stacked drafts (fancon-id #27 to #31). After v0.1.3 is tagged, bump `#v0.1.3` there too. FanCon's own domain PR is fancon-id #33.
- **Gelar.** Nobody owns this now; its session was archived on 8 Nov. Start a new session once PR-D2 ([gelar#1166](https://github.com/adesulco/gelar/pull/1166), still a draft on 10 Nov) merges. Gelar's rules need Ade's yes for the kit dependency, and for any font from a new host (a CSP change). The brief is under Next, item 1.
- **Rules.** Never push to `main`; open the PR and stop, and Ade merges or asks Build to. Commits use the no-reply address `265466687+adesulco@users.noreply.github.com`. No tool or AI naming anywhere.

## Where it stands

| Item | State |
|---|---|
| Repo `adesulco/kultura-house-kit` | Public (Ade, 31 Oct 2026). The build prompt said private; public lets every repo and Vercel install from the tag with no token |
| [#1 Tooling and CI fast tier](https://github.com/adesulco/kultura-house-kit/pull/1) | Merged 31 Oct |
| [#2 House kit v0.1](https://github.com/adesulco/kultura-house-kit/pull/2) | Merged 31 Oct, after a review pass (fixes below) |
| Tag [`v0.1.0`](https://github.com/adesulco/kultura-house-kit/releases/tag/v0.1.0) | Tagged 31 Oct on `9adda49`. Release carries `kultura-house-kit.css`, `kultura-house-kit.js`, `tokens.css`, `ecosystem.json` |
| Tag [`v0.1.1`](https://github.com/adesulco/kultura-house-kit/releases/tag/v0.1.1) | Tagged 1 Nov ([#14](https://github.com/adesulco/kultura-house-kit/pull/14)). Ade's 1 Nov decisions: red buttons fill with red-700 at every size; the strip keeps red-500 with all text 19 px bold (AA as large text); `--k-strip-max` and `--k-strip-pad` container hooks |
| Tag [`v0.1.2`](https://github.com/adesulco/kultura-house-kit/releases/tag/v0.1.2) | Tagged 8 Nov ([#18](https://github.com/adesulco/kultura-house-kit/pull/18), merged by Ade). The Lighthouse bypass secret is set as a cookie on the preview host only, never sent as a header (it reached third-party hosts before); the reusable workflow fetches its script from its own commit; the strip's store link reads "Kultura Store" |
| Dependencies | 1 Nov: actions group, jsdom 30, TypeScript 6, ESLint 10 merged ([#12](https://github.com/adesulco/kultura-house-kit/pull/12)); 10 Nov: minor and patch group ([#17](https://github.com/adesulco/kultura-house-kit/pull/17)); major @types/node and React updates ignored on purpose (Node 22, React 18 floor) |
| Branch protection | 1 Nov: `quick` and `full` required on `main` |
| [#20 v0.1.3](https://github.com/adesulco/kultura-house-kit/pull/20) | Merged 20 Nov, not tagged: FanCon link to `https://fancon.id`. Ships in v0.1.4 |
| Tag [`v0.1.4`](https://github.com/adesulco/kultura-house-kit/releases/tag/v0.1.4) | Tagged 20 Nov on `30eaa22` ([#24](https://github.com/adesulco/kultura-house-kit/pull/24)). The arrow rule (D10) and its sweep; FanCon uses only the footer strip and the motion and performance rules; `fancon` preset removal planned for January 2027 |
| [kultura-co-id #192](https://github.com/adesulco/kultura-co-id/pull/192) | Draft, on v0.1.2, reviewed 7 and 8 Nov: server-rendered strip with no entity line (the footer copyright already names the company), Lighthouse on `/en` and `/id` pinned to the v0.1.2 commit, only the bypass secret passed. Site CI and preview green. `lighthouse` measures nothing until the repository secret `VERCEL_AUTOMATION_BYPASS_SECRET` exists (still absent 10 Nov). Moves to v0.1.3 after #20 |
| [fancon-id #26](https://github.com/adesulco/fancon-id/pull/26) | Merged 1 Nov on v0.1.0: install and `fancon` preset only, no visual change. The FanCon pilot drafts (#27 to #31) use v0.1.2, and #31 adds the server-rendered strip |
| Gelar | Waits for PR-D2 (gelar#1166, still a draft on 10 Nov). No session owns the adoption |
| `adesulco/kultura-house-kit-old` | The first private copy, renamed and kept private. Its old commits carry a personal email, which is why the public repo was created fresh. Ade deletes it (still there 10 Nov) |

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

1. **Vercel bypass secret for kultura-co-id.** Create it in Vercel: kultura-co-id, Settings, Deployment Protection, Protection Bypass for Automation. Save it in GitHub as the repository secret `VERCEL_AUTOMATION_BYPASS_SECRET`: Settings, Secrets and variables, Actions. Then rerun the `lighthouse` check on #192. The first run is also the first real test of the v0.1.2 cookie bypass, because Vercel's docs do not name the cookie or say which paths take the bypass link.
2. ~~Merge kit #20 and tag.~~ Done 20 Nov: #20 and #24 merged, `v0.1.4` tagged.
3. **Merge kultura-co-id #192** once it is on v0.1.4 and Lighthouse passes. Watch LCP: one manual run on the live home page measured 2.51 s against the 2.5 s limit.
4. **Delete `kultura-house-kit-old`** under Settings, Danger zone. The build login has no delete permission.
5. **Gelar:** a yes for the kit dependency when its adoption PR is opened.

Resolved 31 Oct: install access (repo made public, so no tokens and no Actions access setting are needed).
Resolved 1 Nov (Ade): red contrast (red-700 buttons, large bold strip text), strip alignment (container hooks), branch protection, dependency updates. One commit on `main` (0ea38aa, a GitHub-side merge) shows ade@kultura.co.id as committer; Ade chose to leave it. From 7 Nov the standing rules say never push to main: kit changes go through a PR that Ade merges (or asks Build to merge). A GitHub-side merge records ade@kultura.co.id as committer; the authors keep the no-reply address.

## Next

1. **Gelar**, after PR-D2 merges.
   - Install v0.1.3 (v0.1.2 if #20 has not merged) and set `data-k-product="gelar"`.
   - Use Outfit and JetBrains Mono only.
   - Add the footer strip with `entity="PT Kultura Digital Kreasi, Jakarta"`, server-rendered from `renderFooterStripHTML` as kultura-co-id #192 does, with the strip hooks set to Gelar's container.
   - Add Lighthouse on `/` and `/e/fancon-26`, pinned to the kit commit, passing only `VERCEL_AUTOMATION_BYPASS_SECRET`. Gelar uses pnpm 10 (`pnpm-lock.yaml`).
2. **FanCon pilot** (`BUILD_PROMPT_FanCon_Web_Poster_Arsip_2026-11-03.md`): after v0.1.3, bump fancon-id from `#v0.1.2` to `#v0.1.3`.
3. **KULT, FanHub (footer only), Counter and the small repos:** next window.
4. **FloorPass** (DS-5): the `floorpass` preset ships in the kit; app adoption is the FloorPass session's call.
5. **grade.kioskultura.com and the kios storefront:** no PR. `docs/adoption-kioskultura.md` is ready for the grading session.
