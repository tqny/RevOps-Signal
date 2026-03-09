import {
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/utils';
import { LoadingState } from '../ui/EmptyState';

type ResponsiveChartContainerProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  minHeight: number;
  loadingTitle?: string;
  loadingDescription?: string;
};

export function ResponsiveChartContainer({
  children,
  className,
  style,
  minHeight,
  loadingTitle = 'Loading chart',
  loadingDescription = 'Preparing the current selector-backed view.',
}: ResponsiveChartContainerProps) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!node) {
      return undefined;
    }

    let frame = 0;

    const updateReadyState = () => {
      const nextWidth = Math.floor(node.clientWidth);
      const nextHeight = Math.floor(node.clientHeight);

      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setSize((current) =>
          current.width === nextWidth && current.height === nextHeight
            ? current
            : {
                width: nextWidth,
                height: nextHeight,
              },
        );
      });
    };

    updateReadyState();

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    const observer = new ResizeObserver(() => {
      updateReadyState();
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [node]);

  return (
    <div
      ref={(element) => {
        setNode(element);
      }}
      className={cn('min-w-0', className)}
      style={{ minHeight, ...style }}
    >
      {size.width > 0 &&
      size.height > 0 &&
      isValidElement<Record<string, unknown>>(children) ? (
        cloneElement(children as ReactElement<Record<string, unknown>>, {
          width: size.width,
          height: size.height,
        })
      ) : (
        <LoadingState
          title={loadingTitle}
          description={loadingDescription}
          minHeight={minHeight}
        />
      )}
    </div>
  );
}
