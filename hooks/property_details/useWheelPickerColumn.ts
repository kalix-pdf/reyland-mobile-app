import { type RefObject, useCallback, useRef } from 'react';
import type { NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';

import { WHEEL_PICKER_OPTION_HEIGHT } from '@/constants/property-details.constants';

type UseWheelPickerColumnArgs<T> = {
  options: readonly T[];
  selectedValue: T;
  onSelect: (value: T) => void;
};

type UseWheelPickerColumnResult<T> = {
  scrollRef: RefObject<ScrollView | null>;
  scrollToValue: (value: T, animated?: boolean) => void;
  scrollToIndex: (index: number, animated?: boolean) => void;
  handleMomentumScrollEnd: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handlePressOption: (value: T, index: number) => void;
};

/**
 * Encapsulates the scroll/snap/select behavior for a single column inside a
 * native scroll-wheel picker (e.g. month, day, year, hour, minute, AM/PM).
 *
 * Six near-identical copies of this logic previously lived inline in
 * PropertyDetailsScreen. Extracting it here means any future wheel-picker
 * (e.g. a "preferred move-in date" picker elsewhere in the app) can reuse it.
 */
export function useWheelPickerColumn<T extends string | number>({
  options,
  selectedValue,
  onSelect,
}: UseWheelPickerColumnArgs<T>): UseWheelPickerColumnResult<T> {
  const scrollRef = useRef<ScrollView>(null);

  const scrollToIndex = useCallback((index: number, animated = true) => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: Math.max(index, 0) * WHEEL_PICKER_OPTION_HEIGHT,
        animated,
      });
    });
  }, []);

  const scrollToValue = useCallback(
    (value: T, animated = true) => {
      const index = options.indexOf(value);
      scrollToIndex(index, animated);
    },
    [options, scrollToIndex],
  );

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.min(
        Math.max(Math.round(offsetY / WHEEL_PICKER_OPTION_HEIGHT), 0),
        options.length - 1,
      );
      onSelect(options[index]);
    },
    [onSelect, options],
  );

  const handlePressOption = useCallback(
    (value: T, index: number) => {
      onSelect(value);
      scrollToIndex(index);
    },
    [onSelect, scrollToIndex],
  );

  return {
    scrollRef,
    scrollToValue,
    scrollToIndex,
    handleMomentumScrollEnd,
    handlePressOption,
  };
}
