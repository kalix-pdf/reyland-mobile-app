import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useAuth } from "@/context/auth-context";
import { completeOAuthSignIn } from "@/services/auth/complete-oauth-sign-in";

export default function AuthCallbackScreen() {
  const { access_token } = useLocalSearchParams<{ access_token?: string }>();
  const { setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let isActive = true;

    async function finishSignIn() {
      const token = typeof access_token === "string" ? access_token : "";

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const completed = await completeOAuthSignIn(token, setUser);

        if (!completed && isActive) {
          router.replace("/login");
        }
      } catch {
        if (isActive) {
          router.replace("/login");
        }
      }
    }

    finishSignIn();

    return () => {
      isActive = false;
    };
  }, [access_token, router, setUser]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  text: {
    fontSize: 16,
    color: "#4B5563",
  },
});
