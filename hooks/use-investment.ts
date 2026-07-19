import { useCallback } from 'react';
import { useDataFetcher, usePaginatedFetcher } from '@/hooks/useDataFetcher';
import { investment } from '@/types/investor.types';
import { investmentsAPI } from '@/services/fetchData/investment/fetch-investment.api';

export function useInvestments() {
  const fetcherFn = useCallback(
    (cursor?: string) => investmentsAPI.getPaginated(cursor),
    []
  );

  const { data: investments, ...rest } = usePaginatedFetcher<investment>(
    fetcherFn,
    {
      errorMessage: 'Failed to load investments.',
    }
  );

  return {
    investments,
    ...rest,
  };
}
