import { Colors } from '@/constants/colors';
import type { investment } from '@/types/investor.types';
import { formatCompactCurrency, formatDate } from '@/utils/investor.utils';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { DetailRow } from './detail-row';
import { PayoutSchedule } from './payout-schedule';
import { StatusBadge } from './status-badge';

export function InvestmentCard({ investment }: { investment: investment }) {
  const [expanded, setExpanded] = useState(false);

  const progress =
    investment.term_months > 0 ? Math.min(investment.payouts_made / investment.term_months, 1) : 0;
  const remaining = Math.max(investment.term_months - investment.payouts_made, 0);
  const isActive = investment.status?.toLowerCase() === 'active';

  return (
    <View className="rounded-[18px] border border-border bg-surfaceMuted p-4 mb-4">
      <Pressable onPress={() => setExpanded((current) => !current)}>
        <View className="flex-row items-start gap-3">
          <View className="w-9 h-9 rounded-[18px] items-center justify-center bg-tag">
            <Ionicons name="trending-up-outline" size={22} color={Colors.accent} />
          </View>
          <View className="flex-1 min-w-0">
            <View className="flex-row justify-between items-center">
              <Text className="text-textPrimary text-base font-black flex-1 mr-2" numberOfLines={1}>
                {investment.investment_ref}
              </Text>
              <StatusBadge status={investment.status} />
            </View>

            <View className="flex-row justify-between mt-2">
              <View>
                <Text className="text-textSecondary text-[11px] font-semibold uppercase">Principal</Text>
                <Text className="text-textPrimary text-[13px] font-black">
                  {formatCompactCurrency(investment.principal_amount)}
                </Text>
              </View>
              <View>
                <Text className="text-textSecondary text-[11px] font-semibold uppercase">
                  Monthly Payout
                </Text>
                <Text className="text-textPrimary text-[13px] font-black">
                  {formatCompactCurrency(investment.monthly_payout_amount)}
                </Text>
              </View>
              <View>
                <Text className="text-textSecondary text-[11px] font-semibold uppercase">ROI</Text>
                <Text className="text-textPrimary text-[13px] font-black">
                  {investment.monthly_roi_percentage}%
                </Text>
              </View>
            </View>

            <View className="mt-3 h-2 rounded-full bg-border overflow-hidden">
              <View className="h-2 bg-accent rounded-full" style={{ width: `${progress * 100}%` }} />
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-textSecondary text-[11px] font-semibold">
                {investment.payouts_made}/{investment.term_months} payouts made
              </Text>
              {isActive && (
                <Text className="text-textSecondary text-[11px] font-semibold">
                  {remaining} left · next {formatDate(investment.next_payout_at)}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-center mt-3 pt-2 border-t border-border/60">
          <Text className="text-accent text-[12px] font-bold mr-1">
            {expanded ? 'Hide details' : 'View details & schedule'}
          </Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={Colors.accent} />
        </View>
      </Pressable>

      {expanded && (
        <View className="mt-3">
          <View className="rounded-[14px] bg-background p-3 mb-3">
            <DetailRow
              label="Annual ROI Rate"
              value={`${(investment.annual_roi_base_rates * 100).toFixed(2)}%`}
            />
            <DetailRow label="Investment Plan Range" value={String(investment.investment_plan_range)} />
            <DetailRow label="Locked" value={investment.locked_investment ? 'Yes' : 'No'} />
            <DetailRow label="Maturity Action" value={investment.maturity_action ?? '—'} />
            <DetailRow label="Invested On" value={formatDate(investment.invested_at)} />
            <DetailRow label="Matures On" value={formatDate(investment.matures_at)} />
            <DetailRow label="Matured On" value={formatDate(investment.matured_at)} />
          </View>

          {investment.contract_file_url ? (
            <Pressable
              onPress={() => Linking.openURL(investment.contract_file_url)}
              className="flex-row items-center justify-center rounded-[14px] border border-border py-2.5 mb-3"
            >
              <Ionicons name="document-text-outline" size={16} color={Colors.accent} />
              <Text className="text-accent text-[12px] font-bold ml-2">View Contract</Text>
            </Pressable>
          ) : null}

          <Text className="text-textPrimary text-[13px] font-black mb-1">
            Payout Schedule ({investment.investment_payouts?.length ?? 0})
          </Text>
          <PayoutSchedule payouts={investment.investment_payouts ?? []} />
        </View>
      )}
    </View>
  );
}