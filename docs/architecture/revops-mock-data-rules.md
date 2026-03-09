# RevOps Signal - Eagle-AI Mock Data Rules

## Purpose

This document translates Eagle-AI business framing into concrete rules for future seed expansion.

It defines what must stay fixed, what may vary, and what correlations future opportunities must respect so Task 15B can expand the dataset without inventing new business logic ad hoc.

## Fixed Model Assumptions

The following remain fixed unless a future Architect task changes the durable docs first:

### Entity and filter surface

- 6 seeded periods
- 3 timeframe presets
- 3 regions
- 3 segments
- 4 teams
- 6 reps

No new filter dimensions or new entity types should be introduced in Task 15B.

### Opportunity schema

The current opportunity schema remains the working model for Task 15B.

Future expansion should use the existing fields and enums rather than adding new ones casually.

### Opportunity lifecycle model

Keep the current separation:

- `stage` = active funnel position
- `forecastCategory` = forecast confidence bucket
- `isClosed` + `outcome` = closed-state representation

Do not add `Closed Won` or `Closed Lost` as stage values.

### Selector ownership

Shared selector logic remains the single source of truth for page metrics.

Data expansion should fit the selectors. It should not create a second business-logic layer in page code or seed helpers.

### Quota bias

Deal generation should remain directionally aligned with the current quota-share weighting by rep and segment.

The business story should support the existing quota model rather than fighting it.

## Baseline Starting Point

Current seeded state:

- 24 total opportunities
- even 4-deal distribution per rep
- North America largest, EMEA second, APAC smallest
- Enterprise largest by revenue weight
- March currently carries the heaviest expected close concentration

This baseline is not wrong. It is just too symmetrical to feel like a mature operating dataset.

## Required Distribution Rules

Task 15B may randomize details, but the resulting dataset must satisfy the following directional rules.

### 1. Rep counts should become intentionally uneven

Required pattern:

- strategic reps should usually own fewer but larger deals
- growth reps should sit in the middle
- core reps should carry higher counts and smaller average deal size

Task 15B should clearly move away from the current exact `4 deals per rep` symmetry.

### 2. Region and team mix should stay believable

Required pattern:

- North America should remain the largest region by opportunity count and value
- EMEA should remain meaningful, not residual
- APAC should remain smaller than North America while still having enough volume to support page-level analysis
- `NA Strategic` should skew enterprise and high-value
- `NA Commercial` should skew higher-volume and smaller-ticket
- `EMEA Growth` should stay balanced
- `APAC Expansion` should show a stronger expansion tendency than the other teams

### 3. Segment should strongly predict amount

Required pattern:

- commercial deals should rarely look enterprise-sized
- enterprise deals should rarely look commercial-small
- mid-market should bridge the ladder without erasing it
- modest overlap is acceptable near band edges

Default target bands:

- Commercial: roughly `$30k-$65k`
- Mid-market: roughly `$60k-$100k`
- Enterprise: roughly `$120k-$220k`

### 4. Stage should correlate with probability

Required pattern:

- `Prospect` = lowest probabilities
- `Discovery` = low to moderate probabilities
- `Solution` = moderate probabilities
- `Proposal` = moderately high probabilities
- `Negotiation` = highest probabilities among open deals

Variation is allowed, but stage progression should remain directionally meaningful.

### 5. Stage and risk should correlate with age

Required pattern:

- larger and more strategic deals usually stay open longer
- late-stage enterprise deals can be older without automatically being unhealthy
- older early-stage deals should often look weaker or riskier
- fast commercial wins should remain plausible
- high-risk late-stage deals should not look cleaner than healthy peers

`daysOpen`, `riskLevel`, `riskReason`, and `healthScore` should tell a coherent operational story together.

### 6. Source should correlate with team and segment tendencies

Use current source values only:

- `Inbound`
- `Outbound`
- `Partner`
- `Referral`
- `Expansion`
- `SDR`

Expected tendencies:

- `Inbound`: more common in commercial and mid-market, especially `NA Commercial` and `EMEA Growth`
- `Outbound`: strong fit for strategic and growth motions, especially mid-market and enterprise creation
- `Partner`: can skew larger and is a good fit for regulated enterprise buying
- `Referral`: lower-volume but often cleaner, higher-intent motion across mid-market and enterprise
- `Expansion`: strongest fit for `APAC Expansion`, representing added seats, modules, or broader rollout scope
- `SDR`: stronger fit for commercial and lower mid-market top-of-funnel volume

These are tendencies, not exclusivity rules.

### 7. Forecast category should correlate with stage and risk

Use current forecast categories only:

- `pipeline`
- `best_case`
- `commit`

Required pattern:

- `pipeline` should hold most earlier-stage and uncertain deals
- `best_case` should hold plausible upside that is not yet committed
- `commit` should concentrate in healthier late-stage deals

Additional rules:

- early-stage deals should almost never be `commit`
- high-risk deals should be less likely to be `commit`
- complex enterprise deals can remain `best_case` late in the cycle
- `Negotiation` does not automatically equal `commit`

### 8. Closed outcomes should reflect realistic timing

Required pattern:

- commercial wins can close faster
- enterprise wins generally take longer
- later-stage losses should exist
- historical periods should contain more closed outcomes than active forecast states
- lost deals should not all be tiny, ancient, or early-stage

### 9. Timeframe mix should tell one business story

Required pattern:

- Q4 2025 should read as more historical and outcome-heavy
- Q1 2026 should read as more open and forecast-heavy
- March may remain the heaviest close month, but not cartoonishly overloaded

## Allowed Variation

Task 15B may vary:

- exact deal counts per rep
- exact amount within the approved segment ladder
- exact source mix by rep and team
- exact risk reasons
- exact close timing by month

As long as the resulting dataset still respects the directional rules in this document.

## Non-Goals

Task 15B should not:

- add new reps, teams, segments, regions, or timeframe presets
- introduce a new object model for expansion revenue
- change stages, forecast categories, or closed-state representation
- fork selector logic
- use randomness that produces obviously incoherent combinations

## Implementation Hand-Off To Task 15B

Task 15B can proceed safely if it treats these rules as its contract:

- expand the opportunity set materially beyond the current 24 records
- make per-rep, per-team, and per-period distributions less symmetrical
- keep Eagle-AI business framing explicit in the seed logic and supporting copy
- preserve the current schema and selector model

If Task 15B hits a real modeling problem, that issue should be documented first rather than patched silently in code.
