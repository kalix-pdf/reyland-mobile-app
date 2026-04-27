import { Colors } from "@/constants/color";
import { Tabs } from "expo-router";
import { Text } from "react-native";

const TAB_SCREENS = [
  { name: "index", title: "Home", icon: "🏠" },
  { name: "profile", title: "Profile", icon: "👤" },
];

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: Colors.accent,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarStyle: {
        backgroundColor: Colors.surface,
        borderTopColor: Colors.border,
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
        paddingTop: 6,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
    }}>
      {TAB_SCREENS.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 22, color }}>{icon}</Text>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}