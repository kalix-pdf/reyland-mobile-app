import { useAppTheme } from '@/context/theme-context';
import { AffiliateDashboardStats } from '@/types/affiliate.types';
import React from 'react';
import { Text, View } from 'react-native';
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

export function AffiliateDashboard({ stats }: {stats: AffiliateDashboardStats}) {
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

