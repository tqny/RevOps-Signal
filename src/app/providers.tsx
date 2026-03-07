import type { PropsWithChildren } from 'react';
import { FilterProvider } from '../features/filters';

export function AppProviders({ children }: PropsWithChildren) {
  return <FilterProvider>{children}</FilterProvider>;
}
