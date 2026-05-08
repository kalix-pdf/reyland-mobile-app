import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/context/auth-context';
import { AuthError } from '@/services/auth/AuthResult';
import { completeOAuthSignIn } from '@/services/auth/complete-oauth-sign-in';
import { signInWithFacebook } from '@/services/auth/facebook';
import { signInWithGoogle } from '@/services/auth/google';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export default function LoginScreen() {
  const { login, user, setUser } = useAuth();
  const [isLoadingGoogleOuth, setIsLoadingGoogleOuth] = useState(false);
  const [isLoadingFacebookOuth, setIsLoadingFacebookOuth] = useState(false);

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  const handleFabookLogin = async () => {
    if (isLoadingFacebookOuth) return;
    setIsLoadingFacebookOuth(true);

    try {
      const { token } = await signInWithFacebook();

      if (token) {
        await completeOAuthSignIn(token, setUser);
      }
    } catch {
    } finally {
      setIsLoadingFacebookOuth(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoadingGoogleOuth) return;
    setIsLoadingGoogleOuth(true);

    try {
      const { token } = await signInWithGoogle();

      if (token) {
        await completeOAuthSignIn(token, setUser);
      }
    } catch (error) {
      if (error instanceof AuthError && error.code === 'CANCELLED') return;
      Alert.alert(
        'Sign-in Failed',
        error instanceof AuthError ? error.message : 'Something went wrong, Please contact support.',
      );
    } finally {
      setIsLoadingGoogleOuth(false);
    }
  };

  return (
    <LoginForm
      onLogin={async (email, password) => {
        const result = await login(email, password);

        if (result.success) {
          router.replace('/(tabs)');
        }

        return result;
      }}
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFabookLogin}
      onLoadingFacebookOuth={isLoadingFacebookOuth}
      onLoadingGoogleOuth={isLoadingGoogleOuth}
      onCreateAccount={() => router.replace('/sign-up')}
      onForgotPassword={() => router.push('/forgot-password')}
    />
  );
}
