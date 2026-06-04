import React, {
  createContext,
  useContext,
  useEffect,
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

interface ProjectsContextValue
  extends Omit<PaginatedFetcherState<Project>, 'data'>,
    FetcherActions {
  project: Project[];
  filtered: Project[];
  search: string;
  setSearch: (value: string) => void;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

interface ProjectsProviderProps {
  children: ReactNode;
}

export function ProjectsProvider({ children }: ProjectsProviderProps) {
  const [search, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (search.trim().length === 0) {
      setDebouncedSearch('');
      return;
    }

    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const setSearch = useCallback((value: string) => {
    setSearchInput(value);

    if (value.trim().length === 0) {
      setDebouncedSearch('');
    }
  }, []);

  const fetcherFn = useCallback(
    (cursor?: string) => projectsApi.getPaginated(cursor),
    [],
  );

  const { data: project, ...rest } = usePaginatedFetcher(fetcherFn, {
    errorMessage: 'Failed to load projects. Pull down to retry.',
  });

  const filtered = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    return project.filter((item) => {
      const location = item.location ?? '';

      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.project_name.toLowerCase().includes(normalizedSearch) ||
        location.toLowerCase().includes(normalizedSearch);

      return matchesSearch;
    });
  }, [project, debouncedSearch]);

  const value = useMemo<ProjectsContextValue>(
    () => ({
      project,
      filtered,
      search,
      setSearch,
      ...rest,
    }),
    [project, filtered, search, rest],
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
