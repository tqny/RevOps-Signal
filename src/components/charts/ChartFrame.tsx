import { SurfaceCard } from '../ui/SurfaceCard';

type ChartFrameLayout = 'bars' | 'spark' | 'stack' | 'funnel' | 'ring';

type ChartFrameProps = {
  title: string;
  description: string;
  layout?: ChartFrameLayout;
};

const bars = [44, 68, 58, 82, 54, 76, 64];
const stackBars = [
  ['35%', '40%', '25%'],
  ['20%', '46%', '34%'],
  ['30%', '38%', '32%'],
  ['26%', '48%', '26%'],
];

function SparkLayout() {
  return (
    <div className="mt-6 overflow-hidden rounded-soft border border-white/6 bg-surface-alt/70 p-4">
      <div className="relative h-40">
        <div className="absolute inset-x-0 bottom-0 top-4 flex items-end gap-3">
          {bars.map((height, index) => (
            <div
              // Deterministic decorative scaffold only; real charts arrive after selectors.
              key={height}
              className="flex-1 rounded-t-[18px] border border-white/5 bg-[linear-gradient(180deg,rgba(76,215,255,0.24),rgba(111,107,255,0.08))]"
              style={{ height: `${height}%`, opacity: 0.72 + index * 0.03 }}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)]" />
        </div>
      </div>
    </div>
  );
}

function BarsLayout() {
  return (
    <div className="mt-6 flex h-44 items-end gap-3 rounded-soft border border-white/6 bg-surface-alt/70 p-4">
      {bars.map((height, index) => (
        <div key={height} className="flex flex-1 items-end">
          <div
            className="w-full rounded-t-[18px] border border-white/6 bg-[linear-gradient(180deg,rgba(111,107,255,0.8),rgba(111,107,255,0.18))]"
            style={{ height: `${height}%`, opacity: 0.64 + index * 0.04 }}
          />
        </div>
      ))}
    </div>
  );
}

function StackLayout() {
  return (
    <div className="mt-6 space-y-4 rounded-soft border border-white/6 bg-surface-alt/70 p-4">
      {stackBars.map((segments, index) => (
        <div key={index} className="space-y-2">
          <div className="text-xs uppercase tracking-[0.18em] text-text-muted">
            Slice {index + 1}
          </div>
          <div className="flex h-6 overflow-hidden rounded-pill border border-white/6 bg-surface">
            <div
              className="h-full bg-accent-primary/70"
              style={{ width: segments[0] }}
            />
            <div
              className="h-full bg-accent-secondary/70"
              style={{ width: segments[1] }}
            />
            <div
              className="h-full bg-white/14"
              style={{ width: segments[2] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function FunnelLayout() {
  const widths = ['100%', '84%', '70%', '54%', '38%'];

  return (
    <div className="mt-6 space-y-3 rounded-soft border border-white/6 bg-surface-alt/70 p-4">
      {widths.map((width, index) => (
        <div key={width} className="space-y-2">
          <div className="text-xs uppercase tracking-[0.18em] text-text-muted">
            Stage {index + 1}
          </div>
          <div
            className="flex h-9 items-center rounded-pill border border-white/6 bg-[linear-gradient(90deg,rgba(111,107,255,0.78),rgba(76,215,255,0.16))] px-4 text-sm text-text-primary"
            style={{ width }}
          >
            Funnel placeholder
          </div>
        </div>
      ))}
    </div>
  );
}

function RingLayout() {
  return (
    <div className="mt-6 flex flex-col gap-6 rounded-soft border border-white/6 bg-surface-alt/70 p-4 xl:flex-row xl:items-center xl:justify-between">
      {[
        'conic-gradient(var(--rs-accent-primary) 0deg 220deg, rgba(255,255,255,0.08) 220deg 360deg)',
        'conic-gradient(var(--rs-accent-secondary) 0deg 180deg, rgba(255,255,255,0.08) 180deg 360deg)',
      ].map((background, index) => (
        <div key={background} className="flex items-center gap-4">
          <div
            className="relative h-28 w-28 rounded-full"
            style={{ background }}
          >
            <div className="absolute inset-[16px] rounded-full bg-surface-alt" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              Band {index + 1}
            </p>
            <p className="text-lg font-semibold text-text-primary">
              Composition placeholder
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PlaceholderLayout({ layout }: { layout: ChartFrameLayout }) {
  switch (layout) {
    case 'bars':
      return <BarsLayout />;
    case 'stack':
      return <StackLayout />;
    case 'funnel':
      return <FunnelLayout />;
    case 'ring':
      return <RingLayout />;
    case 'spark':
    default:
      return <SparkLayout />;
  }
}

export function ChartFrame({
  title,
  description,
  layout = 'spark',
}: ChartFrameProps) {
  return (
    <SurfaceCard
      title={title}
      description={description}
      footer="Placeholder treatment only. Shared selector-driven chart data starts after the seeded mock model is added."
    >
      <PlaceholderLayout layout={layout} />
    </SurfaceCard>
  );
}
