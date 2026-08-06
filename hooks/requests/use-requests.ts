import { useDataFetcher } from '@/hooks/useDataFetcher';
import { fetchUserRequests, RequestFilter, UserRequest } from '@/services/fetchData/requests/request.api';
import { useCallback, useMemo } from 'react';

const ACTIVE_STATUSES = new Set([
  'new',
  'requested',
  'pending',
  'pending review',
  'approved',
  'processing',
  'contacted',
  'qualified',
  'confirmed',
  'rescheduled',
]);

export function useRequests(filter: RequestFilter = 'all') {
  const fetcherFn = useCallback(() => fetchUserRequests(), []);

  const { data: requests, ...rest } = useDataFetcher<UserRequest[]>(fetcherFn, {
    initialData: [],
    errorMessage: 'Unable to load your requests right now.',
  });

  const filteredRequests = useMemo(
    () => (filter === 'all' ? requests : requests.filter((request) => request.kind === filter)),
    [filter, requests],
  );

  const activeRequests = useMemo(
    () => requests.filter((request) => ACTIVE_STATUSES.has(request.status.toLowerCase())),
    [requests],
  );

  return {
    requests: filteredRequests,
    allRequests: requests,
    activeRequests,
    ...rest,
  };
}