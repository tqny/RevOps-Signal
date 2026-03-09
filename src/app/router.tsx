import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { AboutProjectPage } from '../pages/AboutProjectPage';
import { ExecutiveOverviewPage } from '../pages/ExecutiveOverviewPage';
import { ForecastRisksPage } from '../pages/ForecastRisksPage';
import { PipelineFunnelPage } from '../pages/PipelineFunnelPage';
import { SalesPerformancePage } from '../pages/SalesPerformancePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <ExecutiveOverviewPage />,
      },
      {
        path: 'pipeline',
        element: <PipelineFunnelPage />,
      },
      {
        path: 'performance',
        element: <SalesPerformancePage />,
      },
      {
        path: 'forecast',
        element: <ForecastRisksPage />,
      },
      {
        path: 'about',
        element: <AboutProjectPage />,
      },
    ],
  },
]);
