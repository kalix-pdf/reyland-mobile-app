import { Colors } from '@/constants/colors';
import { HeaderShell, HeaderTitle } from '@/components/header';
import type { InvestorPlan } from '@/constants/investor-plans';
import { useInvestments } from '@/hooks/investment/use-investment';
import { usePortfolioStats } from '@/hooks/investment/use-portfolio-stats';
import { useInvestmentWithdrawalRequests } from '@/hooks/investment/use-withdrawal-requests';
import { InvestorApiError, requestInvestorAccess } from '@/services/investor/investor.api';
import { addWithdrawalRequest, WithdrawalRequestApiError } from '@/services/withdrawal-requests/withdrawal-request.api';
import type { WithdrawalRequest } from '@/services/withdrawal-requests/withdrawal-request.api';
import type { investment } from '@/types/investor.types';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InvestmentCard } from './investment-card';
import { NewInvestmentPlanModal } from './new-investment-plan-modal';
import { PortfolioSummary } from './portfolio-summary';
import type { WithdrawalRequestFormPayload } from './request-withdrawal-modal';

export function InvestorDashboard() {
  const { investments, walletBalance, loading, refreshing, error, hasMore, loadMore, refresh } = useInvestments();
  const {
    activeWithdrawalRequests,
    refresh: refreshWithdrawalRequests,
  } = useInvestmentWithdrawalRequests();
  const stats = usePortfolioStats(investments);

  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawalSubmittingId, setWithdrawalSubmittingId] = useState<number | null>(null);

  const handleSubmitNewInvestment = async (
    plan: InvestorPlan,
    isLockIn: boolean,
    preferredSigningAt: string,
  ) => {
    if (submitting) return;

    try {
      setSubmitting(true);
      await requestInvestorAccess({
        investment_plan_range: plan.code,
        is_lock_in: isLockIn,
        preferred_signing_at: preferredSigningAt,
      });

      setPlanModalVisible(false);
      Alert.alert('Request submitted', `Your request for the ${plan.label} plan has been submitted for review.`);
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

  const handleRequestWithdrawal = async (
    investment: investment,
    payload: WithdrawalRequestFormPayload,
  ) => {
    if (withdrawalSubmittingId) return;

    try {
      setWithdrawalSubmittingId(investment.id);
      await addWithdrawalRequest({
        investment_id: investment.id,
        withdrawal_type: payload.withdrawalType,
        requested_amount: payload.requestedAmount,
        payment_method_id: payload.paymentMethodId,
        notes: payload.notes || null,
      });

      Alert.alert('Withdrawal request submitted', 'Your request is now pending review.');
      refresh();
      refreshWithdrawalRequests();
    } catch (error) {
      Alert.alert(
        'Unable to submit withdrawal',
        error instanceof WithdrawalRequestApiError || error instanceof Error
          ? error.message
          : 'Please try again in a moment.',
      );
    } finally {
      setWithdrawalSubmittingId(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <HeaderShell transparent>
        <HeaderTitle title="Affiliate Dashboard" />
      </HeaderShell>

      <DashboardContent
        investments={investments}
        walletBalance={walletBalance}
        loading={loading}
        error={error}
        stats={stats}
        refreshing={refreshing}
        hasMore={hasMore}
        loadMore={loadMore}
        onRefreshDashboard={() => {
          refresh();
          refreshWithdrawalRequests();
        }}
        onRequestNewInvestment={() => setPlanModalVisible(true)}
        onRequestWithdrawal={handleRequestWithdrawal}
        withdrawalSubmittingId={withdrawalSubmittingId}
        withdrawalRequests={activeWithdrawalRequests}
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

type DashboardContentProps = {
  investments: ReturnType<typeof useInvestments>['investments'];
  walletBalance: number;
  loading: boolean;
  error: unknown;
  stats: ReturnType<typeof usePortfolioStats>;
  refreshing: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onRefreshDashboard: () => void;
  onRequestNewInvestment: () => void;
  onRequestWithdrawal: (
    investment: investment,
    payload: WithdrawalRequestFormPayload,
  ) => void;
  withdrawalSubmittingId: number | null;
  withdrawalRequests: WithdrawalRequest[];
};

function DashboardContent({ investments, walletBalance, loading, error, stats, refreshing,
  hasMore, loadMore, onRefreshDashboard, onRequestNewInvestment, onRequestWithdrawal, withdrawalSubmittingId,
  withdrawalRequests }: DashboardContentProps) {
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
    <FlatList
      data={investments}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View className="px-4">
          <InvestmentCard
            investment={item}
            onRequestWithdrawal={onRequestWithdrawal}
            withdrawalSubmitting={withdrawalSubmittingId === item.id}
            activeWithdrawalRequest={withdrawalRequests.find((request) => {
              const investmentId = typeof request.investment_id === 'object'
                ? request.investment_id.id
                : request.investment_id;

              return Number(investmentId) === Number(item.id);
            })}
          />
        </View>
      )}
      ListHeaderComponent={<PortfolioSummary stats={stats} walletBalance={walletBalance} />}
      ListFooterComponent={
        <View className="px-4 pb-6 pt-2">
          <Pressable
            onPress={onRequestNewInvestment}
            className="flex-row items-center justify-center gap-2 rounded-2xl border border-accent py-3.5 active:opacity-75"
          >
            <Ionicons name="add-circle-outline" size={18} color={Colors.accent} />
            <Text className="text-accent text-[13px] font-black">Request New Investment</Text>
          </Pressable>
        </View>
      }
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshDashboard} tintColor={Colors.accent} />}
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
  );
}
