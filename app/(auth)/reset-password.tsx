import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { updatePassword } from '@/services/auth/auth-forgot-password';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ResetPasswordScreen() {
  const { access_token, refresh_token } = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
  }>();

  const router = useRouter();

  const accessToken = typeof access_token === 'string' ? access_token : '';

  const refreshToken = typeof refresh_token === 'string' ? refresh_token : '';

  return (
    <ResetPasswordForm
      onSubmit={async (password) => {
        if (!accessToken || !refreshToken) {
          return {
            success: false,
            message: 'This reset link is no longer valid. Please request a new one.',
          };
        }

        try {
          await updatePassword(accessToken, refreshToken, password);

          return {
            success: true,
            message: 'Password updated successfully. Redirecting...',
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
