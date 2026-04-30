import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/context/auth-context";
import { Redirect, router } from "expo-router";

export default function LoginScreen() {
  const { login, user } = useAuth();

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <LoginForm
      onLogin={async (email, password) => {
        const success = await login(email, password);

        if (success) {
          router.replace("/(tabs)");
        }

        return success;
      }}
      onCreateAccount={() => router.push("/sign-up")}
      onForgotPassword={() => router.push("/forgot-password")}
    />
  );
}
