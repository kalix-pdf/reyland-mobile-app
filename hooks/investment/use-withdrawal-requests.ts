import { useDataFetcher } from '@/hooks/useDataFetcher';
import { fetchMyWithdrawalRequests, WithdrawalRequest } from '@/services/withdrawal-requests/withdrawal-request.api';
import { useCallback, useMemo } from 'react';

const ACTIVE_WITHDRAWAL_STATUSES = new Set([0, 1, 2]);

export function useInvestmentWithdrawalRequests() {
  const fetcher = useCallback(() => fetchMyWithdrawalRequests(), []);

  const { data: withdrawalRequests, ...rest } = useDataFetcher<WithdrawalRequest[]>(fetcher, {
    initialData: [],
    errorMessage: 'Failed to load withdrawal requests.',
  });

  const activeWithdrawalRequests = useMemo(
    () => withdrawalRequests.filter((request) => ACTIVE_WITHDRAWAL_STATUSES.has(Number(request.status))),
    [withdrawalRequests],
  );

  return {
    withdrawalRequests,
    activeWithdrawalRequests,
    ...rest,
  };
}
