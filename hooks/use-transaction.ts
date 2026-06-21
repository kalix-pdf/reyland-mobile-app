import { useCallback } from 'react';
import { transactionsAPI } from '@/services/fetchData/transaction/fetch-transaction.api';
import { usePaginatedFetcher } from '@/hooks/useDataFetcher';
import type { Transaction } from '@/types';

export function useTransaction() {
  const fetcherFn = useCallback(
    (cursor?: string) =>
      transactionsAPI.getPaginated(cursor), []
  );

  const { data: transactions, ...rest } = usePaginatedFetcher<Transaction>(
    fetcherFn,
    {
      errorMessage: 'Failed to load transactions.',
    }
  );

  return {
    transactions,
    ...rest,
  };
}