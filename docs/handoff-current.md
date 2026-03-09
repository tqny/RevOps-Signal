# RevOps Signal - Current Handoff State

## Project

RevOps Signal

## Current Phase

Task 15A business framing and seed distribution spec is complete. Task 15B seeded deal expansion and business alignment is the next planned Builder step before deployment prep.

## Active Role

Builder

## Current Branch

`codex/task-15a-business-framing-seed-spec`

Task 15A is implemented on the current branch and committed locally.
Suggested next branch after merge: `codex/task-15b-seeded-deal-expansion`

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
- route-based shared shell
- dedicated `/about` reviewer route in the shared shell
- shared filter state
- seeded local data
- centralized metric selectors/utilities
- shell-contained route content boundary
- repo-native responsive QA via managed Playwright Chromium

## Design Summary

- Set 1 is master style authority
- dark premium analytics UI
- restrained accents
- card-based layout
- dense but controlled information design
- patterns from Sets 2-4 adapted into Set 1 style
- reviewer orientation stays editorial and in-shell rather than marketing-like
- responsive laptop-width containment is part of the current quality bar

## Current Task

Task 15B is next: seeded deal expansion and business alignment.

## Recently Completed

- Task 14 visual refinement
- Task 15 documentation refresh across README, task, architecture, QA, decision, and handoff docs
- Task 15A added durable Eagle-AI business framing and mock-data generation rules under `docs/architecture/`
- Task 17 browser QA automation remains in place with screenshot and report output under `output/playwright/responsive-smoke/`

## Planned Next Steps

- Task 15B: expand seeded deals only and align minimal product/reviewer copy to the approved business framing
- Task 16: deployment prep

## Verification Baseline

- `npm run test`
- `npm run lint`
- `npm run build`
- `npm run qa:responsive`
- install managed Chromium once per machine with `npm run qa:responsive:install`

## Open Issues / Blockers

- no functional blockers currently
- `npm run build` still emits the existing Vite chunk-size warning for the main client bundle; this remains non-blocking

## Active Assumptions

- no backend/auth in MVP
- shared selector model is the single metric source of truth
- four analytics pages remain the core MVP story
- the About route is reviewer orientation, not a fifth analytics page
- tables remain lightweight in MVP
- timeframe filtering remains preset-based
- Task 15A/15B should not add new reps, teams, segments, regions, or timeframe presets
- Eagle-AI is the approved mock business and `amount` means first-year contract value including onboarding / implementation
- deployment prep follows the 15A/15B data/business-framing work

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
