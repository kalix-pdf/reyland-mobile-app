import { useCallback } from 'react';

import { propertiesApi } from '@/services/fetchData/property/fetch-property.api';
import { usePaginatedFetcher } from '@/hooks/useDataFetcher';
import type { Property } from '@/types';

export function useProjectProperties(projectId: number) {
  const fetcherFn = useCallback(
    (cursor?: string) =>
      propertiesApi.getPaginatedByProjectId(projectId, cursor),
    [projectId]
  );

  const { data: properties, ...rest } = usePaginatedFetcher<Property>(
    fetcherFn,
    {
      errorMessage: 'Failed to load properties.',
    }
  );

  return {
    properties,
    ...rest,
  };
}