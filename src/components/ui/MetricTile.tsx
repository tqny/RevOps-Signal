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

export function MetricTile({
  label,
  value,
  detail,
  tone = 'neutral',
  statusLabel,
  isPlaceholder = false,
}: MetricTileProps) {
  return (
    <SurfaceCard className="h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              {label}
            </p>
            <p
              className={cn(
                'text-3xl font-semibold tracking-tight text-text-primary',
                tone === 'accent' && 'text-accent-secondary',
                isPlaceholder && 'text-2xl text-text-secondary',
              )}
            >
              {value}
            </p>
          </div>
          <p className="max-w-sm text-sm leading-6 text-text-secondary">
            {detail}
          </p>
        </div>
        <StatusBadge variant={tone}>
          {statusLabel ?? toneLabel[tone]}
        </StatusBadge>
      </div>
    </SurfaceCard>
  );
}
