# RevOps Signal - Eagle-AI Business Framing

## Purpose

This document defines the pretend business behind the current RevOps dataset so future seed expansion work can stay consistent with the product story, pricing logic, and sales motion already implied by the app.

It is a framing document, not a schema-change document.

## Company Identity

Eagle-AI is a Series B / growth-stage B2B SaaS company selling an AI compliance and governance platform.

The platform is aimed at regulated or process-sensitive organizations that need clearer controls, oversight, and accountability for AI-related workflows.

Typical buyer environments include:

- fintech
- healthcare
- insurance
- enterprise IT / security / compliance-heavy organizations
- other regulated or audit-sensitive B2B environments

Eagle-AI is not generic AI productivity software. The company should read like a focused governance and compliance vendor with enterprise buying patterns and implementation complexity.

## Product Framing

Eagle-AI helps organizations govern and operationalize AI controls across workflows such as:

- policy and controls management
- evidence collection
- audit readiness
- approval workflows
- model governance and review workflows
- compliance reporting and internal accountability

The product story should stay practical and portfolio-grade. The goal is a credible operating context for RevOps analysis, not a large fictional company narrative.

## Revenue Model

Eagle-AI sells annual software contracts with a meaningful onboarding and implementation component, especially in larger deals.

For this MVP, opportunity `amount` represents first-year contract value:

- first-year subscription revenue
- onboarding and implementation fees

This is an intentional simplification. The model does not split software and services into separate revenue objects.

Expansion deals continue to represent incremental first-year contract value within the current period rather than a separate object model.

## Segment Pricing Logic

The current seed already implies a usable segment ladder. Future deal generation should preserve that ladder.

Default segment bands:

- Commercial: roughly `$30k-$65k`
- Mid-market: roughly `$60k-$100k`
- Enterprise: roughly `$120k-$220k`

Guidance:

- modest overlap can exist near band boundaries
- segment should remain one of the strongest predictors of amount
- enterprise should remain the revenue-weighted anchor of the model
- implementation contribution should be more material in enterprise than in commercial

## Current Operating Structure

The current team and region model stays fixed for Task 15B:

- `NA Commercial` -> `North America`
- `NA Strategic` -> `North America`
- `EMEA Growth` -> `EMEA`
- `APAC Expansion` -> `APAC`

The app should continue to read like one company operating through these four sales motions rather than through a larger organizational hierarchy.

## Team Motion

### NA Commercial

- higher-volume team
- mostly commercial and lower mid-market
- shorter sales cycles
- more pipeline count and lower average deal size

### NA Strategic

- fewer, larger deals
- enterprise-heavy
- longer cycles
- larger implementation components
- larger late-stage forecast swings are acceptable

### EMEA Growth

- balanced motion
- mid-market-heavy with some enterprise
- mixed source profile
- moderate cycle length and moderate complexity

### APAC Expansion

- smaller regional footprint than North America
- not token-level, but clearly smaller than North America
- stronger expansion bias than the other teams
- expansion work can reflect added seats, added modules, or broader rollout scope

APAC should not be treated as expansion-only. It should retain a clear expansion tendency without becoming a one-note region.

## Rep Archetypes

The current capacity-band model already supports believable role specialization.

Current mapping:

- Strategic: Leo Nguyen, Priya Shah
- Growth: Ava Carter, Maya Roberts
- Core: Evan Scott, Noah Brooks

Expected behavior by archetype:

### Strategic reps

- fewer total opportunities
- higher average contract value
- strongest enterprise concentration
- longest average sales cycles
- more late-stage variability because large deals can move forecast materially

### Growth reps

- balanced portfolio
- mid-market dominant
- moderate counts and moderate ACV
- healthy mix of outbound, inbound, and partner-sourced motion

### Core reps

- highest counts
- smaller average contract values
- commercial-heavy with some lower mid-market
- faster cycle times
- more top-of-funnel and mid-funnel density

These rules should replace the current too-even per-rep distribution during Task 15B without changing the rep roster.

## Timeframe Interpretation

The seeded periods should read as one continuous business story:

### Q4 2025

- more historical
- more closed opportunities
- more finalized outcomes
- less speculative forecasting

### Q1 2026

- more active pipeline
- more open forecast
- more uncertainty
- more probability and risk variation

March can remain the heaviest close month, but the model should not feel artificially cliff-loaded.

## Baseline Seed State

Task 15A treats the current seed as a reasonable base that needs richer business framing and more realistic unevenness, not a broken model.

Current baseline:

- 24 seeded opportunities
- structurally plausible but too even
- each rep currently owns exactly 4 deals
- North America is the largest slice
- EMEA is second
- APAC is smallest
- Enterprise is the largest revenue-weighted segment

Current segment amounts already fit the intended ladder reasonably well:

- Commercial: about `$35k-$67k`
- Mid-market: about `$57k-$98k`
- Enterprise: about `$112k-$210k`

## Intentional Modeling Constraint

The current `amount` field blends subscription and onboarding / implementation into a single first-year contract value number.

That is a constraint, but not currently a modeling problem.

For this MVP, the simplification is acceptable because:

- the dashboard analyzes commercial performance, not invoice composition
- the current selector layer only needs one comparable deal-value number
- enterprise implementation scope can still be represented credibly through larger first-year contract values

Task 15B should preserve this model unless a later task explicitly requires a deeper revenue breakdown.

## Guardrails For Task 15B

Task 15B should:

- add more opportunities only
- preserve the current regions, segments, teams, reps, and timeframe presets
- preserve the current stage, forecast category, and closed-state model
- keep shared selectors as the source of truth
- align copy changes to Eagle-AI only where the product/business framing needs to become explicit

Task 15B should not:

- invent a new product catalog
- add a services revenue object model
- introduce new filter dimensions
- create a different company story per region or team
