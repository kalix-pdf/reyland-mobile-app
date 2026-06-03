import { useDataFetcher, type FetcherActions, type FetcherState } from '@/hooks/useDataFetcher';
import { projectsApi } from '@/services/fetchData/project/fetch-project.api';
import type { Project } from '@/types';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

interface DashboardContextValue extends FetcherState<Project[]>, FetcherActions {
  /** Unique city/region names derived from the fetched projects (max 6). */
  locations: string[];
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const fetchFeatured = useCallback(() => projectsApi.getFeatured(), []);

  const { data: projects, ...rest } = useDataFetcher(fetchFeatured, {
    initialData: [] as Project[],
    errorMessage: 'Failed to load projects. Pull down to retry.',
  });

  const locations = useMemo(
    () =>
      Array.from(
        new Set(
          projects
            .map((p) => p.location?.split(',')[0]?.trim())
            .filter((loc): loc is string => Boolean(loc)),
        ),
      ).slice(0, 6),
    [projects],
  );

  const value = useMemo<DashboardContextValue>(
    () => ({ data: projects, locations, ...rest }),
    [projects, locations, rest],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error('useDashboard must be used within a <DashboardProvider>.');
  }
  return ctx;
}