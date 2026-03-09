import { NavLink } from 'react-router-dom';
import { APP_NAME, NAV_ITEMS } from '../../lib/constants';
import { cn } from '../../lib/utils';

export function SideNav() {
  return (
    <aside className="rs-panel w-full shrink-0 rounded-panel p-4 lg:sticky lg:top-4 lg:w-[252px] lg:self-start xl:w-[280px]">
      <div className="space-y-6">
        <div className="rs-inset-panel rounded-soft p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
                RevOps MVP
              </p>
              <div className="mt-3 space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                  {APP_NAME}
                </h2>
                <p className="text-sm leading-6 text-text-secondary">
                  Four connected analytics pages plus a reviewer guide for
                  Eagle-AI, using 50 deterministic seeded deals, shared
                  filters, and no backend.
                </p>
              </div>
            </div>
            <div className="h-12 w-12 rounded-soft border border-accent-primary/20 bg-[radial-gradient(circle_at_top,rgba(76,215,255,0.35),rgba(111,107,255,0.12)_55%,transparent_72%)]" />
          </div>
        </div>

        <nav
          aria-label="Primary"
          className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'group flex min-w-[200px] flex-1 items-center gap-3 rounded-soft border px-3 py-3 transition duration-150 ease-out sm:min-w-[220px] lg:min-w-0',
                  isActive
                    ? 'border-accent-primary/36 bg-[linear-gradient(90deg,rgba(111,107,255,0.22),rgba(76,215,255,0.08))] text-text-primary shadow-[0_0_0_1px_rgba(111,107,255,0.14)]'
                    : 'border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] text-text-secondary hover:border-white/12 hover:bg-surface-elevated/84 hover:text-text-primary',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-soft border text-xs font-semibold tracking-[0.18em]',
                      isActive
                        ? 'border-accent-primary/34 bg-[linear-gradient(180deg,rgba(111,107,255,0.22),rgba(76,215,255,0.12))] text-accent-secondary'
                        : 'border-white/8 bg-surface text-text-muted',
                    )}
                  >
                    {item.shortLabel}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-inherit">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-text-muted group-hover:text-text-secondary">
                      {item.description}
                    </span>
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="rs-note-panel rounded-soft border-dashed p-4 text-sm text-text-secondary">
          <p className="font-medium text-text-primary">Build rails</p>
          <ul className="mt-3 space-y-2 leading-6">
            <li>Local mock data only</li>
            <li>Amounts represent first-year contract value</li>
            <li>Shared selector-driven metrics</li>
            <li>No auth, backend, or CRM integration</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
