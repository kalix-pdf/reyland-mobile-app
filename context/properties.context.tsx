import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { propertiesApi } from '@/services/fetchData/property/fetch-property.api';
import {
  usePaginatedFetcher,
  type PaginatedFetcherState,
  type FetcherActions,
} from '@/hooks/useDataFetcher';
import type { Property } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

export const FILTERS = ['All', 'Available', 'Sold', 'Reserved'] as const;
export type Filter = (typeof FILTERS)[number];

export const STATUS_MAP: Record<Exclude<Filter, 'All'>, Property['status']> = {
  Available: 0,
  Sold:      1,
  Reserved:  2,
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface PropertiesContextValue
  extends Omit<PaginatedFetcherState<Property>, 'data'>,
    FetcherActions {
  /** Raw, unfiltered list of fetched properties. */
  properties: Property[];
  /** Filtered + searched subset of `properties` — use this for the list. */
  filtered: Property[];
  activeFilter: Filter;
  setActiveFilter: (filter: Filter) => void;
  search: string;
  setSearch: (value: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const PropertiesContext = createContext<PropertiesContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface PropertiesProviderProps {
  children: ReactNode;
}

export function PropertiesProvider({ children }: PropertiesProviderProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
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

  // Stable fetcher reference passed to the hook
  const fetcherFn = useCallback(
    (cursor?: string) => propertiesApi.getPaginated(cursor),
    [],
  );

  const { data: properties, ...rest } = usePaginatedFetcher(fetcherFn, {
    errorMessage: 'Failed to load properties. Pull down to retry.',
  });

  const filtered = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    return properties.filter((property) => {
      const location = property.project?.location ?? '';

      const matchesFilter =
        activeFilter === 'All' || property.status === STATUS_MAP[activeFilter];

      const matchesSearch =
        normalizedSearch.length === 0 ||
        property.title.toLowerCase().includes(normalizedSearch) ||
        location.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [properties, activeFilter, debouncedSearch]);

  const value = useMemo<PropertiesContextValue>(
    () => ({
      properties,
      filtered,
      activeFilter,
      setActiveFilter,
      search,
      setSearch,
      ...rest,
    }),
    [properties, filtered, activeFilter, search, rest],
  );

  return (
    <PropertiesContext.Provider value={value}>{children}</PropertiesContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProperties(): PropertiesContextValue {
  const ctx = useContext(PropertiesContext);
  if (!ctx) {
    throw new Error('useProperties must be used within a <PropertiesProvider>.');
  }
  return ctx;
}
