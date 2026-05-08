import { router } from "expo-router";

import { establishAuthenticatedSession } from "@/services/auth/auth-session";
import { User } from "@/types/user.types";

type SetUser = (user: User | null) => void;

export async function completeOAuthSignIn(token: string, setUser: SetUser) {
  if (!token) {
    return false;
  }

  const established = await establishAuthenticatedSession(token, setUser);
  if (!established) {
    return false;
  }

  router.replace("/(tabs)");
  return true;
}
