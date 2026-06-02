import { apiClient } from '@/lib/axios';
import { AxiosRequestConfig, AxiosError } from 'axios';

export const BASE = '/admin/properties/fetch';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
    total: number;
  };
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

// ─── Error ───────────────────────────────────────────────────────────────────

export class ApiError extends Error { constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly endpoint?: string ) 
    {
      super(message);
      this.name = 'ApiError';
    }
}

// ─── Core Fetcher ─────────────────────────────────────────────────────────────

/**
 * Generic fetch wrapper. Throws `ApiError` on failure.
 *
 * @example
 * const user = await fetchOne<User>('/admin/users/1');
 */
export async function fetchOne<T>( endpoint: string, options?: AxiosRequestConfig ): Promise<T> {
  try {
    const response = await apiClient.get<ApiResponse<T>>(endpoint, options);

    if (!response.data.success) {
      throw new ApiError(
        response.data.message ?? `Request failed: ${endpoint}`,
        response.status,
        endpoint,
      );
    }

    return response.data.data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const axiosErr = err as AxiosError<ApiResponse<T>>;
    throw new ApiError(
      axiosErr.response?.data?.message ?? axiosErr.message,
      axiosErr.response?.status,
      endpoint,
    );
  }
}

// ─── Paginated Fetcher ────────────────────────────────────────────────────────

export interface PaginatedFetchOptions {
  cursor?: string;
  limit?: number;
  mode?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Generic paginated cursor fetch. Returns typed `PaginatedResult<T>`.
 *
 * @example
 * const result = await fetchPaginated<Property>('/admin/properties/fetch/properties', { limit: 5 });
 */
export async function fetchPaginated<T>(endpoint: string,
  { cursor, limit = 10, mode = 'mobile', ...rest }: PaginatedFetchOptions = {},
  axiosOptions?: AxiosRequestConfig ): Promise<PaginatedResult<T>> {
  
  const params = new URLSearchParams({
    mode,
    limit: String(limit),
    ...(cursor ? { cursor } : {}),
    ...Object.fromEntries(
      Object.entries(rest)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)]),
    ),
  });

  try {
    const response = await apiClient.get<PaginatedApiResponse<T>>(
      `${endpoint}?${params.toString()}`,
      axiosOptions,
    );

    if (!response.data.success) {
      throw new ApiError(
        response.data.message ?? `Request failed: ${endpoint}`,
        response.status,
        endpoint,
      );
    }

    return {
      data: response.data.data,
      nextCursor: response.data.pagination.nextCursor,
      hasMore: response.data.pagination.hasMore,
      total: response.data.pagination.total,
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    const axiosErr = err as AxiosError<PaginatedApiResponse<T>>;
    throw new ApiError(
      axiosErr.response?.data?.message ?? axiosErr.message,
      axiosErr.response?.status,
      endpoint,
    );
  }
}

/**
 * Exhaustively fetches all pages up to `maxPages` (default: 5) to prevent
 * runaway requests. Returns a flat array of all collected items.
 *
 * @example
 * const all = await fetchAllPages<Property>('/admin/properties/fetch/properties', { limit: 10 }, 4);
 */
export async function fetchAllPages<T>( endpoint: string, 
  options: Omit<PaginatedFetchOptions, 'cursor'> = {}, maxPages = 5 ): Promise<T[]> {
  const collected: T[] = [];
  let cursor: string | null | undefined;
  let page = 0;

  do {
    const result = await fetchPaginated<T>(endpoint, {
      ...options,
      ...(cursor ? { cursor } : {}),
    });
    collected.push(...result.data);
    cursor = result.nextCursor;
    page++;
  } while (cursor && page < maxPages);

  return collected;
}