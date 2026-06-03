import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';
import { DiscoverScreen } from '../../components/home/discover';
import { ProjectsProvider } from '@/context/project.context';

export default function DiscoverTab() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/" />;
  }

  return (
    <ProjectsProvider>
      <DiscoverScreen />
    </ProjectsProvider>
  );
}
