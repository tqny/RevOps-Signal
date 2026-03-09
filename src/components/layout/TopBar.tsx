import { FilterBar, useFilters } from '../../features/filters';
import { StatusBadge } from '../ui/StatusBadge';

export function TopBar() {
  const { hasActiveFilters } = useFilters();

  return (
    <div className="rounded-panel border border-white/8 bg-surface/85 p-4 shadow-panel backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
              RevOps Signal
            </p>
            <h2 className="mt-2 text-lg font-semibold text-text-primary">
              Shared filters and selector-backed metrics now drive every route
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge variant="neutral">
              Set 1 styling normalized
            </StatusBadge>
            <StatusBadge variant="success">Shared selectors live</StatusBadge>
            <StatusBadge variant={hasActiveFilters ? 'accent' : 'neutral'}>
              {hasActiveFilters ? 'Filter context updated' : 'Default filters'}
            </StatusBadge>
          </div>
        </div>
        <FilterBar />
      </div>
    </div>
  );
}
