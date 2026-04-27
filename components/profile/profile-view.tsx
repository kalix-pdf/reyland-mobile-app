import SettingsRow from "@/components/settings-row";
import { Colors } from "@/constants/color";
import { User } from "@/data/user";
import React, { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";

export function ViewProfile({ user, onLogout }: {user: User; onLogout: () => void}) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => {onLogout} },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.avatar}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>12</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>4</Text>
              <Text style={styles.statLabel}>Inquiries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>2</Text>
              <Text style={styles.statLabel}>Tours</Text>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="👤"
            label="Edit Profile"
            onPress={() => Alert.alert("Edit Profile")}
          />
          <SettingsRow
            icon="🔑"
            label="Change Password"
            onPress={() => Alert.alert("Change Password")}
          />
          <SettingsRow
            icon="📱"
            label="Phone Number"
            value="+63 917 *** ****"
            onPress={() => Alert.alert("Phone Number")}
          />
          <SettingsRow
            icon="📍"
            label="Preferred Location"
            value="Metro Manila"
            onPress={() => Alert.alert("Preferred Location")}
            showArrow={true}
          />
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <View style={styles.iconWrap}>
                <Text style={{ fontSize: 18 }}>🔔</Text>
              </View>
              <Text style={styles.toggleLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.border, true: Colors.accentLight }}
              thumbColor={notifications ? Colors.accent : "#f4f3f4"}
            />
          </View>
          <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
            <View style={styles.toggleLeft}>
              <View style={styles.iconWrap}>
                <Text style={{ fontSize: 18 }}>🌙</Text>
              </View>
              <Text style={styles.toggleLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: Colors.border, true: Colors.accentLight }}
              thumbColor={darkMode ? Colors.accent : "#f4f3f4"}
            />
          </View>
        </View>

        {/* Support */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="❓"
            label="Help Center"
            onPress={() => Alert.alert("Help Center")}
          />
          <SettingsRow
            icon="⭐"
            label="Rate the App"
            onPress={() => Alert.alert("Rate App")}
          />
          <SettingsRow
            icon="📄"
            label="Privacy Policy"
            onPress={() => Alert.alert("Privacy Policy")}
          />
          <SettingsRow
            icon="📋"
            label="Terms of Service"
            onPress={() => Alert.alert("Terms of Service")}
            showArrow={true}
          />
        </View>

        {/* Danger Zone */}
        <Text style={styles.sectionTitle}>Account Actions</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="🚪"
            label="Log Out"
            onPress={handleLogout}
            danger
            showArrow={false}
          />
          <SettingsRow
            icon="🗑"
            label="Delete Account"
            onPress={() =>
              Alert.alert("Delete Account", "This action is irreversible.", [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive" },
              ])
            }
            danger
            showArrow={false}
          />
        </View>

        <Text style={styles.version}>PropFind v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarWrap: { position: "relative", marginBottom: 12 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#FFF", fontWeight: "800", fontSize: 24 },
  onlineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.success,
    position: "absolute",
    right: 2,
    bottom: 2,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  email: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },
  statsRow: { flexDirection: "row", alignItems: "center" },
  stat: { alignItems: "center", flex: 1 },
  statNum: { fontSize: 20, fontWeight: "800", color: Colors.accent },
  statLabel: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  section: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  toggleLeft: { flexDirection: "row", alignItems: "center" },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.tag,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  toggleLabel: { fontSize: 15, color: Colors.textPrimary, fontWeight: "500" },
  version: {
    textAlign: "center",
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 32,
    marginTop: -8,
  },
});
