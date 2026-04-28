import { LoginForm } from "@/components/auth/login-form";
import { ViewProfile } from "@/components/profile/profile-view";
import { useAuth } from "@/context/auth-context";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user, login, logout } = useAuth();

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
