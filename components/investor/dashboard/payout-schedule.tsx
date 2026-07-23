import type { InvestmentPayout } from '@/types/investor.types';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { PayoutRow } from './payout-row';

export function PayoutSchedule({ payouts }: { payouts: InvestmentPayout[] }) {
  const sorted = useMemo(
    () => [...payouts].sort((a, b) => a.payout_month - b.payout_month),
    [payouts],
  );

  if (!sorted.length) {
    return (
      <Text className="text-textSecondary text-[12px] font-semibold py-2">
        No payout schedule available.
      </Text>
    );
  }

  return (
    <View className="mt-1">
      {sorted.map((payout) => (
        <PayoutRow key={payout.id} payout={payout} />
      ))}
    </View>
  );
}