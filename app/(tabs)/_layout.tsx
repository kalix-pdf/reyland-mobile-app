import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";

const TAB_SCREENS = [
  {
    name: "index",
    title: "Home",
    icon: "home-outline",
    activeIcon: "home",
  },
  {
    name: "profile",
    title: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
] as const;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

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
              <Ionicons name={focused ? activeIcon : icon} size={focused ? 24 : 22} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 82 : 68,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 10,
    paddingHorizontal: 12,

    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,

    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: -6,
    },
    elevation: 10,
  },

  tabBarItem: {
    borderRadius: 18,
  },

  tabBarLabel: {
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },
});
