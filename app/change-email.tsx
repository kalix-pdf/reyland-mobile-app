import { ChangePersonalInfoView } from '@/components/profile/change-personal-info-view';
import { useAuth } from '@/context/auth-context';

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
    />
  );
}
