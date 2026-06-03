import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { createTabLayoutStyles } from '../../styles/navigation.styles';

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
  const styles = createTabLayoutStyles(Colors);
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

        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,

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
              <Text style={[styles.tabLabelText, { color }, focused && styles.tabLabelTextActive]}>{title}</Text>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}