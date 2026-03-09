import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';
import type { ForecastCompositionRow, RiskRow } from '../../types/revops';
import {
  formatCompactCurrency,
  formatCount,
  formatCurrency,
  formatPercentage,
} from '../../lib/formatters';

const forecastPalette = {
  closedWon: {
    fill: 'rgba(49,196,141,0.82)',
    stroke: 'rgba(49,196,141,0.28)',
  },
  weightedOpen: {
    fill: 'rgba(111,107,255,0.82)',
    stroke: 'rgba(111,107,255,0.28)',
  },
} as const;

const compositionPalette: Record<ForecastCompositionRow['id'], string> = {
  commit: 'var(--rs-success)',
  best_case: 'var(--rs-accent-primary)',
  pipeline: 'var(--rs-warning)',
};

const riskLevelPalette = {
  low: {
    fill: 'rgba(49,196,141,0.82)',
    stroke: 'rgba(49,196,141,0.28)',
  },
  medium: {
    fill: 'rgba(111,107,255,0.82)',
    stroke: 'rgba(111,107,255,0.28)',
  },
  high: {
    fill: 'rgba(240,82,82,0.82)',
    stroke: 'rgba(240,82,82,0.3)',
  },
} as const;

type ForecastCoverageDatum = {
  label: string;
  closedWonAmount: number;
  weightedOpenPipelineAmount: number;
  targetAmount: number;
  weightedForecastAmount: number;
  forecastGapAmount: number;
};

function formatAxisCurrency(value: number | string) {
  return formatCompactCurrency(Number(value));
}

function getAxisMax(values: number[]) {
  const maxValue = Math.max(...values, 1);

  return Math.ceil(maxValue * 1.15);
}

function RenderSafeChart({
  className,
  minHeight,
  children,
}: {
  className: string;
  minHeight: number;
  children: ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={className}>
      {isReady ? children : <div style={{ minHeight }} />}
    </div>
  );
}

