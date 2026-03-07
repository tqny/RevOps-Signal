import {
  regionOptions,
  repOptions,
  segmentOptions,
  teamOptions,
  timeframeOptions,
} from '../../data/mock';
import type { FilterOption, FilterSelectionKey } from '../../types/revops';
import { cn } from '../../lib/utils';
import { useFilters } from './filterContext';

type SelectFieldProps = {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="min-w-[150px] flex-1 space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-soft border border-white/8 bg-surface-alt px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent-primary/45 focus:ring-2 focus:ring-accent-primary/20"
      >
        {options.map((option) => (
          <option key={option.id || 'all'} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const allOption = { id: '', label: 'All' };

const secondaryFields: Array<{
  label: string;
  key: FilterSelectionKey;
  options: FilterOption[];
}> = [
  {
    label: 'Segment',
    key: 'segmentIds',
    options: segmentOptions,
  },
  {
    label: 'Region',
    key: 'regionIds',
    options: regionOptions,
  },
  {
    label: 'Team',
    key: 'teamIds',
    options: teamOptions,
  },
  {
    label: 'Rep',
    key: 'repIds',
    options: repOptions,
  },
];

export function FilterBar() {
  const {
    filters,
    hasActiveFilters,
    resetFilters,
    updateTimeframe,
    updateSingleSelection,
  } = useFilters();

  return (
    <div className="rounded-soft border border-white/6 bg-surface-alt/70 p-3">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-text-primary">
              Shared filter model
            </p>
            <p className="text-sm text-text-secondary">
              Filters now drive the seeded local dataset and shared selectors
              across every route.
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className={cn(
              'rounded-pill border px-3 py-2 text-sm font-medium transition',
              hasActiveFilters
                ? 'border-accent-primary/35 bg-accent-primary/12 text-accent-secondary hover:bg-accent-primary/18'
                : 'cursor-not-allowed border-white/8 bg-surface text-text-muted',
            )}
            disabled={!hasActiveFilters}
          >
            Reset filters
          </button>
        </div>
        <div className="grid gap-3 xl:grid-cols-5">
          <SelectField
            label="Timeframe"
            value={filters.timeframeId}
            options={timeframeOptions}
            onChange={updateTimeframe}
          />
          {secondaryFields.map((field) => (
            <SelectField
              key={field.key}
              label={field.label}
              value={filters[field.key][0] ?? ''}
              options={[allOption, ...field.options]}
              onChange={(value) => updateSingleSelection(field.key, value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
