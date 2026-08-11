import { Colors } from '@/constants/colors';
import type {
  InstallmentPayment,
  InstallmentSummary,
  Transaction,
  TransactionContract,
} from '@/types';
import {
  PAYMENT_TYPE_LABELS,
  STATEMENT_CONFIG,
  StatementConfigEntry,
  TransactionType,
  formatCurrency,
  formatDate,
} from '@/utils/transaction.utils';
import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { memo, useCallback } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

interface PaymentRecordsListProps {
  transaction: Transaction | null | undefined;
  payments: InstallmentPayment[];
  summary?: InstallmentSummary;
  contract?: TransactionContract | null;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

function isKnownTransactionType(type: number | undefined): type is TransactionType {
  return type === 0 || type === 1 || type === 2;
}

function formatAmountNoSymbol(value: number) {
  return value.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getTransactionTitle(transaction: Transaction) {
  if (transaction.property?.title) return transaction.property.title;
  if (transaction.type === 1) return 'Investment Transaction';
  if (transaction.type === 2) return 'Investment Withdrawal';
  return 'Property Transaction';
}

function getPaymentTypeLabel(transaction: Transaction) {
  return PAYMENT_TYPE_LABELS[transaction.payment_type] ?? `Payment Type ${transaction.payment_type}`;
}

const StatementHeader = memo(function StatementHeader({
  transaction,
  config,
}: {
  transaction: Transaction;
  config: StatementConfigEntry;
}) {
  return (
    <View className="mx-5 mt-3 overflow-hidden rounded-[24px] bg-primary p-5">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <View className="mb-3 flex-row items-center gap-2">
            <View className="h-9 w-9 items-center justify-center rounded-[14px] bg-textOnDark/10">
              <Ionicons name={config.icon} size={19} color={Colors.textOnDark} />
            </View>
            <Text className="text-[12px] font-black uppercase tracking-[1px] text-textOnDark/60">
              {config.label}
            </Text>
          </View>

          <Text className="text-[18px] font-black leading-6 text-textOnDark" numberOfLines={2}>
            {getTransactionTitle(transaction)}
          </Text>

          <Text className="mt-2 text-[13px] font-semibold text-textOnDark/65">
            {getPaymentTypeLabel(transaction)}
          </Text>
        </View>

        <View className="rounded-full bg-textOnDark/10 px-2.5 py-1">
          <Text className="text-[10px] font-black uppercase text-textOnDark">
            {transaction.status}
          </Text>
        </View>
      </View>

      <View className="mt-5">
        <Text className="text-[12px] font-black uppercase text-textOnDark/55">Amount</Text>
        <View className="mt-1 flex-row items-end">
          <Text className="mr-1 text-[34px] font-black text-textOnDark">₱</Text>
          <Text
            className="text-[34px] font-black text-textOnDark"
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {formatAmountNoSymbol(Number(transaction.total_price ?? 0))}
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row gap-3 border-t border-textOnDark/10 pt-4">
        <HeaderMeta label="Reference" value={transaction.reference_no || 'Not provided'} />
        <HeaderMeta label="Date" value={formatDate(transaction.created_at)} alignEnd />
      </View>
    </View>
  );
});

function HeaderMeta({
  label,
  value,
  alignEnd = false,
}: {
  label: string;
  value: string;
  alignEnd?: boolean;
}) {
  return (
    <View className={`flex-1 ${alignEnd ? 'items-end' : ''}`}>
      <Text className="text-[11px] font-black uppercase text-textOnDark/50">{label}</Text>
      <Text
        className={`mt-1 text-[12px] font-bold text-textOnDark ${alignEnd ? 'text-right' : ''}`}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-[16px] bg-background p-3">
      <Text className="text-[11px] font-black uppercase text-textMuted">{label}</Text>
      <Text className="mt-1 text-[13px] font-black text-textPrimary" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const InstallmentSummaryPanel = memo(function InstallmentSummaryPanel({
  summary,
}: {
  summary: InstallmentSummary;
}) {
  const progress =
    summary.total_price > 0 ? Math.min(summary.total_paid / summary.total_price, 1) : 0;

  return (
    <SectionCard title="Payment Summary" icon="pie-chart-outline">
      <View className="flex-row items-baseline justify-between gap-3">
        <Text className="text-[13px] font-black uppercase text-textSecondary">
          Remaining Balance
        </Text>
        <Text className="text-lg font-black text-textPrimary">
          {formatCurrency(summary.payment_balance)}
        </Text>
      </View>

      <View className="mt-3 h-2.5 overflow-hidden rounded-full bg-border/50">
        <View className="h-2.5 rounded-full bg-accent" style={{ width: `${progress * 100}%` }} />
      </View>

      <View className="mb-4 mt-2 flex-row justify-between">
        <Text className="text-[12px] font-semibold text-textSecondary">
          {formatCurrency(summary.total_paid)} paid
        </Text>
        <Text className="text-[12px] font-semibold text-textSecondary">
          of {formatCurrency(summary.total_price)}
        </Text>
      </View>

      <View className="flex-row gap-2">
        <SummaryStat label="Initial" value={formatCurrency(summary.initial_amount_paid)} />
        <SummaryStat
          label="Monthly"
          value={summary.monthly_installment != null ? formatCurrency(summary.monthly_installment) : '-'}
        />
        <SummaryStat
          label="Term"
          value={summary.years_to_pay != null ? `${summary.years_to_pay} yrs` : '-'}
        />
      </View>

      <DetailLine label="Next due date" value={formatDate(summary.due_date)} />
    </SectionCard>
  );
});

const WithdrawalSummaryPanel = memo(function WithdrawalSummaryPanel({
  transaction,
}: {
  transaction: Transaction;
}) {
  return (
    <SectionCard title="Withdrawal Summary" icon="wallet-outline">
      <View className="flex-row gap-2">
        <SummaryStat label="Amount" value={formatCurrency(transaction.total_price)} />
        <SummaryStat label="Method" value={transaction.payment_method ?? '-'} />
        <SummaryStat label="Status" value={transaction.status} />
      </View>

      <DetailLine label="Requested on" value={formatDate(transaction.created_at)} />
    </SectionCard>
  );
});

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
    <SectionCard title="Contract" icon="document-text-outline">
      <Text className="text-[13px] font-semibold text-textSecondary" numberOfLines={1}>
        {contract.file_name || 'Document available'}
      </Text>

      <Pressable
        onPress={handleViewContract}
        disabled={!canView}
        accessibilityRole="button"
        accessibilityLabel="View contract"
        className={`mt-4 min-h-[46px] flex-row items-center justify-center rounded-[16px] ${
          canView ? 'bg-accent active:opacity-80' : 'bg-surfaceMuted'
        }`}
      >
        <Ionicons name="open-outline" size={17} color={canView ? Colors.white : Colors.textMuted} />
        <Text className={`ml-2 text-[13px] font-black ${canView ? 'text-white' : 'text-textMuted'}`}>
          View Contract
        </Text>
      </Pressable>
    </SectionCard>
  );
});

const LedgerRow = memo(function LedgerRow({
  payment,
  config,
}: {
  payment: InstallmentPayment;
  config: StatementConfigEntry;
}) {
  return (
    <View className="mx-5 mb-3 rounded-[20px] border border-border bg-surface p-4 shadow-sm">
      <View className="flex-row items-start gap-3">
        <View className="h-11 w-11 items-center justify-center rounded-[15px] bg-tag">
          <Ionicons name={config.entryIcon} size={20} color={Colors.accent} />
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <Text className="text-[14px] font-black text-textPrimary" numberOfLines={1}>
                {payment.payment_method}
              </Text>
              <Text className="mt-1 text-[12px] font-semibold text-textSecondary" numberOfLines={1}>
                Ref: {payment.reference_no || 'Not provided'}
              </Text>
            </View>

            <Text className="text-[14px] font-black text-accent">
              {config.sign} {formatCurrency(payment.amount_paid)}
            </Text>
          </View>

          {!!payment.notes && (
            <Text className="mt-2 text-[12px] font-semibold text-textMuted" numberOfLines={2}>
              {payment.notes}
            </Text>
          )}

          <View className="mt-3 flex-row items-center justify-between gap-3 border-t border-border pt-3">
            <Text className="text-[12px] font-semibold text-textMuted" numberOfLines={1}>
              Recorded by {payment.recorded_by || 'Admin'}
            </Text>
            <Text className="text-[12px] font-semibold text-textSecondary">
              {formatDate(payment.payment_date)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: ReactNode;
}) {
  return (
    <View className="mx-5 mt-3 rounded-[20px] border border-border bg-surface p-4 shadow-sm">
      <View className="mb-3 flex-row items-center gap-2">
        <View className="h-9 w-9 items-center justify-center rounded-[13px] bg-tag">
          <Ionicons name={icon} size={18} color={Colors.accent} />
        </View>
        <Text className="text-[15px] font-black text-textPrimary">{title}</Text>
      </View>
      {children}
    </View>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <View className="mt-4 flex-row justify-between border-t border-border pt-4">
      <Text className="text-[13px] font-semibold text-textSecondary">{label}</Text>
      <Text className="text-[13px] font-black text-textPrimary">{value}</Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View className="mx-5 items-center rounded-[20px] border border-dashed border-border bg-surface px-6 py-10">
      <View className="mb-3 h-14 w-14 items-center justify-center rounded-[20px] bg-tag">
        <Ionicons name="receipt-outline" size={26} color={Colors.accent} />
      </View>
      <Text className="text-[15px] font-black text-textPrimary">No records yet</Text>
      <Text className="mt-2 text-center text-[13px] font-semibold text-textMuted">
        Payment or processing records will appear here once available.
      </Text>
    </View>
  );
}

function LoadingStatementState() {
  return (
    <View className="flex-1 items-center justify-center bg-background py-24">
      <Text className="text-xs font-semibold text-textMuted">Loading statement...</Text>
    </View>
  );
}

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
    return <LoadingStatementState />;
  }

  const config = STATEMENT_CONFIG[transaction.type];
  const showInstallmentSummary = transaction.type === 0 && !!summary;
  const showWithdrawalSummary = transaction.type === 2;

  const listHeader = (
    <>
      <StatementHeader transaction={transaction} config={config} />
      {showInstallmentSummary && <InstallmentSummaryPanel summary={summary} />}
      {showWithdrawalSummary && <WithdrawalSummaryPanel transaction={transaction} />}
      {contract && <ContractCard contract={contract} />}

      <View className="mx-5 mb-2 mt-5 flex-row items-center justify-between">
        <Text className="text-[15px] font-black text-textPrimary">{config.entryLabel}</Text>
        <Text className="text-[12px] font-semibold text-textMuted">
          {payments.length} record{payments.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </>
  );

  return (
    <FlatList
      className="flex-1 bg-background"
      data={payments}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }: ListRenderItemInfo<InstallmentPayment>) => (
        <LedgerRow payment={item} config={config} />
      )}
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
