import type { Transaction } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { TYPE_CONFIG, STATUS_STYLES, PAYMENT_TYPE_LABELS, formatCurrency, formatDate } from '@/utils/transaction.utils';

interface TransactionRowProps {
  transaction: Transaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const router = useRouter();

  const typeConfig = TYPE_CONFIG[transaction.type] ?? TYPE_CONFIG[0];
  const statusStyle = STATUS_STYLES[transaction.status] ?? STATUS_STYLES.pending;
  const paymentType = PAYMENT_TYPE_LABELS[transaction.payment_type] ?? `Payment Type ${transaction.payment_type}`;
  // console.log(typeConfig, statusStyle, paymentType, transaction);
  const title = transaction.property?.title
    ? transaction.property.title
    : transaction.type === 2
      ? 'Investment Withdrawal'
      : transaction.type === 1
        ? 'Investment Transaction'
        : 'Property unavailable';

  return (
    <Pressable
      onPress={() => router.push(`/transaction/${transaction.id}/payment-records`)}
      className="flex-row items-center justify-between bg-surface border border-border rounded-2xl px-4 py-3 mx-4 mb-3 active:opacity-80"
    >
      <View className="flex-row items-center flex-1 pr-3">
        <View className={`w-11 h-11 rounded-full items-center justify-center mr-3 ${typeConfig.iconBg}`}>
          <Ionicons name={typeConfig.icon} size={20} color={typeConfig.iconColor} />
        </View>

        <View className="flex-1">
          <Text className="font-medium text-textPrimary" numberOfLines={1}>
            {title}
          </Text>
          <View className="flex-row items-center mt-0.5">
            <Text className="text-textSecondary text-xs">{typeConfig.label}</Text>
            <Text className="text-textSecondary text-xs mx-1">•</Text>
            <Text className="text-textSecondary text-xs">{paymentType}</Text>
          </View>
          <Text className="text-textSecondary text-xs mt-0.5">
            {formatDate(transaction.created_at)}
          </Text>
        </View>
      </View>

      <View className="items-end">
        <Text className={`text-base font-semibold ${typeConfig.amountClass}`}>
          {typeConfig.amountPrefix}
          {formatCurrency(transaction.total_price)}
        </Text>
        <View className={`mt-1 px-2 py-0.5 rounded-full ${statusStyle.bg}`}>
          <Text className={`text-xs font-medium capitalize ${statusStyle.text}`}>
            {transaction.status}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}