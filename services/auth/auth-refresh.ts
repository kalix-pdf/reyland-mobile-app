import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApiBaseUrl } from './auth-shared';

type RefreshResult = {
  token: string;
  refreshToken: string;
  expiresAt: number;
};

export const refreshSession = async (): Promise<RefreshResult> => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('No refresh token available!.');
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
  const { token, refreshToken: newRefreshToken, expiresAt } = json.data;

  // Persist the new tokens immediately
  await AsyncStorage.multiSet([
    ['token', token],
    ['refreshToken', newRefreshToken],
  ]);

  return { token, refreshToken: newRefreshToken, expiresAt };
};