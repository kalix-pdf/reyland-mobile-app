import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/types/user.types';

const USER_CACHE_KEY = 'cached_user';
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';

// ---- Secure token storage ----

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function setTokens(token: string, refreshToken?: string): Promise<void> {
  const ops: Promise<void>[] = [SecureStore.setItemAsync(TOKEN_KEY, token)];
  if (refreshToken) {
    ops.push(SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken));
  }
  await Promise.all(ops);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
}

// ---- Non-sensitive cached user ----

export async function getCachedUser(): Promise<User | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as User;
    if (!parsed || typeof parsed !== 'object' || !parsed.uuid) {
      await clearCachedUser();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function setCachedUser(user: User): Promise<void> {
  await AsyncStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
}

export async function clearCachedUser(): Promise<void> {
  await AsyncStorage.removeItem(USER_CACHE_KEY);
}

// ---- Combined teardown ----

export async function endSession(setUser: (user: User | null) => void): Promise<void> {
  await Promise.all([clearTokens(), clearCachedUser()]);
  setUser(null);
}