import { useState, type PropsWithChildren } from 'react';
import { createDefaultFilters, DEFAULT_TIMEFRAME_ID } from '../../data/mock';
import type { FilterSelectionKey, RevOpsFilters } from '../../types/revops';
import { FilterContext } from './filterContext';

export function FilterProvider({ children }: PropsWithChildren) {
  const [filters, setFilters] = useState<RevOpsFilters>(createDefaultFilters);

  const hasActiveFilters =
    filters.timeframeId !== DEFAULT_TIMEFRAME_ID ||
    filters.segmentIds.length > 0 ||
    filters.regionIds.length > 0 ||
    filters.teamIds.length > 0 ||
    filters.repIds.length > 0;

  const updateTimeframe = (timeframeId: string) => {
    setFilters((current) => ({
      ...current,
      timeframeId,
    }));
  };

  const updateSingleSelection = (
    key: FilterSelectionKey,
    selectedId: string,
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: selectedId ? [selectedId] : [],
    }));
  };

  const resetFilters = () => {
    setFilters(createDefaultFilters());
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        hasActiveFilters,
        updateTimeframe,
        updateSingleSelection,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
