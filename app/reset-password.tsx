import { useLocalSearchParams, useRouter } from 'expo-router';

import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { useAuth } from '@/context/auth-context';
import { establishAuthenticatedSession } from '@/services/auth/auth-session';
import { updatePassword } from '@/services/auth/auth-forgot-password';

export default function ResetPasswordScreen() {
  const { access_token, refresh_token } = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
  }>();
  const { setUser } = useAuth();
  const router = useRouter();

  const accessToken = typeof access_token === 'string' ? access_token : '';
  const refreshToken = typeof refresh_token === 'string' ? refresh_token : undefined;

  return (
    <ResetPasswordForm
      onSubmit={async (password) => {
        if (!accessToken) {
          return {
            success: false,
            message: 'This reset link is no longer valid. Please request a new one.',
          };
        }

        try {
          await updatePassword(accessToken, password);
          const established = await establishAuthenticatedSession(accessToken, setUser, refreshToken);

          if (!established) {
            return {
              success: false,
              message: 'Your password changed, but we could not restore your session. Please sign in manually.',
            };
          }

          router.replace('/(tabs)');

          return {
            success: true,
            message: 'Password updated successfully.',
          };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unable to update your password right now.',
          };
        }
      }}
      onBackToLogin={() => router.replace('/login')}
    />
  );
}
