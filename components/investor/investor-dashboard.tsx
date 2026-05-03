import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constants/colors";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const portfolioStats = [
  { label: "Total Value", value: "₱48.3M", change: "+12.4%", positive: true },
  { label: "Properties", value: "14", change: "+2 this yr", positive: true },
  { label: "Gross Yield", value: "8.7%", change: "-0.3%", positive: false },
  { label: "Occupancy", value: "91%", change: "+5%", positive: true },
];

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
  Residential: { bg: "#E5F5EC", text: "#006B3D" },
  Commercial: { bg: "#EFF6FF", text: "#1D4ED8" },
  Industrial: { bg: "#FEF9EC", text: "#92400E" },
};

function PropertyCard({ property }: { property: (typeof properties)[0] }) {
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
          name={item.positive ? "arrow-up-outline" : "arrow-down-outline"}
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
    { icon: "add-outline" as const, label: "Add Property" },
    { icon: "bar-chart-outline" as const, label: "Reports" },
    { icon: "document-text-outline" as const, label: "Documents" },
    { icon: "chatbubble-ellipses-outline" as const, label: "Inquiries" },
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

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 18 }]}
        showsVerticalScrollIndicator={false}
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scroll: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 98 },

  heroShell: {
    marginHorizontal: 18,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    overflow: "hidden",
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 24,
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  heroKicker: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(255,255,255,0.76)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  heroTitle: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  heroIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
  },

  heroCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
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

  statsRow: {
    paddingHorizontal: 18,
    gap: 12,
    paddingTop: 18,
    paddingBottom: 4,
    marginBottom: 6,
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    width: 130,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOpacity: 0.04,
    shadowRadius: 10,
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

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  sectionAction: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.accent,
  },

  qaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    gap: 12,
  },
  qaItem: { flex: 1, alignItems: "center" },
  qaIconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
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
  qaLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    textAlign: "center",
    letterSpacing: 0.2,
  },

  propCard: {
    marginHorizontal: 18,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOpacity: 0.05,
    shadowRadius: 12,
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
    fontSize: 17,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  propLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  propLocation: {
    flex: 1,
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "600",
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
    marginHorizontal: 18,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOpacity: 0.04,
    shadowRadius: 10,
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
});
