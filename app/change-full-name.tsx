import { ChangePersonalInfoView } from '@/components/profile/change-personal-info-view';
import { useAuth } from '@/context/auth-context';

export default function ChangeFullNameScreen() {
  const { user } = useAuth();

  return (
    <ChangePersonalInfoView
      title="Change Full Name"
      currentLabel="Current Full Name"
      currentValue={user?.name ?? ''}
      inputs={[{ key: 'fullName', placeholder: 'Full name' }]}
    />
  );
}
