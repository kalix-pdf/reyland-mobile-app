import { BACKEND_URL } from './AuthResult';

type MessagePayload = {
  message?: string;
  error?: string;
  data?: {
    message?: string;
    error?: string;
  };
};

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

export const authApiBaseUrl = BACKEND_URL;

export const getAuthMessage = (payload: MessagePayload) =>
  payload.message ||
  payload.error ||
  payload.data?.message ||
  payload.data?.error ||
  'Request completed successfully.';

export const parseAuthErrorMessage = async (response: Response) => {
  try {
    const payload = (await response.json()) as MessagePayload;
    if (payload.message || payload.data?.message) {
      return getAuthMessage(payload);
    }
  } catch {
    // Fall back to status-based messaging when the response body is unreadable.
  }

  if (response.status === 400) {
    return 'Please check your details and try again.';
  }

  if (response.status === 401) {
    return 'Invalid email or password.';
  }

  if (response.status === 403) {
    return 'Your account cannot access this right now. Please contact support if this continues.';
  }

  if (response.status === 404) {
    return 'We could not reach the sign-in service. Please try again shortly.';
  }

  if (response.status === 409) {
    return 'This email is already registered.';
  }

  if (response.status === 422) {
    return 'Some of your details look invalid. Please review them and try again.';
  }

  if (response.status >= 500) {
    return 'Our server is having trouble right now. Please try again later.';
  }

  return 'Something went wrong. Please try again.';
};
