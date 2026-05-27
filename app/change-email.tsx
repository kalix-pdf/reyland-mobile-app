import { ChangePersonalInfoView } from '@/components/profile/change-personal-info-view';
import { useAuth } from '@/context/auth-context';
import { updateEmail } from '@/services/user/update-email.api';

export default function ChangeEmailScreen() {
  const { user } = useAuth();

  return (
    <ChangePersonalInfoView
      title="Change Email Address"
      currentLabel="Current Email Address"
      currentValue={user?.email ?? ''}
      inputs={[
        { key: 'email', placeholder: 'Email', keyboardType: 'email-address' },
        { key: 'confirmEmail', placeholder: 'Confirmed Email', keyboardType: 'email-address' },
      ]}
      submitLabel="Save Email"
      loadingLabel="Saving email..."
      subtitle="Enter your new email and password. You may need to confirm links sent to both your current and new inboxes."
      onSubmit={async ({ email, password }) => {
        try {
          if (!email) {
            return {
              success: false,
              message: 'Email is required.',
            };
          }

          const result = await updateEmail(email, password);

          return {
            success: true,
            message: result.message,
          };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unable to update your email right now.',
          };
        }
      }}
    />
  );
}
