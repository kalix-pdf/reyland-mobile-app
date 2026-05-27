import { ChangePersonalInfoView } from '@/components/profile/change-personal-info-view';
import { useAuth } from '@/context/auth-context';

export default function ChangePhoneScreen() {
  const { user } = useAuth();

  return (
    <ChangePersonalInfoView
      title="Change Phone Number"
      currentLabel="Current Phone Number"
      currentValue={user?.phone ?? ''}
      inputs={[
        { key: 'phone', placeholder: 'Phone number', keyboardType: 'phone-pad' },
        { key: 'confirmPhone', placeholder: 'Confirmed phone number', keyboardType: 'phone-pad' },
      ]}
    />
  );
}
