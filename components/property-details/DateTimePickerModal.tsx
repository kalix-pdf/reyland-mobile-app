import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { HOUR_OPTIONS, MINUTE_OPTIONS, MONTH_OPTIONS, TIME_PERIOD_OPTIONS } from '@/constants/property-details.constants';
import { WheelPickerColumn } from '@/components/ui/WheelPickerColumn';
import { createYearOptions, getDaysInMonth } from '@/utils/property-details.utils';
import type { SchedulePickerKind, VisitDateParts, VisitTimeParts } from '@/types/property-details.types';

type DateTimePickerModalProps = {
  visible: SchedulePickerKind; // 'date' | 'time' | null
  draftDate: VisitDateParts;
  draftTime: VisitTimeParts;
  onChangeDraftDate: (next: Partial<VisitDateParts>) => void;
  onChangeDraftTime: (next: Partial<VisitTimeParts>) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DateTimePickerModal({
  visible,
  draftDate,
  draftTime,
  onChangeDraftDate,
  onChangeDraftTime,
  onConfirm,
  onCancel,
}: DateTimePickerModalProps) {
  if (visible === null) return null;

  const yearOptions = createYearOptions();
  const dayOptions = Array.from(
    { length: getDaysInMonth(draftDate.month, draftDate.year) },
    (_, index) => index + 1,
  );

  return (
    // Absolutely fills the parent modal's content area — no native Modal here.
    <View className="absolute inset-0 items-center justify-center p-7 z-50">
      <Pressable className="absolute inset-0 bg-black/[0.35]" onPress={onCancel} />

      <View
        className="w-full max-w-[360px] p-[22px] rounded-3xl bg-surface"
        style={{
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.16,
          shadowRadius: 24,
          elevation: 8,
        }}
      >
        <Text className="text-textPrimary text-lg font-extrabold mb-[18px]">
          {visible === 'date' ? 'Select date' : 'Select time'}
        </Text>

        {visible === 'date' ? (
          <View className="min-h-[178px] flex-row gap-2.5">
            <WheelPickerColumn
              options={MONTH_OPTIONS}
              selectedValue={MONTH_OPTIONS[draftDate.month]}
              onSelect={(month) => onChangeDraftDate({ month: MONTH_OPTIONS.indexOf(month) })}
            />
            <WheelPickerColumn
              options={dayOptions}
              selectedValue={draftDate.day}
              onSelect={(day) => onChangeDraftDate({ day })}
            />
            <WheelPickerColumn
              options={yearOptions}
              selectedValue={draftDate.year}
              onSelect={(year) => onChangeDraftDate({ year })}
            />
          </View>
        ) : (
          <View className="min-h-[178px] flex-row gap-2.5">
            <WheelPickerColumn
              options={HOUR_OPTIONS}
              selectedValue={draftTime.hour}
              onSelect={(hour) => onChangeDraftTime({ hour })}
            />
            <WheelPickerColumn
              options={MINUTE_OPTIONS}
              selectedValue={draftTime.minute}
              onSelect={(minute) => onChangeDraftTime({ minute })}
              formatLabel={(minute) => String(minute).padStart(2, '0')}
            />
            <WheelPickerColumn
              options={TIME_PERIOD_OPTIONS}
              selectedValue={draftTime.period}
              onSelect={(period) => onChangeDraftTime({ period })}
            />
          </View>
        )}

        <View className="flex-row justify-end gap-[18px] mt-[18px]">
          <Pressable
            accessibilityRole="button"
            onPress={onCancel}
            className="min-h-9 justify-center px-1 active:opacity-[0.78]"
          >
            <Text className="text-textSecondary text-sm font-extrabold">Cancel</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onConfirm}
            className="min-h-9 justify-center px-1 active:opacity-[0.78]"
          >
            <Text className="text-accent text-sm font-black">Confirm</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}