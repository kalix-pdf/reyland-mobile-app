import { apiClient } from '@/lib/axios';
import { AuthApiError } from '@/services/auth/auth-shared';
import axios from 'axios';

const UPDATE_PHONE_NUMBER_ENDPOINT = '/api/user/phone';

type UpdatePhoneNumberPayload = {
  phone: string;
  password: string;
};

type UpdatePhoneNumberResponse = {
  message?: string;
  error?: string;
  data?: {
    phone?: string;
    message?: string;
    error?: string;
  };
};

const getMessage = (payload: UpdatePhoneNumberResponse | undefined, fallback: string) =>
  payload?.message ||
  payload?.error ||
  payload?.data?.message ||
  payload?.data?.error ||
  fallback;

export async function updatePhoneNumber(phone: string, password: string) {
  const payload: UpdatePhoneNumberPayload = {
    phone,
    password,
  };

  try {
    const response = await apiClient.patch<UpdatePhoneNumberResponse>(UPDATE_PHONE_NUMBER_ENDPOINT, payload);

    return {
      phone: response.data.data?.phone ?? phone,
      message: getMessage(response.data, 'Phone number updated successfully.'),
    };
  } catch (error) {
    if (axios.isAxiosError<UpdatePhoneNumberResponse>(error)) {
      throw new AuthApiError(
        getMessage(error.response?.data, 'Unable to update your phone number right now.'),
        error.response?.status,
      );
    }

    throw error;
  }
}
