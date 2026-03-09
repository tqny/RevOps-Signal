# RevOps Signal - Task Plan

## Phase 0 - Planning

- finalize spec
- finalize architecture
- finalize design synthesis
- finalize handoff package

## Phase 1 - Scaffold + Foundation

### Task 1: Scaffold project foundation

**Status**
Completed

**Purpose**
Create the React/TypeScript/Tailwind baseline and repo-ready structure.

**Dependencies**

- approved stack
- planning docs

**Definition of Done**

- Vite app scaffolded
- Tailwind configured
- ESLint/Prettier configured
- folder structure created
- route placeholders created

**Verification**

- dev server runs
- build passes
- lint passes

### Task 2: Create design token foundation

**Status**
Completed

**Purpose**
Implement the base token system and foundational visual rules.

**Dependencies**

- Task 1
- design docs

**Definition of Done**

- token file created
- core colors/spacing/radius/shadows/typography defined
- base surface/card/button styles exist

**Verification**

- shared token usage visible in app shell or sample components
- no obvious random one-off foundation values

### Task 3: Build app shell and navigation

**Status**
Completed

**Purpose**
Create the persistent layout for all pages.

**Dependencies**

- Tasks 1-2

**Definition of Done**

- left nav
- top bar
- route layout
- active nav states
- desktop-first responsive shell

**Verification**

- all routes accessible
- layout remains stable across pages

## Phase 2 - Data + Filters

### Task 4: Add seeded mock data model

**Status**
Completed

**Purpose**
Create realistic mock entities and opportunity records.

**Dependencies**

- Task 1

**Definition of Done**

- core types exist
- seed data exists
- relationships are plausible

**Verification**

- TypeScript passes
- sample records support required metrics

### Task 5: Build shared derivation utilities

**Status**
Completed

**Purpose**
Centralize business metric calculations.

**Dependencies**

- Task 4

**Definition of Done**

- filtered subset selector
- KPI selectors
- funnel selectors
- performance selectors
- forecast/risk selectors

**Verification**

- utility tests pass
- outputs reconcile for same filtered subset

### Task 6: Build shared filter bar

**Status**
Completed

**Purpose**
Allow cross-page filtering with one state model.

**Dependencies**

- Tasks 3-5

**Definition of Done**

- timeframe filter
- segment filter
- region filter
- team/rep filter
- defaults defined

**Verification**

- all pages react to filter changes
- empty-state handling works

## Phase 3 - Executive Overview

### Task 7: Implement Executive Overview page

**Status**
Completed

**Purpose**
Deliver the top-level business story.

**Dependencies**

- Tasks 3-6

**Definition of Done**

- KPI strip
- trend chart
- mix/composition chart
- signals panel
- summary table/list

**Verification**

- page metrics reconcile with selectors
- page hierarchy is clear

## Phase 4 - Pipeline & Funnel

### Task 8: Implement Pipeline & Funnel page

**Status**
Completed

**Purpose**
Explain conversion and leakage.

**Dependencies**

- Tasks 3-6

**Definition of Done**

- funnel view
- stage conversion view
- leakage/aging view
- support cards/table

**Verification**

- stage totals and conversions reconcile
- visuals remain readable and purposeful

## Phase 5 - Sales Performance

### Task 9: Implement Sales Performance page

**Status**
Completed

**Purpose**
Show execution quality across team/rep.

**Dependencies**

- Tasks 3-6

**Definition of Done**

- attainment widgets
- rep/team comparison chart
- performance table
- progress bars

**Verification**

- attainment math is correct
- rep rollups are accurate

## Phase 6 - Forecast & Risks

### Task 10: Implement Forecast & Risks page

**Status**
Completed

**Purpose**
Show likely outcome and downside.

**Dependencies**

- Tasks 3-6

**Definition of Done**

- weighted forecast vs target
- forecast composition
- risk distribution
- stalled pipeline table

**Verification**

- forecast math reconciles
- risk totals match filtered subset

## Phase 7 - Reviewer Orientation

