import AsyncStorage from '@react-native-async-storage/async-storage';

import { getUserInfo } from '@/services/fetchData/user-info.api';
import { User } from '@/types/user.types';

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

  const userInfo = await getUserInfo();

  if (!userInfo.uuid) {
    await AsyncStorage.multiRemove(['token', 'refreshToken']);
    return false;
  }

  setUser({
    ...userInfo,
    accessToken: userInfo.accessToken || token,
  });

  return true;
}
