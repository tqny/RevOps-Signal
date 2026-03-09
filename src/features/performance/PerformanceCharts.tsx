import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';
import { ResponsiveChartContainer } from '../../components/charts/ResponsiveChartContainer';
import type { PerformanceRow } from '../../types/revops';
import {
  formatCount,
  formatCurrency,
  formatPercentage,
} from '../../lib/formatters';

type PaceTone = 'success' | 'accent' | 'warning';

const pacePalette: Record<PaceTone, { fill: string; stroke: string }> = {
  success: {
    fill: 'rgba(49,196,141,0.82)',
    stroke: 'rgba(49,196,141,0.26)',
  },
  accent: {
    fill: 'rgba(111,107,255,0.82)',
    stroke: 'rgba(111,107,255,0.26)',
  },
  warning: {
    fill: 'rgba(245,185,76,0.82)',
    stroke: 'rgba(245,185,76,0.26)',
  },
};

function getPaceTone(rate: number): PaceTone {
  if (rate >= 1) {
    return 'success';
  }

  if (rate >= 0.8) {
    return 'accent';
  }

  return 'warning';
}

function formatRateAxis(value: number | string) {
  return formatPercentage(Number(value));
}

function getChartMaxRate(
  rows: PerformanceRow[],
  getRate: (row: PerformanceRow) => number,
) {
  const highestRate = rows.reduce(
    (maxRate, row) => Math.max(maxRate, getRate(row)),
    1,
  );

  return Math.max(1.1, Math.ceil(highestRate * 10) / 10);
}

function RepAttainmentTooltip({ active, payload }: TooltipContentProps) {
  const row = payload?.[0]?.payload as PerformanceRow | undefined;

  if (!active || !row) {
    return null;
  }

  return (
    <div className="min-w-[240px] rounded-soft border border-white/10 bg-surface-elevated/96 p-4 shadow-panel">
      <p className="text-sm font-medium text-text-primary">{row.ownerName}</p>
      <div className="mt-3 space-y-2 text-sm text-text-secondary">
        <div className="flex items-center justify-between gap-4">
          <span>Closed won</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(row.closedWonAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Attainment</span>
          <span className="font-medium text-text-primary">
            {formatPercentage(row.attainmentRate)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Quota</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(row.quotaAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Win rate</span>
          <span className="font-medium text-text-primary">
            {formatPercentage(row.winRate)}
          </span>
        </div>
      </div>
    </div>
  );
}

function TeamCoverageTooltip({ active, payload }: TooltipContentProps) {
  const row = payload?.[0]?.payload as PerformanceRow | undefined;

  if (!active || !row) {
    return null;
  }

  return (
    <div className="min-w-[240px] rounded-soft border border-white/10 bg-surface-elevated/96 p-4 shadow-panel">
      <p className="text-sm font-medium text-text-primary">{row.ownerName}</p>
      <div className="mt-3 space-y-2 text-sm text-text-secondary">
        <div className="flex items-center justify-between gap-4">
          <span>Weighted forecast</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(row.weightedForecastAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Coverage</span>
          <span className="font-medium text-text-primary">
            {formatPercentage(row.forecastAttainmentRate)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Quota</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(row.quotaAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Open deals</span>
          <span className="font-medium text-text-primary">
            {formatCount(row.openDealCount)}
          </span>
        </div>
      </div>
    </div>
  );
}

type RepAttainmentChartProps = {
  data: PerformanceRow[];
};

export function RepAttainmentChart({ data }: RepAttainmentChartProps) {
  if (data.length === 0) {
    return null;
  }

  const height = Math.max(220, data.length * 52);

  return (
    <ResponsiveChartContainer
      className="min-w-0 rounded-soft border border-white/8 bg-surface-alt/40 p-3"
      style={{ height }}
      minHeight={height}
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
          domain={[0, getChartMaxRate(data, (row) => row.attainmentRate)]}
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--rs-text-muted)', fontSize: 12 }}
          tickFormatter={formatRateAxis}
        />
        <YAxis
          dataKey="ownerName"
          type="category"
          width={108}
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--rs-text-muted)', fontSize: 12 }}
          interval={0}
        />
        <ReferenceLine
          x={1}
          stroke="rgba(245,185,76,0.72)"
          strokeDasharray="6 6"
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          content={RepAttainmentTooltip}
        />
        <Bar
          dataKey="attainmentRate"
          name="Attainment"
          radius={[999, 999, 999, 999]}
          barSize={18}
        >
          {data.map((row) => {
            const tone = getPaceTone(row.attainmentRate);

            return (
              <Cell
                key={row.ownerId}
                fill={pacePalette[tone].fill}
                stroke={pacePalette[tone].stroke}
              />
            );
          })}
          <LabelList
            dataKey="attainmentRate"
            position="right"
            offset={10}
            fill="var(--rs-text-primary)"
            fontSize={12}
            formatter={(value) => formatPercentage(Number(value ?? 0))}
          />
        </Bar>
      </BarChart>
    </ResponsiveChartContainer>
  );
}

type TeamForecastCoverageChartProps = {
  data: PerformanceRow[];
};

export function TeamForecastCoverageChart({
  data,
}: TeamForecastCoverageChartProps) {
  if (data.length === 0) {
    return null;
  }

  const height = Math.max(200, data.length * 60);

  return (
    <ResponsiveChartContainer
      className="min-w-0 rounded-soft border border-white/8 bg-surface-alt/40 p-3"
      style={{ height }}
      minHeight={height}
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
            getChartMaxRate(data, (row) => row.forecastAttainmentRate),
          ]}
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--rs-text-muted)', fontSize: 12 }}
          tickFormatter={formatRateAxis}
        />
        <YAxis
          dataKey="ownerName"
          type="category"
          width={116}
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'var(--rs-text-muted)', fontSize: 12 }}
          interval={0}
        />
        <ReferenceLine
          x={1}
          stroke="rgba(245,185,76,0.72)"
          strokeDasharray="6 6"
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          content={TeamCoverageTooltip}
        />
        <Bar
          dataKey="forecastAttainmentRate"
          name="Forecast coverage"
          radius={[999, 999, 999, 999]}
          barSize={18}
        >
          {data.map((row) => {
            const tone = getPaceTone(row.forecastAttainmentRate);

            return (
              <Cell
                key={row.ownerId}
                fill={pacePalette[tone].fill}
                stroke={pacePalette[tone].stroke}
              />
            );
          })}
          <LabelList
            dataKey="forecastAttainmentRate"
            position="right"
            offset={10}
            fill="var(--rs-text-primary)"
            fontSize={12}
            formatter={(value) => formatPercentage(Number(value ?? 0))}
          />
        </Bar>
      </BarChart>
    </ResponsiveChartContainer>
  );
}
