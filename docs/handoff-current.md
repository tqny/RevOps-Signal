# RevOps Signal - Current Handoff State

## Project

RevOps Signal

## Current Phase

Step 2 in progress: scaffold complete, shared data/filter foundation complete, and the app is ready for page-focused implementation

## Active Role

Builder

## Current Branch

`codex/scaffold-vite-app`

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

Begin Task 7 by turning the selector-backed overview shell into the first fully composed page.

## Recently Completed

- reviewed and normalized the Step 1 planning package
- created the durable doc set and design criteria files
- scaffolded the React + TypeScript + Vite + Tailwind app foundation
- added the desktop-first app shell, route placeholders, and shared filter-state foundation
- added the seeded mock data model with segment-aware quota snapshots
- built centralized selectors for overview, funnel, performance, and forecast logic
- connected all four routes to shared selector-backed outputs and empty states
- added selector tests and verified `npm run lint`, `npm run test`, `npm run build`, and local Vite boot

## Exact Next Task

Task 7: Implement Executive Overview page

## Open Issues / Blockers

- none currently
- page-specific chart treatment and final visual composition are still pending

## Active Assumptions

- no backend/auth in MVP
- shared selector model is the single metric source of truth
- four pages are sufficient for MVP
- tables remain lightweight in MVP
- timeframe filtering remains preset-based
- current page content is selector-backed, but chart treatment is intentionally still lightweight ahead of page-by-page polish

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
