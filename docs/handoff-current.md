# RevOps Signal - Current Handoff State

## Project

RevOps Signal

## Current Phase

Step 7 complete: the reviewer-facing About surface is now in-product, and QA/polish is next

## Active Role

Builder

## Current Branch

`codex/task-11-about-project-surface`

Task 10 is merged into `main`.
Task 11 is implemented on the current branch.
Suggested next branch: `codex/task-12-empty-state-polish`

## Current MVP Scope

A desktop-first four-page RevOps dashboard using seeded mock data, shared filters, centralized metric derivation, and a dedicated reviewer-facing About surface inside the product shell.

Pages:

1. Executive Overview
2. Pipeline & Funnel
3. Sales Performance
4. Forecast & Risks
5. About This Project

## Architecture Summary

- React + TypeScript + Vite
- Tailwind styling
- route-based pages
- dedicated `/about` reviewer route in the shared shell
- shared filter state
- seeded local data
- centralized metric selectors/utilities

## Design Summary

- Set 1 is master style authority
- dark premium analytics UI
- restrained accents
- card-based layout
- dense but controlled information design
- patterns from Sets 2-4 adapted into Set 1 style
- reviewer orientation stays editorial and in-shell rather than marketing-like

## Current Task

Task 12 is next: empty/loading/error state polish.

## Recently Completed

- reviewed and normalized the Step 1 planning package
- created the durable doc set and design criteria files
- scaffolded the React + TypeScript + Vite + Tailwind app foundation
- added the desktop-first app shell, route placeholders, and shared filter-state foundation
- added the seeded mock data model with segment-aware quota snapshots
- built centralized selectors for overview, funnel, performance, and forecast logic
- connected all four routes to shared selector-backed outputs and empty states
- added selector tests and verified `npm run lint`, `npm run test`, `npm run build`, and local Vite boot
- added a root README that frames the project for reviewers and explains the current MVP foundation
- implemented the Executive Overview page with selector-backed KPI cards, a trend chart, a mix chart, an executive signals panel, and a rep coverage summary table
- verified the overview implementation with lint, tests, build, local Vite boot, and browser screenshots of the rendered route
- implemented the Pipeline & Funnel page with selector-backed funnel, conversion, leakage, and stalled-watchlist sections
- verified the pipeline implementation with `npm run test`, `npm run lint`, `npm run build`, local Vite boot, and a rendered Chromium screenshot of `/pipeline`
- implemented the Sales Performance page with selector-backed attainment widgets, rep/team comparison charts, progress ladders, and a richer performance table
- verified the sales performance implementation with `npm run test`, `npm run lint`, `npm run build`, local Vite boot, and rendered Chromium screenshots of `/performance`
- implemented the Forecast & Risks page with selector-backed forecast coverage, composition, risk distribution, and stalled pipeline table sections
- verified the forecast implementation with `npm run test`, `npm run lint`, `npm run build`, local Vite boot, and a rendered Chromium check of `/forecast`
- added a dedicated About This Project route in the shared shell so reviewers can understand project framing, scope, system design, and technical judgment without leaving the product
- updated spec, architecture, design, task, QA, handoff, and README docs so the reviewer-facing route is tracked as the new Task 11 before QA/polish
- verified the About route with `npm run test`, `npm run lint`, `npm run build`, and a rendered Firefox check of `/about`, including nav active-state confirmation and a follow-up route transition back to `/`

## Exact Next Task

Task 12: Empty/loading/error state polish

## Open Issues / Blockers

- none currently
- `/forecast` rendered correctly in local browser checks and built preview, with no failing network requests observed during the captured pass
- initial Recharts sizing warnings (`width(-1)` / `height(-1)`) still reproduce on `/forecast` in both local dev and built preview even though the page renders correctly; treat this as a real QA polish item rather than dev-only noise

## Active Assumptions

- no backend/auth in MVP
- shared selector model is the single metric source of truth
- four analytics pages remain the core MVP story
- the About route is reviewer orientation, not a fifth analytics page
- tables remain lightweight in MVP
- timeframe filtering remains preset-based
- all four analytics pages are now fully composed from shared selectors; remaining work is QA/polish, responsive tightening, and final docs refresh

## Required Read Order

1. `AGENTS.md`
2. `docs/handoff-protocol.md`
3. this file
4. `docs/spec.md`
5. `docs/architecture.md`
6. `docs/tasks.md`
7. `docs/design.md`
8. `docs/decisions.md`
9. `docs/qa-checklist.md`
10. `design-criteria.jsonc`
11. `developer-brief.md`
