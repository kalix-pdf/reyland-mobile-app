import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';

type PropertyActionBarProps = {
  checkingInquiry: boolean;
  hasActiveInquiry: boolean;
  onPressInquire: () => void;

  checkingSiteVisit: boolean;
  hasActiveSiteVisit: boolean;
  onPressScheduleVisit: () => void;
};

export function PropertyActionBar({
  checkingInquiry,
  hasActiveInquiry,
  onPressInquire,
  checkingSiteVisit,
  hasActiveSiteVisit,
  onPressScheduleVisit,
}: PropertyActionBarProps) {
  return (
    <View className="flex-row gap-2.5 px-[15px] pt-3 pb-[50px] bg-surface border-t border-border">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          checkingInquiry
            ? 'Checking inquiry status'
            : hasActiveInquiry
              ? 'Inquiry already sent'
              : 'Inquire now'
        }
        onPress={onPressInquire}
        disabled={checkingInquiry}
        className={`flex-1 min-h-[52px] flex-row items-center justify-center gap-2 rounded-2xl border border-accent bg-surface ${
          hasActiveInquiry ? 'bg-tag' : ''
        } ${checkingInquiry ? 'opacity-[0.72]' : ''}`}
      >
        {({ pressed }) => (
          <>
            <Ionicons
              name={hasActiveInquiry ? 'checkmark-circle-outline' : 'chatbubble-ellipses-outline'}
              size={18}
              color={Colors.accent}
              style={pressed ? { opacity: 0.78 } : undefined}
            />
            <Text
              className="text-accent text-sm font-black"
              style={pressed ? { opacity: 0.78 } : undefined}
            >
              {checkingInquiry ? 'Checking...' : hasActiveInquiry ? 'Inquiry Sent' : 'Inquire Now'}
            </Text>
          </>
        )}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Schedule visit"
        accessibilityState={{ disabled: checkingSiteVisit }}
        onPress={onPressScheduleVisit}
        disabled={checkingSiteVisit}
        className={`flex-[1.1] min-h-[52px] flex-row items-center justify-center gap-2 rounded-2xl bg-accent ${
          checkingSiteVisit ? 'opacity-[0.72]' : ''
        }`}
      >
        <Ionicons
          name={hasActiveSiteVisit ? 'checkmark-circle-outline' : 'calendar-outline'}
          size={18}
          color={Colors.textOnDark}
        />
        <Text className="text-textOnDark text-sm font-black">
          {checkingSiteVisit ? 'Checking...' : hasActiveSiteVisit ? 'Visit Requested' : 'Schedule Visit'}
        </Text>
      </Pressable>
    </View>
  );
}
