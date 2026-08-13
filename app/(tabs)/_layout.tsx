import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_SCREENS = [
  { name: 'index', title: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'discover', title: 'Discover', icon: 'telescope-outline', activeIcon: 'telescope' },
  { name: 'investor', title: 'Affiliate', icon: 'pulse-outline', activeIcon: 'pulse' },
  { name: 'profile', title: 'Profile', icon: 'person-circle-outline', activeIcon: 'person-circle' },
] as const;

export default function TabLayout() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  if (!user) {
    return <Redirect href="/" />;
  }

  // Base content height (icon + label) stays constant across devices.
  const BAR_CONTENT_HEIGHT = Platform.OS === 'ios' ? 60 : 56;
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: true,
        freezeOnBlur: true,

        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,

        tabBarStyle: {
          height: BAR_CONTENT_HEIGHT + bottomInset,
          paddingTop: 10,
          paddingBottom: bottomInset,
          paddingHorizontal: 14,
          backgroundColor: Colors.surface,
          borderTopWidth: 0,
          shadowColor: Colors.primary,
          shadowOpacity: 0.12,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: -8 },
          elevation: 10,
        },
        tabBarItemStyle: {
          borderRadius: 22,
          paddingTop: 2,
        },
        tabBarLabelStyle: {
          marginTop: 4,
        },

        tabBarHideOnKeyboard: true,
      }}
    >
      {TAB_SCREENS.map(({ name, title, icon, activeIcon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, focused }) => (
              <View>
                <Ionicons
                  name={focused ? activeIcon : icon}
                  size={focused ? 24 : 21}
                  color={focused ? Colors.accent : color}
                />
              </View>
            ),
            tabBarLabel: ({ color, focused }) => (
              <Text
                className={`text-[11px] font-bold tracking-[0.1px] ${focused ? 'font-black' : ''}`}
                style={{ color }}
              >
                {title}
              </Text>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}