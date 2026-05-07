import { WelcomeScreen } from '@/components/auth/welcome-screen';
import { useAuth } from '@/context/auth-context';
import { AuthError } from '@/services/auth/AuthResult';
import { completeOAuthSignIn } from '@/services/auth/complete-oauth-sign-in';
import { signInWithFacebook } from '@/services/auth/facebook';
import { signInWithGoogle } from '@/services/auth/google';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export default function WelcomeRoute() {
  const { user, setUser } = useAuth();
  const [isLoadingGoogleOuth, setIsLoadingGoogleOuth] = useState(false);
  const [isLoadingFacebookOuth, setIsLoadingFacebookOuth] = useState(false);

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

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

  const handleFacebookLogin = async () => {
    if (isLoadingFacebookOuth) return;
    setIsLoadingFacebookOuth(true);
    try {
      const { token } = await signInWithFacebook();

      if (token) {
        await completeOAuthSignIn(token, setUser);
      }
    } catch (error) {
      if (error instanceof AuthError && error.code === 'CANCELLED') return;
      Alert.alert(
        'Sign-in Failed',
        error instanceof AuthError ? error.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsLoadingFacebookOuth(false);
    }
  };

  return (
    <WelcomeScreen
      onSignIn={() => router.push('/login')}
      onSignUp={() => router.push('/sign-up')}
      onGoogleLogin={handleGoogleLogin}
      onFacebookLogin={handleFacebookLogin}
      isGoogleLoading={isLoadingGoogleOuth}
      isFacebookLoading={isLoadingFacebookOuth}
    />
  );
}