### Task 11: Add About This Project surface

**Status**
Completed

**Purpose**
Add a reviewer-facing explanation layer inside the product shell without changing the four-page analytics scope.

**Dependencies**

- Tasks 3-10
- spec / architecture / design docs

**Definition of Done**

- a natural in-product placement is chosen and implemented
- reviewers can understand what the project is, why it exists, how it works, and what is intentionally out of scope
- routing and navigation stay coherent with the current shell
- the surface reflects the existing visual language rather than a separate marketing style

**Verification**

- chosen About surface renders correctly
- navigation active state works if a route/nav item is added
- layout remains stable with the new surface
- docs stay consistent with the placement decision

## Phase 8 - QA + Polish

### Task 12: Empty/loading/error state polish

**Status**
Completed

### Task 13: Responsive tightening

**Status**
Completed

### Task 14: Visual refinement

**Status**
Completed

### Task 15: Documentation refresh

**Status**
Completed

**Purpose**
Refresh the durable docs and repo README so they match the current implemented MVP, the dedicated About route placement, and the repo-native responsive QA workflow.

**Dependencies**

- Tasks 11-14
- Task 17

**Definition of Done**

- durable docs reflect the current routes, shared selector discipline, and reviewer-facing About surface
- README matches the implemented product framing and verification path
- current handoff state no longer carries stale branch or next-task references

**Verification**

- `npm run test`
- `npm run lint`
- `npm run build`
- `npm run qa:responsive`

### Task 15A: Business framing and seed distribution spec

**Status**
Pending

**Purpose**
Define the pretend business, product/pricing semantics, and seeded deal-distribution rules for a richer opportunity set without changing the current filter/entity architecture.

**Dependencies**

- Task 15
- current seeded opportunity model

**Definition of Done**

- durable docs define the pretend business category, product framing, and what opportunity `amount` represents
- durable docs define what stays fixed for the next build step: no new reps, teams, segments, regions, or timeframe presets
- durable docs define target distribution rules for additional deals across existing reps, teams, regions, segments, and periods
- durable docs make clear that Task 15B should preserve the current shared selector model and avoid page-architecture changes

**Verification**

- spec, architecture, task, decision, and handoff docs are internally consistent
- Task 15B has a clear enough brief to implement without inventing business framing ad hoc

### Task 15B: Seeded deal expansion and business alignment

**Status**
Pending

**Purpose**
Add more seeded deals only and align app/reviewer copy to the approved pretend business while preserving the current schema, filters, routes, and selector-backed metric logic.

**Dependencies**

- Task 15A

**Definition of Done**

- opportunity count increases materially using the approved distribution rules
- no new reps, teams, segments, regions, or timeframe presets are introduced
- shared selectors remain the single source of truth for cross-page metrics
- copy updates are limited to the minimum needed to make the dashboard represent the approved pretend business coherently

**Verification**

- `npm run test`
- `npm run lint`
- `npm run build`
- `npm run qa:responsive`

### Task 16: Deployment prep

**Status**
Pending

## Phase 9 - Workflow Hardening

### Task 17: Browser QA automation

**Status**
Completed

**Purpose**
Make rendered browser checks repeatable inside the repo so fresh threads do not have to rediscover browser setup, launch options, and responsive verification steps.

**Dependencies**

- Tasks 12-13
- existing route shell and responsive QA expectations

**Definition of Done**

- a repo-native browser QA script exists for responsive smoke checks
- the script uses a managed browser path instead of assuming a system Chrome install
- the script captures route screenshots and a concise layout report for the current MVP routes
- the workflow is documented in repo docs or scripts clearly enough for fresh threads to reuse directly

**Verification**

- browser install step succeeds from repo scripts
- responsive QA script runs against the local app without manual Playwright CLI recovery steps
- route loads, nav stability, chart containment, and table degradation checks are reported for the current MVP routes

## Execution Rules

- implement one approved task at a time
- do not add surprise features
- if a task changes architecture or scope, update docs first
- update handoff state after meaningful milestones
