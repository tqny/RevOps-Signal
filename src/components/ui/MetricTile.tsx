import { cn } from '../../lib/utils';
import { SurfaceCard } from './SurfaceCard';
import { StatusBadge } from './StatusBadge';

type MetricTileTone = 'accent' | 'neutral' | 'success' | 'warning';

type MetricTileProps = {
  label: string;
  value: string;
  detail: string;
  tone?: MetricTileTone;
  statusLabel?: string;
  isPlaceholder?: boolean;
};

const toneLabel: Record<MetricTileTone, string> = {
  accent: 'Ready',
  neutral: 'Baseline',
  success: 'Good',
  warning: 'Next',
};

const toneCardClassMap: Record<MetricTileTone, string> = {
  accent:
    'border-accent-primary/16 bg-[radial-gradient(circle_at_top_right,rgba(76,215,255,0.16),transparent_28%),linear-gradient(180deg,rgba(28,33,43,0.96),rgba(12,15,21,0.96))]',
  neutral: '',
  success:
    'border-success/16 bg-[radial-gradient(circle_at_top_right,rgba(49,196,141,0.12),transparent_28%),linear-gradient(180deg,rgba(28,33,43,0.96),rgba(12,15,21,0.96))]',
  warning:
    'border-warning/16 bg-[radial-gradient(circle_at_top_right,rgba(245,185,76,0.14),transparent_30%),linear-gradient(180deg,rgba(28,33,43,0.96),rgba(12,15,21,0.96))]',
};

const toneBarClassMap: Record<MetricTileTone, string> = {
  accent:
    'bg-[linear-gradient(90deg,rgba(76,215,255,0.96),rgba(111,107,255,0.92))]',
  neutral: 'bg-white/18',
  success:
    'bg-[linear-gradient(90deg,rgba(49,196,141,0.94),rgba(76,215,255,0.75))]',
  warning:
    'bg-[linear-gradient(90deg,rgba(245,185,76,0.94),rgba(111,107,255,0.72))]',
};

export function MetricTile({
  label,
  value,
  detail,
  tone = 'neutral',
  statusLabel,
  isPlaceholder = false,
}: MetricTileProps) {
  return (
    <SurfaceCard className={cn('h-full', toneCardClassMap[tone])}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            {label}
          </p>
          <div className={cn('h-1.5 w-14 rounded-full', toneBarClassMap[tone])} />
        </div>
        <StatusBadge variant={tone}>
          {statusLabel ?? toneLabel[tone]}
        </StatusBadge>
      </div>
      <div className="mt-6 space-y-4">
        <p
          className={cn(
            'text-3xl font-semibold tracking-tight text-text-primary',
            tone === 'accent' && 'text-accent-secondary',
            isPlaceholder && 'text-2xl text-text-secondary',
          )}
        >
          {value}
        </p>
        <p className="max-w-sm text-sm leading-6 text-text-secondary">
          {detail}
        </p>
      </div>
    </SurfaceCard>
  );
}
