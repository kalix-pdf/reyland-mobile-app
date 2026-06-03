import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';
import { PropertiesScreen } from '../../components/home/properties';
import { PropertiesProvider } from '@/context/properties.context';

export default function DiscoverScreen() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/" />;
  }

  return (
    <PropertiesProvider>
      <PropertiesScreen />
    </PropertiesProvider>
  );
}
