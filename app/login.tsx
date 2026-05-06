import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/context/auth-context";
import { Redirect, router } from "expo-router";
import { signInWithGoogle } from "@/services/auth/google";
import { AuthError } from "@/services/auth/AuthResult";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { getUserInfo } from "@/services/fetchData/user.api";
import { signInWithFacebook } from "@/services/auth/facebook";

export default function LoginScreen() {
  const { login, user, setUser } = useAuth();
  const [isLoadingOuth, setIsLoadingOuth] = useState(false)

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  const handleFabookLogin = async() => {
    if (isLoadingOuth) return;
    setIsLoadingOuth(true);

    try {
      const { token } = await signInWithFacebook()

      if (token) {
        await getUserInfoByToken(token);
      }

    } catch (error) {

    } finally {
      setIsLoadingOuth(false)
    }
  }

  const getUserInfoByToken = async(token: string) => {
    if (!token) return;

    const userInfo = await getUserInfo(token);
        
    if (userInfo.uuid) {
      await AsyncStorage.setItem('token', token);
      setUser(userInfo);
      router.replace('/')
    }
  }

  const handleGoogleLogin = async() => {
    if (isLoadingOuth) return;
    setIsLoadingOuth(true);

    try {
      const { token } = await signInWithGoogle()
      
      if (token) {
        await getUserInfoByToken(token);   
      }

    } catch(error) {
      if (error instanceof AuthError && error.code === 'CANCELLED') return;
      Alert.alert(
        'Sign-in Failed',
        error instanceof AuthError ? error.message : 
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
      onFacebookLogin={handleFabookLogin}
      onLoadingOuth={isLoadingOuth}
      onCreateAccount={() => router.push("/sign-up")}
      onForgotPassword={() => router.push("/forgot-password")}
    />
  );
}
