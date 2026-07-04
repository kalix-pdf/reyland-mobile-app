import { Colors } from '@/constants/colors';
import type { SchedulePickerKind, VisitDateParts, VisitTimeParts } from '@/types/property-details.types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { DateTimePickerModal } from '../property-details';

type InvestorPlanSummary = {
  range: string;
};

export function ScheduleContractModal({
  visible,
  userName,
  userEmail,
  userPhone,
  plan,
  totalAnnualRate,
  lockIn,
  visitDateLabel,
  visitTimeLabel,
  isSubmitDisabled,
  activePicker,
  draftDate,
  draftTime,
  onChangeDraftDate,
  onChangeDraftTime,
  onConfirmPicker,
  onCancelPicker,
  onClose,
  onPressDate,
  onPressTime,
  onSubmit,
}: {
  visible: boolean;
  userName: string;
  userEmail: string;
  userPhone: string;
  plan: InvestorPlanSummary;
  totalAnnualRate: number;
  lockIn: boolean;
  visitDateLabel: string;
  visitTimeLabel: string;
  isSubmitDisabled: boolean;
  activePicker: SchedulePickerKind;
  draftDate: VisitDateParts;
  draftTime: VisitTimeParts;
  onChangeDraftDate: (next: Partial<VisitDateParts>) => void;
  onChangeDraftTime: (next: Partial<VisitTimeParts>) => void;
  onConfirmPicker: () => void;
  onCancelPicker: () => void;
  onClose: () => void;
  onPressDate: () => void;
  onPressTime: () => void;
  onSubmit: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/[0.42]" onPress={onClose} />

        <View className="max-h-[90%] pt-2.5 px-[15px] pb-[30px] rounded-t-[26px] bg-surface">
          <View className="self-center w-11 h-[5px] rounded-full bg-border mb-4" />

          <View className="flex-row items-center gap-3 mb-4">
            <View className="w-[42px] h-[42px] rounded-[21px] items-center justify-center bg-tag">
              <Ionicons name="document-text-outline" size={20} color={Colors.accent} />
            </View>
            <View className="flex-1 min-w-0">
              <Text className="text-textPrimary text-lg font-black">Schedule contract signing</Text>
              <Text className="mt-[3px] text-textSecondary text-[13px] font-bold" numberOfLines={1}>
                Office appointment before investment posting
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close contract signing form"
              hitSlop={10}
              onPress={onClose}
              className="w-9 h-9 rounded-full items-center justify-center bg-background active:opacity-[0.78]"
            >
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-3.5 pb-2"
          >
            <View className="min-h-[92px] flex-row items-center gap-[13px] p-3.5 rounded-[18px] bg-primary">
              <View className="w-[42px] h-[42px] rounded-[21px] items-center justify-center bg-textOnDark/[0.14]">
                <Ionicons name="document-text-outline" size={20} color={Colors.textOnDark} />
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-textOnDark/70 text-xs font-extrabold">Office visit required</Text>
                <Text className="mt-1 text-textOnDark text-sm leading-5 font-black">
                  The investor must visit Reyland office to sign the contract before any transaction is recorded.
                </Text>
              </View>
            </View>

            <View className="rounded-[18px] border border-border bg-surfaceMuted p-3.5">
              <View className="flex-row items-center gap-2.5 mb-3">
                <View className="w-8 h-8 rounded-[16px] items-center justify-center bg-tag">
                  <Ionicons name="calendar-outline" size={16} color={Colors.accent} />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-textPrimary text-base font-black">Contract signing schedule</Text>
                  <Text className="mt-0.5 text-textSecondary text-xs font-bold">
                    Choose the preferred date and time for the office visit
                  </Text>
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
                      className={`flex-1 text-[14px] font-extrabold ${
                        visitDateLabel ? 'text-textPrimary' : 'text-textMuted'
                      }`}
                      numberOfLines={1}
                    >
                      {visitDateLabel || 'Select date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
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
                      className={`flex-1 text-[14px] font-extrabold ${
                        visitTimeLabel ? 'text-textPrimary' : 'text-textMuted'
                      }`}
                      numberOfLines={1}
                    >
                      {visitTimeLabel || 'Select time'}
                    </Text>
                    <Ionicons name="time-outline" size={18} color={Colors.textMuted} />
                  </Pressable>
                </View>
              </View>
            </View>

            <View className="rounded-[16px] bg-background border border-border p-3.5">
              <Text className="text-textPrimary text-sm font-black mb-1">Selected investment</Text>
              <SummaryRow label="Range" value={plan.range} />
              <SummaryRow label="Annual rate" value={`${totalAnnualRate}% per annum`} />
              <SummaryRow
                label="3-year lock-in"
                value={lockIn ? 'Selected (+10%)' : 'Not selected'}
                last
              />
            </View>

            <View className="rounded-[16px] bg-background border border-border p-3.5">
              <Text className="text-textPrimary text-sm font-black mb-1">Investor details</Text>
              <SummaryRow label="Name" value={userName || 'Account user'} />
              <SummaryRow label="Phone" value={userPhone || 'Not provided'} />
              <SummaryRow label="Email" value={userEmail || 'Not provided'} last />
            </View>

            <View className="flex-row items-start gap-2.5 rounded-[16px] bg-tag p-3.5">
              <Ionicons name="information-circle-outline" size={18} color={Colors.accent} />
              <Text className="flex-1 text-tagText text-[12.5px] leading-[18px] font-bold">
                Scheduling this visit does not create an investment transaction. The admin records it after contract signing at the office.
              </Text>
            </View>

            <View className="flex-row items-start gap-2.5 rounded-[16px] bg-background border border-border p-3.5">
              <Ionicons name="mail-outline" size={18} color={Colors.accent} />
              <Text className="flex-1 text-textSecondary text-[12.5px] leading-[18px] font-bold">
                Further contract signing details and next steps will be sent through Gmail after this schedule request.
              </Text>
            </View>
          </ScrollView>

          <View className="flex-row gap-2.5 pt-3.5">
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              className="flex-1 min-h-[50px] items-center justify-center rounded-2xl border border-border bg-surface active:opacity-[0.78]"
            >
              <Text className="text-textSecondary text-sm font-black">Cancel</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: isSubmitDisabled }}
              onPress={isSubmitDisabled ? undefined : onSubmit}
              disabled={isSubmitDisabled}
              className={`flex-[1.35] min-h-[50px] items-center justify-center rounded-2xl ${
                isSubmitDisabled ? 'bg-border opacity-[0.72]' : 'bg-accent active:opacity-[0.78]'
              }`}
            >
              <Text className={`text-sm font-black ${isSubmitDisabled ? 'text-textMuted' : 'text-textOnDark'}`}>
                Request Signing Schedule
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
      <DateTimePickerModal
        visible={activePicker}
        draftDate={draftDate}
        draftTime={draftTime}
        onChangeDraftDate={onChangeDraftDate}
        onChangeDraftTime={onChangeDraftTime}
        onConfirm={onConfirmPicker}
        onCancel={onCancelPicker}
      />
    </Modal>
  );
}

function SummaryRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View className={`flex-row items-center justify-between gap-3 py-2 ${last ? '' : 'border-b border-border'}`}>
      <Text className="text-textSecondary text-xs font-black">{label}</Text>
      <Text className="flex-1 text-right text-textPrimary text-[13px] font-black" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
