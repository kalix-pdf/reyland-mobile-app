import { AuthApiError, authApiBaseUrl, getAuthMessage, parseAuthErrorMessage } from './auth-shared';

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

type SignUpApiEnvelope = {
  message?: string;
  data?: {
    message?: string;
  };
};

export type SignUpApiResult = {
  message: string;
};

const SIGN_UP_ENDPOINT = '/api/auth/register';

export async function registerUser(name: string, email: string, password: string): Promise<SignUpApiResult> {
  const payload: SignUpPayload = {
    name,
    email,
    password,
  };

  const response = await fetch(`${authApiBaseUrl}${SIGN_UP_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new AuthApiError(await parseAuthErrorMessage(response), response.status);
  }

  const result = (await response.json()) as SignUpApiEnvelope;

  return {
    message: getAuthMessage(result),
  };
}
