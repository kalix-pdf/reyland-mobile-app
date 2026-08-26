import { getUserInfo } from '@/services/fetchData/user-info.api';
import { User } from '@/types/user.types';
import { setTokens, setCachedUser } from '@/lib/token-storage';

type SetUser = (user: User | null) => void;

export async function establishAuthenticatedSession(
  token: string,
  setUser: SetUser,
  refreshToken?: string,
): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    const userInfo = await getUserInfo(token);

    if (!userInfo?.uuid) {
      return false;
    }

    const user: User = {
      ...userInfo,
      accessToken: userInfo.accessToken || token,
    };

    await setTokens(token, refreshToken);
    await setCachedUser(user);

    setUser(user);
    return true;
  } catch {
    return false;
  }
}