import { useCallback } from 'react';
import type { Project } from '@/types';
import { searchProjects } from '@/services/fetchData/search.service';
import { useSearch } from './useSeach';

interface UseProjectSearchOptions {
  /** The full local project list from your context/store. */
  localProjects: Project[];
}

/**
 * Typed search hook for the DiscoverScreen.
 *
 * When the user types, a debounced query is sent to the server.
 * While the query is empty the full `localProjects` list is returned.
 */
export function useProjectSearch({ localProjects }: UseProjectSearchOptions) {
  const onSearch = useCallback(
    async (query: string, signal: AbortSignal): Promise<Project[] | null> => {
      // Delegate to the service layer — keeps API details out of the hook.
      return searchProjects({ query, signal });
    },
    [],
  );

  return useSearch<Project>({
    onSearch,
    localData: localProjects,
    debounceMs: 1000,
  });
}