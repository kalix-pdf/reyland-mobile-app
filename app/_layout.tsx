import "../global.css";
import { AuthProvider } from '@/context/auth-context';
import { AppThemeProvider, useAppTheme } from '@/context/theme-context';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

function RootNavigator() {
  const { colors, isDarkMode } = useAppTheme();

  const navigationTheme = {
    ...DefaultTheme,
    dark: isDarkMode,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemeProvider value={navigationTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)/auth/callback" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/sign-up" />
          <Stack.Screen name="(auth)/forgot-password" />
          <Stack.Screen name="(auth)/reset-password" />
          <Stack.Screen name="about-reyland" options={{ animation: 'simple_push' }} />
          <Stack.Screen name="privacy-policy" options={{ animation: 'simple_push' }} />
          <Stack.Screen name="terms-and-conditions" options={{ animation: 'simple_push' }} />
          <Stack.Screen name="investor-signup" />
          <Stack.Screen name="profile/personal-information" options={{ animation: 'simple_push' }} />
          <Stack.Screen name="profile/change-full-name" options={{ animation: 'simple_push' }} />
          <Stack.Screen name="profile/change-email" options={{ animation: 'simple_push' }} />
          <Stack.Screen name="profile/change-phone" options={{ animation: 'simple_push' }} />
          <Stack.Screen name="profile/change-password" options={{ animation: 'simple_push' }} />
          <Stack.Screen name="affiliate/index" options={{ animation: 'simple_push' }} />
          <Stack.Screen name="transaction/index" options={{ animation: 'simple_push' }} />
          <Stack.Screen name="transaction/[id]/payment-records" options={{ animation: 'simple_push' }} />
          <Stack.Screen name="property/[id]" />
          <Stack.Screen name="project-property/[id]" />
          <Stack.Screen name="search-home-screen/index" />
        </Stack>

        <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor="transparent" translucent />
      </ThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </AppThemeProvider>
  );
}
