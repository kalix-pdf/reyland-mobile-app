import { getRefreshToken, setTokens } from '@/lib/token-storage';
import { authApiBaseUrl } from './auth-shared';

type RefreshResult = {
  token: string;
  refreshToken: string;
  expiresAt: number;
};

let inFlightRefresh: Promise<RefreshResult> | null = null;

export const refreshSession = async (): Promise<RefreshResult> => {
  // Dedupe concurrent callers (e.g. an axios interceptor firing on
  // several parallel 401s) so we don't fire multiple refresh requests
  // and race each other writing tokens.
  if (inFlightRefresh) {
    return inFlightRefresh;
  }

  inFlightRefresh = (async () => {
    try {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available.');
      }

      const response = await fetch(`${authApiBaseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Refresh failed.');
      }

      const json = await response.json();
      const { token, refreshToken: newRefreshToken, expiresAt } = json.data ?? {};

      if (!token || !newRefreshToken || !expiresAt) {
        throw new Error('Malformed refresh response.');
      }

      await setTokens(token, newRefreshToken);

      return { token, refreshToken: newRefreshToken, expiresAt };
    } finally {
      inFlightRefresh = null;
    }
  })();

  return inFlightRefresh;
};