# Engineering rules

CI rule of record: `04_Digital/00_Strategy/Kultura_CI_Standard_v1_2026-10-14.md`.

- Open PRs as drafts. Run lint, typecheck and unit tests locally before pushing. Batch commits; do not push one commit at a time. Mark the PR ready for review only when it is done.
- One PR per concern. CI-only PRs contain no app code. Ade merges.
- No tool or AI naming anywhere: code, comments, commit messages, PR bodies, file names, package metadata. Roles are "Build" and "Product office".
- Customer-facing strings: Bahasa first, "kamu", sentence case, no em dashes, "booth" never "lapak".
- Plain TypeScript and CSS in the core. React only under `react/`.
