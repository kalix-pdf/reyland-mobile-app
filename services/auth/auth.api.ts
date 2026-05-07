// Verify muna natin yung email bago isend sa db yung data kapag nag sign up.
import { BACKEND_URL } from './AuthResult';

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type SignUpApiEnvelope = {
  message?: string;
  data?: {
    message?: string;
  };
};

type LoginApiEnvelope = {
  message?: string;
  token?: string;
  accessToken?: string;
  data?: {
    message?: string;
    token?: string;
    accessToken?: string;
  };
};

export type SignUpApiResult = {
  message: string;
};

export type LoginApiResult = {
  token: string;
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

// ito yung endpoint par
const SIGN_UP_ENDPOINT = '/api/auth/sign-up';
const LOGIN_ENDPOINT = '/api/auth/sign-in';

const getMessage = (payload: { message?: string; data?: { message?: string } }) =>
  payload.message ||
  payload.data?.message ||
  'We sent a verification link to your email. Verify your account before signing in.';

const parseErrorMessage = async (response: Response) => {
  try {
    const payload = (await response.json()) as SignUpApiEnvelope;
    if (payload.message || payload.data?.message) {
      return getMessage(payload);
    }
  } catch {
    // error po
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

type UserAuthApi = {
  sign_up: (name: string, email: string, password: string) => Promise<SignUpApiResult>;
  login: (email: string, password: string) => Promise<LoginApiResult>;
};

export const user_auth_api: UserAuthApi = {
  sign_up: async (name: string, email: string, password: string) => {
    const payload: SignUpPayload = {
      name,
      email,
      password,
    };

    const response = await fetch(`${BACKEND_URL}${SIGN_UP_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new AuthApiError(await parseErrorMessage(response), response.status);
    }

    const result = (await response.json()) as SignUpApiEnvelope;

    return {
      message: getMessage(result),
    };
  },

  login: async (email: string, password: string) => {
    const payload: LoginPayload = {
      email,
      password,
    };

    const response = await fetch(`${BACKEND_URL}${LOGIN_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response);
      throw new AuthApiError(message, response.status);
    }

    const result = (await response.json()) as LoginApiEnvelope;
    const token = result.token || result.accessToken || result.data?.token || result.data?.accessToken;

    if (!token) {
      throw new AuthApiError('Sign-in succeeded but no access token was returned.');
    }

    return { token };
  },
};
