import { fetchUserRequests, RequestFilter, UserRequest } from '@/services/requests/request.api';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const nextRequests = await fetchUserRequests();
      setRequests(nextRequests);
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load your requests right now.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const filteredRequests = useMemo(
    () => (filter === 'all' ? requests : requests.filter((request) => request.kind === filter)),
    [filter, requests],
  );

  const activeRequests = useMemo(
    () => requests.filter((request) => ACTIVE_STATUSES.has(request.status.toLowerCase())),
    [requests],
  );

  const refresh = useCallback(() => loadRequests(true), [loadRequests]);
  const retry = useCallback(() => loadRequests(false), [loadRequests]);

  return {
    requests: filteredRequests,
    allRequests: requests,
    activeRequests,
    loading,
    refreshing,
    error,
    refresh,
    retry,
  };
}
