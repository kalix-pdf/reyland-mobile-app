import { useState, useCallback, useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FetcherState<T> {
  data: T;
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
}

export interface FetcherActions {
  refresh: () => void;
  retry: () => void;
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface UseDataFetcherOptions {
  /** Milliseconds before the request is considered timed out. Default: 5000 */
  timeoutMs?: number;
  /** Error message shown on timeout or catch. Default: 'Failed to load data. Pull down to retry.' */
  errorMessage?: string;
  /** Whether to call fetch automatically on mount. Default: true */
  fetchOnMount?: boolean;
}

export interface UsePaginatedFetcherOptions extends UseDataFetcherOptions {
  /** Error message shown on timeout or catch. Default: 'Failed to load data. Pull down to retry.' */
  errorMessage?: string;
}

// ─── useDataFetcher ───────────────────────────────────────────────────────────

/**
 * Generic hook for one-shot data fetching with loading, refreshing, error, and
 * timeout support. Suitable for any screen that fetches a list or single object.
 *
 * @example
 * const { data, loading, refreshing, error, refresh, retry } = useDataFetcher(
 *   () => projectsApi.getFeatured(),
 *   { initialData: [], errorMessage: 'Failed to load projects. Pull down to retry.' },
 * );
 */
export function useDataFetcher<T>(
  fetcher: () => Promise<T>,
  options: UseDataFetcherOptions & { initialData: T },
): FetcherState<T> & FetcherActions {
  const {
    timeoutMs = 5000,
    errorMessage = 'Failed to load data. Pull down to retry.',
    fetchOnMount = true,
    initialData,
  } = options;

  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchIdRef = useRef(0);

  const clearErrorTimer = useCallback(() => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
  }, []);

  const fetchData = useCallback(
    async (isRefreshing = false) => {
      const currentFetchId = ++fetchIdRef.current;

      isRefreshing ? setRefreshing(true) : setLoading(true);
      setError(null);

      clearErrorTimer();

      errorTimerRef.current = setTimeout(() => {
        if (fetchIdRef.current !== currentFetchId) return;
        setError(errorMessage);
        setLoading(false);
        setRefreshing(false);
      }, timeoutMs);

      try {
        const result = await fetcher();

        if (fetchIdRef.current !== currentFetchId) return;

        setData(result);
      } catch {
        if (fetchIdRef.current !== currentFetchId) return;
        setError(errorMessage);
      } finally {
        if (fetchIdRef.current === currentFetchId) {
          clearErrorTimer();
          isRefreshing ? setRefreshing(false) : setLoading(false);
        }
      }
    },
    [fetcher, timeoutMs, errorMessage],
  );

  useEffect(() => {
    if (fetchOnMount) fetchData();
    return clearErrorTimer;
  }, []);

  const refresh = useCallback(() => fetchData(true), [fetchData]);
  const retry = useCallback(() => fetchData(false), [fetchData]);

  return { data, loading, refreshing, loadingMore: false, error, refresh, retry };
}

// ─── usePaginatedFetcher ──────────────────────────────────────────────────────

export interface PaginatedFetcherState<T> extends FetcherState<T[]> {
  hasMore: boolean;
  loadMore: () => void;
}

/**
 * Hook for cursor-based paginated data fetching. Extends `useDataFetcher` with
 * `loadMore`, `hasMore`, and `loadingMore` support.
 *
 * @example
 * const { data, loading, error, hasMore, loadMore, loadingMore, refresh, retry } =
 *   usePaginatedFetcher(() => propertiesApi.getPaginated, {
 *     errorMessage: 'Failed to load properties. Pull down to retry.',
 *   });
 */
export function usePaginatedFetcher<T>(
  /**
   * A function that accepts an optional cursor and returns a paginated result.
   * Pass the raw API method — the hook manages cursor state internally.
   */
  fetcherFn: (cursor?: string) => Promise<PaginatedResult<T>>,
  options: UsePaginatedFetcherOptions = {},
): PaginatedFetcherState<T> & FetcherActions {
  const {
    timeoutMs = 5000,
    errorMessage = 'Failed to load data. Pull down to retry.',
    fetchOnMount = true,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchIdRef = useRef(0);

  const clearErrorTimer = useCallback(() => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
  }, []);

  const fetchData = useCallback(
    async (isRefreshing = false) => {
      const currentFetchId = ++fetchIdRef.current;

      isRefreshing ? setRefreshing(true) : setLoading(true);
      setError(null);

      clearErrorTimer();

      errorTimerRef.current = setTimeout(() => {
        if (fetchIdRef.current !== currentFetchId) return;
        setError(errorMessage);
        setLoading(false);
        setRefreshing(false);
      }, timeoutMs);

      try {
        const { data: freshData, nextCursor: cursor, hasMore: more } = await fetcherFn();

        if (fetchIdRef.current !== currentFetchId) return;

        setData(Array.isArray(freshData) ? freshData : []);
        setNextCursor(cursor);
        setHasMore(more);
      } catch {
        if (fetchIdRef.current !== currentFetchId) return;
        setError(errorMessage);
      } finally {
        if (fetchIdRef.current === currentFetchId) {
          clearErrorTimer();
          isRefreshing ? setRefreshing(false) : setLoading(false);
        }
      }
    },
    [fetcherFn, timeoutMs, errorMessage],
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !nextCursor || loading) return;

    try {
      setLoadingMore(true);
      const { data: moreData, nextCursor: cursor, hasMore: more } = await fetcherFn(nextCursor);

      setData((prev) => [...prev, ...(Array.isArray(moreData) ? moreData : [])]);
      setNextCursor(cursor);
      setHasMore(more);
    } catch {
      // Silent fail — user can scroll back to retry
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, nextCursor, loading, fetcherFn]);

  useEffect(() => {
    if (fetchOnMount) fetchData();
    return clearErrorTimer;
  }, []);

  const refresh = useCallback(() => fetchData(true), [fetchData]);
  const retry = useCallback(() => fetchData(false), [fetchData]);

  return { data, loading, refreshing, loadingMore, error, hasMore, loadMore, refresh, retry };
}