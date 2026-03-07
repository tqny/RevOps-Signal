import { cn } from '../../lib/utils';
import { SurfaceCard } from './SurfaceCard';
import { StatusBadge } from './StatusBadge';

type MetricTileTone = 'accent' | 'neutral' | 'success' | 'warning';

type MetricTileProps = {
  label: string;
  value: string;
  detail: string;
  tone?: MetricTileTone;
};

const toneLabel: Record<MetricTileTone, string> = {
  accent: 'Ready',
  neutral: 'Baseline',
  success: 'Good',
  warning: 'Next',
};

export function MetricTile({
  label,
  value,
  detail,
  tone = 'neutral',
}: MetricTileProps) {
  return (
    <SurfaceCard className="h-full">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              {label}
            </p>
            <p
              className={cn(
                'text-3xl font-semibold tracking-tight text-text-primary',
                tone === 'accent' && 'text-accent-secondary',
              )}
            >
              {value}
            </p>
          </div>
          <p className="max-w-sm text-sm leading-6 text-text-secondary">
            {detail}
          </p>
        </div>
        <StatusBadge variant={tone}>{toneLabel[tone]}</StatusBadge>
      </div>
    </SurfaceCard>
  );
}
