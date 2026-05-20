import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { HomeDashboard } from '@/components/home/home-dashboard';
import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';

export default function IndexScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#008812" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <HomeDashboard />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});