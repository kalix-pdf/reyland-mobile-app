import { InvestorPlan } from '@/constants/investor-plans';
import { formatPeso } from '@/utils/investor.utils';
import { View } from 'react-native';
import { CombinedSummaryRow } from './combined-summary-row';

type InvestorSummaryCardProps = {
  plan: InvestorPlan;
  lockIn: boolean;
  estimatedAnnualReturn: number;
};

export function InvestorSummaryCard({ plan, lockIn, estimatedAnnualReturn }: InvestorSummaryCardProps) {
  return (
    <View className="rounded-[18px] bg-primary p-4 mb-[18px]">
      <CombinedSummaryRow label="Selected package" value={plan.range} />
      <CombinedSummaryRow label="Annual rate" value={`${plan.annualRate}% per annum`} />
      {lockIn && <CombinedSummaryRow label="Bonus" value="+ 10% bonus rate after 3 years" />}
      <CombinedSummaryRow label="Lock-in" value={lockIn ? '3 years selected' : 'Not selected'} />
      <CombinedSummaryRow
        label="Estimate from minimum"
        value={`${formatPeso(estimatedAnnualReturn)} / year`}
        last
      />
    </View>
  );
}