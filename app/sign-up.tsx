import { useAuth } from '@/context/auth-context';
import { AuthError } from '@/services/auth/AuthResult';
import { AuthApiError, user_auth_api } from '@/services/auth/auth.api';
import { completeOAuthSignIn } from '@/services/auth/complete-oauth-sign-in';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { SignUpForm } from '../components/auth/sign-up-form';
import { signInWithFacebook } from '../services/auth/facebook';
import { signInWithGoogle } from '../services/auth/google';

export default function SignUpScreen() {
  const [isLoadingGoogleOuth, setIsLoadingGoogleOuth] = useState(false);
  const [isLoadingFacebookOuth, setIsLoadingFacebookOuth] = useState(false);
  const { setUser } = useAuth();

  const handleSignUp = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const result = await user_auth_api.sign_up(name, email, password);

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof AuthApiError) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: false,
        message: 'Something went wrong. Please try again.',
      };
    }
  };

  const handleGoogleSignUp = async () => {
    if (isLoadingGoogleOuth) return;
    setIsLoadingGoogleOuth(true);

    try {
      const { token } = await signInWithGoogle();

      if (token) {
        await completeOAuthSignIn(token, setUser);
      }
    } catch (error) {
      if (error instanceof AuthError && error.code === 'CANCELLED') {
        return;
      }

      Alert.alert(
        'Sign-in Failed',
        error instanceof AuthError ? error.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsLoadingGoogleOuth(false);
    }
  };

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

  return (
    <SignUpForm
      onSignUp={handleSignUp}
      onLogin={() => router.replace('/login')}
      onGoogleSignUp={handleGoogleSignUp}
      onFacebookSignUp={handleFabookLogin}
      isGoogleLoading={isLoadingGoogleOuth}
      isFacebookLoading={isLoadingFacebookOuth}
    />
  );
}
