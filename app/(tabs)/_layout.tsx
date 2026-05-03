import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";

const TAB_SCREENS = [
  {
    name: "index",
    title: "Home",
    icon: "home-outline",
    activeIcon: "home",
  },
  {
    name: "discover",
    title: "Discover",
    icon: "compass-outline",
    activeIcon: "compass",
  },
  {
    name: "investor",
    title: "Investor",
    icon: "business-outline",
    activeIcon: "business",
  },
  {
    name: "profile",
    title: "Profile",
    icon: "person-outline",
    activeIcon: "person",
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

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 92 : 78,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    paddingHorizontal: 14,

    backgroundColor: Colors.surface,
    borderTopWidth: 0,

    shadowColor: Colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: -8,
    },
    elevation: 10,
  },

  tabBarItem: {
    borderRadius: 22,
    paddingTop: 2,
  },

  tabBarLabel: {
    marginTop: 4,
  },

  tabLabelText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.1,
  },

  tabLabelTextActive: {
    fontWeight: "900",
  },
});
