import { Colors } from "@/constants/color";
import { AuthProvider } from "@/context/auth-context";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "../hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: Colors.accent,
      background: Colors.background,
      card: Colors.surface,
      text: Colors.textPrimary,
      border: Colors.border,
      notification: Colors.accent,
    },
  };

  return (
    <AuthProvider>
      <ThemeProvider value={navigationTheme}>
        <Stack
          screenOptions={{
            contentStyle: {
              backgroundColor: Colors.background,
            },
            headerStyle: {
              backgroundColor: Colors.surface,
            },
            headerTintColor: Colors.textPrimary,
            headerTitleStyle: {
              fontWeight: "800",
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen
            name="property/[id]"
            options={{
              title: "Property Detail",
              headerBackTitle: "Back",
            }}
          />
        </Stack>

        <StatusBar style={isDark ? "light" : "dark"} />
      </ThemeProvider>
    </AuthProvider>
  );
}
