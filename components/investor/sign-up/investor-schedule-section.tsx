import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

type InvestorScheduleSectionProps = {
  visitDateLabel: string;
  visitTimeLabel: string;
  onPressDate: () => void;
  onPressTime: () => void;
};

export function InvestorScheduleSection({
  visitDateLabel,
  visitTimeLabel,
  onPressDate,
  onPressTime,
}: InvestorScheduleSectionProps) {
  const { colors } = useAppTheme();

  return (
    <View className="rounded-[18px] border border-border bg-surfaceMuted p-4 mb-[18px]">
      <View className="flex-row items-center gap-2.5 mb-3">
        <View className="w-8 h-8 rounded-[16px] items-center justify-center bg-tag">
          <Ionicons name="calendar-outline" size={16} color={colors.accent} />
        </View>
        <View className="flex-1 min-w-0">
          <Text className="text-textPrimary text-base font-black">Preferred contract signing</Text>
        </View>
      </View>

      <View className="flex-row gap-2.5">
        <View className="flex-1 gap-[7px]">
          <Text className="text-textSecondary text-xs font-black">Visit date</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Select contract signing date"
            onPress={onPressDate}
            className="min-h-[50px] flex-row items-center justify-between gap-2 px-3.5 py-3 rounded-2xl border border-border bg-background active:opacity-[0.78]"
          >
            <Text
              className={`flex-1 text-[13px] font-extrabold ${
                visitDateLabel ? 'text-textPrimary' : 'text-textMuted'
              }`}
              numberOfLines={1}
            >
              {visitDateLabel || 'Select date'}
            </Text>
            <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
          </Pressable>
        </View>

        <View className="flex-1 gap-[7px]">
          <Text className="text-textSecondary text-xs font-black">Visit time</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Select contract signing time"
            onPress={onPressTime}
            className="min-h-[50px] flex-row items-center justify-between gap-2 px-3.5 py-3 rounded-2xl border border-border bg-background active:opacity-[0.78]"
          >
            <Text
              className={`flex-1 text-[13px] font-extrabold ${
                visitTimeLabel ? 'text-textPrimary' : 'text-textMuted'
              }`}
              numberOfLines={1}
            >
              {visitTimeLabel || 'Select time'}
            </Text>
            <Ionicons name="time-outline" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}