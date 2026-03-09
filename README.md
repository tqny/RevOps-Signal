# RevOps Signal

A portfolio-grade RevOps dashboard demo that turns seeded mock GTM data into a connected executive-style revenue story, with an in-product About surface for reviewer orientation.

## Problem Statement

Revenue dashboards often fail in one of two ways:

1. They are visually polished but analytically shallow, with disconnected charts that do not reconcile.
2. They are data-dense but difficult to interpret, making it hard to understand how pipeline, conversion, rep performance, and forecast risk actually connect.

RevOps Signal was built to practice the opposite approach: a deliberately scoped analytics product where the metrics are coordinated, the page structure tells a story, and each visualization exists to answer a specific business question.

## Product Framing

RevOps Signal simulates a believable internal analytics workflow for revenue operations, sales leadership, or GTM stakeholders.

The app is organized around four connected views:

1. **Executive Overview**  
   Fast top-level scan of revenue health, pipeline coverage, trend direction, and major signals.

2. **Pipeline & Funnel**  
   Diagnosis of stage volume, conversion behavior, funnel leakage, and aging.

3. **Sales Performance**  
   Comparison of rep and team execution using attainment, win rate, velocity, and quota progress.

4. **Forecast & Risks**  
   Forward-looking interpretation of weighted forecast, target gap, stalled pipeline, and risk concentration.

It also includes **About This Project**, a reviewer-facing route inside the product shell that explains what the app simulates, why it was built, how the shared data model works, and what was intentionally left out of scope.

The goal is not to simulate a full BI platform. The goal is to show a disciplined MVP where shared business logic stays visible across multiple pages.

## Why This Project Exists

This project was built as a practice case in disciplined AI-assisted software development with emphasis on:

- scoped planning before implementation
- dashboard information architecture
- realistic metric definition
- shared aggregation logic
- design adaptation from references rather than blind copying
- repo hygiene and handoff readiness

It is also intended as a portfolio piece that demonstrates product thinking, GTM systems reasoning, and the ability to build a coherent analytics interface rather than a disconnected chart gallery.

## Current Repo Status

The repo currently includes:

- a route-based app shell with five routes, including the reviewer-facing About surface
- seeded Eagle-AI mock data across periods, regions, segments, teams, reps, and 50 total opportunities
- shared global filters across the four analytics pages
- centralized selector and derivation logic for KPI, funnel, performance, forecast, and risk views
- fully composed Executive Overview, Pipeline & Funnel, Sales Performance, and Forecast & Risks pages
- repo-native responsive browser QA with managed Playwright Chromium, screenshot capture, and JSON report output
- durable planning, architecture, design, and handoff docs for reviewable iteration

## Architecture Overview

At a high level, RevOps Signal is a route-based React dashboard application with:

- React + TypeScript + Vite
- Tailwind CSS for layout and styling
- React Router for a shared shell with four analytics pages plus the About route
- Recharts for core visualizations
- seeded local mock data as the MVP source of truth
- shared filter state across pages
- centralized selector and derivation logic so core metrics stay consistent

The architecture is intentionally simple:

- route-based multi-page app
- desktop-first layout shell
- seeded mock entities and opportunities
- lightweight shared filter state
- derived view models for each page
- no backend, auth, or external integrations in v1

That keeps the project lean while still supporting a believable business narrative.

## Data Model and Source of Truth

The MVP uses a seeded local dataset rather than a real backend.

The current seed simulates Eagle-AI, a growth-stage B2B SaaS company selling an AI compliance and governance platform. Opportunity `amount` is treated as first-year contract value, including subscription plus onboarding / implementation. The dataset now preserves 24 hand-authored opportunities and expands to 50 total records through a deterministic seed helper so the opportunity story stays stable across runs and commits. The durable business framing and seed rules live in [`docs/architecture/revops-business-framing.md`](docs/architecture/revops-business-framing.md) and [`docs/architecture/revops-mock-data-rules.md`](docs/architecture/revops-mock-data-rules.md).

The source model is centered around:

- time periods
- regions
- segments
- teams
- reps
- quota snapshots
- opportunities

Each opportunity includes fields such as stage, amount, owner, expected close period, probability, sales cycle, forecast category, and risk metadata.

