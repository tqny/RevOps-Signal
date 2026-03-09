import { useLocation } from 'react-router-dom';
import { FilterBar, useFilters } from '../../features/filters';
import { StatusBadge } from '../ui/StatusBadge';

export function TopBar() {
  const location = useLocation();
  const { hasActiveFilters } = useFilters();
  const isAboutRoute = location.pathname === '/about';

  return (
    <div className="rounded-panel border border-white/8 bg-surface/85 p-4 shadow-panel backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
              {isAboutRoute ? 'Project Context' : 'RevOps Signal'}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-text-primary">
              {isAboutRoute
                ? 'Reviewer framing, scope boundaries, and implementation choices'
                : 'Shared filters and selector-backed metrics now drive every route'}
            </h2>
            {isAboutRoute ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
                This route explains what the product simulates, why it was
                built, how the shared data model works, and what was
                intentionally left out of scope.
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isAboutRoute ? (
              <>
                <StatusBadge variant="accent">Reviewer guide</StatusBadge>
                <StatusBadge variant="success">Four-page analytics MVP</StatusBadge>
                <StatusBadge variant="neutral">No backend or auth</StatusBadge>
              </>
            ) : (
              <>
                <StatusBadge variant="neutral">
                  Set 1 styling normalized
                </StatusBadge>
                <StatusBadge variant="success">Shared selectors live</StatusBadge>
                <StatusBadge variant={hasActiveFilters ? 'accent' : 'neutral'}>
                  {hasActiveFilters
                    ? 'Filter context updated'
                    : 'Default filters'}
                </StatusBadge>
              </>
            )}
          </div>
        </div>
        {isAboutRoute ? null : <FilterBar />}
      </div>
    </div>
  );
}
