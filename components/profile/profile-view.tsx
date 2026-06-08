import { useAppTheme } from '@/context/theme-context';
import { ViewProfileProps } from '@/types/user.types';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { ReactNode } from 'react';
import { Alert, Image, Pressable, RefreshControl, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createProfileViewStyles } from '../../styles/profile.styles';
import { getInitials } from './get-initials';
import { HeaderShell, HeaderTitle } from '../header';

type RowProps = {
  styles: ReturnType<typeof createProfileViewStyles>;
  colors: ReturnType<typeof useAppTheme>['colors'];
  icon: ReactNode;
  label: string;
  value?: string;
  danger?: boolean;
  showArrow?: boolean;
  isLast?: boolean;
  right?: ReactNode;
  onPress?: () => void;
};

function Row({
  styles,
  colors,
  icon,
  label,
  value,
  danger = false,
  showArrow = true,
  isLast = false,
  right,
  onPress,
}: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, isLast && styles.rowLast, pressed && styles.rowPressed]}
    >
      <View style={[styles.rowIconWrap, danger && styles.rowIconWrapDanger]}>{icon}</View>

      <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>

      {right ?? (
        <>
          {value ? <Text style={styles.rowValue}>{value}</Text> : null}
          {showArrow && !danger ? <Ionicons name="chevron-forward" size={16} color={colors.textMuted} /> : null}
        </>
      )}
    </Pressable>
  );
}

export function ViewProfile({ user, onLogout, onRefresh, refreshing = false, refreshOffset = 0 }: ViewProfileProps) {
  const { colors } = useAppTheme();
  const styles = createProfileViewStyles(colors);

  const initials = getInitials(user.name);
  const isVerified = user.status !== 0;

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => void onLogout() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Fixed header */}
      <HeaderShell transparent>
        <HeaderTitle title='Account' />
      </HeaderShell>

      <ScrollView
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
        {/* Profile strip */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatar}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
          </View>

          <Image
            source={require('@/assets/images/logo_transparent_without_text_bg.png')}
            style={styles.heroBrandMarkPrimary}
            resizeMode="contain"
          />

          {/* Info */}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            {user.email ? <Text style={styles.profileEmail}>{user.email}</Text> : null}
            {user.phone ? <Text style={styles.profilePhone}>{user.phone}</Text> : null}

            <View style={styles.badge}>
              {isVerified ? (
                <>
                  <Ionicons name="checkmark-circle" size={13} color={colors.accent} />
                  <Text style={styles.badgeText}>Verified</Text>
                </>
              ) : (
                <Text style={styles.pendingText}>Pending Approval</Text>
              )}
            </View>
          </View>
        </View>

        {user.status !== 0 && (
          <>
            <Row
              styles={styles}
              colors={colors}
              icon={<Feather name="user" size={17} color={colors.accent} />}
              label="Personal Information"
              onPress={() => router.push('/personal-information')}
            />

            <Row
              styles={styles}
              colors={colors}
              icon={<Feather name="users" size={17} color={colors.accent} />}
              label="Affiliate Program"
              onPress={() => Alert.alert('Affiliate')}
              isLast
            />

            <Row
              styles={styles}
              colors={colors}
              icon={<Ionicons name="help-circle-outline" size={18} color={colors.accent} />}
              label="About Reyland PH"
              onPress={() => Alert.alert('About Reyland PH')}
            />

            <Row
              styles={styles}
              colors={colors}
              icon={<MaterialCommunityIcons name="shield-lock-outline" size={18} color={colors.accent} />}
              label="Privacy Policy"
              onPress={() => Alert.alert('Privacy Policy')}
            />

            <Row
              styles={styles}
              colors={colors}
              icon={<Ionicons name="document-text-outline" size={18} color={colors.accent} />}
              label="Terms of Service"
              onPress={() => Alert.alert('Terms of Service')}
              isLast
            />

            <Row
              styles={styles}
              colors={colors}
              icon={<Ionicons name="document-text-outline" size={18} color={colors.accent} />}
              label="Contact Us"
              onPress={() => Alert.alert('Contact Us')}
              isLast
            />

            <Row
              styles={styles}
              colors={colors}
              icon={<Ionicons name="star-outline" size={18} color={colors.accent} />}
              label="Rate the App"
              onPress={() => Alert.alert('Rate App')}
            />

            {/* Preferences */}
            {/* <Section styles={styles}>
              <ToggleRow
                styles={styles}
                colors={colors}
                icon={<Ionicons name="notifications-outline" size={18} color={colors.accent} />}
                label="Push Notifications"
                value={notifications}
                onValueChange={setNotifications}
              />
              <ToggleRow
                styles={styles}
                colors={colors}
                icon={<Ionicons name="moon-outline" size={18} color={colors.accent} />}
                label="Dark Mode"
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                isLast
              />
            </Section> */}
          </>
        )}

        {/* Account Actions */}
        <Row
          styles={styles}
          colors={colors}
          icon={<Feather name="log-out" size={17} color={colors.error} />}
          label="Log Out"
          onPress={handleLogout}
          danger
          showArrow={false}
        />
        {/* <Row
            styles={styles}
            colors={colors}
            icon={<Feather name="trash-2" size={17} color={colors.error} />}
            label="Delete Account"
            onPress={handleDeleteAccount}
            danger
            showArrow={false}
            isLast
          /> */}

        <Text style={styles.version}>Reyland v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
