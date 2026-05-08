import { authApiBaseUrl } from './auth-shared';

const LOGOUT_ENDPOINT = '/api/auth/logout';

export async function logoutUser(token: string) {
  await fetch(`${authApiBaseUrl}${LOGOUT_ENDPOINT}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}
