import { ViewProfile } from "@/components/profile/profile-view";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/auth-context";
import { Redirect, router } from "expo-router";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text } from "react-native";

export default function ProfileScreen() {
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

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

  if (!user) {
    return <Redirect href="/" />;
  }

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
