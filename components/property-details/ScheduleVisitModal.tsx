import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { PropertyInquiryField as InquiryField } from '@/components/property-details/property-details';

type ScheduleVisitModalProps = {
  visible: boolean;
  propertyTitle: string;
  location: string;

  contactValues: { name: string; email: string; phone: string };
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;

  notes: string;
  onChangeNotes: (value: string) => void;

  visitDateLabel: string;
  visitTimeLabel: string;
  onPressDate: () => void;
  onPressTime: () => void;

  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  onClose: () => void;
};

export function ScheduleVisitModal({
  visible,
  propertyTitle,
  location,
  contactValues,
  onChangeName,
  onChangeEmail,
  onChangePhone,
  notes,
  onChangeNotes,
  visitDateLabel,
  visitTimeLabel,
  onPressDate,
  onPressTime,
  isSubmitDisabled,
  isSubmitting,
  onSubmit,
  onClose,
}: ScheduleVisitModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/[0.42]" onPress={onClose} />

        <View className="max-h-[90%] pt-2.5 px-[15px] pb-[30px] rounded-t-[26px] bg-surface">
          <View className="self-center w-11 h-[5px] rounded-full bg-border mb-4" />

          <View className="flex-row items-center gap-3 mb-4">
            <View className="w-[42px] h-[42px] rounded-[21px] items-center justify-center bg-tag">
              <Ionicons name="calendar-outline" size={20} color={Colors.accent} />
            </View>
            <View className="flex-1 min-w-0">
              <Text className="text-textPrimary text-lg font-black">Schedule a Visit</Text>
              <Text className="mt-[3px] text-textSecondary text-[13px] font-bold" numberOfLines={1}>
                {propertyTitle}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close schedule visit form"
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
            <View className="min-h-[82px] flex-row items-center gap-[13px] p-3.5 rounded-2xl bg-primary">
              <View className="w-[42px] h-[42px] rounded-[21px] items-center justify-center bg-textOnDark/[0.14]">
                <Ionicons name="location-outline" size={20} color={Colors.textOnDark} />
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-textOnDark/70 text-xs font-extrabold">Preferred site visit</Text>
                <Text className="mt-1 text-textOnDark text-sm leading-5 font-black" numberOfLines={2}>
                  {location}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2.5">
              <View className="flex-1 gap-[7px]">
                <Text className="text-textSecondary text-xs font-black">Preferred date</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Select preferred visit date"
                  onPress={onPressDate}
                  className="min-h-[50px] flex-row items-center justify-between gap-2 px-3.5 py-3 rounded-2xl border border-border bg-background active:opacity-[0.78]"
                >
                  <Text
                    className={`flex-1 text-[14px] font-extrabold ${
                      visitDateLabel ? 'text-textPrimary' : 'text-textMuted'
                    }`}
                  >
                    {visitDateLabel || 'Select date'}
                  </Text>
                  <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
                </Pressable>
              </View>

              <View className="flex-1 gap-[7px]">
                <Text className="text-textSecondary text-xs font-black">Preferred time</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Select preferred visit time"
                  onPress={onPressTime}
                  className="min-h-[50px] flex-row items-center justify-between gap-2 px-3.5 py-3 rounded-2xl border border-border bg-background active:opacity-[0.78]"
                >
                  <Text
                    className={`flex-1 text-[14px] font-extrabold ${
                      visitTimeLabel ? 'text-textPrimary' : 'text-textMuted'
                    }`}
                  >
                    {visitTimeLabel || 'Select time'}
                  </Text>
                  <Ionicons name="time-outline" size={18} color={Colors.textMuted} />
                </Pressable>
              </View>
            </View>

            <View className="h-px bg-border" />

            <InquiryField
              label="Full name"
              value={contactValues.name}
              onChangeText={onChangeName}
              placeholder="Juan Dela Cruz"
              autoCapitalize="words"
            />
            <InquiryField
              label="Email"
              value={contactValues.email}
              onChangeText={onChangeEmail}
              placeholder="name@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <InquiryField
              label="Phone"
              value={contactValues.phone}
              onChangeText={onChangePhone}
              placeholder="09xx xxx xxxx"
              keyboardType="phone-pad"
            />
            <InquiryField
              label="Notes for the visit"
              value={notes}
              onChangeText={onChangeNotes}
              placeholder="Add companions, timing details, or questions"
              multiline
              style={{ minHeight: 108, textAlignVertical: 'top' }}
            />
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
                {isSubmitting ? 'Requesting...' : 'Request Visit'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
