import { Pressable, ScrollView, Text, View } from 'react-native';

import { WHEEL_PICKER_OPTION_HEIGHT } from '@/constants/property-details.constants';
import { useWheelPickerColumn } from '@/hooks/property_details/useWheelPickerColumn';

type WheelPickerColumnProps<T extends string | number> = {
  options: readonly T[];
  selectedValue: T;
  onSelect: (value: T) => void;
  formatLabel?: (value: T) => string;
};

/**
 * A single scrollable, snap-to-item column for native date/time wheel pickers.
 * Generic over T so it works for months (string), days/hours/minutes (number),
 * or AM/PM (string union) without duplicating markup per column.
 */
export function WheelPickerColumn<T extends string | number>({
  options,
  selectedValue,
  onSelect,
  formatLabel,
}: WheelPickerColumnProps<T>) {
  const { scrollRef, handleMomentumScrollEnd, handlePressOption } = useWheelPickerColumn<T>({
    options,
    selectedValue,
    onSelect,
  });

  return (
    <View className="flex-1 h-[178px] overflow-hidden rounded-2xl bg-background">
      <View className="absolute left-0 right-0 top-[68px] h-[42px] border-t-[1.5px] border-b-[1.5px] border-accent bg-accent/[0.07]" />
      <ScrollView
        ref={scrollRef}
        className="flex-1 max-h-[178px]"
        contentContainerClassName="py-[68px]"
        showsVerticalScrollIndicator={false}
        snapToInterval={WHEEL_PICKER_OPTION_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {options.map((option, index) => {
          const selected = selectedValue === option;
          const label = formatLabel ? formatLabel(option) : String(option);

          return (
            <Pressable
              key={String(option)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => handlePressOption(option, index)}
              className="h-[42px] items-center justify-center"
            >
              <Text
                className={
                  selected
                    ? 'text-textPrimary text-[16px] font-black text-center'
                    : 'text-textMuted text-[15px] font-bold text-center'
                }
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
