import { Colors } from '@/constants/colors';
import type { Transaction } from '@/types';
import {
  PAYMENT_TYPE_LABELS,
  STATUS_STYLES,
  TYPE_CONFIG,
  formatCurrency,
  formatDate,
} from '@/utils/transaction.utils';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type TransactionTypeConfig = (typeof TYPE_CONFIG)[number];
type TransactionStatusStyle = (typeof STATUS_STYLES)[Transaction['status']];

interface TransactionRowProps {
  transaction: Transaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const router = useRouter();
  const viewParams = getTransactionViewParams(transaction);
  const typeConfig = getTransactionTypeConfig(transaction);
  const statusStyle = getTransactionStatusStyle(transaction);

  return (
    <Pressable
      onPress={() => router.push(viewParams)}
      className="mb-3 rounded-[20px] border border-border bg-surface p-4 shadow-sm active:opacity-85"
    >
      <View className="flex-row items-start gap-3">
        <TransactionTypeIcon config={typeConfig} />

        <View className="min-w-0 flex-1">
          <TransactionHeader
            transaction={transaction}
            typeConfig={typeConfig}
            statusStyle={statusStyle}
          />

          <TransactionMeta transaction={transaction} />
        </View>
      </View>
    </Pressable>
  );
}

function TransactionTypeIcon({ config }: { config: TransactionTypeConfig }) {
  return (
    <View className={`h-12 w-12 items-center justify-center rounded-[16px] ${config.iconBg}`}>
      <Ionicons name={config.icon} size={22} color={Colors.accent} />
    </View>
  );
}

function TransactionHeader({
  transaction,
  typeConfig,
  statusStyle,
}: {
  transaction: Transaction;
  typeConfig: TransactionTypeConfig;
  statusStyle: TransactionStatusStyle;
}) {
  return (
    <View className="flex-row items-start justify-between gap-3">
      <View className="min-w-0 flex-1">
        <Text className="text-[16px] font-black text-textPrimary" numberOfLines={1}>
          {getTransactionTitle(transaction)}
        </Text>

        <View className="mt-2 flex-row flex-wrap items-center gap-2">
          <Badge className="bg-tag" textClassName="text-tagText">
            {typeConfig.label}
          </Badge>

          <Badge className={statusStyle.bg} textClassName={statusStyle.text}>
            {transaction.status}
          </Badge>
        </View>
      </View>

      <TransactionAmount transaction={transaction} typeConfig={typeConfig} />
    </View>
  );
}

function TransactionAmount({
  transaction,
  typeConfig,
}: {
  transaction: Transaction;
  typeConfig: TransactionTypeConfig;
}) {
  return (
    <View className="items-end">
      <Text className={`text-[16px] font-black ${typeConfig.amountClass}`}>
        {typeConfig.amountPrefix}
        {formatCurrency(transaction.total_price)}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
    </View>
  );
}

function TransactionMeta({ transaction }: { transaction: Transaction }) {
  const paymentType = getPaymentTypeLabel(transaction);

  return (
    <View className="mt-4 gap-2 border-t border-border pt-3">
      <View className="flex-row items-center justify-between gap-3">
        <MetaItem icon="card-outline" label={paymentType} flexible />
        <MetaItem icon="calendar-outline" label={formatDate(transaction.created_at)} />
      </View>

      {transaction.reference_no ? (
        <Text className="text-[11px] font-semibold text-textMuted" numberOfLines={1}>
          Ref: {transaction.reference_no}
        </Text>
      ) : null}
    </View>
  );
}

function MetaItem({
  icon,
  label,
  flexible = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  flexible?: boolean;
}) {
  return (
    <View className={`${flexible ? 'min-w-0 flex-1' : ''} flex-row items-center gap-1.5`}>
      <Ionicons name={icon} size={14} color={Colors.textMuted} />
      <Text className="text-[12px] font-semibold text-textSecondary" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function Badge({
  className,
  textClassName,
  children,
}: {
  className: string;
  textClassName: string;
  children: string;
}) {
  return (
    <View className={`rounded-full px-2.5 py-1 ${className}`}>
      <Text className={`text-[10px] font-black uppercase ${textClassName}`}>
        {children}
      </Text>
    </View>
  );
}

function getTransactionViewParams(transaction: Transaction) {
  return {
    pathname: '/transaction/[id]/payment-records' as const,
    params: {
      id: String(transaction.id),
      transaction: JSON.stringify(transaction),
    },
  };
}

function getTransactionTypeConfig(transaction: Transaction): TransactionTypeConfig {
  return TYPE_CONFIG[transaction.type] ?? TYPE_CONFIG[0];
}

function getTransactionStatusStyle(transaction: Transaction): TransactionStatusStyle {
  return STATUS_STYLES[transaction.status] ?? STATUS_STYLES.pending;
}

function getPaymentTypeLabel(transaction: Transaction) {
  return PAYMENT_TYPE_LABELS[transaction.payment_type] ?? `Payment Type ${transaction.payment_type}`;
}

function getTransactionTitle(transaction: Transaction) {
  if (transaction.property?.title) return transaction.property.title;

  if (transaction.type === 2) return 'Investment Withdrawal';
  if (transaction.type === 1) return 'Investment Transaction';

  return 'Property Transaction';
}
