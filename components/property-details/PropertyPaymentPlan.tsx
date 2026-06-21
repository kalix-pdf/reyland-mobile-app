import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { PropertyBreakdownRow as BreakdownRow, PropertySection as Section } from '@/components/property-details/property-details';
import { formatCurrencyOrFallback } from '@/utils/property-details.utils';

type PropertyPaymentPlanProps = {
  monthlyInstallment: number | null | undefined;
  downPayment: number | null | undefined;
  yearsToPay: number;
};

export function PropertyPaymentPlan({
  monthlyInstallment,
  downPayment,
  yearsToPay,
}: PropertyPaymentPlanProps) {
  const paymentTermLabel =
    yearsToPay > 0 ? `${yearsToPay} year${yearsToPay === 1 ? '' : 's'} to pay` : 'Not specified';

  return (
    <Section title="Payment Plan">
      <View className="overflow-hidden rounded-[22px] bg-surface border border-border">
        <View className="min-h-[96px] flex-row items-center gap-3.5 p-4 bg-primary">
          <View className="w-[46px] h-[46px] rounded-[23px] items-center justify-center bg-textOnDark/[0.14]">
            <Ionicons name="wallet-outline" size={22} color={Colors.textOnDark} />
          </View>
          <View className="flex-1 min-w-0">
            <Text className="text-textOnDark/70 text-xs font-extrabold">
              Estimated monthly installment
            </Text>
            <Text className="mt-[5px] text-textOnDark text-[23px] font-black">
              {formatCurrencyOrFallback(monthlyInstallment)}
            </Text>
          </View>
        </View>

        <View className="px-4">
          <BreakdownRow
            label="Down payment (Installment)"
            value={formatCurrencyOrFallback(downPayment)}
          />
          <BreakdownRow label="Payment term" value={paymentTermLabel} last />
        </View>
      </View>
    </Section>
  );
}
