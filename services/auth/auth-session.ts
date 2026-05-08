import AsyncStorage from '@react-native-async-storage/async-storage';

import { getUserInfo } from '@/services/fetchData/user.api';
import { User } from '@/types/user.types';

type SetUser = (user: User | null) => void;

export async function establishAuthenticatedSession(
  token: string,
  setUser: SetUser,
  refreshToken?: string,
) {
  const userInfo = await getUserInfo(token);

  if (!userInfo.uuid) {
    return false;
  }

  await AsyncStorage.setItem('token', token);

  if (refreshToken) {
    await AsyncStorage.setItem('refreshToken', refreshToken);
  }

  setUser({
    ...userInfo,
    accessToken: userInfo.accessToken || token,
  });

  return true;
}
