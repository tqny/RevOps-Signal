# RevOps Signal - Developer Design Brief

## Intended User Experience

The product should feel like a polished internal RevOps dashboard used by serious operators and leadership.

The experience should communicate:

- clarity
- credibility
- control
- connected business reasoning

The user should feel that each page explains a different part of the same revenue story.

## Visual Direction

Primary visual character:

- dark
- premium
- strategic
- crisp
- restrained

This is not a flashy sales landing page.
It is a serious internal analytics product with taste.

## Composition Priorities

### Global

- stable left nav
- compact top bar
- strong page title / summary zone
- clean grid-based content

### Per page

1. summary first
2. diagnosis second
3. supporting specifics third

## Chart Priorities

Use visual variety, but only where it earns its keep.

Preferred uses:

- line for trend
- bar for comparison
- stacked bar for composition
- donut for limited share/composition use
- funnel for sequential conversion
- progress bars for attainment/confidence
- tables for trust and specificity

## Responsive Strategy

Desktop-first.
Optimize for laptop and standard monitor use.
On smaller widths:

- stack cards
- allow some horizontal table overflow
- keep KPIs and filters readable

## Dark Mode Behavior

Dark mode is the native default.
No alternate light theme is required in MVP.

Use layered surfaces:

- app background
- primary cards
- secondary elevated surfaces
- soft borders
- restrained accent focus states

## Typography Direction

Use a non-default sans family that still feels operational and serious.
Favor Manrope or a similar clean geometric family over generic dashboard defaults.

## Minimum Token Set Required

Implement at minimum:

- app background
- primary surface
- secondary surface
- border
- primary text
- secondary text
- accent primary
- success
- warning
- danger
- spacing scale
- radius scale
- shadow scale
- typography scale

## Implementation Checklist

- create token foundation first
- build shell before page detail
- reuse card and filter primitives
- keep chart framing consistent
- avoid ad hoc page-local styling systems
- preserve metric storytelling hierarchy
- keep gradients limited to emphasis moments
- treat Set 1 as final style authority
