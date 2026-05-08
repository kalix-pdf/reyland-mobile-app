import { loginUser, type LoginApiResult } from './auth-login';
import { registerUser, type SignUpApiResult } from './auth-register';
import { AuthApiError } from './auth-shared';

type UserAuthApi = {
  signUp: (name: string, email: string, password: string) => Promise<SignUpApiResult>;
  login: (email: string, password: string) => Promise<LoginApiResult>;
  sign_up: (name: string, email: string, password: string) => Promise<SignUpApiResult>;
};

export type { LoginApiResult, SignUpApiResult };
export { AuthApiError };

export const user_auth_api: UserAuthApi = {
  signUp: registerUser,
  login: loginUser,
  sign_up: registerUser,
};
