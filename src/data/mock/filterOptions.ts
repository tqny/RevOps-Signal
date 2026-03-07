import type { FilterOption, RevOpsFilters } from '../../types/revops';
import { revOpsDataset } from './revopsDataset';

export const DEFAULT_TIMEFRAME_ID = 'current-quarter';

export const timeframeOptions: FilterOption[] =
  revOpsDataset.timeframePresets.map((preset) => ({
    id: preset.id,
    label: preset.label,
  }));

export const segmentOptions: FilterOption[] = revOpsDataset.segments.map(
  (segment) => ({
    id: segment.id,
    label: segment.name,
  }),
);

export const regionOptions: FilterOption[] = revOpsDataset.regions.map(
  (region) => ({
    id: region.id,
    label: region.name,
  }),
);

export const teamOptions: FilterOption[] = revOpsDataset.teams.map((team) => ({
  id: team.id,
  label: team.name,
}));

export const repOptions: FilterOption[] = revOpsDataset.reps.map((rep) => ({
  id: rep.id,
  label: rep.name,
}));

export function createDefaultFilters(): RevOpsFilters {
  return {
    timeframeId: timeframeOptions[0]?.id ?? DEFAULT_TIMEFRAME_ID,
    segmentIds: [],
    regionIds: [],
    teamIds: [],
    repIds: [],
  };
}
