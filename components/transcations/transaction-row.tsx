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

interface TransactionRowProps {
  transaction: Transaction;
}

function getTransactionTitle(transaction: Transaction) {
  if (transaction.property?.title) return transaction.property.title;

  if (transaction.type === 2) return 'Investment Withdrawal';
  if (transaction.type === 1) return 'Investment Transaction';

  return 'Property Transaction';
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const router = useRouter();

  const typeConfig = TYPE_CONFIG[transaction.type] ?? TYPE_CONFIG[0];
  const statusStyle = STATUS_STYLES[transaction.status] ?? STATUS_STYLES.pending;
  const paymentType =
    PAYMENT_TYPE_LABELS[transaction.payment_type] ?? `Payment Type ${transaction.payment_type}`;
  const title = getTransactionTitle(transaction);

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/transaction/[id]/payment-records',
          params: {
            id: String(transaction.id),
            transaction: JSON.stringify(transaction),
          },
        })
      }
      className="mb-3 rounded-[20px] border border-border bg-surface p-4 shadow-sm active:opacity-85"
    >
      <View className="flex-row items-start gap-3">
        <View className={`h-12 w-12 items-center justify-center rounded-[16px] ${typeConfig.iconBg}`}>
          <Ionicons name={typeConfig.icon} size={22} color={Colors.accent} />
        </View>

        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <Text className="text-[16px] font-black text-textPrimary" numberOfLines={1}>
                {title}
              </Text>

              <View className="mt-2 flex-row flex-wrap items-center gap-2">
                <View className="rounded-full bg-tag px-2.5 py-1">
                  <Text className="text-[10px] font-black uppercase text-tagText">
                    {typeConfig.label}
                  </Text>
                </View>

                <View className={`rounded-full px-2.5 py-1 ${statusStyle.bg}`}>
                  <Text className={`text-[10px] font-black uppercase ${statusStyle.text}`}>
                    {transaction.status}
                  </Text>
                </View>
              </View>
            </View>

            <View className="items-end">
              <Text className={`text-[16px] font-black ${typeConfig.amountClass}`}>
                {typeConfig.amountPrefix}
                {formatCurrency(transaction.total_price)}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </View>
          </View>

          <View className="mt-4 gap-2 border-t border-border pt-3">
            <View className="flex-row items-center justify-between gap-3">
              <View className="min-w-0 flex-1 flex-row items-center gap-1.5">
                <Ionicons name="card-outline" size={14} color={Colors.textMuted} />
                <Text className="text-[12px] font-semibold text-textSecondary" numberOfLines={1}>
                  {paymentType}
                </Text>
              </View>

              <View className="flex-row items-center gap-1.5">
                <Ionicons name="calendar-outline" size={14} color={Colors.textMuted} />
                <Text className="text-[12px] font-semibold text-textSecondary">
                  {formatDate(transaction.created_at)}
                </Text>
              </View>
            </View>

            {transaction.reference_no ? (
              <Text className="text-[11px] font-semibold text-textMuted" numberOfLines={1}>
                Ref: {transaction.reference_no}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