This structure supports metrics such as:

- total pipeline
- weighted forecast
- pipeline coverage
- stage conversion
- win rate
- average deal size
- sales cycle length
- quota attainment
- stalled pipeline
- forecast gap
- risk distribution

The important design decision is that these values are not meant to be hardcoded page by page. They are derived from one shared source of truth so the pages remain internally consistent under the same filters.

## Core System Logic

Each page explains a different part of the same revenue system:

- pipeline volume and composition shape forecast potential
- stage conversion and leakage explain why coverage may or may not become revenue
- rep and team execution explain where results are being driven or missed
- weighted forecast and risk signals explain forward confidence and downside

This is why the app uses shared filtering and centralized derivation utilities. It is meant to behave like one coherent operating dashboard, not four unrelated pages.

## What Is In Scope for V1

Included in v1:

- four core dashboard pages
- shared filters across views
- seeded mock data
- centralized metric derivation
- purposeful use of multiple visualization types
- desktop-first responsive layout
- polished internal-tool design direction

Intentionally excluded from v1:

- backend or production database
- authentication
- CRM integrations
- CSV upload
- live sync
- complex drill-down systems
- exports or reporting workflows
- notifications
- ML or predictive modeling
- enterprise admin tooling

The constraint is deliberate: keep the system serious, coherent, and finishable.

## What This Project Demonstrates

This project is intended to demonstrate:

- software framing in business-system terms
- thoughtful dashboard information architecture
- metric storytelling across multiple connected pages
- disciplined scope control
- clean separation between source data, derived metrics, and UI presentation
- design adaptation from reference patterns into a coherent product language
- AI-assisted development with durable docs, handoff structure, and reviewable workflow

For technical reviewers, the signal is judgment about where to keep things simple. For product, GTM, or RevOps reviewers, the signal is understanding how revenue metrics connect operationally.

## Repo Signals

This repo is structured to support disciplined iteration rather than one-off demo hacking.

Signals intentionally built into the workflow include:

- durable project docs in [`docs/`](docs)
- repo-root [`AGENTS.md`](AGENTS.md) as the execution constitution
- scoped task planning in [`docs/tasks.md`](docs/tasks.md)
- handoff files for continuity across sessions and coding agents
- branch-based workflow
- emphasis on small, reviewable changes
- separation of project docs from runtime app data

## Local Setup

### Requirements

- Node.js LTS
- npm

### Run locally

```bash
npm install
npm run dev
```

### Build and preview

```bash
npm run build
npm run preview
```

### Tests and lint

```bash
npm run test
npm run lint
```

### Responsive browser QA

Install managed Chromium once:

```bash
npm run qa:responsive:install
```

Then run the smoke check:

```bash
npm run qa:responsive
```

The responsive QA command builds the app, starts a strict local preview, runs the current MVP routes through managed Chromium at laptop-width breakpoints, and writes screenshots plus a JSON report to `output/playwright/responsive-smoke/`.

## Review Guidance

A practical review path for this project is:

1. Start on **About This Project** if you want product framing, architecture context, and scope boundaries before reviewing the analytics routes.
2. Move to **Executive Overview** for the top-level health scan.
3. Change the global filters and confirm that numbers update across pages.
4. Move to **Pipeline & Funnel** and inspect whether conversion and leakage explain the overview signal.
5. Move to **Sales Performance** and compare attainment, win rate, and velocity across reps and teams.
6. Move to **Forecast & Risks** and confirm that weighted forecast and risk views align with the earlier pages.

Things to look for:

- whether the pages feel narratively connected
- whether the metrics reconcile
- whether the chart choices match the business question being answered
- whether the UI feels like a believable internal analytics product
- whether the scope feels deliberate rather than inflated

If you want to review the planning and governance layer, start with [`AGENTS.md`](AGENTS.md), then [`docs/handoff-current.md`](docs/handoff-current.md), and then the core docs in [`docs/`](docs).

## Notes

RevOps Signal is intentionally a scoped v1. It is meant to show product judgment, metric reasoning, dashboard design discipline, and clean implementation structure rather than imitate a full enterprise BI platform.
