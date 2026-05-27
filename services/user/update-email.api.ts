import axios from 'axios';
import { apiClient } from '@/lib/axios';
import { AuthApiError } from '@/services/auth/auth-shared';

const UPDATE_EMAIL_ENDPOINT = '/api/user/email';

type UpdateEmailPayload = {
  email: string;
  password: string;
};

type UpdateEmailResponse = {
  message?: string;
  error?: string;
  data?: {
    email?: string;
    message?: string;
    error?: string;
  };
};

const getMessage = (payload: UpdateEmailResponse | undefined, fallback: string) =>
  payload?.message ||
  payload?.error ||
  payload?.data?.message ||
  payload?.data?.error ||
  fallback;

export async function updateEmail(email: string, password: string) {
  const payload: UpdateEmailPayload = {
    email,
    password,
  };

  try {
    const response = await apiClient.patch<UpdateEmailResponse>(UPDATE_EMAIL_ENDPOINT, payload);

    return {
      email: response.data.data?.email ?? email,
      message: getMessage(
        response.data,
        'We sent confirmation links. Open the Reyland email in your current and new inboxes to finish changing your email.',
      ),
    };
  } catch (error) {
    if (axios.isAxiosError<UpdateEmailResponse>(error)) {
      throw new AuthApiError(
        getMessage(error.response?.data, 'Unable to update your email right now.'),
        error.response?.status,
      );
    }

    throw error;
  }
}
