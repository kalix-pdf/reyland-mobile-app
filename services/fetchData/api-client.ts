import { apiClient } from '@/lib/axios';
import { AxiosRequestConfig, AxiosError } from 'axios';

export const BASE = '/admin/properties/fetch';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  wallet_balance: number;
  type_counts?: {
    all: number;
    purchase: number;
    investment: number;
    withdrawal: number;
  };
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
  meta?: {
    walletBalance: number;
    typeCounts?: {
      all: number;
      purchase: number;
      investment: number;
      withdrawal: number;
    };
  }
}

export interface PaginationMeta {
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

export interface paginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta | null;
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

// ─── Shared error normalizer ──────────────────────────────────────────────────

function normalizeError<T>(err: unknown, endpoint: string): ApiError {
  if (err instanceof ApiError) return err;
  const axiosErr = err as AxiosError<ApiResponse<T>>;
  return new ApiError(
    axiosErr.response?.data?.message ?? axiosErr.message,
    axiosErr.response?.status,
    endpoint,
  );
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
    throw normalizeError<T>(err, endpoint);
  }
}

// ─── Write Helpers (POST / PUT / DELETE) ──────────────────────────────────────

/**
 * Generic POST wrapper for creating a resource. Throws `ApiError` on failure.
 *
 * @example
 * const created = await postOne<PaymentMethod>('/payment-method', payload);
 */
export async function postOne<T>( endpoint: string, body?: unknown, options?: AxiosRequestConfig ): Promise<T> {
  try {
    const response = await apiClient.post<ApiResponse<T>>(endpoint, body, options);

    if (!response.data.success) {
      throw new ApiError(
        response.data.message ?? `Request failed: ${endpoint}`,
        response.status,
        endpoint,
      );
    }

    return response.data.data;
  } catch (err) {
    throw normalizeError<T>(err, endpoint);
  }
}

/**
 * Generic PUT wrapper for updating a resource. Throws `ApiError` on failure.
 *
 * @example
 * const updated = await putOne<PaymentMethod>('/payment-method/123', payload);
 */
export async function putOne<T>( endpoint: string, body?: unknown, options?: AxiosRequestConfig ): Promise<T> {
  try {
    const response = await apiClient.put<ApiResponse<T>>(endpoint, body, options);

    if (!response.data.success) {
      throw new ApiError(
        response.data.message ?? `Request failed: ${endpoint}`,
        response.status,
        endpoint,
      );
    }

    return response.data.data;
  } catch (err) {
    throw normalizeError<T>(err, endpoint);
  }
}

/**
 * Generic DELETE wrapper for removing a resource. Throws `ApiError` on failure.
 * Use `T = void` when the endpoint returns no meaningful payload.
 *
 * @example
 * await deleteOne('/payment-method/123');
 */
export async function deleteOne<T = void>( endpoint: string, options?: AxiosRequestConfig ): Promise<T> {
  try {
    const response = await apiClient.delete<ApiResponse<T>>(endpoint, options);

    if (!response.data.success) {
      throw new ApiError(
        response.data.message ?? `Request failed: ${endpoint}`,
        response.status,
        endpoint,
      );
    }

    return response.data.data;
  } catch (err) {
    throw normalizeError<T>(err, endpoint);
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
      meta: {
        walletBalance: response.data.wallet_balance,
        typeCounts: response.data.type_counts,
      },
    };
  } catch (err) {
    throw normalizeError<T>(err, endpoint);
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
