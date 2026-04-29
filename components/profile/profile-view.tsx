import { AppColors } from "@/constants/colors";
import { useAppTheme } from "@/context/theme-context";
import { User } from "@/data/user";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { ReactNode, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ViewProfileProps = {
  user: User;
  onLogout: () => void;
};

type Styles = ReturnType<typeof createStyles>;

type SettingItemProps = {
  styles: Styles;
  colors: AppColors;
  icon: ReactNode;
  label: string;
  value?: string;
  danger?: boolean;
  showArrow?: boolean;
  isLast?: boolean;
  onPress?: () => void;
};

type ToggleItemProps = {
  styles: Styles;
  colors: AppColors;
  icon: ReactNode;
  label: string;
  value: boolean;
  isLast?: boolean;
  onValueChange: (value: boolean) => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SettingItem({
  styles,
  colors,
  icon,
  label,
  value,
  danger = false,
  showArrow = true,
  isLast = false,
  onPress,
}: SettingItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.settingRow, isLast && styles.settingRowLast, pressed && styles.settingRowPressed]}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIconWrap, danger && styles.settingIconWrapDanger]}>{icon}</View>

        <Text style={[styles.settingLabel, danger && styles.dangerText]}>{label}</Text>
      </View>

      <View style={styles.settingRight}>
        {value ? <Text style={styles.settingValue}>{value}</Text> : null}

        {showArrow ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : null}
      </View>
    </Pressable>
  );
}

function ToggleItem({ styles, colors, icon, label, value, isLast = false, onValueChange }: ToggleItemProps) {
  return (
    <View style={[styles.settingRow, isLast && styles.settingRowLast]}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconWrap}>{icon}</View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: colors.border,
          true: colors.accentLight,
        }}
        thumbColor={value ? colors.accent : "#F4F4F5"}
      />
    </View>
  );
}

