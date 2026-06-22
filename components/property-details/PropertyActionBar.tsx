import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { User } from '@/types';

type PropertyActionBarProps = {
  checkingInquiry: boolean;
  hasActiveInquiry: boolean;
  onPressInquire: () => void;
  user: User | null;
  checkingSiteVisit: boolean;
  hasActiveSiteVisit: boolean;
  onPressScheduleVisit: () => void;
};

export function PropertyActionBar({
  checkingInquiry,
  hasActiveInquiry,
  onPressInquire,
  user,
  checkingSiteVisit,
  hasActiveSiteVisit,
  onPressScheduleVisit,
}: PropertyActionBarProps) {
  // status === 0 means the user's account is still pending approval
  const isPendingApproval = user?.status === 0;

  const inquireDisabled = checkingInquiry || isPendingApproval || hasActiveInquiry;
  const scheduleVisitDisabled = checkingSiteVisit || isPendingApproval || hasActiveSiteVisit;

  return (
    <View className="flex-row gap-2.5 px-[15px] pt-3 pb-[50px] bg-surface border-t border-border">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isPendingApproval
            ? 'Pending approval'
            : checkingInquiry
              ? 'Checking inquiry status'
              : hasActiveInquiry
                ? 'Inquiry already sent'
                : 'Inquire now'
        }
        accessibilityState={{ disabled: inquireDisabled }}
        onPress={onPressInquire}
        disabled={inquireDisabled}
        className={`flex-1 min-h-[52px] flex-row items-center justify-center gap-2 rounded-2xl border border-accent ${
          hasActiveInquiry ? 'bg-tag' : 'bg-surface'
        } ${inquireDisabled ? 'opacity-[0.72]' : ''}`}
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
              {isPendingApproval
                ? 'Pending Approval'
                : checkingInquiry
                  ? 'Checking...'
                  : hasActiveInquiry
                    ? 'Inquiry Sent'
                    : 'Inquire Now'}
            </Text>
          </>
        )}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isPendingApproval
            ? 'Pending approval'
            : checkingSiteVisit
              ? 'Checking site visit status'
              : hasActiveSiteVisit
                ? 'Site visit already requested'
                : 'Schedule visit'
        }
        accessibilityState={{ disabled: scheduleVisitDisabled }}
        onPress={onPressScheduleVisit}
        disabled={scheduleVisitDisabled}
        className={`flex-[1.1] min-h-[52px] flex-row items-center justify-center gap-2 rounded-2xl bg-accent ${
          scheduleVisitDisabled ? 'opacity-[0.72]' : ''
        }`}
      >
        <Ionicons
          name={hasActiveSiteVisit ? 'checkmark-circle-outline' : 'calendar-outline'}
          size={18}
          color={Colors.textOnDark}
        />
        <Text className="text-textOnDark text-sm font-black">
          {isPendingApproval
            ? 'Pending Approval'
            : checkingSiteVisit
              ? 'Checking...'
              : hasActiveSiteVisit
                ? 'Visit Requested'
                : 'Schedule Visit'}
        </Text>
      </Pressable>
    </View>
  );
}