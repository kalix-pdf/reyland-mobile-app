import { PersonalInformationView } from '@/components/profile/personal-information-view';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createProfileScreenStyles } from '../styles/profile.styles';

export default function PersonalInformationScreen() {
  const styles = createProfileScreenStyles(Colors);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!user) return null;

  return <PersonalInformationView user={user} />;
}
