import { ChangePasswordView } from '@/components/profile/change-password-view';
import { changePassword } from '@/services/auth/auth-change-password';

export default function ChangePasswordScreen() {
  return (
    <ChangePasswordView
      onSubmit={async (currentPassword, password) => {
        try {
          const message = await changePassword(currentPassword, password);
          return {
            success: true,
            message,
          };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unable to change your password right now.',
          };
        }
      }}
    />
  );
}
