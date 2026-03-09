import { Outlet, useLocation } from 'react-router-dom';
import { RouteContentBoundary } from './RouteContentBoundary';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';

export function AppShell() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-text-primary">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(76,215,255,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(111,107,255,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(49,196,141,0.05),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:120px_120px]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col gap-5 px-4 py-4 sm:px-6 lg:flex-row lg:gap-5 lg:px-6 xl:gap-6 xl:px-8">
        <SideNav />
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <TopBar />
          <main className="min-w-0 flex-1">
            <RouteContentBoundary resetKey={`${location.pathname}:${location.key}`}>
              <Outlet />
            </RouteContentBoundary>
          </main>
        </div>
      </div>
    </div>
  );
}
