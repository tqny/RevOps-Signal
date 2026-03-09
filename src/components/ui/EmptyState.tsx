import { cn } from '../../lib/utils';

type DataStateVariant = 'empty' | 'loading' | 'error';

type DataStateProps = {
  title: string;
  description: string;
  variant?: DataStateVariant;
  minHeight?: number;
  className?: string;
};

const variantMeta: Record<
  DataStateVariant,
  {
    eyebrow: string;
    className: string;
  }
> = {
  empty: {
    eyebrow: 'No results',
    className: 'border-white/10 bg-surface-alt/60',
  },
  loading: {
    eyebrow: 'Loading',
    className: 'border-accent-primary/16 bg-surface-alt/55',
  },
  error: {
    eyebrow: 'Unavailable',
    className: 'border-warning/22 bg-warning/8',
  },
};

function DataState({
  title,
  description,
  variant = 'empty',
  minHeight,
  className,
}: DataStateProps) {
  const meta = variantMeta[variant];

  return (
    <div
      className={cn(
        'flex flex-col justify-center rounded-soft border border-dashed bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-5',
        meta.className,
        className,
      )}
      style={minHeight ? { minHeight } : undefined}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted">
        {meta.eyebrow}
      </p>
      <p className="mt-1 text-sm font-medium text-text-primary">{title}</p>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {description}
      </p>
      {variant === 'loading' ? (
        <div className="mt-4 space-y-2">
          <div className="h-2 w-24 animate-pulse rounded-pill bg-white/10" />
          <div className="h-2 w-full animate-pulse rounded-pill bg-white/8" />
          <div className="h-2 w-3/4 animate-pulse rounded-pill bg-white/8" />
        </div>
      ) : null}
    </div>
  );
}

type EmptyStateProps = Omit<DataStateProps, 'variant'>;

export function EmptyState(props: EmptyStateProps) {
  return <DataState {...props} variant="empty" />;
}

type LoadingStateProps = Omit<DataStateProps, 'variant'>;

export function LoadingState(props: LoadingStateProps) {
  return <DataState {...props} variant="loading" />;
}

type ErrorStateProps = Omit<DataStateProps, 'variant'>;

export function ErrorState(props: ErrorStateProps) {
  return <DataState {...props} variant="error" />;
}
