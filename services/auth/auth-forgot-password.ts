import { AuthApiError, authApiBaseUrl, parseAuthErrorMessage } from './auth-shared';

const FORGOT_PASSWORD_ENDPOINT = '/api/auth/forgot-password';
const UPDATE_PASSWORD_ENDPOINT = '/api/auth/password/update';

type ForgotPasswordPayload = {
  email: string;
};

type UpdatePasswordPayload = {
  accessToken: string;
  refreshToken: string;
  password: string;
};

export async function requestPasswordReset(email: string) {
  const payload: ForgotPasswordPayload = { email };

  const response = await fetch(`${authApiBaseUrl}${FORGOT_PASSWORD_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new AuthApiError(await parseAuthErrorMessage(response), response.status);
  }

  return true;
}

export async function updatePassword(accessToken: string, refreshToken: string, password: string) {
  const payload: UpdatePasswordPayload = {
    accessToken,
    refreshToken,
    password,
  };

  const response = await fetch(`${authApiBaseUrl}${UPDATE_PASSWORD_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new AuthApiError(await parseAuthErrorMessage(response), response.status);
  }

  return true;
}
