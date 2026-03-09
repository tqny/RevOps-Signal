import {
  DEFAULT_TIMEFRAME_ID,
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
    <label className="rs-inset-panel min-w-0 rounded-soft p-3">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring mt-2 min-w-0 w-full rounded-soft border border-white/8 bg-surface px-3 py-2.5 text-sm text-text-primary outline-none transition hover:border-white/12 focus:border-accent-primary/45"
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
  const activeSelectionCount =
    (filters.timeframeId !== DEFAULT_TIMEFRAME_ID ? 1 : 0) +
    (filters.segmentIds.length > 0 ? 1 : 0) +
    (filters.regionIds.length > 0 ? 1 : 0) +
    (filters.teamIds.length > 0 ? 1 : 0) +
    (filters.repIds.length > 0 ? 1 : 0);

  return (
    <div className="rs-note-panel rounded-soft p-3 sm:p-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
              Filters
            </p>
            <p className="mt-2 text-sm font-medium text-text-primary">
              Shared filter model
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Filters now drive the seeded local dataset and shared selectors
              across every route.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
            <p className="text-xs text-text-muted">
              {hasActiveFilters
                ? `${activeSelectionCount} controls narrowed`
                : 'Default scope applied'}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className={cn(
                'w-full rounded-pill border px-3 py-2 text-sm font-medium transition sm:w-auto',
                hasActiveFilters
                  ? 'border-accent-primary/35 bg-[linear-gradient(180deg,rgba(111,107,255,0.2),rgba(111,107,255,0.08))] text-accent-secondary hover:border-accent-primary/45 hover:bg-accent-primary/18'
                  : 'cursor-not-allowed border-white/8 bg-surface text-text-muted',
              )}
              disabled={!hasActiveFilters}
            >
              Reset filters
            </button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
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
