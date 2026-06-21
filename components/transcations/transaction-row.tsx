import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Transaction } from '@/types';

interface TransactionRowProps {
  transaction: Transaction;
}

const STATUS_STYLES: Record<Transaction['status'], { bg: string; text: string }> = {
  completed: { bg: 'bg-green-100', text: 'text-green-700' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
};

const TYPE_LABELS: Record<number, string> = {
  0: 'Purchase',
  1: 'Investment',
};

const PAYMENT_TYPE_LABELS: Record<number, string> = {
  0: 'Full payment',
  1: 'Installment',
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
  const typeLabel = TYPE_LABELS[transaction.type] ?? `Type ${transaction.type}`;
  const payment_type = PAYMENT_TYPE_LABELS[transaction.payment_type] ?? `Payment Type ${transaction.payment_type}`

  return (
    <Pressable
      // onPress={() => router.push(`/transactions/${transaction.id}`)}
      className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 active:bg-gray-50"
    >
      <View className="flex-1 pr-3">
        <Text className="font-medium text-gray-900" numberOfLines={1}>
          Property: {transaction.property.title}
        </Text>
        <Text className="text-gray-500 mt-0.5" numberOfLines={1}>
          {payment_type}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-gray-500">{typeLabel}</Text>
          <Text className="text-gray-400 mx-1">•</Text>
          <Text className="text-gray-500">
            {formatDate(transaction.created_at)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center">
        <View className="items-end mr-2">
          <Text className="text-base font-semibold text-gray-900">
            {formatCurrency(transaction.total_price)}
          </Text>
          <View className={`mt-1 px-2 py-0.5 rounded-full ${statusStyle.bg}`}>
            <Text className={`text-xs font-medium capitalize ${statusStyle.text}`}>
              {transaction.status}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </View>
    </Pressable>
  );
}