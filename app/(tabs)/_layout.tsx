import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { Platform, Text, View } from 'react-native';

const TAB_SCREENS = [
  {
    name: 'index',
    title: 'Home',
    icon: 'home-outline',
    activeIcon: 'home',
  },
  {
    name: 'discover',
    title: 'Discover',
    icon: 'telescope-outline',
    activeIcon: 'telescope',
  },
  {
    name: 'investor',
    title: 'Investor',
    icon: 'pulse-outline',
    activeIcon: 'pulse',
  },
  {
    name: 'profile',
    title: 'Profile',
    icon: 'person-circle-outline',
    activeIcon: 'person-circle',
  },
] as const;

export default function TabLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: true,
        freezeOnBlur: true,

        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,

        // tabBarStyle/tabBarItemStyle/tabBarLabelStyle are consumed by the
        // navigator config, not rendered as className-able elements, so
        // they stay as style objects — values now sourced from tailwind.colors.js
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 92 : 78,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
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