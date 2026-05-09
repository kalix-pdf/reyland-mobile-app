import { useRefreshControl } from '@/hooks/use-refresh-control';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { createInvestorDashboardStyles } from '../../styles/dashboard.styles';

const styles = createInvestorDashboardStyles(Colors);

// ─── Mock Data ────────────────────────────────────────────────────────────────

const portfolioStats = [
  { label: 'Total Value', value: '₱48.3M', change: '+12.4%', positive: true },
  { label: 'Properties', value: '14', change: '+2 this yr', positive: true },
  { label: 'Gross Yield', value: '8.7%', change: '-0.3%', positive: false },
  { label: 'Occupancy', value: '91%', change: '+5%', positive: true },
];

const properties = [
  {
    id: '1',
    name: 'Lakeview Estate',
    location: 'Tagaytay, Cavite',
    area: '1,200 sqm',
    value: '₱12.5M',
    status: 'For Sale',
    roi: '14.2%',
    type: 'Residential',
    acquired: '2021',
    appreciation: '+22%',
  },
  {
    id: '2',
    name: 'Greenfield Lot 7B',
    location: 'Laguna, Biñan',
    area: '650 sqm',
    value: '₱4.8M',
    status: 'Leased',
    roi: '7.8%',
    type: 'Commercial',
    acquired: '2022',
    appreciation: '+11%',
  },
  {
    id: '3',
    name: 'Ridgepark Industrial',
    location: 'Batangas City',
    area: '3,400 sqm',
    value: '₱22.1M',
    status: 'For Sale',
    roi: '18.5%',
    type: 'Industrial',
    acquired: '2020',
    appreciation: '+34%',
  },
  {
    id: '4',
    name: 'Sunrise Cove Plot',
    location: 'Nasugbu, Batangas',
    area: '500 sqm',
    value: '₱3.2M',
    status: 'Leased',
    roi: '6.1%',
    type: 'Residential',
    acquired: '2023',
    appreciation: '+8%',
  },
];

const transactions = [
  { label: 'Lease Income — Greenfield 7B', date: 'Apr 28', amount: '+₱38,000', positive: true },
  { label: 'Property Tax — Ridgepark', date: 'Apr 20', amount: '-₱12,400', positive: false },
  { label: 'Appraisal Fee — Lakeview', date: 'Apr 15', amount: '-₱3,200', positive: false },
  { label: 'Lease Income — Sunrise Cove', date: 'Apr 10', amount: '+₱22,000', positive: true },
];

function StatCard({ label, value, change, positive }: (typeof portfolioStats)[0]) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <View style={[styles.statBadge, positive ? styles.statBadgePos : styles.statBadgeNeg]}>
        <Text style={[styles.statChange, positive ? styles.statChangePos : styles.statChangeNeg]}>{change}</Text>
      </View>
    </View>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const typeColors: Record<string, { bg: string; text: string }> = {
  Residential: { bg: '#E5F5EC', text: '#006B3D' },
  Commercial: { bg: '#EFF6FF', text: '#1D4ED8' },
  Industrial: { bg: '#FEF9EC', text: '#92400E' },
};

function PropertyCard({ property }: { property: (typeof properties)[0] }) {
  const tc = typeColors[property.type] ?? typeColors.Residential;
  const isForSale = property.status === 'For Sale';

  return (
    <View style={styles.propCard}>
      {/* Color accent strip */}
      <View style={[styles.propStrip, { backgroundColor: isForSale ? Colors.accent : Colors.warning }]} />

      <View style={styles.propContent}>
        {/* Top row */}
        <View style={styles.propTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.propName} numberOfLines={1}>
              {property.name}
            </Text>
            <View style={styles.propLocationRow}>
              <Ionicons name="location-outline" size={14} color={Colors.accent} />
              <Text style={styles.propLocation}>{property.location}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, isForSale ? styles.saleStatus : styles.leaseStatus]}>
            <Text style={[styles.statusText, isForSale ? styles.saleStatusText : styles.leaseStatusText]}>
              {property.status}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.propDivider} />

        {/* Metrics row */}
        <View style={styles.propMetrics}>
          <View style={styles.propMetric}>
            <Text style={styles.metricLabel}>Value</Text>
            <Text style={styles.metricValue}>{property.value}</Text>
          </View>
          <View style={styles.metricSep} />
          <View style={styles.propMetric}>
            <Text style={styles.metricLabel}>Area</Text>
            <Text style={styles.metricValue}>{property.area}</Text>
          </View>
          <View style={styles.metricSep} />
          <View style={styles.propMetric}>
            <Text style={styles.metricLabel}>ROI</Text>
            <Text style={[styles.metricValue, { color: Colors.accent }]}>{property.roi}</Text>
          </View>
          <View style={styles.metricSep} />
          <View style={styles.propMetric}>
            <Text style={styles.metricLabel}>+Growth</Text>
            <Text style={[styles.metricValue, { color: Colors.accent }]}>{property.appreciation}</Text>
          </View>
        </View>

        {/* Footer row */}
        <View style={styles.propFooter}>
          <View style={[styles.typeBadge, { backgroundColor: tc.bg }]}>
            <Text style={[styles.typeBadgeText, { color: tc.text }]}>{property.type}</Text>
          </View>
          <Text style={styles.acquiredText}>Acquired {property.acquired}</Text>
        </View>
      </View>
    </View>
  );
}

