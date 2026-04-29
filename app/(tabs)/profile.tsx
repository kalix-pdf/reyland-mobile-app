import { LoginForm } from "@/components/auth/login-form";
import { ViewProfile } from "@/components/profile/profile-view";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/auth-context";
import { router } from "expo-router";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text } from "react-native";

export default function ProfileScreen() {
  const { user, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>
          {user ? "Signing out..." : "Signing in..."}
        </Text>
      </SafeAreaView>
    );
  }

  return user ? (
    <ViewProfile user={user} onLogout={logout} />
  ) : (
    <LoginForm
      onLogin={login}
      onCreateAccount={() => router.push("/sign-up")}
      onForgotPassword={() => router.push("/forgot-password")}
    />
  );
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