import { useAppTheme } from '@/context/theme-context';
import React, { useMemo } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderNav, HeaderShell, HomeAction } from '@/components/header';
import { createAffiliateStyles } from '@/styles/affiliate.styles';
import { useAffiliateProgram } from '@/hooks/use-affiliate-program';
import { AffiliateDashboard } from '@/components/affiliate/affiliate-dashboard';
import { AffiliateEnrollPanel } from '@/components/affiliate/affiliate-enroll';
import { AffiliateDashboardStats } from '@/types/affiliate.types';

export default function AffiliateProgramScreen() {
  const { status, loading, refreshing, enrolling, error, refresh, retry, enroll } = useAffiliateProgram();
  const { colors } = useAppTheme();
  const styles = createAffiliateStyles(colors);

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
      //waiting for admin approval component
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
            <Text style={styles.secondaryButtonText}>Please come back later</Text>
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
          <AffiliateDashboard stats={dashboardStats} />
        ) : (
          <AffiliateEnrollPanel onEnroll={handleEnroll} enrolling={enrolling} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
