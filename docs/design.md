# RevOps Signal - Design System and Reference Synthesis

## 1. Design Intent

RevOps Signal should feel like a premium internal analytics product:

- dark
- strategic
- polished
- high-signal
- executive-friendly
- modern without being flashy

The UI should feel dense enough to be believable, but controlled enough to stay readable.

## 2. Master Style Authority

**Set 1 is the master style authority.**

Set 1 governs:

- overall palette
- surface layering
- border and shadow behavior
- navigation tone
- spacing rhythm
- filter/button feel
- overall density target

Other sets may contribute patterns, but all approved patterns must be normalized into Set 1's visual language.

## 3. Approved Reference Contributions

### Set 1

Approved:

- dark premium canvas
- layered card surfaces
- compact dashboard density
- table treatment
- pill/filter styling
- restrained gradient accents
- left-nav + main-panel rhythm

### Set 2

Approved:

- chart card composition
- subchart grouping
- dashboard card arrangement
- chart framing for overview metrics

### Set 3

Approved:

- dense analytics layout patterns
- mixed-chart sections
- segmented controls
- filter/table relationships
- compact analytics page composition

### Set 4

Approved:

- KPI strip treatment
- status pills
- table action placement
- cleaner top utility controls
- minimal enterprise card rhythm

## 4. Rejected / Not Needed

Do not import literally:

- fintech semantics
- hosting/system-monitor semantics
- security-specific widgets as subject matter
- domain-management semantics
- device mockup framing
- overly colorful rainbow chart systems

## 5. Color Principles

- dark charcoal base
- slightly lifted surfaces
- soft borders
- cool violet/indigo/cyan accent family
- green/red reserved for performance or risk signaling
- gradients only for high-emphasis moments

Color count should stay disciplined.

## 6. Typography Principles

- clean sans
- strong KPI numerals
- restrained page headings
- muted labels and helper text
- prioritize information hierarchy and scannability

## 7. Layout Principles

- use cards as primary containment
- maintain consistent gutters
- keep section rhythm even
- lead each page with summary or diagnostic priority widgets
- use lower sections for supporting detail
- avoid cramped, over-nested compositions

## 8. Component Principles

### KPI Cards

- high contrast numbers
- muted label
- compact trend indicator
- optional subtle icon or accent

### Chart Cards

- clear title
- concise subtitle if useful
- legend only when needed
- padded plotting area
- restrained hover/tooltip behavior

### Filters

- compact and aligned
- clearly selected state
- low-noise styling
- shared across pages

### Tables

- soft row dividers
- strong primary text, muted secondary text
- status pills where useful
- right-aligned numeric columns where appropriate

### Progress Bars

- use for quota/attainment and confidence-type displays
- keep instantly readable

## 9. Page-Level Design Notes

### Executive Overview

Most polished and summary-driven page.
It should feel like the best first-impression page.

### Pipeline & Funnel

More diagnostic.
Use sequence and conversion-oriented visuals.

### Sales Performance

Balanced between cards, comparisons, and ranked/tabular data.

### Forecast & Risks

More interpretive and forward-looking.
Risk should be visible but not visually chaotic.

### About This Project

Reviewer orientation should live inside the product shell, not as a detached marketing splash.

Use the same card hierarchy, spacing rhythm, and restrained accent language as the analytics pages.

Content should explain:

- what the project simulates
- why it was built
- how the data and selector model work
- what was intentionally scoped out
- what technical or product judgment the build demonstrates

Preferred patterns:

- editorial-style overview sections
- concise principle or scope callouts
- simple system diagrams or process blocks only if they clarify structure

Avoid:

- hero-copy excess
- marketing claims without substance
- decorative charts that do not explain the product

## 10. Data Viz Rules

- every visualization must answer a specific question
- do not duplicate the same story in multiple chart types
- use line charts for trends
- use bars for comparisons
- use stacked bars for composition over categories
- use donut sparingly for share/composition
- use funnel only where sequential stage logic matters
- use tables to support specificity and trust

## 11. Empty / Sparse State Rules

When filters reduce data significantly:

- preserve layout structure
- show calm empty states
- do not break chart cards
- offer no-results messaging for current filters

## 12. Design Discipline

The project is not trying to imitate the reference brands literally.
It should extract transferable design logic and adapt it to RevOps analytics.
