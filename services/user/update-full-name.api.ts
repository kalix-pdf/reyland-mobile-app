import axios from 'axios';
import { apiClient } from '@/lib/axios';
import { AuthApiError } from '@/services/auth/auth-shared';

const UPDATE_FULL_NAME_ENDPOINT = '/api/user/full-name';

type UpdateFullNamePayload = {
  fullName: string;
  password: string;
};

type UpdateFullNameResponse = {
  message?: string;
  error?: string;
  data?: {
    fullName?: string;
    message?: string;
    error?: string;
  };
};

const getMessage = (payload: UpdateFullNameResponse | undefined, fallback: string) =>
  payload?.message ||
  payload?.error ||
  payload?.data?.message ||
  payload?.data?.error ||
  fallback;

export async function updateFullName(fullName: string, password: string) {
  const payload: UpdateFullNamePayload = {
    fullName,
    password,
  };

  try {
    const response = await apiClient.patch<UpdateFullNameResponse>(UPDATE_FULL_NAME_ENDPOINT, payload);

    return {
      fullName: response.data.data?.fullName ?? fullName,
      message: getMessage(response.data, 'Full name updated successfully.'),
    };
  } catch (error) {
    if (axios.isAxiosError<UpdateFullNameResponse>(error)) {
      throw new AuthApiError(
        getMessage(error.response?.data, 'Unable to update your full name right now.'),
        error.response?.status,
      );
    }

    throw error;
  }
}
