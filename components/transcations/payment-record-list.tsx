import { Colors } from '@/constants/colors';
import type {
  InstallmentPayment,
  InstallmentSummary,
  Transaction,
  TransactionContract,
} from '@/types';
import {
  STATEMENT_CONFIG,
  StatementConfigEntry,
  TransactionType,
  formatCurrency,
  formatDate,
} from '@/utils/transaction.utils';
import { Ionicons } from '@expo/vector-icons';
import { memo, useCallback, useMemo } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  Text,
  View
} from 'react-native';

interface PaymentRecordsListProps {
  transaction: Transaction | null | undefined;
  payments: InstallmentPayment[];
  summary?: InstallmentSummary;
  contract?: TransactionContract | null;
  /** True while the parent is still fetching `transaction`. Prevents the
   * config fallback from ever rendering an incorrect statement type. */
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

function isKnownTransactionType(type: number | undefined): type is TransactionType {
  return type === 0 || type === 1 || type === 2;
}

// function maskRef(ref: string) {
//   if (!ref) return '—';
//   return ref.length > 8 ? `${ref.slice(0, 4)} •••• ${ref.slice(-4)}` : ref;
// }

// Avoids the previous `formatCurrency(x).replace(/^\D+/, '')` hack, which
// silently breaks if formatCurrency's symbol/format ever changes.
function formatAmountNoSymbol(value: number) {
  return value.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// function StatementSkeleton() {
//   return (
//     <View className="flex-1 items-center justify-center bg-background py-24">
//       <ActivityIndicator size="small" color={Colors.accent} />
//       <Text className="text-textMuted text-xs mt-3">Loading statement…</Text>
//     </View>
//   );
// }

// ---------- Statement header (e-wallet balance-card style, light) ----------
const StatementHeader = memo(function StatementHeader({
  transaction,
  config,
}: {
  transaction: Transaction;
  config: StatementConfigEntry;
}) {
  return (
    <View
      className="mx-4 mt-4 rounded-2xl bg-surface border border-border p-5"
      style={{
        shadowColor: Colors.textPrimary,
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View
            className="h-8 w-8 rounded-full items-center justify-center mr-2"
            style={{ backgroundColor: config.accentSoft }}
          >
            <Ionicons name={config.icon} size={18} color={config.accent} />
          </View>
          <Text className="text-textSecondary text-sm font-semibold uppercase tracking-widest">
            {config.label}
          </Text>
        </View>
        <View
          className="px-2.5 py-1 rounded-full border"
          style={{ backgroundColor: config.accentSoft, borderColor: config.accentBorder }}
        >
          <Text className="text-sm font-semibold capitalize" style={{ color: config.accent }}>
            {transaction.status}
          </Text>
        </View>
      </View>

      <View className="flex-row items-end mt-4">
        <Text className="text-textMuted text-base font-semibold mb-1 mr-1">₱</Text>
        <Text
          className="text-textPrimary text-4xl font-bold"
          style={{ fontVariant: ['tabular-nums'], letterSpacing: -0.5 }}
        >
          {formatAmountNoSymbol(transaction.total_price)}
        </Text>
      </View>

      <View className="flex-row justify-between mt-5 pt-4 border-t border-border">
        <View>
          <Text className="text-textMuted text-[13px] uppercase tracking-wide">Reference No.</Text>
          <Text
            className="text-textSecondary text-sm mt-0.5 font-medium"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {transaction.reference_no}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-textMuted text-[13px] uppercase tracking-wide">Date Issued</Text>
          <Text className="text-sm mt-0.5 font-medium">
            {formatDate(transaction.created_at)}
          </Text>
        </View>
      </View>
    </View>
  );
});

// ---------- Summary panel components ----------
function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 mx-1">
      <Text className="text-textMuted text-center text-[13px] uppercase tracking-wide">
        {label}
      </Text>
      <Text
        className="text-textPrimary font-semibold text-center mt-1"
        numberOfLines={1}
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {value}
      </Text>
    </View>
  );
}

// Balance is only meaningful for a Purchase (installment) transaction — an
// investment or withdrawal record has no running "balance owed" concept.
const InstallmentSummaryPanel = memo(function InstallmentSummaryPanel({
  summary }: { summary: InstallmentSummary; }) {
  const progress =
    summary.total_price > 0 ? Math.min(summary.total_paid / summary.total_price, 1) : 0;

  return (
    <View className="mx-4 mt-3 rounded-2xl bg-surface border border-border p-5">
      <View className="flex-row justify-between items-baseline">
        <Text className="text-textSecondary text-[13px] uppercase tracking-wide font-medium">
          Remaining Balance
        </Text>
        <Text className="text-textPrimary text-lg font-bold" style={{ fontVariant: ['tabular-nums'] }}>
          {formatCurrency(summary.payment_balance)}
        </Text>
      </View>

      <View className="h-2.5 bg-border/40 rounded-full mt-3 overflow-hidden">
        <View className="h-2.5 rounded-full bg-accentDark" style={{ width: `${progress * 100}%` }} />
      </View>
      <View className="flex-row justify-between mt-1.5 mb-4">
        <Text className="text-textSecondary text-[13px]">{formatCurrency(summary.total_paid)} paid</Text>
        <Text className="text-textSecondary text-[13px]">of {formatCurrency(summary.total_price)}</Text>
      </View>

      <View className="flex-row mt-5 -mx-1">
        <SummaryStat label="Initial" value={formatCurrency(summary.initial_amount_paid)} />
        <SummaryStat
          label="Monthly"
          value={summary.monthly_installment != null ? formatCurrency(summary.monthly_installment) : '—'}
        />
        <SummaryStat
          label="Term (yrs)"
          value={summary.years_to_pay != null ? String(summary.years_to_pay) : '—'}
        />
      </View>

      <View className="mt-4 pt-4 flex-row justify-between border-t border-border">
        <Text className="text-textSecondary text-sm">Next due date</Text>
        <Text className="text-textPrimary text-sm font-medium">{formatDate(summary.due_date)}</Text>
      </View>
    </View>
  );
});

const WithdrawalSummaryPanel = memo(function WithdrawalSummaryPanel({
  transaction,
}: {
  transaction: Transaction;
}) {
  return (
    <View className="mx-4 mt-3 rounded-2xl bg-surface border border-border p-5">
      <View className="flex-row -mx-1">
        <SummaryStat label="Amount" value={formatCurrency(transaction.total_price)} />
        <SummaryStat label="Method" value={transaction.payment_method ?? '—'} />
        <SummaryStat label="Status" value={transaction.status} />
      </View>
      <View className="mt-4 pt-4 flex-row justify-between border-t border-border">
        <Text className="text-textSecondary text-xs">Requested on</Text>
        <Text className="text-textPrimary text-xs font-medium">{formatDate(transaction.created_at)}</Text>
      </View>
    </View>
  );
});

// ---------- Contract card ----------
const ContractCard = memo(function ContractCard({ contract }: { contract: TransactionContract }) {
  const canView = Boolean(contract.file_url);

  const handleViewContract = useCallback(async () => {
    if (!contract.file_url) {
      Alert.alert('Contract unavailable', 'The contract link is currently unavailable. Please try again later.');
      return;
    }
    try {
      const supported = await Linking.canOpenURL(contract.file_url);
      if (!supported) {
        Alert.alert('Unable to open contract', 'No app is available to open this link.');
        return;
      }
      await Linking.openURL(contract.file_url);
    } catch {
      Alert.alert('Unable to open contract', 'Please try again in a moment.');
    }
  }, [contract.file_url]);

  return (
    <View className="mx-4 mt-3 rounded-2xl bg-surface border border-border p-4">
      <View className="flex-row items-start">
        <View className="h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
          <Ionicons name="document-text-outline" size={22} color={Colors.accent} />
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold text-textPrimary">Contract</Text>
          <Text className="mt-0.5 text-textSecondary text-xs" numberOfLines={1}>
            {contract.file_name || 'Document available'}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={handleViewContract}
        disabled={!canView}
        accessibilityRole="button"
        accessibilityLabel="View contract"
        className={`mt-4 flex-row items-center justify-center rounded-xl px-4 py-3 ${
          canView ? 'bg-accent active:bg-accentDark' : 'bg-surfaceMuted'
        }`}
      >
        <Ionicons name="open-outline" size={17} color={canView ? Colors.white : Colors.textMuted} />
        <Text className={`ml-2 font-semibold text-sm ${canView ? 'text-white' : 'text-textMuted'}`}>
          View Contract
        </Text>
      </Pressable>
    </View>
  );
});

// ---------- Ledger entry row (self-contained card, no group-wrapper needed) ----------
const LedgerRow = memo(function LedgerRow({ payment, accent, accentSoft,
  entryIcon, sign }: { payment: InstallmentPayment; accent: string;
  accentSoft: string; entryIcon: keyof typeof Ionicons.glyphMap; sign: '+' | '-'; }) {

  return (
    <View className="mx-4 mb-2 flex-row items-center rounded-2xl bg-surface border border-border px-4 py-3.5">
      <View
        className="h-10 w-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: accentSoft }}
      >
        <Ionicons name={entryIcon} size={20} color={accent} />
      </View>

      <View className="flex-1 pr-3">
        <Text className="font-medium text-textPrimary text-[13px]">{payment.payment_method}</Text>
        <Text className="text-textSecondary text-sm mt-0.5" style={{ fontVariant: ['tabular-nums'] }}>
          Ref: {payment.reference_no}
        </Text>
        {!!payment.notes && (
          <Text className="text-textMuted text-xs mt-0.5" numberOfLines={2}>
            {payment.notes}
          </Text>
        )}
        <Text className="text-textMuted text-sm mt-1">Recorded by {payment.recorded_by}</Text>
      </View>

      <View className="items-end">
        <Text className="text-[13px] font-bold" style={{ color: accent, fontVariant: ['tabular-nums'] }}>
          {sign} {formatCurrency(payment.amount_paid)}
        </Text>
        <Text className="text-textSecondary text-sm mt-0.5">{formatDate(payment.payment_date)}</Text>
      </View>
    </View>
  );
});

function EmptyState() {
  return (
    <View className="px-4 py-10 items-center">
      <Ionicons name="receipt-outline" size={28} color={Colors.textMuted} />
      <Text className="text-textMuted text-sm mt-2">No records yet.</Text>
    </View>
  );
}

// ---------- Main component ----------
function PaymentRecordsListImpl({
  transaction,
  payments,
  summary,
  contract,
  loading = false,
  refreshing = false,
  onRefresh,
}: PaymentRecordsListProps) {

  if (loading || !transaction || !isKnownTransactionType(transaction.type)) {
    return (
      <Text className="text-textMuted text-xs mt-3">Loading statement…</Text>
    );
  }

  const config = STATEMENT_CONFIG[transaction.type];

  const showInstallmentSummary = transaction.type === 0 && !!summary;
  const showWithdrawalSummary = transaction.type === 2;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<InstallmentPayment>) => (
      <LedgerRow
        payment={item}
        accent={config.accent}
        accentSoft={config.accentSoft}
        entryIcon={config.entryIcon}
        sign={config.sign}
      />
    ),
    [config],
  );

  const keyExtractor = useCallback((item: InstallmentPayment) => String(item.id), []);

  const listHeader = useMemo(
    () => (
      <>
        <StatementHeader transaction={transaction} config={config} />
        {showInstallmentSummary && <InstallmentSummaryPanel summary={summary!} />}
        {showWithdrawalSummary && <WithdrawalSummaryPanel transaction={transaction} />}
        {contract && <ContractCard contract={contract} />}

        <View className="mx-4 mt-5 mb-1 flex-row items-center justify-between">
          <Text className="text-textPrimary font-semibold text-sm">{config.entryLabel}</Text>
          <Text className="text-textMuted text-xs">
            {payments.length} record{payments.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </>
    ),
    [transaction, config, showInstallmentSummary, showWithdrawalSummary, summary, contract, payments.length],
  );

  return (
    <FlatList
      className="flex-1 bg-background"
      data={payments}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={EmptyState}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />
        ) : undefined
      }
      contentContainerStyle={{ paddingBottom: 24 }}
      initialNumToRender={12}
      maxToRenderPerBatch={12}
      windowSize={7}
      removeClippedSubviews
    />
  );
}

export const PaymentRecordsList = memo(PaymentRecordsListImpl);