import { ChangePersonalInfoView } from '@/components/profile/change-personal-info-view';
import { useAuth } from '@/context/auth-context';
import { setCachedUser } from '@/services/auth/auth-session';
import { updateFullName } from '@/services/user/update-full-name.api';

export default function ChangeFullNameScreen() {
  const { setUser, user } = useAuth();

  return (
    <ChangePersonalInfoView
      title="Change Full Name"
      currentLabel="Current Full Name"
      currentValue={user?.name ?? ''}
      inputs={[{ key: 'fullName', placeholder: 'Full name' }]}
      submitLabel="Save Full Name"
      loadingLabel="Saving full name..."
      subtitle="Enter your new full name and confirm your password before saving."
      onSubmit={async ({ fullName, password }) => {
        try {
          if (!fullName) {
            return {
              success: false,
              message: 'Full name is required.',
            };
          }

          const result = await updateFullName(fullName, password);

          if (user) {
            const nextUser = { ...user, name: result.fullName };
            setUser(nextUser);
            await setCachedUser(nextUser);
          }

          return {
            success: true,
            message: result.message,
          };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unable to update your full name right now.',
          };
        }
      }}
    />
  );
}
