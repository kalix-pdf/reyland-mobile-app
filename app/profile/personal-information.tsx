import { PersonalInformationView } from '@/components/profile/personal-information-view';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { useRefreshControl } from '@/hooks/use-refresh-control';
import { setCachedUser } from '@/services/auth/auth-session';
import { getUserInfo } from '@/services/fetchData/user-info.api';
import { router } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PersonalInformationScreen() {
  const { user, setUser, isLoading } = useAuth();

  const refreshUser = useCallback(async () => {
    const latestUser = await getUserInfo();
    const nextUser = {
      ...latestUser,
      accessToken: latestUser.accessToken || user?.accessToken || '',
    };

    setUser(nextUser);
    await setCachedUser(nextUser);
  }, [setUser, user?.accessToken]);

  const { refreshing, onRefresh } = useRefreshControl(refreshUser);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 justify-center items-center gap-3 bg-background'>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text className='text-sm text-textSecondary'>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!user) return null;

  return <PersonalInformationView user={user} refreshing={refreshing} onRefresh={onRefresh} />;
}
