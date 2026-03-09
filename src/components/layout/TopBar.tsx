import { useLocation } from 'react-router-dom';
import { FilterBar, useFilters } from '../../features/filters';
import { StatusBadge } from '../ui/StatusBadge';

export function TopBar() {
  const location = useLocation();
  const { hasActiveFilters } = useFilters();
  const isAboutRoute = location.pathname === '/about';

  return (
    <div className="rs-panel rounded-panel p-4 sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
              {isAboutRoute ? 'Eagle-AI Context' : 'Eagle-AI Revenue Model'}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-text-primary">
              {isAboutRoute
                ? 'Reviewer framing, business context, and implementation choices'
                : 'Shared filters and selector-backed Eagle-AI metrics now drive every route'}
            </h2>
            {isAboutRoute ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
                This route explains the Eagle-AI scenario, why the AI
                compliance model was chosen, how first-year contract value is
                seeded, and what remains intentionally out of scope.
              </p>
            ) : (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
                Keep the active slice consistent across routes so Eagle-AI
                pipeline, performance, and forecast answers reconcile against
                the same first-year contract value model.
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:max-w-[22rem] lg:justify-end">
            {isAboutRoute ? (
              <>
                <StatusBadge variant="accent">Reviewer guide</StatusBadge>
                <StatusBadge variant="success">Eagle-AI scenario</StatusBadge>
                <StatusBadge variant="neutral">No backend or auth</StatusBadge>
              </>
            ) : (
              <>
                <StatusBadge variant="neutral">50 seeded deals</StatusBadge>
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
