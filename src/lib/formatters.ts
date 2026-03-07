import {
  regionOptions,
  repOptions,
  segmentOptions,
  teamOptions,
  timeframeOptions,
} from '../data/mock';
import type { FilterOption, RevOpsFilters } from '../types/revops';

function findLabel(options: FilterOption[], value: string | undefined) {
  if (!value) {
    return 'All';
  }

  return options.find((option) => option.id === value)?.label ?? 'All';
}

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const standardCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-US');

export function formatFilterSummary(filters: RevOpsFilters) {
  const summaryItems = [
    `Timeframe: ${findLabel(timeframeOptions, filters.timeframeId)}`,
    `Segment: ${findLabel(segmentOptions, filters.segmentIds[0])}`,
    `Region: ${findLabel(regionOptions, filters.regionIds[0])}`,
    `Team: ${findLabel(teamOptions, filters.teamIds[0])}`,
    `Rep: ${findLabel(repOptions, filters.repIds[0])}`,
  ];

  return summaryItems.join('  /  ');
}

export function formatCompactCurrency(value: number) {
  return compactCurrencyFormatter.format(value);
}

export function formatCurrency(value: number) {
  return standardCurrencyFormatter.format(value);
}

export function formatSignedCompactCurrency(value: number) {
  if (value === 0) {
    return formatCompactCurrency(value);
  }

  const prefix = value > 0 ? '+' : '-';

  return `${prefix}${formatCompactCurrency(Math.abs(value))}`;
}

export function formatPercentage(value: number) {
  return percentageFormatter.format(value);
}

export function formatCount(value: number) {
  return numberFormatter.format(value);
}

export function formatDays(value: number) {
  return `${Math.round(value)}d`;
}

export function formatLabelFromToken(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