function StatItem({ styles, value, label }: { styles: Styles; value: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Section({ styles, title, children }: { styles: Styles; title: string; children: ReactNode }) {
  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

export function ViewProfile({ user, onLogout }: ViewProfileProps) {
  const { colors, isDarkMode, toggleDarkMode } = useAppTheme();
  const styles = createStyles(colors);

  const [notifications, setNotifications] = useState(true);

  const initials = getInitials(user.name);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: onLogout,
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "This action is irreversible. Are you sure you want to delete your account?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <View style={styles.heroDecorCircleOne} />
          <View style={styles.heroDecorCircleTwo} />

          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroKicker}>My Account</Text>
              <Text style={styles.heroTitle}>Profile</Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.headerIconButton, pressed && styles.headerIconButtonPressed]}
              onPress={() => Alert.alert("Settings")}
            >
              <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View style={styles.contentPanel}>
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>{initials}</Text>
                )}
              </View>

              <View style={styles.onlineDot} />
            </View>

            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.type}>{user.role === 0 ? 'Buyer' : 'Investor'}</Text>

            <View style={styles.badge}>
              <Ionicons name="checkmark-circle" size={15} color={colors.accent} />
              <Text style={styles.badgeText}>Verified Reyland User</Text>
            </View>

            <View style={styles.statsCard}>
              <StatItem styles={styles} value="12" label="Saved" />
              <View style={styles.statDivider} />
              <StatItem styles={styles} value="4" label="Inquiries" />
              <View style={styles.statDivider} />
              <StatItem styles={styles} value="2" label="Tours" />
            </View>
          </View>

          <Section styles={styles} title="Account">
            <SettingItem
              styles={styles}
              colors={colors}
              icon={<Feather name="user" size={19} color={colors.accent} />}
              label="Edit Profile"
              onPress={() => Alert.alert("Edit Profile")}
            />

            <SettingItem
              styles={styles}
              colors={colors}
              icon={<Feather name="user" size={19} color={colors.accent} />}
              label="Register as Investor!"
              onPress={() => Alert.alert("Investor")}
            />

            <SettingItem
              styles={styles}
              colors={colors}
              icon={<Feather name="lock" size={19} color={colors.accent} />}
              label="Change Password"
              onPress={() => Alert.alert("Change Password")}
            />

            <SettingItem
              styles={styles}
              colors={colors}
              icon={<Feather name="phone" size={19} color={colors.accent} />}
              label="Phone Number"
              value="+63 917 *** ****"
              onPress={() => Alert.alert("Phone Number")}
            />

            <SettingItem
              styles={styles}
              colors={colors}
              icon={<Ionicons name="location-outline" size={20} color={colors.accent} />}
              label="Preferred Location"
              value="Metro Manila"
              onPress={() => Alert.alert("Preferred Location")}
              isLast
            />
          </Section>

          <Section styles={styles} title="Preferences">
            <ToggleItem
              styles={styles}
              colors={colors}
              icon={<Ionicons name="notifications-outline" size={20} color={colors.accent} />}
              label="Push Notifications"
              value={notifications}
              onValueChange={setNotifications}
            />

            <ToggleItem
              styles={styles}
              colors={colors}
              icon={<Ionicons name="moon-outline" size={20} color={colors.accent} />}
              label="Dark Mode"
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              isLast
            />
          </Section>

          <Section styles={styles} title="Support">
            <SettingItem
              styles={styles}
              colors={colors}
              icon={<Ionicons name="help-circle-outline" size={20} color={colors.accent} />}
              label="Help Center"
              onPress={() => Alert.alert("Help Center")}
            />

            <SettingItem
              styles={styles}
              colors={colors}
              icon={<Ionicons name="star-outline" size={20} color={colors.accent} />}
              label="Rate the App"
              onPress={() => Alert.alert("Rate App")}
            />

            <SettingItem
              styles={styles}
              colors={colors}
              icon={<MaterialCommunityIcons name="shield-lock-outline" size={20} color={colors.accent} />}
              label="Privacy Policy"
              onPress={() => Alert.alert("Privacy Policy")}
            />

            <SettingItem
              styles={styles}
              colors={colors}
              icon={<Ionicons name="document-text-outline" size={20} color={colors.accent} />}
              label="Terms of Service"
              onPress={() => Alert.alert("Terms of Service")}
              isLast
            />
          </Section>

          <Section styles={styles} title="Account Actions">
            <SettingItem
              styles={styles}
              colors={colors}
              icon={<Feather name="log-out" size={19} color={colors.error} />}
              label="Log Out"
              onPress={handleLogout}
              danger
              showArrow={false}
            />

            <SettingItem
              styles={styles}
              colors={colors}
              icon={<Feather name="trash-2" size={19} color={colors.error} />}
              label="Delete Account"
              onPress={handleDeleteAccount}
              danger
              showArrow={false}
              isLast
            />
          </Section>

          <Text style={styles.version}>Reyland v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: Colors.background,
    },

    scrollContent: {
      paddingBottom: 28,
    },

    hero: {
      minHeight: 190,
      backgroundColor: Colors.accent,
      paddingHorizontal: 24,
      paddingTop: 24,
      overflow: "hidden",
    },

    heroDecorCircleOne: {
      position: "absolute",
      width: 170,
      height: 170,
      borderRadius: 85,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
      right: -58,
      top: 18,
    },

    heroDecorCircleTwo: {
      position: "absolute",
      width: 220,
      height: 220,
      borderRadius: 110,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
      left: -92,
      bottom: -92,
    },

    heroHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },

    heroKicker: {
      color: "rgba(255,255,255,0.82)",
      fontSize: 14,
      fontWeight: "800",
      marginBottom: 8,
    },

    heroTitle: {
      color: "#FFFFFF",
      fontSize: 32,
      fontWeight: "900",
      letterSpacing: -0.8,
    },

    headerIconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: Colors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: "rgba(255,255,255,0.35)",
    },

    headerIconButtonPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.97 }],
    },

    contentPanel: {
      marginTop: -54,
      backgroundColor: Colors.background,
      borderTopLeftRadius: 34,
      borderTopRightRadius: 34,
      paddingTop: 18,
    },

    profileCard: {
      backgroundColor: Colors.surface,
      marginHorizontal: 20,
      borderRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 18,
      alignItems: "center",
      borderWidth: 1,
      borderColor: Colors.border,
      shadowColor: Colors.primary,
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      elevation: 4,
    },

    avatarWrap: {
      position: "relative",
      marginBottom: 12,
    },

    avatar: {
      width: 82,
      height: 82,
      borderRadius: 41,
      backgroundColor: Colors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: Colors.surface,
      overflow: "hidden",
    },

    avatarImage: {
      width: "100%",
      height: "100%",
      borderRadius: 41,
    },

    avatarText: {
      color: "#FFFFFF",
      fontWeight: "900",
      fontSize: 25,
      letterSpacing: -0.4,
    },

    onlineDot: {
      width: 17,
      height: 17,
      borderRadius: 8.5,
      backgroundColor: Colors.success,
      position: "absolute",
      right: 4,
      bottom: 5,
      borderWidth: 3,
      borderColor: Colors.surface,
    },

    name: {
      fontSize: 22,
      fontWeight: "900",
      color: Colors.textPrimary,
      letterSpacing: -0.4,
    },

    type: {
      fontSize: 15,
      color: Colors.textMuted
    },

    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: Colors.tag,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      marginTop: 12,
    },

    badgeText: {
      color: Colors.tagText,
      fontSize: 12,
      fontWeight: "900",
    },

    statsCard: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.background,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingVertical: 16,
      marginTop: 18,
    },

    statItem: {
      flex: 1,
      alignItems: "center",
    },

    statValue: {
      color: Colors.accent,
      fontSize: 21,
      fontWeight: "900",
    },

    statLabel: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 2,
    },

    statDivider: {
      width: 1,
      height: 32,
      backgroundColor: Colors.border,
    },

    sectionBlock: {
      marginTop: 24,
    },

    sectionTitle: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: "900",
      letterSpacing: 1,
      textTransform: "uppercase",
      paddingHorizontal: 22,
      marginBottom: 10,
    },

    sectionCard: {
      backgroundColor: Colors.surface,
      marginHorizontal: 20,
      borderRadius: 24,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: Colors.border,
      shadowColor: Colors.primary,
      shadowOpacity: 0.04,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      elevation: 2,
    },

    settingRow: {
      minHeight: 62,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },

    settingRowLast: {
      borderBottomWidth: 0,
    },

    settingRowPressed: {
      backgroundColor: Colors.background,
    },

    settingLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 12,
    },

    settingIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 14,
      backgroundColor: Colors.tag,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    settingIconWrapDanger: {
      backgroundColor: Colors.errorBackground,
    },

    settingLabel: {
      color: Colors.textPrimary,
      fontSize: 15,
      fontWeight: "700",
    },

    settingRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    settingValue: {
      color: Colors.textMuted,
      fontSize: 13,
      fontWeight: "700",
    },

    dangerText: {
      color: Colors.error,
      fontWeight: "800",
    },

    version: {
      textAlign: "center",
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 24,
      marginBottom: 8,
    },
  });
