import { NavLink } from 'react-router-dom';
import { APP_NAME, NAV_ITEMS } from '../../lib/constants';
import { cn } from '../../lib/utils';

export function SideNav() {
  return (
    <aside className="w-full shrink-0 rounded-panel border border-white/8 bg-surface/85 p-4 shadow-panel backdrop-blur-sm lg:sticky lg:top-4 lg:w-[280px] lg:self-start">
      <div className="space-y-6">
        <div className="rounded-soft border border-white/6 bg-surface-alt/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-secondary">
            RevOps MVP
          </p>
          <div className="mt-3 space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
              {APP_NAME}
            </h2>
            <p className="text-sm leading-6 text-text-secondary">
              Four connected pages, local seeded data only, shared filters, no
              backend.
            </p>
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
                  'group flex min-w-[220px] flex-1 items-center gap-3 rounded-soft border px-3 py-3 transition duration-150 ease-out lg:min-w-0',
                  isActive
                    ? 'border-accent-primary/40 bg-accent-primary/14 text-text-primary shadow-[0_0_0_1px_rgba(111,107,255,0.16)]'
                    : 'border-white/6 bg-surface-alt/70 text-text-secondary hover:border-white/12 hover:bg-surface-elevated/80 hover:text-text-primary',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-soft border text-xs font-semibold tracking-[0.18em]',
                      isActive
                        ? 'border-accent-primary/40 bg-accent-primary/18 text-accent-secondary'
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

        <div className="rounded-soft border border-dashed border-white/10 bg-surface-alt/55 p-4 text-sm text-text-secondary">
          <p className="font-medium text-text-primary">Build rails</p>
          <ul className="mt-3 space-y-2 leading-6">
            <li>Local mock data only</li>
            <li>Shared selector-driven metrics</li>
            <li>No auth, backend, or CRM integration</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
