import { useAppTheme } from '@/context/theme-context';
import { Switch, Text, View } from 'react-native';

type InvestorLockInToggleProps = {
  lockIn: boolean;
  onToggle: (value: boolean) => void;
};

export function InvestorLockInToggle({ lockIn, onToggle }: InvestorLockInToggleProps) {
  const { colors } = useAppTheme();

  return (
    <View className="rounded-[18px] border border-border bg-surface p-4 mb-[18px]">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 min-w-0">
          <Text className="text-textPrimary text-base font-black">3-year lock-in bonus</Text>
          <Text className="mt-1 text-textSecondary text-[14px] leading-[18px] font-semibold">
            Add 10% rate after 3 years when you choose a 3-year lock-in.
          </Text>
        </View>
        <Switch
          value={lockIn}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.accentLight }}
          thumbColor={lockIn ? colors.accent : colors.white}
        />
      </View>
    </View>
  );
}