import type { InvestmentPayout } from '@/types/investor.types';
import { daysUntil, formatCompactCurrency, formatDate } from '@/utils/investor.utils';
import { Text, View } from 'react-native';
import { StatusBadge } from './status-badge';

export function PayoutRow({ payout }: { payout: InvestmentPayout }) {
  const isOverdue = payout.status?.toLowerCase() === 'pending' && (daysUntil(payout.due_date) ?? 0) < 0;
  const effectiveStatus = isOverdue ? 'overdue' : payout.status;

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