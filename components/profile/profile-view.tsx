import { useAppTheme } from '@/context/theme-context';
import { ViewProfileProps } from '@/types/user.types';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import React, { ReactNode } from 'react';
import { Alert, Image, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderShell, HeaderTitle } from '../header';
import { getInitials } from './get-initials';

// Tiny className joiner, swap for `clsx`/`twMerge` if you already use one
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

type RowProps = {
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

function Row({ colors, icon, label, value, danger = false, showArrow = true, isLast = false, right, onPress }: RowProps) {
  return (
    <Pressable onPress={onPress}
      className={cn('flex-row items-center px-5 py-[15px] gap-3.5', isLast && 
        'border-b-0', 'active:opacity-50')}>
      <View className={cn('w-[34px] h-[34px] rounded-[10px] items-center justify-center', danger 
        && 'bg-errorBackground')}>{icon}</View>

      <Text className={cn('flex-1 text-[15px] font-medium text-textPrimary', danger 
        && 'text-error')}>{label}</Text>

      {right ?? (
        <>
          {value ? <Text className='text-[13px] text-textMuted'>{value}</Text> : null}
          {showArrow && !danger ? <Ionicons name="chevron-forward" size={16} color={colors.textMuted} /> : null}
        </>
      )}
    </Pressable>
  );
}

export function ViewProfile({ user, onLogout, onRefresh, refreshing = false, refreshOffset = 0 }: ViewProfileProps) {
  const { colors } = useAppTheme();

  const initials = getInitials(user.name);
  const isVerified = user.status !== 0;

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => void onLogout() },
    ]);
  };

  return (
    <SafeAreaView className='flex-1 bg-background' edges={['top', 'left', 'right']}>
      {/* Fixed header */}
      <HeaderShell transparent>
        <HeaderTitle title='Account' />
      </HeaderShell>

      <ScrollView
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
        contentContainerClassName='pb-10'
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
        <View className="flex-row items-center gap-3.5 px-5 py-5 mt-2.5">
          {/* Avatar */}
          <View className="w-[75px] h-[75px] rounded-[35px] bg-primary items-center justify-center overflow-hidden">
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} className="w-full h-full" />
            ) : (
              <Text className="text-white font-semibold text-xl">{initials}</Text>
            )}
          </View>

          <Image
            source={require('@/assets/images/logo_transparent_without_text_bg.png')}
            className='absolute w-[440px] h-[440px] -top-[30px] -right-[128px] opacity-[0.12] rotate-1'
            resizeMode="contain"
          />

          {/* Info */}
          <View className="flex-1 gap-0.5">
            <Text className="text-xl font-bold text-textPrimary tracking-[-0.2px]">{user.name}</Text>
            {user.email ? <Text className="text-sm text-textSecondary">{user.email}</Text> : null}
            {user.phone ? <Text className="text-sm text-textSecondary">{user.phone}</Text> : null}

            <View className="flex-row items-center gap-1 mt-1">
              {isVerified ? (
                <>
                  <Ionicons name="checkmark-circle" size={13} color={colors.accent} />
                  <Text className="text-base font-bold">Verified</Text>
                </>
              ) : (
                <Text className="text-base font-bold text-error">Pending Approval</Text>
              )}
            </View>
          </View>
        </View>

        {user.status !== 0 && (
          <>
            <Row
              colors={colors}
              icon={<Feather name="user" size={17} color={colors.accent} />}
              label="Personal Information"
              onPress={() => router.push('/profile/personal-information')}
            />

            <Row
              colors={colors}
              icon={<Feather name="users" size={17} color={colors.accent} />}
              label="Affiliate Program"
              onPress={() => router.push('/affiliate' as Href)}
              isLast
            />

            <Row
              colors={colors}
              icon={<Feather name="users" size={17} color={colors.accent} />}
              label="Transactions"
              onPress={() => router.push('/transaction')}
              isLast
            />

            <Row
              colors={colors}
              icon={<Ionicons name="help-circle-outline" size={18} color={colors.accent} />}
              label="About Reyland PH"
              onPress={() => Alert.alert('About Reyland PH')}
            />

            <Row
              colors={colors}
              icon={<MaterialCommunityIcons name="shield-lock-outline" size={18} color={colors.accent} />}
              label="Privacy Policy"
              onPress={() => Alert.alert('Privacy Policy')}
            />

            <Row
              colors={colors}
              icon={<Ionicons name="document-text-outline" size={18} color={colors.accent} />}
              label="Terms of Service"
              onPress={() => Alert.alert('Terms of Service')}
              isLast
            />

            <Row
              colors={colors}
              icon={<Ionicons name="document-text-outline" size={18} color={colors.accent} />}
              label="Contact Us"
              onPress={() => Alert.alert('Contact Us')}
              isLast
            />

            <Row
              colors={colors}
              icon={<Ionicons name="star-outline" size={18} color={colors.accent} />}
              label="Rate the App"
              onPress={() => Alert.alert('Rate App')}
            />
          </>
        )}

        {/* Account Actions */}
        <Row
          colors={colors}
          icon={<Feather name="log-out" size={17} color={colors.error} />}
          label="Log Out"
          onPress={handleLogout}
          danger
          showArrow={false}
        />

        <Text className='text-center text-textMuted text-xs font-semibold mt-8'>Reyland v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
