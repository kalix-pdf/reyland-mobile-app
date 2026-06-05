import { useCallback } from 'react';
import type { Property } from '@/types';
import { searchProperties } from '@/services/fetchData/search.service';
import { useSearch } from './useSeach';

interface UsePropertySearchOptions {
  projectId: number;
  /** The full local property list from useProjectProperties. */
  localProperties: Property[];
}

/**
 * Typed search hook for the ProjectPropertiesScreen.
 *
 * Sends a debounced query scoped to the current project to the server.
 * Falls back to `localProperties` when the query is empty.
 */
export function usePropertySearch({
  projectId,
  localProperties,
}: UsePropertySearchOptions) {
  const onSearch = useCallback(
    async (query: string, signal: AbortSignal): Promise<Property[] | null> => {
      return searchProperties({ projectId, query, signal });
    },
    // Re-create only when projectId changes (navigating to a different project).
    [projectId],
  );

  return useSearch<Property>({
    onSearch,
    localData: localProperties,
    debounceMs: 2000,
  });
}