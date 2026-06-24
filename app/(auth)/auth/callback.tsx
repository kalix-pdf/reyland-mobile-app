import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '@/context/auth-context';
import { completeOAuthSignIn } from '@/services/auth/complete-oauth-sign-in';

export default function AuthCallbackScreen() {
  const { access_token, refresh_token, flow } = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
    flow?: string;
  }>();
  const { setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let isActive = true;

    async function finishSignIn() {
      const token = typeof access_token === 'string' ? access_token : '';
      const refreshToken = typeof refresh_token === 'string' ? refresh_token : undefined;
      const authFlow = typeof flow === 'string' ? flow : '';

      if (authFlow === 'email-change-confirmed') {
        router.replace('/(tabs)/profile');
        return;
      }

      if (authFlow === 'email-confirmed') {
        router.replace('/login');
        return;
      }

      if (!token) {
        router.replace('/login');
        return;
      }

      if (authFlow === 'password-reset') {
        router.replace({
          pathname: '/reset-password',
          params: {
            access_token: token,
            ...(refreshToken ? { refresh_token: refreshToken } : {}),
          },
        });
        return;
      }

      try {
        const completed = await completeOAuthSignIn(token, setUser, refreshToken);

        if (!completed && isActive) {
          router.replace('/login');
        }
      } catch {
        if (isActive) {
          router.replace('/login');
        }
      }
    }

    finishSignIn();

    return () => {
      isActive = false;
    };
  }, [access_token, flow, refresh_token, router, setUser]);

  return (
    <View className='flex-1 align-center justify-center gap-[12px] p-[24px] bg-background'>
      <ActivityIndicator size="large" />
      <Text className='text-gray-600 text-base'>
        {flow === 'password-reset'
          ? 'Opening password reset...'
          : flow === 'email-change-confirmed' || flow === 'email-confirmed'
            ? 'Email link accepted...'
            : 'Completing sign in...'}
      </Text>
    </View>
  );
}
