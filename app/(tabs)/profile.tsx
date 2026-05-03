import { ViewProfile } from "@/components/profile/profile-view";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/auth-context";
import { router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user, isLoading, logout } = useAuth();
  const isLoggingOut = useRef(false);

  useEffect(() => {
    if (!isLoading && !user && !isLoggingOut.current) {
      router.replace("/login");
    }
  }, [user, isLoading]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut.current) return; // prevent double-tap
    isLoggingOut.current = true;

    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      isLoggingOut.current = false;
    }
  }, [logout]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>{isLoggingOut.current ? "Signing out..." : "Loading profile..."}</Text>
      </SafeAreaView>
    );
  }

  if (!user) return null;

  return <ViewProfile user={user} onLogout={handleLogout} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
