import { INVESTOR_PLANS, InvestorPlan } from '@/constants/investor-plans';
import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type InvestorPlanPickerProps = {
  selectedPlanId: InvestorPlan['id'];
  onSelectPlan: (planId: InvestorPlan['id']) => void;
};

export function InvestorPlanPicker({ selectedPlanId, onSelectPlan }: InvestorPlanPickerProps) {
  const { colors } = useAppTheme();

  return (
    <View className="rounded-[18px] border border-border bg-surfaceMuted p-4 mb-[18px]">
      <View className="flex-row items-center gap-2.5 mb-3">
        <View className="w-8 h-8 rounded-[16px] items-center justify-center bg-tag">
          <Ionicons name="briefcase-outline" size={18} color={colors.accent} />
        </View>
        <View className="flex-1 min-w-0">
          <Text className="text-textPrimary text-base font-black">Investment intent</Text>
          <Text className="mt-0.5 text-textSecondary text-sm font-bold">
            Choose the range to prepare for contract signing.
          </Text>
        </View>
      </View>

      <View className="gap-2.5">
        {INVESTOR_PLANS.map((plan) => {
          const selected = plan.id === selectedPlanId;
          return (
            <Pressable
              key={plan.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onSelectPlan(plan.id)}
              className={`rounded-2xl border p-3 active:opacity-[0.78] ${
                selected ? 'bg-tag border-accent' : 'bg-background border-border'
              }`}
            >
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-1 min-w-0">
                  <Text className="text-textPrimary font-black">{plan.label}</Text>
                  <Text className="mt-0.5 text-textSecondary font-bold">{plan.range}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-accent font-black">{plan.annualRate}%</Text>
                  <Text className="text-textMuted text-[12px] font-extrabold">per annum</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}