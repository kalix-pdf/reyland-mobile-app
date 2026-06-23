import { View, Text, FlatList } from 'react-native';
import type { InstallmentPayment, InstallmentSummary } from '@/types';

interface PaymentRecordsListProps {
  payments: InstallmentPayment[];
  summary?: InstallmentSummary;
}

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

function SummaryCard({ summary }: { summary: InstallmentSummary }) {
  const progress =
    summary.total_price > 0 ? Math.min(summary.total_paid / summary.total_price, 1) : 0;

  return (
    <View className="bg-gray-900 rounded-2xl p-5 mx-4 mt-4">
      <Text className="text-gray-400 uppercase tracking-wide">Total price</Text>
      <Text className="text-white text-2xl font-bold mt-1">
        {formatCurrency(summary.total_price)}
      </Text>

      <View className="h-1.5 bg-gray-700 rounded-full mt-4 overflow-hidden">
        <View
          className="h-1.5 bg-emerald-400 rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </View>

      <View className="flex-row justify-between mt-2">
        <Text className="text-gray-400">
          Paid {formatCurrency(summary.total_paid)}
        </Text>
        <Text className="text-gray-400">
          Balance {formatCurrency(summary.payment_balance)}
        </Text>
      </View>

      <View className="flex-row mt-5 -mx-1">
        <SummaryStat
          label="Initial payment"
          value={formatCurrency(summary.initial_amount_paid)}
        />
        <SummaryStat
          label="Monthly"
          value={
            summary.monthly_installment != null
              ? formatCurrency(summary.monthly_installment)
              : '—'
          }
        />
        <SummaryStat
          label="Years to pay"
          value={summary.years_to_pay != null ? String(summary.years_to_pay) : '—'}
        />
      </View>

      <View className="mt-4 pt-4 border-t border-gray-700">
        <Text className="text-gray-400">Due date</Text>
        <Text className="text-white font-medium mt-0.5">
          {formatDate(summary.due_date)}
        </Text>
      </View>
    </View>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 mx-1">
      <Text className="text-gray-500 text-center text-[14px]">{label}</Text>
      <Text className="text-white font-semibold text-center mt-0.5" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function PaymentRow({ payment }: { payment: InstallmentPayment }) {
  return (
    <View className="flex-row items-start justify-between px-4 py-3 border-b border-gray-100">
      <View className="flex-1 pr-3">
        <Text className="font-medium text-gray-900">{payment.payment_method}</Text>
        <Text className="text-gray-700 mt-0.5">Ref: {payment.reference_no}</Text>
        {!!payment.notes && (
          <Text className="text-gray-400 mt-0.5" numberOfLines={2}>
            {payment.notes}
          </Text>
        )}
        <Text className="text-gray-400 mt-1">
          Recorded by {payment.recorded_by}
        </Text>
      </View>

      <View className="items-end">
        <Text className="text-base font-semibold text-gray-900">
          {formatCurrency(payment.amount_paid)}
        </Text>
        <Text className="text-gray-500 mt-0.5">
          {formatDate(payment.payment_date)}
        </Text>
      </View>
    </View>
  );
}

export function PaymentRecordsList({ payments, summary }: PaymentRecordsListProps) {
  return (
    
      <FlatList
        className="flex-1 bg-white"
        data={payments}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <PaymentRow payment={item} />}
        ListHeaderComponent={
          <>
            {summary && <SummaryCard summary={summary} />}
            <Text className="px-4 pt-5 pb-2 text-gray-900 font-semibold">
              Payment history
            </Text>
          </>
        }
        ListEmptyComponent={
          <View className="px-4 py-10 items-center">
            <Text className="text-gray-400">No payment records yet.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
  );
}