import axios from 'axios';
import { apiClient } from '@/lib/axios';
import { AuthApiError } from '@/services/auth/auth-shared';

const DELETE_ACCOUNT_ENDPOINT = '/api/user/delete-account';

type DeleteAccountResponse = {
  message?: string;
  error?: string;
  data?: {
    message?: string;
    error?: string;
  };
};

const getMessage = (payload: DeleteAccountResponse | undefined, fallback: string) =>
  payload?.message ||
  payload?.error ||
  payload?.data?.message ||
  payload?.data?.error ||
  fallback;

export async function deleteAccount() {
  try {
    const response = await apiClient.delete<DeleteAccountResponse>(DELETE_ACCOUNT_ENDPOINT);

    return {
      message: getMessage(response.data, 'Your account has been deleted.'),
    };
  } catch (error) {
    if (axios.isAxiosError<DeleteAccountResponse>(error)) {
      throw new AuthApiError(
        getMessage(error.response?.data, 'Unable to delete your account right now.'),
        error.response?.status,
      );
    }

    throw error;
  }
}
