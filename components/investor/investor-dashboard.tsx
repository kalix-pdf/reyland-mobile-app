//read here
//babaguin pa mock data dito par, need ialign sa data/properties at data/user

import React, { useState } from "react";
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const Colors = {
  primary: "#00171C",
  primaryLight: "#06343A",
  primaryDark: "#000D10",
  accent: "#008C4F",
  accentLight: "#4FC47A",
  accentDark: "#006B3D",
  background: "#F4F8F6",
  surface: "#FFFFFF",
  surfaceMuted: "#F0F5F2",
  surfaceDark: "#00171C",
  textPrimary: "#00171C",
  textSecondary: "#3E5F57",
  textMuted: "#7A918A",
  textOnDark: "#FFFFFF",
  border: "#CBD5D1",
  borderDark: "#12383E",
  success: "#008C4F",
  warning: "#F59E0B",
  error: "#DC2626",
  tag: "#E5F5EC",
  tagText: "#006B3D",
  saleBadge: "#ECFDF5",
  saleBadgeText: "#047857",
  white: "#FFFFFF",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const portfolioStats = [
  { label: "Total Value", value: "₱48.3M", change: "+12.4%", positive: true },
  { label: "Properties", value: "14", change: "+2 this yr", positive: true },
  { label: "Gross Yield", value: "8.7%", change: "-0.3%", positive: false },
  { label: "Occupancy", value: "91%", change: "+5%", positive: true },
];


//babaguin pa mock data dito par, need ialign sa data/properties
const properties = [
  {
    id: "1",
    name: "Lakeview Estate",
    location: "Tagaytay, Cavite",
    area: "1,200 sqm",
    value: "₱12.5M",
    status: "For Sale",
    roi: "14.2%",
    type: "Residential",
    acquired: "2021",
    appreciation: "+22%",
  },
  {
    id: "2",
    name: "Greenfield Lot 7B",
    location: "Laguna, Biñan",
    area: "650 sqm",
    value: "₱4.8M",
    status: "Leased",
    roi: "7.8%",
    type: "Commercial",
    acquired: "2022",
    appreciation: "+11%",
  },
  {
    id: "3",
    name: "Ridgepark Industrial",
    location: "Batangas City",
    area: "3,400 sqm",
    value: "₱22.1M",
    status: "For Sale",
    roi: "18.5%",
    type: "Industrial",
    acquired: "2020",
    appreciation: "+34%",
  },
  {
    id: "4",
    name: "Sunrise Cove Plot",
    location: "Nasugbu, Batangas",
    area: "500 sqm",
    value: "₱3.2M",
    status: "Leased",
    roi: "6.1%",
    type: "Residential",
    acquired: "2023",
    appreciation: "+8%",
  },
];

const transactions = [
  { label: "Lease Income — Greenfield 7B", date: "Apr 28", amount: "+₱38,000", positive: true },
  { label: "Property Tax — Ridgepark", date: "Apr 20", amount: "-₱12,400", positive: false },
  { label: "Appraisal Fee — Lakeview", date: "Apr 15", amount: "-₱3,200", positive: false },
  { label: "Lease Income — Sunrise Cove", date: "Apr 10", amount: "+₱22,000", positive: true },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

// function Header() {
//   return (
//     <View style={styles.header}>
//       <View>
//         <Text style={styles.headerName}>Alejandro Cruz</Text>
//       </View>
//       <View style={styles.headerRight}>
//         <View style={styles.notifDot} />
//         <View style={styles.avatar}>
//           <Text style={styles.avatarText}>AC</Text>
//         </View>
//       </View>
//     </View>
//   );
// }

function StatCard({ label, value, change, positive }: typeof portfolioStats[0]) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <View style={[styles.statBadge, positive ? styles.statBadgePos : styles.statBadgeNeg]}>
        <Text style={[styles.statChange, positive ? styles.statChangePos : styles.statChangeNeg]}>
          {change}
        </Text>
      </View>
    </View>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && <TouchableOpacity><Text style={styles.sectionAction}>{action}</Text></TouchableOpacity>}
    </View>
  );
}

const typeColors: Record<string, { bg: string; text: string }> = {
  Residential: { bg: "#E5F5EC", text: "#006B3D" },
  Commercial:  { bg: "#EFF6FF", text: "#1D4ED8" },
  Industrial:  { bg: "#FEF9EC", text: "#92400E" },
};

