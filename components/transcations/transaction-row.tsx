import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { Transaction } from '@/types';

interface TransactionRowProps {
  transaction: Transaction;
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  completed: { bg: 'bg-green-100', text: 'text-green-700' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  overdue: { bg: 'bg-red-100', text: 'text-red-700' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-500' },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const router = useRouter();
  const statusStyle = STATUS_STYLES[transaction.status] ?? STATUS_STYLES.pending;

  return (
    <Pressable
    //   onPress={() => router.push(`/transactions/${transaction.id}`)}
      className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 active:bg-gray-50"
    >
      <View className="flex-1 pr-3">
        <Text className="text-base font-medium text-gray-900" numberOfLines={1}>
          {transaction.property?.title ?? 'Property'}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-sm text-gray-500 capitalize">
            {transaction.type}
          </Text>
          <Text className="text-sm text-gray-400 mx-1">•</Text>
          <Text className="text-sm text-gray-500">
            {formatDate(transaction.created_at)}
          </Text>
        </View>
      </View>

      <View className="items-end">
        <Text className="text-base font-semibold text-gray-900">
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