import { useDataFetcher, type FetcherActions, type FetcherState } from '@/hooks/useDataFetcher';
import { projectsApi } from '@/services/fetchData/project/fetch-project.api';
import { getPromotionImage } from '@/services/fetchData/promotion/fetch-promotion.api';
import { propertiesApi } from '@/services/fetchData/property/fetch-property.api';
import type { Project, PromotionProps, Property } from '@/types';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

interface DashboardData {
  projects: Project[];
  featuredProperties: Property[];
  promotionImages: PromotionProps[];
}

interface DashboardContextValue extends FetcherState<DashboardData>, FetcherActions {
  /** Unique city/region names derived from the fetched projects (max 6). */
  locations: string[];
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const fetchDashboard = useCallback(async (): Promise<DashboardData> => {
    const [projects, featuredProperties, promotionImages] = await Promise.all([
      projectsApi.getFeatured(),
      propertiesApi.getFeatured(),
      getPromotionImage(),
    ]);

    return { projects, featuredProperties, promotionImages };
  }, []);

  const { data, ...rest } = useDataFetcher(fetchDashboard, {
    initialData: { projects: [], featuredProperties: [], promotionImages: [] },
    errorMessage: 'Failed to load dashboard. Pull down to retry.',
  });

  const locations = useMemo(
    () =>
      Array.from(
        new Set(
          data.projects
            .map((p) => p.location?.split(',')[0]?.trim())
            .filter((loc): loc is string => Boolean(loc)),
        ),
      ).slice(0, 6),
    [data.projects],
  );

  const value = useMemo<DashboardContextValue>(
    () => ({ data, locations, ...rest }),
    [data, locations, rest],
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
