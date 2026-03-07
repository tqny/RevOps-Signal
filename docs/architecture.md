# RevOps Signal - Architecture

## 1. Architecture Summary

RevOps Signal is a React + TypeScript + Vite dashboard app with route-based pages, shared filter state, seeded local data, and centralized metric derivation utilities.

The architecture optimizes for:

- consistency
- simplicity
- extensibility without overengineering
- clean cross-page metric reuse

## 2. Route Structure

- `/` -> Executive Overview
- `/pipeline` -> Pipeline & Funnel
- `/performance` -> Sales Performance
- `/forecast` -> Forecast & Risks

## 3. App Shell

Shared layout:

- left navigation rail
- top utility / filter bar
- page header
- main dashboard content grid

## 4. State Model

### Global UI State

Use a lightweight shared filter state for:

- timeframe preset
- selected segments
- selected regions
- selected teams
- selected reps

Implementation default:

- React context with small hooks/selectors

Do not adopt a heavier global state library unless requirements materially grow.

## 5. Data Model Strategy

Primary source of truth:

- seeded local mock data

Core entities:

- reps
- teams
- regions
- segments
- opportunities
- time periods

Derived values should be computed through shared utilities/selectors rather than stored redundantly.

Quota handling rule:

- quota snapshots are segment-aware in the local seed so segment filters do not produce nonsensical target-based metrics

## 6. Selector / Derivation Layer

Create a central derivation layer for:

- filtered opportunity subset
- KPI aggregates
- funnel metrics
- rep/team performance metrics
- forecast metrics
- risk metrics
- filter-safe empty states and ranked rows derived from the same filtered context

Rule:
No page should compute core business metrics ad hoc if the same logic belongs in shared selectors.

## 7. Suggested Source Structure

- `src/app`
- `src/components`
  - `ui`
  - `layout`
  - `charts`
- `src/features`
  - `filters`
  - `overview`
  - `pipeline`
  - `performance`
  - `forecast`
- `src/data`
  - `mock`
  - `selectors`
  - `metrics`
- `src/lib`
- `src/pages`
- `src/styles`
- `src/types`

## 8. Component Boundaries

### Shared Layout

- App shell
- side nav
- top bar
- page container
- page header

### Shared UI

- KPI card
- section card
- chart card
- filter control
- progress bar
- status pill
- empty state
- table shell

### Feature-Level

Each page may have feature-specific sections, but shared primitives should be reused.

## 9. Rendering Strategy

- desktop-first responsive grids
- render-safe chart wrappers
- empty states for sparse filtered results
- avoid fragile chart assumptions

## 10. UI Primitive Strategy

Default to custom lightweight primitives built with React + Tailwind first.

If a control needs stronger accessibility behavior later, add a focused primitive dependency surgically instead of installing a broader UI layer up front.

## 11. Testing Strategy

Test the highest-value shared logic:

- filter application
- weighted forecast math
- attainment math
- funnel aggregation
- consistency across rollups

## 12. Extension Path

A later backend can replace seeded data if:

- entity shapes remain stable
- shared selector interfaces remain coherent
- page components consume derived view models rather than raw API responses directly
