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
          <Stack.Screen name="auth/callback" />
          <Stack.Screen name="login" />
          <Stack.Screen name="sign-up" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="investor-signup" />
          <Stack.Screen name="property/[id]" />
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
