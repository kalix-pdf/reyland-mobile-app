import { ViewProfile } from '@/components/profile/profile-view';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { useRefreshControl } from '@/hooks/use-refresh-control';
import { getUserInfo } from '@/services/fetchData/user-info.api';
import { ErrorScreen } from '@/components/helper/error-project';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createProfileScreenStyles } from '../../styles/profile.styles';

export default function ProfileScreen() {
  const styles = createProfileScreenStyles(Colors);
  const { user, isLoading, logout, setUser } = useAuth();
  const isLoggingOut = useRef(false);
  const insets = useSafeAreaInsets();
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user && !isLoggingOut.current) {
      router.replace('/login');
    }
  }, [user, isLoading]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut.current) return; // prevent double-tap
    isLoggingOut.current = true;

    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      isLoggingOut.current = false;
    }
  }, [logout]);

  const handleRefresh = useCallback(async () => {
    try {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
  
      errorTimerRef.current = setTimeout(() => {
        setError('Failed to load profile. Pull down to retry.');
      }, 5000);
      
      const refreshedUser = await getUserInfo();

      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
  
      if (refreshedUser.uuid) {
        setUser(refreshedUser);
        setError(null);
      }

    } catch (error) {
      clearTimeout(errorTimerRef.current!);
      errorTimerRef.current = null;
      setError('Failed to load profile. Pull down to retry.');
    }
  }, [setUser]);

  const { refreshing, onRefresh } = useRefreshControl(handleRefresh);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>{isLoggingOut.current ? 'Signing out...' : 'Loading profile...'}</Text>
      </SafeAreaView>
    );
  }

  if (error) return <ErrorScreen message={error} onRetry={() => { setError(null); handleRefresh(); }} />

  if (!user) return null;

  return (
    <ViewProfile
      user={user}
      onLogout={handleLogout}
      onRefresh={onRefresh}
      refreshing={refreshing}
      refreshOffset={insets.top + 28}
    />
  );
}
