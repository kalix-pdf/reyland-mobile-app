import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/context/auth-context";
import { Redirect, router } from "expo-router";
import { GoogleAuthError, signInWithGoogle } from "@/services/auth/google";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { getUserInfo } from "@/services/fetchData/user.api";

export default function LoginScreen() {
  const { login, user, setUser } = useAuth();
  const [isLoadingOuth, setIsLoadingOuth] = useState(false)

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  const handleGoogleLogin = async() => {
    if (isLoadingOuth) return;
    setIsLoadingOuth(true);

    try {
      const { token } = await signInWithGoogle()
      
      if (token) {
        const userInfo = await getUserInfo(token);
        
        if (userInfo.uuid) {
          await AsyncStorage.setItem('token', token);
          setUser(userInfo);
          router.push("/");
        }
      }

    } catch(error) {
      if (error instanceof GoogleAuthError && error.code === 'CANCELLED') return;
      Alert.alert(
        'Sign-in Failed',
        error instanceof GoogleAuthError ? error.message : 
        'Something went wrong, Please contact support.'
      )
    } finally {
      setIsLoadingOuth(false);
    }
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
      onGoogleLogin={handleGoogleLogin}
      onLoadingOuth={isLoadingOuth}
      onCreateAccount={() => router.push("/sign-up")}
      onForgotPassword={() => router.push("/forgot-password")}
    />
  );
}
