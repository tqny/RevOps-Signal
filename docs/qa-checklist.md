# RevOps Signal - QA Checklist

## 1. App / Routing

- [ ] app boots without errors
- [ ] all dashboard routes plus the About route load
- [ ] navigation reflects current route, including the About surface
- [ ] layout remains stable during navigation

## 2. Filters

- [ ] timeframe filter updates outputs
- [ ] segment filter updates outputs
- [ ] region filter updates outputs
- [ ] team/rep filter updates outputs
- [ ] combined filters do not crash the app
- [ ] empty filtered subsets show graceful states

## 3. Metric Consistency

- [ ] top-level KPI values reconcile with page details
- [ ] weighted forecast is derived consistently
- [ ] attainment uses the correct underlying logic
- [ ] stage totals reconcile across funnel views
- [ ] rep/team rollups match underlying opportunities

## 4. Visual Quality

- [ ] card spacing is consistent
- [ ] typography hierarchy is clear
- [ ] tables are readable
- [ ] charts are not cramped
- [ ] accents are restrained and coherent
- [ ] pages feel like one product

## 5. Accessibility / Interaction

- [ ] keyboard focus is visible
- [ ] text contrast is acceptable
- [ ] controls communicate selected/hover/disabled states
- [ ] tables and charts have understandable labels/titles

## 6. Responsiveness

- [ ] app remains usable on laptop widths
- [ ] no major overlap or clipping in key sections
- [ ] tables degrade acceptably
- [ ] charts remain readable

## 7. Engineering Quality

- [ ] build passes
- [ ] lint passes
- [ ] shared selectors used for core metrics
- [ ] no obvious duplicated business logic
- [ ] docs updated if scope/architecture changed
