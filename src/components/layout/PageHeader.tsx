import { useFilters } from '../../features/filters';
import { formatFilterSummary } from '../../lib/formatters';
import { StatusBadge } from '../ui/StatusBadge';

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  const { filters, hasActiveFilters } = useFilters();

  return (
    <header className="flex flex-col gap-4 rounded-panel border border-white/8 bg-surface/85 p-5 shadow-panel backdrop-blur-sm sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-secondary">
            {eyebrow}
          </p>
          <div className="space-y-2">
            <h1 className="text-[1.9rem] font-semibold tracking-tight text-text-primary sm:text-3xl xl:text-[2.4rem]">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-text-secondary">
              {description}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:max-w-[18rem] lg:justify-end">
          <StatusBadge variant={hasActiveFilters ? 'accent' : 'neutral'}>
            {hasActiveFilters
              ? 'Shared filters active'
              : 'Default filter scope'}
          </StatusBadge>
          <StatusBadge variant="success">Selector-backed view</StatusBadge>
        </div>
      </div>
      <div className="rounded-soft border border-white/6 bg-surface-alt/80 px-4 py-3 text-sm text-text-secondary">
        Current filter context: {formatFilterSummary(filters)}
      </div>
    </header>
  );
}
