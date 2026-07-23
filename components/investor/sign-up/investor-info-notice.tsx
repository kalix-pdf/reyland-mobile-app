import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function InvestorInfoNotice() {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row items-start gap-2.5 rounded-[16px] bg-tag p-3.5 mb-[18px]">
      <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
      <Text className="flex-1 text-tagText text-[12.5px] leading-[18px] font-bold">
        The office visit is for contract signing. The admin will manually record the investment transaction after signing.
      </Text>
    </View>
  );
}