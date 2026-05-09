import { router } from 'expo-router';
import { requestPasswordReset } from '@/services/auth/auth-forgot-password';
import { ForgotPasswordForm } from '../components/auth/forgot-password-form';

export default function ForgotPasswordScreen() {
  return (
    <ForgotPasswordForm
      onSubmit={async (email) => requestPasswordReset(email)}
      onLogin={() => router.back()}
    />
  );
}
