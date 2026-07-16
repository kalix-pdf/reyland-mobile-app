// hooks/useTransaction.ts
import { useCallback } from 'react';
import { transactionsAPI } from '@/services/fetchData/transaction/fetch-transaction.api';
import { useDataFetcher, usePaginatedFetcher } from '@/hooks/useDataFetcher';
import type { Transaction, FetchInstallmentResponseData } from '@/types';

export function useTransaction() {
  const fetcherFn = useCallback(
    (cursor?: string) => transactionsAPI.getPaginated(cursor),
    []
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


export function usePaymentHistory(id: number) {
  const fetcherFn = useCallback(() => transactionsAPI.getPaymentHistoryByUserId(id), [id]);

  const { data, ...rest } = useDataFetcher<FetchInstallmentResponseData | null>(fetcherFn, {
    initialData: null,
    errorMessage: 'Failed to load payment records.',
  });

  return {
    payments: data?.payments ?? [],
    summary: data?.summary,
    contract: data?.contract ?? null,
    ...rest,
  };
}
