import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import { projectsApi } from '@/services/fetchData/project/fetch-project.api';
import {
  usePaginatedFetcher,
  type PaginatedFetcherState,
  type FetcherActions,
} from '@/hooks/useDataFetcher';
import type { Project } from '@/types';

export const FILTERS = ['All', 'Available', 'Sold', 'Reserved'] as const;
export type Filter = (typeof FILTERS)[number];

export const STATUS_MAP: Record<Exclude<Filter, 'All'>, Project['status']> = {
  Available: 0,
  Sold: 1,
  Reserved: 2,
};

interface ProjectsContextValue
  extends Omit<PaginatedFetcherState<Project>, 'data'>,
    FetcherActions {
  project: Project[];
  filtered: Project[];
  activeFilter: Filter;
  setActiveFilter: (filter: Filter) => void;
  search: string;
  setSearch: (value: string) => void;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

interface ProjectsProviderProps {
  children: ReactNode;
}

export function ProjectsProvider({ children }: ProjectsProviderProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');

  const fetcherFn = useCallback(
    (cursor?: string) => projectsApi.getPaginated(cursor),
    [],
  );

  const { data: project, ...rest } = usePaginatedFetcher(fetcherFn, {
    errorMessage: 'Failed to load projects. Pull down to retry.',
  });

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return project.filter((item) => {
      const location = item.location ?? '';

      const matchesFilter =
        activeFilter === 'All' ||
        item.status === STATUS_MAP[activeFilter];

      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.project_name.toLowerCase().includes(normalizedSearch) ||
        location.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [project, activeFilter, search]);

  const value = useMemo<ProjectsContextValue>(
    () => ({
      project,
      filtered,
      activeFilter,
      setActiveFilter,
      search,
      setSearch,
      ...rest,
    }),
    [project, filtered, activeFilter, search, rest],
  );

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects(): ProjectsContextValue {
  const ctx = useContext(ProjectsContext);

  if (!ctx) {
    throw new Error(
      'useProjects must be used within a <ProjectsProvider />.',
    );
  }

  return ctx;
}