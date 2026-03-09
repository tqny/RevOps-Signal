# RevOps Signal - Current Handoff State

## Project

RevOps Signal

## Current Phase

Step 5 complete: Executive Overview, Pipeline & Funnel, and Sales Performance are fully composed from shared selectors, and Forecast & Risks is next

## Active Role

Builder

## Current Branch

`codex/task-9-sales-performance`

Merge this branch into the latest `main`, then create a fresh task branch for the next page pass.
Suggested next branch: `codex/task-10-forecast-risks`

## Current MVP Scope

A desktop-first four-page RevOps dashboard using seeded mock data, shared filters, and centralized metric derivation.

Pages:

1. Executive Overview
2. Pipeline & Funnel
3. Sales Performance
4. Forecast & Risks

## Architecture Summary

- React + TypeScript + Vite
- Tailwind styling
- route-based pages
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

## Current Task

Task 9 is complete. Continue with the next page implementation task after merging this branch.

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

## Exact Next Task

Task 10: Implement Forecast & Risks page

## Open Issues / Blockers

- none currently
- Forecast & Risks is still on the lighter interim presentation and remains the next page-specific composition pass
- local Vite browser checks still log a missing `favicon.ico` request plus initial Recharts sizing warnings on `/performance`; visual render was intact, but this should be revisited during QA polish if the warnings persist outside dev

## Active Assumptions

- no backend/auth in MVP
- shared selector model is the single metric source of truth
- four pages are sufficient for MVP
- tables remain lightweight in MVP
- timeframe filtering remains preset-based
- Executive Overview, Pipeline & Funnel, and Sales Performance are now fully composed from shared selectors; Forecast & Risks still uses the lighter interim presentation

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
