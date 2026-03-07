import type { NavItem } from '../types/revops';

export const APP_NAME = 'RevOps Signal';

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Executive Overview',
    path: '/',
    shortLabel: 'EX',
    description: 'Health scan and connected signals',
  },
  {
    label: 'Pipeline & Funnel',
    path: '/pipeline',
    shortLabel: 'PF',
    description: 'Volume, conversion, and leakage',
  },
  {
    label: 'Sales Performance',
    path: '/performance',
    shortLabel: 'SP',
    description: 'Attainment, velocity, and ranking',
  },
  {
    label: 'Forecast & Risks',
    path: '/forecast',
    shortLabel: 'FR',
    description: 'Confidence, gaps, and downside',
  },
];
