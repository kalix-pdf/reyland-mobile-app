import { useCallback } from 'react';
import { useDataFetcher, usePaginatedFetcher } from '@/hooks/useDataFetcher';
import { investment } from '@/types/investor.types';
import { investmentsAPI } from '@/services/fetchData/investment/fetch-investment.api';

export function useInvestments() {
  const fetcherFn = useCallback(
    (cursor?: string) => investmentsAPI.getPaginated(cursor),
    []
  );

  const { data: investments, meta, ...rest } = usePaginatedFetcher<investment>(
    fetcherFn,
    { errorMessage: 'Failed to load investments.' }
  );

  // console.log('useInvestments - investments:', investments);

  return {
    investments,
    walletBalance: meta?.walletBalance ?? 0,
    ...rest,
  };
}