function TransactionRow({ item }: { item: (typeof transactions)[0] }) {
  return (
    <View style={styles.txRow}>
      <View style={[styles.txIcon, item.positive ? styles.txIconPos : styles.txIconNeg]}>
        <Ionicons
          name={item.positive ? 'arrow-up-outline' : 'arrow-down-outline'}
          size={16}
          color={item.positive ? Colors.tagText : Colors.error}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.txLabel} numberOfLines={1}>
          {item.label}
        </Text>
        <Text style={styles.txDate}>{item.date}</Text>
      </View>
      <Text style={[styles.txAmount, item.positive ? styles.txPos : styles.txNeg]}>{item.amount}</Text>
    </View>
  );
}

function QuickActions() {
  const actions = [
    { icon: 'add-outline' as const, label: 'Add Property' },
    { icon: 'bar-chart-outline' as const, label: 'Reports' },
    { icon: 'document-text-outline' as const, label: 'Documents' },
    { icon: 'chatbubble-ellipses-outline' as const, label: 'Inquiries' },
  ];
  return (
    <View style={styles.qaRow}>
      {actions.map((a) => (
        <TouchableOpacity key={a.label} style={styles.qaItem} activeOpacity={0.75}>
          <View style={styles.qaIconBox}>
            <Ionicons name={a.icon} size={22} color={Colors.accent} />
          </View>
          <Text style={styles.qaLabel}>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function InvestorDashboard() {
  const insets = useSafeAreaInsets();
  const { refreshing, onRefresh } = useRefreshControl();

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <ScrollView
        // alwaysBounceVertical={false}
        // bounces={false}
        contentInsetAdjustmentBehavior="never"
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 18 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
            progressViewOffset={insets.top + 28}
          />
        }
      >
        <View style={styles.heroShell}>
          <View style={styles.heroDecorCircleOne} />
          <View style={styles.heroDecorCircleTwo} />

          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroKicker}>Investor Center</Text>
              <Text style={styles.heroTitle}>Portfolio Overview</Text>
            </View>

            <View style={styles.heroIconButton}>
              <Ionicons name="analytics-outline" size={22} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroLabel}>Total Portfolio Value</Text>
              <Text style={styles.heroValue}>₱48,300,000</Text>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>▲ 12.4% this year</Text>
              </View>
            </View>
            <View style={styles.heroRight}>
              <View style={styles.miniCircle}>
                <Text style={styles.miniCircleVal}>14</Text>
                <Text style={styles.miniCircleLabel}>Lots</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats row */}
        <ScrollView
          horizontal
          contentInsetAdjustmentBehavior="never"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsRow}
        >
          {portfolioStats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </ScrollView>

        {/* Quick actions */}
        <SectionHeader title="Quick Actions" />
        <QuickActions />

        {/* Properties */}
        <SectionHeader title="My Properties" action="See All" />
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}

        {/* Recent transactions */}
        <SectionHeader title="Recent Transactions" action="History" />
        <View style={styles.txCard}>
          {transactions.map((t, i) => (
            <React.Fragment key={t.label}>
              <TransactionRow item={t} />
              {i < transactions.length - 1 && <View style={styles.txDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Bottom padding */}
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
