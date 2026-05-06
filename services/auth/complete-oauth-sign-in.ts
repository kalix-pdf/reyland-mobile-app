import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { getUserInfo } from "@/services/fetchData/user.api";
import { User } from "@/types/user.types";

type SetUser = (user: User | null) => void;

export async function completeOAuthSignIn(token: string, setUser: SetUser) {
  if (!token) {
    return false;
  }

  const userInfo = await getUserInfo(token);

  if (!userInfo.uuid) {
    return false;
  }

  await AsyncStorage.setItem("token", token);
  setUser(userInfo);
  router.replace("/(tabs)");
  return true;
}