function PropertyCard({ property }: { property: typeof properties[0] }) {
  const tc = typeColors[property.type] ?? typeColors.Residential;
  const isForSale = property.status === "For Sale";

  return (
    <View style={styles.propCard}>
      {/* Color accent strip */}
      <View style={[styles.propStrip, { backgroundColor: isForSale ? Colors.accent : Colors.warning }]} />

      <View style={styles.propContent}>
        {/* Top row */}
        <View style={styles.propTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.propName} numberOfLines={1}>{property.name}</Text>
            <Text style={styles.propLocation}>📍 {property.location}</Text>
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

function TransactionRow({ item }: { item: typeof transactions[0] }) {
  return (
    <View style={styles.txRow}>
      <View style={[styles.txIcon, item.positive ? styles.txIconPos : styles.txIconNeg]}>
        <Text style={styles.txIconText}>{item.positive ? "↑" : "↓"}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.txLabel} numberOfLines={1}>{item.label}</Text>
        <Text style={styles.txDate}>{item.date}</Text>
      </View>
      <Text style={[styles.txAmount, item.positive ? styles.txPos : styles.txNeg]}>
        {item.amount}
      </Text>
    </View>
  );
}

function QuickActions() {
  const actions = [
    { icon: "＋", label: "Add Property" },
    { icon: "📊", label: "Reports" },
    { icon: "📋", label: "Documents" },
    { icon: "💬", label: "Inquiries" },
  ];
  return (
    <View style={styles.qaRow}>
      {actions.map((a) => (
        <TouchableOpacity key={a.label} style={styles.qaItem} activeOpacity={0.75}>
          <View style={styles.qaIconBox}>
            <Text style={styles.qaIcon}>{a.icon}</Text>
          </View>
          <Text style={styles.qaLabel}>{a.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const tabs = ["Dashboard", "Portfolio", "Market", "Profile"];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Top nav bar */}
      <View style={styles.topBar}>
        <View style={styles.logoMark}>
          <Text style={styles.logoText}>🔺</Text>
        </View>
        <Text style={styles.appTitle}>Reyland Development</Text>
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* <Header /> */}

        {/* Hero summary card */}
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

        {/* Stats row */}
        <ScrollView
          horizontal
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: Colors.white,
    fontWeight: "800",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  appTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  bellIcon: { fontSize: 16 },

  scroll: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingTop: 4 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerGreeting: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  headerName: {
    fontSize: 22,
    color: Colors.textPrimary,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginTop: 2,
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    marginRight: -4,
    marginTop: -12,
    zIndex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: Colors.white, fontWeight: "700", fontSize: 14 },

  // Hero card
  heroCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  heroLeft: { flex: 1 },
  heroLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  heroValue: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  heroBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  heroBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  heroRight: { marginLeft: 16 },
  miniCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryLight,
  },
  miniCircleVal: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: "800",
  },
  miniCircleLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    fontWeight: "600",
    marginTop: -2,
  },

  // Stats
  statsRow: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 4,
    marginBottom: 8,
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    width: 130,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  statBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  statBadgePos: { backgroundColor: Colors.tag },
  statBadgeNeg: { backgroundColor: "#FEF2F2" },
  statChange: { fontSize: 11, fontWeight: "700" },
  statChangePos: { color: Colors.tagText },
  statChangeNeg: { color: Colors.error },

  // Section headers
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionAction: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.accent,
  },

  // Quick actions
  qaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 12,
  },
  qaItem: { flex: 1, alignItems: "center" },
  qaIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  qaIcon: { fontSize: 20 },
  qaLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.textSecondary,
    textAlign: "center",
    letterSpacing: 0.2,
  },

  // Property card
  propCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    overflow: "hidden",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  propStrip: {
    width: 4,
    backgroundColor: Colors.accent,
  },
  propContent: {
    flex: 1,
    padding: 16,
  },
  propTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  propName: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  propLocation: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  saleStatus: { backgroundColor: Colors.tag },
  leaseStatus: { backgroundColor: "#FEF9EC" },
  statusText: { fontSize: 11, fontWeight: "700" },
  saleStatusText: { color: Colors.tagText },
  leaseStatusText: { color: "#92400E" },
  propDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
    opacity: 0.5,
  },
  propMetrics: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  propMetric: { flex: 1, alignItems: "center" },
  metricLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  metricSep: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
  propFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typeBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeBadgeText: { fontSize: 11, fontWeight: "700" },
  acquiredText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: "500",
  },

  // Transactions
  txCard: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 12,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  txIconPos: { backgroundColor: Colors.tag },
  txIconNeg: { backgroundColor: "#FEF2F2" },
  txIconText: { fontSize: 16, fontWeight: "800" },
  txLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  txDate: { fontSize: 11, color: Colors.textMuted, fontWeight: "500" },
  txAmount: { fontSize: 14, fontWeight: "800", letterSpacing: -0.2 },
  txPos: { color: Colors.accent },
  txNeg: { color: Colors.error },
  txDivider: {
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.4,
  },

  // Tab bar
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: 20,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  tabIcon: { fontSize: 20, color: Colors.textMuted, marginBottom: 3 },
  tabIconActive: { color: Colors.accent },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },
  tabLabelActive: { color: Colors.accent },
  tabIndicator: {
    position: "absolute",
    top: -10,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
});