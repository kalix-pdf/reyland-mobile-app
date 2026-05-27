import type { ApiRequestConfig } from '@/lib/axios';
import { apiClient } from '@/lib/axios';
import axios from 'axios';
import { AuthApiError } from './auth-shared';

const CHANGE_PASSWORD_ENDPOINT = '/api/auth/password/change';

type ChangePasswordPayload = {
  currentPassword: string;
  password: string;
};

type ApiMessagePayload = {
  message?: string;
  error?: string;
  data?: {
    message?: string;
    error?: string;
  };
};

const getMessage = (payload: ApiMessagePayload | undefined, fallback: string) =>
  payload?.message ||
  payload?.error ||
  payload?.data?.message ||
  payload?.data?.error ||
  fallback;

export async function changePassword(currentPassword: string, password: string) {
  const payload: ChangePasswordPayload = {
    currentPassword,
    password,
  };

  try {
    const response = await apiClient.post<ApiMessagePayload>(CHANGE_PASSWORD_ENDPOINT, payload, {
      skipAuthRefresh: true,
    } as ApiRequestConfig);
    return getMessage(response.data, 'Password changed successfully.');
  } catch (error) {
    if (axios.isAxiosError<ApiMessagePayload>(error)) {
      throw new AuthApiError(
        getMessage(error.response?.data, 'Unable to change your password right now.'),
        error.response?.status,
      );
    }

    throw error;
  }
}
