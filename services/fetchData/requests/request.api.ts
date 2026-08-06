import { apiClient } from '@/lib/axios';
import axios from 'axios';

export type RequestKind =
  | 'investment'
  | 'withdrawal'
  | 'site_visit'
  | 'inquiry';

export type RequestFilter = 'all' | RequestKind;

export type RequestTone =
  | 'pending'
  | 'success'
  | 'warning'
  | 'muted'
  | 'error';

export type UserRequest = {
  id: string;
  kind: RequestKind;
  title: string;
  subtitle: string;
  status: string;
  tone: RequestTone;
  requestedAt: string;
  scheduledAt?: string | null;
  confirmedAt?: string | null;
  detail?: string | null;
};

export type FetchUserRequestsParams = {
  filter?: RequestFilter;
  signal?: AbortSignal;
};

type RequestsResponse = {
  success: boolean;
  message?: string;
  data?: UserRequest[];
};

export class RequestsApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'RequestsApiError';
  }
}

export async function fetchUserRequests(
  params: FetchUserRequestsParams = {},
): Promise<UserRequest[]> {
  const {
    filter = 'all',
    signal,
  } = params;

  try {
    const response = await apiClient.get<RequestsResponse>(
      '/api/user/requests/me',
      {
        params: {
          kind: filter,
        },
        signal,
      },
    );

    if (!response.data.success) {
      throw new RequestsApiError(
        response.data.message ??
          'Unable to load your requests right now.',
        response.status,
      );
    }

    return Array.isArray(response.data.data)
      ? response.data.data
      : [];
  } catch (error) {
    if (error instanceof RequestsApiError) {
      throw error;
    }

    if (axios.isCancel(error)) {
      throw error;
    }

    if (axios.isAxiosError<RequestsResponse>(error)) {
      throw new RequestsApiError(
        error.response?.data?.message ??
          'Unable to load your requests right now.',
        error.response?.status,
      );
    }

    throw error;
  }
}