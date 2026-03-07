import { createContext, useContext } from 'react';
import type { FilterSelectionKey, RevOpsFilters } from '../../types/revops';

export type FilterContextValue = {
  filters: RevOpsFilters;
  hasActiveFilters: boolean;
  updateTimeframe: (timeframeId: string) => void;
  updateSingleSelection: (key: FilterSelectionKey, selectedId: string) => void;
  resetFilters: () => void;
};

export const FilterContext = createContext<FilterContextValue | null>(null);

export function useFilters() {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error('useFilters must be used within a FilterProvider');
  }

  return context;
}
