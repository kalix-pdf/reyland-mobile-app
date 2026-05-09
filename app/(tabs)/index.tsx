import { HomeDashboard } from '@/components/home/home-dashboard';
import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';

export default function HomeScreen() {
  const { user } = useAuth();
  if (!user) {
    return <Redirect href="/" />;
  }

  return <HomeDashboard />;
}
