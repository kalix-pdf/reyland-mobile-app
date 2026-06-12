import { useAppTheme } from '@/context/theme-context';
import { useAffiliateProgram } from '@/hooks/use-affiliate-program';
import { AffiliateDashboardStats } from '@/types/affiliate.types';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderNav, HeaderShell, HomeAction } from '@/components/header';
import { createAffiliateStyles } from '@/styles/affiliate.styles';

function formatCurrency(value = 0) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

function StatTile({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();
  const styles = createAffiliateStyles(colors);

  return (
    <View style={styles.statTile}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function EnrollPanel({ onEnroll, enrolling }: { onEnroll: () => void; enrolling: boolean }) {
  const { colors } = useAppTheme();
  const styles = createAffiliateStyles(colors);
  const [agreed, setAgreed] = useState(false);

  return (
    <View style={styles.panel}>
      <View style={styles.iconBadge}>
        <Feather name="users" size={24} color={colors.accent} />
      </View>

      <Text style={styles.title}>Join the Affiliate Program</Text>
      <Text style={styles.subtitle}>
        Refer buyers and investors to Reyland PH and track your rewards from your affiliate dashboard.
      </Text>

      <View style={styles.benefitList}>
        <View style={styles.benefitRow}>
          <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
          <Text style={styles.benefitText}>Get a unique referral code and shareable link.</Text>
        </View>
        <View style={styles.benefitRow}>
          <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
          <Text style={styles.benefitText}>Monitor referrals and reward status in one place.</Text>
        </View>
      </View>

      <Pressable
        onPress={() => setAgreed((current) => !current)}
        style={({ pressed }) => [styles.termsRow, pressed && styles.pressed]}
        hitSlop={8}
      >
        <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
          {agreed ? <Ionicons name="checkmark" size={13} color={colors.white} /> : null}
        </View>
        <Text style={styles.termsText}>
          I agree to the affiliate terms, privacy policy, and referral reward rules.
        </Text>
      </Pressable>

      <Pressable
        onPress={onEnroll}
        disabled={!agreed || enrolling}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && agreed && !enrolling && styles.pressed,
          (!agreed || enrolling) && styles.disabled,
        ]}
      >
        {enrolling ? (
          <ActivityIndicator size="small" color={colors.white} />
        ) : (
          <Text style={styles.primaryButtonText}>Enroll Now</Text>
        )}
      </Pressable>
    </View>
  );
}

function Dashboard({ stats }: { stats: AffiliateDashboardStats }) {
  const { colors } = useAppTheme();
  const styles = createAffiliateStyles(colors);

  return (
    <View style={styles.panel}>
      <View style={styles.dashboardHeader}>
        <View>
          <Text style={styles.eyebrow}>Affiliate Dashboard</Text>
          <Text style={styles.title}>Your referrals</Text>
        </View>
        <View style={styles.activeBadge}>
          <Text style={styles.activeBadgeText}>Active</Text>
        </View>
      </View>

      <View style={styles.referralBox}>
        <Text style={styles.referralLabel}>Referral Code</Text>
        <Text style={styles.referralCode}>{stats.code}</Text>
        <Text style={styles.referralLink} numberOfLines={1}>{stats.referralLink}</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatTile label="Total Referrals" value={String(stats.totalReferrals)} />
        <StatTile label="Pending Rewards" value={formatCurrency(stats.pendingRewards)} />
        <StatTile label="Approved Rewards" value={formatCurrency(stats.approvedRewards)} />
        <StatTile label="Total Earnings" value={formatCurrency(stats.totalEarnings)} />
      </View>
    </View>
  );
}

export function AffiliateProgramView() {
  const { colors } = useAppTheme();
  const styles = createAffiliateStyles(colors);
  const { status, loading, refreshing, enrolling, error, refresh, retry, enroll } = useAffiliateProgram();

  const dashboardStats = useMemo<AffiliateDashboardStats>(() => ({
    code: status?.code || 'REYLAND',
    referralLink: status?.referralLink || 'Your referral link will appear here.',
    totalReferrals: status?.totalReferrals ?? 0,
    pendingRewards: status?.pendingRewards ?? 0,
    approvedRewards: status?.approvedRewards ?? 0,
    totalEarnings: status?.totalEarnings ?? 0,
  }), [status]);

  const handleEnroll = async () => {
    const enrolled = await enroll();
    if (enrolled) {
      Alert.alert('Affiliate Program', 'You are now enrolled in the affiliate program.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered} edges={['top', 'left', 'right', 'bottom']}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Checking affiliate status...</Text>
      </SafeAreaView>
    );
  }

  if (error && !status) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <HeaderShell transparent>
          <HeaderNav title="Affiliate Program" rightAction={<HomeAction />} />
        </HeaderShell>
        <View style={styles.errorPanel}>
          <Text style={styles.errorTitle}>Unable to load affiliate program</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]} onPress={retry}>
            <Text style={styles.secondaryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <HeaderShell transparent>
        <HeaderNav title="Affiliate Program" rightAction={<HomeAction />} />
      </HeaderShell>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => void refresh()} tintColor={colors.accent} />
        }
      >
        {error ? <Text style={styles.inlineError}>{error}</Text> : null}
        {status?.isAffiliate ? (
          <Dashboard stats={dashboardStats} />
        ) : (
          <EnrollPanel onEnroll={handleEnroll} enrolling={enrolling} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

