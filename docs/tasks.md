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

## Phase 7 - QA + Polish

### Task 11: Empty/loading/error state polish

**Status**
Pending

### Task 12: Responsive tightening

**Status**
Pending

### Task 13: Visual refinement

**Status**
Pending

### Task 14: Documentation refresh

**Status**
Pending

### Task 15: Deployment prep

**Status**
Pending

## Execution Rules

- implement one approved task at a time
- do not add surprise features
- if a task changes architecture or scope, update docs first
- update handoff state after meaningful milestones
