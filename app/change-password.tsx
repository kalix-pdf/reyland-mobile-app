import { ChangePersonalInfoView } from '@/components/profile/change-personal-info-view';

export default function ChangePasswordScreen() {
  return (
    <ChangePersonalInfoView
      title="Change Password"
      currentLabel="Current Password"
      currentValue=""
      currentInput={{ key: 'currentPassword', placeholder: 'Current password', secure: true }}
      inputs={[
        { key: 'password', placeholder: 'New password', secure: true },
        { key: 'confirmPassword', placeholder: 'Confirmed password', secure: true },
      ]}
    />
  );
}
