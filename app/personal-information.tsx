import { PersonalInformationView } from '@/components/profile/personal-information-view';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PersonalInformationScreen() {
  const { user, isLoading } = useAuth();

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

  return <PersonalInformationView user={user} />;
}
