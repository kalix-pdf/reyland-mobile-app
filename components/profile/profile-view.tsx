import { useAppTheme } from "@/context/theme-context";
import { SettingItemProps, Styles, ToggleItemProps, ViewProfileProps, createStyles } from "@/types/user.types";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { ReactNode, useState } from "react";
import { Alert, Image, Pressable, RefreshControl, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

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

export function ViewProfile({ user, onLogout, onRefresh, refreshing = false, refreshOffset = 0 }: ViewProfileProps) {
  const { colors, isDarkMode, toggleDarkMode } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);

  const [notifications, setNotifications] = useState(true);
  // const navigation = useNavigation();

  const user_type = user.role;
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
        onPress: () => {
          void onLogout();
        },
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
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <ScrollView
        // alwaysBounceVertical={false}
        // bounces={false}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void onRefresh?.()}
            tintColor={colors.accent}
            progressViewOffset={refreshOffset}
          />
        }
      >
        <View style={[styles.hero, { paddingTop: insets.top + 18 }]}>
          <View style={styles.heroDecorCircleOne} />
          <View style={styles.heroDecorCircleTwo} />

          <View style={styles.heroHeader}>
            <View>
              <View style={styles.brandPill}>
                <View style={styles.brandDot} />
                <Text style={styles.brandPillText}>ACCOUNT</Text>
              </View>
              <Text style={styles.heroTitle}>Profile</Text>
              <Text style={styles.heroSubtitle}>
                Manage your account, preferences, and saved activity in one place.
              </Text>
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
            <Text style={styles.type}>{user.role === 0 ? "Buyer" : "Investor"}</Text>
            <Text style={styles.memberSince}>Member since {user.memberSince}</Text>

              <View style={styles.badge}>
                {user_type !== 0 ? (
                  <>
                    <Ionicons name="checkmark-circle" size={15} color={colors.accent} />
                    <Text style={styles.badgeText}>Verified Reyland User</Text>
                  </>
                ) : (
                  <Text style={styles.dangerText}>Waiting for Admin Approval</Text>
                )}
              </View>
          </View>

          {user.role !== 0 && (
            <>
             <View style={styles.statsCard}>
              <StatItem styles={styles} value="12" label="Saved" />
              <View style={styles.statDivider} />
              <StatItem styles={styles} value="4" label="Inquiries" />
              <View style={styles.statDivider} />
              <StatItem styles={styles} value="2" label="Tours" />
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
                label="Affiliate"
                // onPress={() => navigation.navigate("SignUpInvestor")}
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
            </>
          )}
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
