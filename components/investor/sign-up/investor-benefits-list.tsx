import { INVESTOR_BENEFITS } from '@/constants/investor-benefits';
import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function InvestorBenefitsList() {
  const { colors } = useAppTheme();

  return (
    <View className="gap-3 py-[18px] border-y border-border mb-[18px]">
      {INVESTOR_BENEFITS.map((benefit) => (
        <View key={benefit} className="flex-row items-start gap-2.5">
          <View className="w-[32px] h-[32px] rounded-[11px] items-center justify-center bg-tag mt-px">
            <Ionicons name="checkmark" size={18} color={colors.accent} />
          </View>
          <Text className="flex-1 leading-[21px] text-textPrimary font-semibold">
            {benefit}
          </Text>
        </View>
      ))}
    </View>
  );
}