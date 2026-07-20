import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Modal, Alert, ActivityIndicator, FlatList, Linking, Pressable, RefreshControl, Text, View } from 'react-native';
import type { investment, InvestmentPayout } from '@/types/investor.types';
import { useInvestments } from '@/hooks/use-investment';
import { HeaderShell, HeaderTitle } from '../header';
import { InvestorPlan, INVESTOR_PLANS } from '@/constants/investor-plans';
import { requestInvestorAccess, InvestorApiError } from '@/services/investor/investor.api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSchedulePicker } from '@/hooks/property_details/useSchedulePicker';
import { DateTimePickerModal } from '../property-details';
import { createVisitDateTimeISO } from '@/utils/property-details.utils';
import { Switch } from 'react-native';

// ---------- Formatting helpers ----------
// NOTE: principal_amount / monthly_payout_amount coming back from the API can be
// unrealistically large (test data) so this formatter scales up to billions
// instead of assuming values stay in the thousands/millions range.
function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

function formatCompactCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) return `₱${(amount / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `₱${(amount / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `₱${(amount / 1_000).toFixed(1)}K`;
  return formatCurrency(amount);
}

function formatDate(dateString: string | null | undefined) {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(dateString: string | null | undefined) {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

// ---------- Status badges ----------

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-700' },
  matured: { bg: 'bg-blue-100', text: 'text-blue-700' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
  paid: { bg: 'bg-green-100', text: 'text-green-700' },
  overdue: { bg: 'bg-red-100', text: 'text-red-700' },
};

function StatusBadge({ status, small }: { status: string; small?: boolean }) {
  const s = STATUS_STYLES[status?.toLowerCase()] ?? STATUS_STYLES.pending;
  return (
    <View className={`px-2 ${small ? 'py-0.5' : 'py-1'} rounded-full ${s.bg}`}>
      <Text className={`${small ? 'text-[10px]' : 'text-[11px]'} font-bold uppercase ${s.text}`}>
        {status}
      </Text>
    </View>
  );
}

// ---------- Portfolio summary ----------

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  subtext?: string;
  accentColor?: string;
}

function StatCard({ icon, label, value, subtext, accentColor = Colors.accent }: StatCardProps) {
  return (
    <View className="flex-1 rounded-[18px] border border-border bg-surfaceMuted p-4">
      <View
        className="w-8 h-8 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: `${accentColor}20` }}
      >
        <Ionicons name={icon} size={16} color={accentColor} />
      </View>
      <Text className="text-textSecondary text-[11px] font-bold uppercase tracking-wide">
        {label}
      </Text>
      <Text className="mt-1 text-textPrimary text-lg font-black" numberOfLines={1}>
        {value}
      </Text>
      {subtext ? (
        <Text className="mt-0.5 text-textSecondary text-[11px] font-semibold">{subtext}</Text>
      ) : null}
    </View>
  );
}

interface PortfolioStats {
  totalPrincipal: number;
  totalMonthlyPayout: number;
  activeCount: number;
  totalPayoutsMade: number;
  totalPayoutsPending: number;
  nextPayout: { amount: number; date: string } | null;
}

function usePortfolioStats(investments: investment[] | undefined): PortfolioStats {
  return useMemo(() => {
    if (!investments?.length) {
      return {
        totalPrincipal: 0,
        totalMonthlyPayout: 0,
        activeCount: 0,
        totalPayoutsMade: 0,
        totalPayoutsPending: 0,
        nextPayout: null,
      };
    }

    const active = investments.filter((inv) => inv.status?.toLowerCase() === 'active');

    const totalPrincipal = active.reduce((sum, inv) => sum + (inv.principal_amount ?? 0), 0);
    const totalMonthlyPayout = active.reduce((sum, inv) => sum + (inv.monthly_payout_amount ?? 0), 0);

    const allPayouts = investments.flatMap((inv) => inv.investment_payouts ?? []);
    const totalPayoutsMade = allPayouts.filter((p) => p.status?.toLowerCase() === 'paid').length;
    const totalPayoutsPending = allPayouts.filter((p) => p.status?.toLowerCase() === 'pending').length;

    const upcoming = active
      .filter((inv) => inv.next_payout_at)
      .sort((a, b) => new Date(a.next_payout_at).getTime() - new Date(b.next_payout_at).getTime());

    const nextPayout = upcoming[0]
      ? { amount: upcoming[0].monthly_payout_amount, date: upcoming[0].next_payout_at }
      : null;

    return {
      totalPrincipal,
      totalMonthlyPayout,
      activeCount: active.length,
      totalPayoutsMade,
      totalPayoutsPending,
      nextPayout,
    };
  }, [investments]);
}

function PortfolioSummary({ stats }: { stats: PortfolioStats }) {
  const nextPayoutDays = stats.nextPayout ? daysUntil(stats.nextPayout.date) : null;

  return (
    <View className="px-4 pt-2 pb-4">
      <View className="rounded-[20px] bg-textPrimary p-5 mb-3">
        <Text className="text-white/60 text-[11px] font-bold uppercase tracking-wide">
          Total Portfolio Value
        </Text>
        <Text className="mt-1 text-white text-3xl font-black">
          ₱{stats.totalPrincipal.toLocaleString()}
        </Text>

        <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-white/10">
          <View>
            <Text className="text-white/60 font-bold uppercase tracking-wide">
              Monthly Income
            </Text>
            <Text className="mt-0.5 text-white text-base font-black">
              ₱{stats.totalMonthlyPayout.toLocaleString()}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-white/60 text-[11px] font-bold uppercase tracking-wide">
              Next Payout
            </Text>
            <Text className="mt-0.5 text-white text-base font-black">
              ₱{stats.nextPayout ? stats.nextPayout.amount.toLocaleString() : '—'}
            </Text>
            {nextPayoutDays !== null && (
              <Text className="text-white/60 font-semibold">
                {nextPayoutDays <= 0 ? 'Due today' : `in ${nextPayoutDays}d`}
              </Text>
            )}
          </View>
        </View>
      </View>

      <View className="flex-row gap-3 mb-3">
        <StatCard
          icon="briefcase-outline"
          label="Active Plans"
          value={String(stats.activeCount)}
          accentColor={Colors.accent}
        />
        <StatCard
          icon="calendar-outline"
          label="Next Payout"
          value={stats.nextPayout ? formatDate(stats.nextPayout.date) : '—'}
          accentColor="#3B82F6"
        />
      </View>

      <View className="flex-row gap-3">
        <StatCard
          icon="checkmark-circle-outline"
          label="Total Payouts Maid"
          value={String(stats.totalPayoutsMade)}
          accentColor="#22C55E"
        />
        <StatCard
          icon="time-outline"
          label="Payouts Pending"
          value={String(stats.totalPayoutsPending) + "months"}
          accentColor="#EAB308"
        />
      </View>
    </View>
  );
}

// ---------- Payout schedule (investment_payouts) ----------

function PayoutRow({ payout }: { payout: InvestmentPayout }) {
  const overdue =
    payout.status?.toLowerCase() === 'pending' && (daysUntil(payout.due_date) ?? 0) < 0;
  const effectiveStatus = overdue ? 'overdue' : payout.status;

  return (
    <View className="flex-row items-center justify-between py-2.5 border-b border-border/60 last:border-b-0">
      <View className="flex-row items-center gap-2">
        <View className="w-6 h-6 rounded-full bg-tag items-center justify-center">
          <Text className="text-textPrimary text-[10px] font-black">{payout.payout_month}</Text>
        </View>
        <View>
          <Text className="text-textPrimary text-[12px] font-bold">
            Due {formatDate(payout.due_date)}
          </Text>
          {payout.paid_date ? (
            <Text className="text-textSecondary text-[11px] font-semibold">
              Paid {formatDate(payout.paid_date)}
            </Text>
          ) : null}
        </View>
      </View>
      <View className="items-end">
        <Text className="text-textPrimary text-[12px] font-black">
          {formatCompactCurrency(payout.paid_amount ?? payout.expected_amount)}
        </Text>
        <StatusBadge status={effectiveStatus} small />
      </View>
    </View>
  );
}

function PayoutSchedule({ payouts }: { payouts: InvestmentPayout[] }) {
  const sorted = useMemo(
    () => [...payouts].sort((a, b) => a.payout_month - b.payout_month),
    [payouts]
  );

  if (!sorted.length) {
    return (
      <Text className="text-textSecondary text-[12px] font-semibold py-2">
        No payout schedule available.
      </Text>
    );
  }

  return (
    <View className="mt-1">
      {sorted.map((p) => (
        <PayoutRow key={p.id} payout={p} />
      ))}
    </View>
  );
}

// ---------- Investment card ----------

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-1.5">
      <Text className="text-textSecondary text-[12px] font-semibold">{label}</Text>
      <Text className="text-textPrimary text-[12px] font-bold text-right flex-1 ml-4" numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function InvestmentCard({ investment }: { investment: investment }) {
  const [expanded, setExpanded] = useState(false);

  const progress =
    investment.term_months > 0
      ? Math.min(investment.payouts_made / investment.term_months, 1)
      : 0;
  const remaining = Math.max(investment.term_months - investment.payouts_made, 0);
  const isActive = investment.status?.toLowerCase() === 'active';

  return (
    <View className="rounded-[18px] border border-border bg-surfaceMuted p-4 mb-4">
      <Pressable onPress={() => setExpanded((e) => !e)}>
        <View className="flex-row items-start gap-3">
          <View className="w-9 h-9 rounded-[18px] items-center justify-center bg-tag">
            <Ionicons name="trending-up-outline" size={22} color={Colors.accent} />
          </View>
          <View className="flex-1 min-w-0">
            <View className="flex-row justify-between items-center">
              <Text className="text-textPrimary text-base font-black flex-1 mr-2" numberOfLines={1}>
                {investment.investment_ref}
              </Text>
              <StatusBadge status={investment.status} />
            </View>

            <View className="flex-row justify-between mt-2">
              <View>
                <Text className="text-textSecondary text-[11px] font-semibold uppercase">
                  Principal
                </Text>
                <Text className="text-textPrimary text-[13px] font-black">
                  {formatCompactCurrency(investment.principal_amount)}
                </Text>
              </View>
              <View>
                <Text className="text-textSecondary text-[11px] font-semibold uppercase">
                  Monthly Payout
                </Text>
                <Text className="text-textPrimary text-[13px] font-black">
                  {formatCompactCurrency(investment.monthly_payout_amount)}
                </Text>
              </View>
              <View>
                <Text className="text-textSecondary text-[11px] font-semibold uppercase">
                  ROI
                </Text>
                <Text className="text-textPrimary text-[13px] font-black">
                  {investment.monthly_roi_percentage}%
                </Text>
              </View>
            </View>

            <View className="mt-3 h-2 rounded-full bg-border overflow-hidden">
              <View className="h-2 bg-accent rounded-full" style={{ width: `${progress * 100}%` }} />
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-textSecondary text-[11px] font-semibold">
                {investment.payouts_made}/{investment.term_months} payouts made
              </Text>
              {isActive && (
                <Text className="text-textSecondary text-[11px] font-semibold">
                  {remaining} left · next {formatDate(investment.next_payout_at)}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-center mt-3 pt-2 border-t border-border/60">
          <Text className="text-accent text-[12px] font-bold mr-1">
            {expanded ? 'Hide details' : 'View details & schedule'}
          </Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={Colors.accent}
          />
        </View>
      </Pressable>

      {expanded && (
        <View className="mt-3">
          <View className="rounded-[14px] bg-background p-3 mb-3">
            <DetailRow label="Annual ROI Rate" value={`${(investment.annual_roi_base_rates * 100).toFixed(2)}%`} />
            <DetailRow label="Investment Plan Range" value={String(investment.investment_plan_range)} />
            <DetailRow label="Locked" value={investment.locked_investment ? 'Yes' : 'No'} />
            <DetailRow label="Maturity Action" value={investment.maturity_action ?? '—'} />
            <DetailRow label="Invested On" value={formatDate(investment.invested_at)} />
            <DetailRow label="Matures On" value={formatDate(investment.matures_at)} />
            <DetailRow label="Matured On" value={formatDate(investment.matured_at)} />
          </View>

          {investment.contract_file_url ? (
            <Pressable
              onPress={() => Linking.openURL(investment.contract_file_url)}
              className="flex-row items-center justify-center rounded-[14px] border border-border py-2.5 mb-3"
            >
              <Ionicons name="document-text-outline" size={16} color={Colors.accent} />
              <Text className="text-accent text-[12px] font-bold ml-2">View Contract</Text>
            </Pressable>
          ) : null}

          <Text className="text-textPrimary text-[13px] font-black mb-1">
            Payout Schedule ({investment.investment_payouts?.length ?? 0})
          </Text>
          <PayoutSchedule payouts={investment.investment_payouts ?? []} />
        </View>
      )}
    </View>
  );
}

// ---------- Dashboard ----------

export function InvestorDashboard() {
  const { investments, loading, refreshing, error, hasMore, loadMore, refresh } = useInvestments();
  const stats = usePortfolioStats(investments);
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitNewInvestment = async (plan: InvestorPlan, is_lock_in: boolean, preferredSigningAt: string) => {
    if (submitting) return;
    try {
      setSubmitting(true);
      await requestInvestorAccess({
        investment_plan_range: plan.code,
        is_lock_in: false,
        preferred_signing_at: preferredSigningAt
      }); 
      setPlanModalVisible(false);
      Alert.alert(
        'Request submitted',
        `Your request for the ${plan.label} plan has been submitted for review.`,
      );
      refresh();
    } catch (error) {
      Alert.alert(
        'Unable to submit request',
        error instanceof InvestorApiError || error instanceof Error
          ? error.message
          : 'Please try again in a moment.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !investments?.length) {
    return (
      <View className="py-10 items-center">
        <ActivityIndicator color={Colors.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="rounded-[18px] border border-border bg-red-100 p-4 mb-4 mx-4">
        <Text className="text-textPrimary text-lg font-black">Something went wrong</Text>
        <Text className="mt-1 text-textSecondary text-[13px] font-semibold">
          Failed to load investments. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <HeaderShell transparent>
        <HeaderTitle title="Investor Dashboard" />
      </HeaderShell>

      <FlatList
        data={investments}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View className="px-4">
            <InvestmentCard investment={item} />
          </View>
        )}
        ListHeaderComponent={<PortfolioSummary stats={stats} />}
        ListFooterComponent={
          <View className="px-4 pb-6 pt-2">
            <Pressable
              onPress={() => setPlanModalVisible(true)}
              className="flex-row items-center justify-center gap-2 rounded-2xl border border-accent py-3.5 active:opacity-75"
            >
              <Ionicons name="add-circle-outline" size={18} color={Colors.accent} />
              <Text className="text-accent text-[13px] font-black">
                Request New Investment
              </Text>
            </Pressable>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.accent} />
        }
        ListEmptyComponent={
          !investments?.length ? (
            <View className="rounded-[18px] border border-border bg-surfaceMuted p-4 mb-4 mx-4">
              <Text className="text-textPrimary text-lg font-black">No investments yet</Text>
            </View>
          ) : null
        }
        onEndReached={hasMore ? loadMore : undefined}
        onEndReachedThreshold={0.4}
      />

      <NewInvestmentPlanModal
        visible={planModalVisible}
        onClose={() => setPlanModalVisible(false)}
        onSubmit={handleSubmitNewInvestment}
        submitting={submitting}
      />
    </SafeAreaView>
  );
}

function NewInvestmentPlanModal({visible, onClose, onSubmit,submitting}: {
  visible: boolean; onClose: () => void; 
  onSubmit: (plan: InvestorPlan, lockIn: boolean, preferredSigningAt: string) => void; submitting: boolean; }) {
  const [selectedId, setSelectedId] = useState(INVESTOR_PLANS[0].id);
  const selectedPlan = INVESTOR_PLANS.find((p) => p.id === selectedId) ?? INVESTOR_PLANS[0];
  const [lockIn, setLockIn] = useState(false);
  const schedulePicker = useSchedulePicker();

  const canSubmit =
    schedulePicker.visitDateLabel.trim().length > 0 &&
    schedulePicker.visitTimeLabel.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const preferredSigningAt = createVisitDateTimeISO(
      schedulePicker.committedDate,
      schedulePicker.committedTime,
    );
    onSubmit(selectedPlan, lockIn, preferredSigningAt);
  };

  return (
    <>
      <Modal visible={visible && !schedulePicker.activePicker} animationType="slide" transparent onRequestClose={onClose}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-[24px] bg-background p-5 pb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-textPrimary text-lg font-black">Choose Investment Plan</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </Pressable>
            </View>

            <View className="gap-2.5 mb-5">
              {INVESTOR_PLANS.map((plan) => {
                const selected = plan.id === selectedId;
                return (
                  <Pressable
                    key={plan.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setSelectedId(plan.id)}
                    className={`rounded-2xl border p-3 active:opacity-[0.78] ${
                      selected ? 'bg-tag border-accent' : 'bg-surfaceMuted border-border'
                    }`}
                  >
                    <View className="flex-row items-center justify-between gap-3">
                      <View className="flex-1 min-w-0">
                        <Text className="text-textPrimary font-black">{plan.label}</Text>
                        <Text className="mt-0.5 text-textSecondary font-bold">{plan.range}</Text>
                      </View>
                      <Text className="text-accent font-black">{plan.annualRate}%</Text>
                    </View>
                  </Pressable>
                );
              })}
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1 min-w-0">
                  <Text className="text-textPrimary text-base font-black">3-year lock-in bonus</Text>
                  <Text className="mt-1 text-textSecondary text-[14px] leading-[18px] font-semibold">
                    Add 10% rate after 3 years
                  </Text>
                </View>
                <Switch
                  value={lockIn}
                  onValueChange={setLockIn}
                  trackColor={{ false: Colors.border, true: Colors.accentLight }}
                  thumbColor={lockIn ? Colors.accent : Colors.white}
                />
              </View>
            </View>

            <Text className="text-textSecondary text-xs font-black mb-2">
              Preferred contract signing
            </Text>
            <View className="flex-row gap-2.5 mb-5">
              <View className="flex-1 gap-[7px]">
                <Pressable
                  onPress={schedulePicker.openDatePicker}
                  className="min-h-[50px] flex-row items-center justify-between gap-2 px-3.5 py-3 rounded-2xl border border-border bg-surfaceMuted active:opacity-[0.78]"
                >
                  <Text
                    className={`flex-1 text-[13px] font-extrabold ${
                      schedulePicker.visitDateLabel ? 'text-textPrimary' : 'text-textMuted'
                    }`}
                    numberOfLines={1}
                  >
                    {schedulePicker.visitDateLabel || 'Select date'}
                  </Text>
                  <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
                </Pressable>
              </View>
              
              <View className="flex-1 gap-[7px]">
                <Pressable
                  onPress={schedulePicker.openTimePicker}
                  className="min-h-[50px] flex-row items-center justify-between gap-2 px-3.5 py-3 rounded-2xl border border-border bg-surfaceMuted active:opacity-[0.78]"
                >
                  <Text
                    className={`flex-1 text-[13px] font-extrabold ${
                      schedulePicker.visitTimeLabel ? 'text-textPrimary' : 'text-textMuted'
                    }`}
                    numberOfLines={1}
                  >
                    {schedulePicker.visitTimeLabel || 'Select time'}
                  </Text>
                  <Ionicons name="time-outline" size={18} color={Colors.textMuted} />
                </Pressable>
              
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={submitting || !canSubmit}
              className={`rounded-2xl py-3.5 items-center ${submitting || !canSubmit ? 'bg-border' : 'bg-accent'}`}
            >
              <Text className="text-white text-[14px] font-black">
                {submitting ? 'Submitting...' : `Request ${selectedPlan.label} Plan`}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        visible={schedulePicker.activePicker}
        draftDate={schedulePicker.draftDate}
        draftTime={schedulePicker.draftTime}
        onChangeDraftDate={schedulePicker.updateDraftDate}
        onChangeDraftTime={schedulePicker.updateDraftTime}
        onConfirm={schedulePicker.confirmPicker}
        onCancel={schedulePicker.cancelPicker}
      />
    </>
  );
}