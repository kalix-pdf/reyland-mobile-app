import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseSearchOptions<TResult> {
  /**
   * Debounce delay in milliseconds.
   * @default 100000
   */
  debounceMs?: number;

  /**
   * Server-side search handler. Receives the committed (debounced) query
   * and an AbortSignal so the hook can cancel stale requests.
   *
   */
  onSearch: (query: string, signal: AbortSignal) => Promise<TResult[] | null>;

  localData: TResult[];
}

export interface UseSearchReturn<TResult> {
  /** Controlled value bound to the TextInput. Updates immediately. */
  inputValue: string;

  /** The committed (debounced) query that was last sent to onSearch. */
  query: string;

  /** Results: server results when a query is active, localData otherwise. */
  results: TResult[];

  /** True while the debounce timer is pending OR a server fetch is in-flight. */
  searching: boolean;

  /** Error message from the last failed onSearch call, if any. */
  searchError: string | null;

  /** Call this from onChangeText. */
  setInputValue: (value: string) => void;

  /** Clears input, query, results back to localData, and any error. */
  clear: () => void;
}

export function useSearch<TResult>({
  debounceMs = 2000,
  onSearch,
  localData,
}: UseSearchOptions<TResult>): UseSearchReturn<TResult> {
  const [inputValue, setInputValueState] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TResult[]>(localData);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query) {
      setResults(localData);
    }
  }, [localData, query]);

  useEffect(() => {
    return () => {
      debounceRef.current && clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const runSearch = useCallback(
    async (trimmedQuery: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setQuery(trimmedQuery);
      setSearchError(null);
      setSearching(true);

      try {
        const serverResults = await onSearch(trimmedQuery, controller.signal);

        if (controller.signal.aborted) return;

        if (serverResults !== null) {
          setResults(serverResults);
        } else {
          setResults(localData);
        }
      } catch (err: unknown) {
        if (controller.signal.aborted) return;

        const message =
          err instanceof Error ? err.message : 'Search failed. Please try again.';
        setSearchError(message);
      } finally {
        if (!controller.signal.aborted) {
          setSearching(false);
        }
      }
    },
    [onSearch, localData],
  );

  const setInputValue = useCallback(
    (value: string) => {
      setInputValueState(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      const trimmed = value.trim();

      if (!trimmed) {
        abortRef.current?.abort();
        setQuery('');
        setResults(localData);
        setSearching(false);
        setSearchError(null);
        return;
      }

      setSearching(true);

      debounceRef.current = setTimeout(() => {
        runSearch(trimmed);
      }, debounceMs);
    },
    [debounceMs, localData, runSearch],
  );

  const clear = useCallback(() => {
    debounceRef.current && clearTimeout(debounceRef.current);
    abortRef.current?.abort();
    setInputValueState('');
    setQuery('');
    setResults(localData);
    setSearching(false);
    setSearchError(null);
  }, [localData]);

  return {
    inputValue,
    query,
    results,
    searching,
    searchError,
    setInputValue,
    clear,
  };
}