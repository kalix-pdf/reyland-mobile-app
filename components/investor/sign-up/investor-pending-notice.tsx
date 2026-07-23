import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function InvestorPendingNotice() {
  const { colors } = useAppTheme();

  return (
    <View className="rounded-[20px] border border-border bg-surfaceMuted p-4 mb-[18px]">
      <View className="flex-row items-center gap-2.5 mb-2">
        <Ionicons name="time-outline" size={20} color={colors.accent} />
        <Text className="text-base font-black text-textPrimary">Registration Submitted</Text>
      </View>
      <Text className="leading-[21px] text-textSecondary font-semibold">
        Your request is pending admin approval. Contract signing details will be sent through Gmail after review.
      </Text>
    </View>
  );
}