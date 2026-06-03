import { HomeDashboard } from '@/components/home/home-dashboard';
import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';
import { DashboardProvider } from '@/context/dashboard-context';

export default function HomeScreen() {
  const { user } = useAuth();
  if (!user) {
    return <Redirect href="/" />;
  }

  return (
    <DashboardProvider>
      <HomeDashboard />
    </DashboardProvider>
  )
}