function ForecastCoverageTooltip({
  active,
  payload,
}: TooltipContentProps) {
  const row = payload?.[0]?.payload as ForecastCoverageDatum | undefined;

  if (!active || !row) {
    return null;
  }

  return (
    <div className="min-w-[240px] rounded-soft border border-white/10 bg-surface-elevated/96 p-4 shadow-panel">
      <p className="text-sm font-medium text-text-primary">{row.label}</p>
      <div className="mt-3 space-y-2 text-sm text-text-secondary">
        <div className="flex items-center justify-between gap-4">
          <span>Closed won</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(row.closedWonAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Weighted open</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(row.weightedOpenPipelineAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Weighted forecast</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(row.weightedForecastAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Visible target</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(row.targetAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Gap to target</span>
          <span className="font-medium text-text-primary">
            {row.forecastGapAmount <= 0 ? 'Above' : 'Below'} by{' '}
            {formatCurrency(Math.abs(row.forecastGapAmount))}
          </span>
        </div>
      </div>
    </div>
  );
}

function ForecastCompositionTooltip({
  active,
  payload,
}: TooltipContentProps) {
  const row = payload?.[0]?.payload as ForecastCompositionRow | undefined;

  if (!active || !row) {
    return null;
  }

  return (
    <div className="min-w-[220px] rounded-soft border border-white/10 bg-surface-elevated/96 p-4 shadow-panel">
      <p className="text-sm font-medium text-text-primary">{row.label}</p>
      <div className="mt-3 space-y-2 text-sm text-text-secondary">
        <div className="flex items-center justify-between gap-4">
          <span>Open amount</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(row.amount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Share of open book</span>
          <span className="font-medium text-text-primary">
            {formatPercentage(row.share)}
          </span>
        </div>
      </div>
    </div>
  );
}

function RiskDistributionTooltip({
  active,
  payload,
}: TooltipContentProps) {
  const row = payload?.[0]?.payload as RiskRow | undefined;

  if (!active || !row) {
    return null;
  }

  return (
    <div className="min-w-[220px] rounded-soft border border-white/10 bg-surface-elevated/96 p-4 shadow-panel">
      <p className="text-sm font-medium text-text-primary">{row.label}</p>
      <div className="mt-3 space-y-2 text-sm text-text-secondary">
        <div className="flex items-center justify-between gap-4">
          <span>Open amount</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(row.amount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Visible deals</span>
          <span className="font-medium text-text-primary">
            {formatCount(row.count)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Share of open book</span>
          <span className="font-medium text-text-primary">
            {formatPercentage(row.share)}
          </span>
        </div>
      </div>
    </div>
  );
}

type ForecastCoverageChartProps = {
  targetAmount: number;
  closedWonAmount: number;
  weightedOpenPipelineAmount: number;
  weightedForecastAmount: number;
  forecastGapAmount: number;
};

export function ForecastCoverageChart({
  targetAmount,
  closedWonAmount,
  weightedOpenPipelineAmount,
  weightedForecastAmount,
  forecastGapAmount,
}: ForecastCoverageChartProps) {
  const data: ForecastCoverageDatum[] = [
    {
      label: 'Weighted forecast',
      closedWonAmount,
      weightedOpenPipelineAmount,
      targetAmount,
      weightedForecastAmount,
      forecastGapAmount,
    },
  ];

  return (
    <div className="min-w-0 space-y-4">
      <RenderSafeChart
        className="min-w-0 h-[220px] rounded-soft border border-white/8 bg-surface-alt/40 p-3"
        minHeight={196}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={196}
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 28, left: 8, bottom: 0 }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 4"
            />
            <XAxis
              type="number"
              domain={[
                0,
                getAxisMax([targetAmount, weightedForecastAmount, closedWonAmount]),
              ]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--rs-text-muted)', fontSize: 12 }}
              tickFormatter={formatAxisCurrency}
            />
            <YAxis
              dataKey="label"
              type="category"
              width={118}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--rs-text-muted)', fontSize: 12 }}
            />
            <ReferenceLine
              x={targetAmount}
              stroke="rgba(245,185,76,0.72)"
              strokeDasharray="6 6"
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={ForecastCoverageTooltip}
            />
            <Bar
              dataKey="closedWonAmount"
              name="Closed won"
              stackId="forecast"
              radius={[999, 0, 0, 999]}
              barSize={24}
            >
              {data.map((row) => (
                <Cell
                  key={`${row.label}-closed`}
                  fill={forecastPalette.closedWon.fill}
                  stroke={forecastPalette.closedWon.stroke}
                />
              ))}
            </Bar>
            <Bar
              dataKey="weightedOpenPipelineAmount"
              name="Weighted open"
              stackId="forecast"
              radius={[0, 999, 999, 0]}
              barSize={24}
            >
              {data.map((row) => (
                <Cell
                  key={`${row.label}-open`}
                  fill={forecastPalette.weightedOpen.fill}
                  stroke={forecastPalette.weightedOpen.stroke}
                />
              ))}
              <LabelList
                dataKey="weightedForecastAmount"
                position="right"
                offset={10}
                fill="var(--rs-text-primary)"
                fontSize={12}
                formatter={(value) => formatCompactCurrency(Number(value ?? 0))}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </RenderSafeChart>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-pill border border-white/8 bg-surface-alt/55 px-3 py-1.5 text-xs text-text-secondary">
          <span className="h-2.5 w-2.5 rounded-full bg-success" />
          <span>Closed won</span>
        </div>
        <div className="flex items-center gap-2 rounded-pill border border-white/8 bg-surface-alt/55 px-3 py-1.5 text-xs text-text-secondary">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-primary" />
          <span>Weighted open pipeline</span>
        </div>
        <div className="flex items-center gap-2 rounded-pill border border-white/8 bg-surface-alt/55 px-3 py-1.5 text-xs text-text-secondary">
          <span className="w-4 border-t border-dashed border-warning" />
          <span>Visible target</span>
        </div>
      </div>
    </div>
  );
}

type ForecastCompositionChartProps = {
  items: ForecastCompositionRow[];
  totalAmount: number;
};

export function ForecastCompositionChart({
  items,
  totalAmount,
}: ForecastCompositionChartProps) {
  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(220px,0.82fr)_minmax(0,1.18fr)] xl:items-center">
      <RenderSafeChart
        className="relative min-w-0 h-[250px] rounded-soft border border-white/8 bg-surface-alt/40 p-3"
        minHeight={226}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={226}
        >
          <PieChart>
            <Tooltip content={ForecastCompositionTooltip} />
            <Pie
              data={items}
              dataKey="amount"
              nameKey="label"
              innerRadius={66}
              outerRadius={96}
              paddingAngle={items.length > 1 ? 3 : 0}
              stroke="rgba(17,20,27,0.96)"
              strokeWidth={4}
            >
              {items.map((item) => (
                <Cell
                  key={item.id}
                  fill={compositionPalette[item.id]}
                  stroke="rgba(17,20,27,0.96)"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted">
            Open pipeline
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
            {formatCompactCurrency(totalAmount)}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {items.length} active buckets
          </p>
        </div>
      </RenderSafeChart>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-soft border border-white/8 bg-surface-alt/45 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: compositionPalette[item.id] }}
                />
                <p className="text-sm font-medium text-text-primary">
                  {item.label}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">
                  {formatCompactCurrency(item.amount)}
                </p>
                <p className="text-xs text-text-muted">
                  {formatPercentage(item.share)}
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-pill bg-surface">
              <div
                className="h-full rounded-pill"
                style={{
                  width: `${Math.max(item.share * 100, 6)}%`,
                  backgroundColor: compositionPalette[item.id],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type RiskDistributionChartProps = {
  data: RiskRow[];
};

export function RiskDistributionChart({ data }: RiskDistributionChartProps) {
  if (data.length === 0) {
    return null;
  }

  return (
    <div className="min-w-0 space-y-4">
      <RenderSafeChart
        className="min-w-0 h-[280px] rounded-soft border border-white/8 bg-surface-alt/40 p-3"
        minHeight={256}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={256}
        >
          <BarChart
            data={data}
            margin={{ top: 16, right: 8, left: -12, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--rs-text-muted)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={72}
              tick={{ fill: 'var(--rs-text-muted)', fontSize: 12 }}
              tickFormatter={formatAxisCurrency}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={RiskDistributionTooltip}
            />
            <Bar
              dataKey="amount"
              name="Open amount"
              radius={[10, 10, 0, 0]}
              barSize={42}
            >
              {data.map((row) => {
                const palette =
                  riskLevelPalette[row.id as keyof typeof riskLevelPalette] ??
                  riskLevelPalette.medium;

                return (
                  <Cell
                    key={row.id}
                    fill={palette.fill}
                    stroke={palette.stroke}
                  />
                );
              })}
              <LabelList
                dataKey="amount"
                position="top"
                offset={10}
                fill="var(--rs-text-primary)"
                fontSize={12}
                formatter={(value) => formatCompactCurrency(Number(value ?? 0))}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </RenderSafeChart>

      <div className="rounded-soft border border-white/8 bg-surface-alt/45 px-4 py-3 text-sm text-text-secondary">
        Low, medium, and high bands cover the full open book for the current
        filter slice, so the chart reconciles cleanly to visible open pipeline.
      </div>
    </div>
  );
}
