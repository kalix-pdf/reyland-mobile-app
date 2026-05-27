import { getUserInfo } from '@/services/fetchData/user-info.api';
import { User } from '@/types/user.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_CACHE_KEY = 'cached_user';

export async function getCachedUser(): Promise<User | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_CACHE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
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

type SetUser = (user: User | null) => void;

export async function establishAuthenticatedSession(
  token: string,
  setUser: SetUser,
  refreshToken?: string,
) {
  await AsyncStorage.setItem('token', token);
  if (refreshToken) {
    await AsyncStorage.setItem('refreshToken', refreshToken);
  }

  const userInfo = await getUserInfo(token);

  if (!userInfo.uuid) {
    await AsyncStorage.multiRemove(['token', 'refreshToken']);
    await clearCachedUser();
    return false;
  }

  const user: User = {
    ...userInfo,
    accessToken: userInfo.accessToken || token,
  };

  await setCachedUser(user);
  setUser(user);

  return true;
}
