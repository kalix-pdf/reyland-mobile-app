import { ChangePersonalInfoView } from '@/components/profile/change-personal-info-view';
import { getPhoneValue } from '@/components/profile/phone-value';
import { useAuth } from '@/context/auth-context';
import { setCachedUser } from '@/services/auth/auth-session';
import { updatePhoneNumber } from '@/services/user/update-phone.api';

export default function ChangePhoneScreen() {
  const { setUser, user } = useAuth();
  const phone = getPhoneValue(user?.phone);
  const hasPhone = Boolean(phone);

  return (
    <ChangePersonalInfoView
      title={hasPhone ? "Change Phone Number" : "Add Phone Number"}
      currentLabel="Current Phone Number"
      currentValue={hasPhone ? phone ?? '' : ''}
      inputs={[
        { key: 'phone', placeholder: 'Phone number', keyboardType: 'phone-pad' },
        { key: 'confirmPhone', placeholder: 'Confirm phone number', keyboardType: 'phone-pad' },
      ]}
      submitLabel={hasPhone ? "Save Phone Number" : "Add Phone Number"}
      loadingLabel="Saving phone number..."
      subtitle="Enter your new phone number and confirm your password before saving."
      onSubmit={async ({ phone, password }) => {
        try {
          if (!phone) {
            return {
              success: false,
              message: 'Phone number is required.',
            };
          }

          const result = await updatePhoneNumber(phone, password);

          if (user) {
            const nextUser = { ...user, phone: result.phone };
            setUser(nextUser);
            await setCachedUser(nextUser);
          }

          return { success: true, message: result.message };

        } catch (error) {
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unable to update your phone number right now.',
          };
        }
      }}
    />
  );
}
