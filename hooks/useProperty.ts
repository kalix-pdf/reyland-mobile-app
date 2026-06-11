import { useCallback } from 'react';
import { propertiesApi } from '@/services/fetchData/property/fetch-property.api';
import { Property } from '@/types';
import { useDataFetcher } from './useDataFetcher';

export function useProperty(id: number) {
  const fetcher = useCallback(async () => {
    if (!Number.isFinite(id) || id <= 0) {
      return null;
    }

    return propertiesApi.getById(id);
  }, [id]);

  const { data: property, ...rest } = useDataFetcher<Property | null>(
    fetcher,
    {
      initialData: null,
      errorMessage: 'Failed to load property details. Pull down to retry.',
    }
  );

  return {
    property,
    ...rest,
  };
}
