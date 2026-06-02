import axios from 'axios';
import { apiClient } from '@/lib/axios';
import { AuthApiError } from '@/services/auth/auth-shared';

const UPDATE_AVATAR_ENDPOINT = '/api/user/avatar';

type UpdateAvatarResponse = {
  message?: string;
  error?: string;
  data?: {
    avatar?: string;
    message?: string;
    error?: string;
  };
};

type AvatarFile = {
  uri: string;
  name: string;
  type: string;
};

const getMessage = (payload: UpdateAvatarResponse | undefined, fallback: string) =>
  payload?.message ||
  payload?.error ||
  payload?.data?.message ||
  payload?.data?.error ||
  fallback;

export async function updateAvatar(file: AvatarFile) {
  const formData = new FormData();
  formData.append('avatar', file as unknown as Blob);

  try {
    const response = await apiClient.patch<UpdateAvatarResponse>(UPDATE_AVATAR_ENDPOINT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      transformRequest: (data) => data,
    });

    return {
      avatar: response.data.data?.avatar ?? '',
      message: getMessage(response.data, 'Profile photo updated successfully.'),
    };
  } catch (error) {
    if (axios.isAxiosError<UpdateAvatarResponse>(error)) {
      throw new AuthApiError(
        getMessage(error.response?.data, 'Unable to update your profile photo right now.'),
        error.response?.status,
      );
    }

    throw error;
  }
}
