# RevOps Signal - Product Spec

## 1. Product Summary

RevOps Signal is a desktop-first multi-page revenue operations dashboard web app that turns seeded mock GTM data into a connected executive-style analytics story, with an in-product reviewer surface that explains the project's framing, scope, and implementation judgment.

It is intended as:

- a disciplined AI-assisted build practice project
- a portfolio-quality demo
- a believable internal analytics product for RevOps / Sales / GTM stakeholders

## 2. Target User

Primary:

- the builder/learner

Secondary:

- recruiter
- hiring manager
- demo reviewer

## 3. Product Goals

The app should:

- present a coherent four-page dashboard experience
- provide a reviewer-facing explanation layer inside the product shell
- use shared mock data across all pages
- compute meaningful derived metrics from a shared source of truth
- show how pipeline, funnel quality, rep performance, and forecast confidence connect
- explain what the project simulates, how it works, and what is intentionally out of scope
- feel polished, modern, and credible

## 4. MVP Scope

### Core Pages

1. Executive Overview
2. Pipeline & Funnel
3. Sales Performance
4. Forecast & Risks

### Reviewer Orientation Surface

- About This Project

### Required MVP Capabilities

- shared filters:
  - timeframe preset over seeded periods
  - segment
  - region
  - team or rep
- seeded local data
- derived metrics
- KPI cards
- line charts
- bar charts
- stacked bars
- donut charts
- funnel visualization
- progress bars
- tables
- trend indicators
- responsive desktop-first layout

### Required Derived Metrics

- pipeline coverage
- stage conversion
- win rate
- average deal size
- sales cycle length
- attainment / quota progress
- forecast gap / upside / risk indicators

## 5. Page Intent

### Executive Overview

High-level revenue health scan.

### Pipeline & Funnel

Volume, conversion, and leakage diagnosis.

### Sales Performance

Rep/team execution and attainment analysis.

### Forecast & Risks

Forward-looking confidence and downside interpretation.

## 6. Non-Goals

Not in MVP:

- real backend
- production database
- authentication
- CRM integrations
- CSV upload
- live sync
- advanced drill-down engine
- complex permissions
- report builder
- export system
- notifications
- machine learning
- excessive admin tooling

## 7. Success Criteria

The MVP is successful if:

- pages feel connected, not random
- reviewers can orient quickly without leaving the product
- charts support a coherent metric story
- filters update views consistently
- numbers reconcile across pages
- the product feels portfolio-ready
- scope remains lean and buildable

## 8. Assumptions

- mock data is the MVP source of truth
- timeframe filtering uses predefined mock periods and presets, not a freeform date picker
- filter combinations may create empty subsets; the app should handle that gracefully
- forecast is deterministic mock logic, not predictive modeling
- all pages should rely on shared derivation logic

## 9. Risks

- overbuilding
- decorative rather than useful charts
- inconsistent metric calculations
- scope creep from nice-to-have widgets
- design imitation instead of design adaptation
