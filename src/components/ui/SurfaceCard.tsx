import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '../../lib/utils';

type SurfaceCardProps = PropsWithChildren<{
  title?: string;
  description?: string;
  className?: string;
  footer?: ReactNode;
}>;

export function SurfaceCard({
  title,
  description,
  className,
  children,
  footer,
}: SurfaceCardProps) {
  return (
    <section
      className={cn(
        'rs-panel rs-panel-hover min-w-0 rounded-panel p-4 sm:p-5',
        className,
      )}
    >
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className="text-lg font-semibold tracking-tight text-text-primary">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm leading-6 text-text-secondary">
              {description}
            </p>
          )}
        </div>
      )}
      <div className={cn(title || description ? 'mt-6' : undefined)}>
        {children}
      </div>
      {footer ? (
        <div className="mt-6 border-t border-white/6 pt-4 text-sm leading-6 text-text-muted">
          {footer}
        </div>
      ) : null}
    </section>
  );
}
