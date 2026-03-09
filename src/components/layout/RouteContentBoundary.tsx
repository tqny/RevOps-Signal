import { Component, type ReactNode } from 'react';
import { ErrorState } from '../ui/EmptyState';
import { SurfaceCard } from '../ui/SurfaceCard';

type RouteContentBoundaryProps = {
  children: ReactNode;
  resetKey: string;
};

type RouteContentBoundaryState = {
  hasError: boolean;
};

export class RouteContentBoundary extends Component<
  RouteContentBoundaryProps,
  RouteContentBoundaryState
> {
  state: RouteContentBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidUpdate(prevProps: RouteContentBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <SurfaceCard
          title="Page unavailable"
          description="The shell is still active, but this route hit a rendering issue."
        >
          <ErrorState
            title="This view could not be rendered"
            description="Try changing routes or reloading the page. The failure is contained so the rest of the product stays usable."
            minHeight={240}
          />
        </SurfaceCard>
      );
    }

    return this.props.children;
  }
}
