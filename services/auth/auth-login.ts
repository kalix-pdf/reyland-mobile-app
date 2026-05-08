import { AuthApiError, authApiBaseUrl, parseAuthErrorMessage } from './auth-shared';

type LoginPayload = {
  email: string;
  password: string;
};

type LoginApiEnvelope = {
  message?: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  data?: {
    message?: string;
    token?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number | null;
  };
  tokens?: {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number | null;
  };
};

export type LoginApiResult = {
  token: string;
  refreshToken?: string;
};

const LOGIN_ENDPOINT = '/api/auth/login';

export async function loginUser(email: string, password: string): Promise<LoginApiResult> {
  const payload: LoginPayload = {
    email,
    password,
  };

  const response = await fetch(`${authApiBaseUrl}${LOGIN_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new AuthApiError(await parseAuthErrorMessage(response), response.status);
  }

  const result = (await response.json()) as LoginApiEnvelope;
  const token =
    result.token || result.accessToken || result.data?.token || result.data?.accessToken || result.tokens?.access_token;
  const refreshToken = result.refreshToken || result.data?.refreshToken || result.tokens?.refresh_token;

  if (!token) {
    throw new AuthApiError('Sign-in succeeded but no access token was returned.');
  }

  return { token, refreshToken };
}
