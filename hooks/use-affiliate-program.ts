import { useCallback, useEffect, useRef, useState } from 'react';
import { enrollAffiliate, getAffiliateStatus } from '@/services/affiliate/affiliate.api';
import { AffiliateStatus } from '@/types/affiliate.types';

type AffiliateProgramState = {
  status: AffiliateStatus | null;
  loading: boolean;
  refreshing: boolean;
  enrolling: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
  enroll: () => Promise<boolean>;
};

const DEFAULT_ERROR = 'Unable to load affiliate program right now.';

export function useAffiliateProgram(): AffiliateProgramState {
  const [status, setStatus] = useState<AffiliateStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const loadStatus = useCallback(async (isRefreshing = false) => {
    try {
      isRefreshing ? setRefreshing(true) : setLoading(true);
      setError(null);

      const result = await getAffiliateStatus();
      if (mountedRef.current) setStatus(result);
    } catch (loadError) {
      if (mountedRef.current) {
        setError(loadError instanceof Error ? loadError.message : DEFAULT_ERROR);
      }
    } finally {
      if (mountedRef.current) {
        isRefreshing ? setRefreshing(false) : setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadStatus();

    return () => {
      mountedRef.current = false;
    };
  }, [loadStatus]);

  const enroll = useCallback(async () => {
    try {
      setEnrolling(true);
      setError(null);

      const result = await enrollAffiliate();
      if (mountedRef.current) {
        setStatus({ ...result, isAffiliate: true });
      }

      return true;
    } catch (enrollError) {
      if (mountedRef.current) {
        setError(enrollError instanceof Error ? enrollError.message : 'Unable to enroll right now.');
      }

      return false;
    } finally {
      if (mountedRef.current) setEnrolling(false);
    }
  }, []);

  const refresh = useCallback(() => loadStatus(true), [loadStatus]);
  const retry = useCallback(() => loadStatus(false), [loadStatus]);

  return { status, loading, refreshing, enrolling, error, refresh, retry, enroll };
}

