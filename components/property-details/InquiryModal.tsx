import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Colors } from '@/constants/colors';
import { PropertyInquiryField as InquiryField } from '@/components/property-details/property-details';

type InquiryModalProps = {
  visible: boolean;
  propertyTitle: string;
  values: { name: string; email: string; phone: string; message: string };
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeMessage: (value: string) => void;
  isSubmitDisabled: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  onClose: () => void;
};

export function InquiryModal({
  visible,
  propertyTitle,
  values,
  onChangeName,
  onChangeEmail,
  onChangePhone,
  onChangeMessage,
  isSubmitDisabled,
  isSubmitting,
  onSubmit,
  onClose,
}: InquiryModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/[0.42]" onPress={onClose} />

        <View className="max-h-[88%] pt-2.5 px-[15px] pb-[30px] rounded-t-[26px] bg-surface">
          <View className="self-center w-11 h-[5px] rounded-full bg-border mb-4" />

          <View className="flex-row items-center gap-3 mb-4">
            <View className="w-[42px] h-[42px] rounded-[21px] items-center justify-center bg-tag">
              <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.accent} />
            </View>
            <View className="flex-1 min-w-0">
              <Text className="text-textPrimary text-lg font-black">Inquire about this property</Text>
              <Text className="mt-[3px] text-textSecondary text-[13px] font-bold" numberOfLines={1}>
                {propertyTitle}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close inquiry form"
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
            contentContainerClassName="gap-3 pb-2"
          >
            <InquiryField
              label="Full name"
              value={values.name}
              onChangeText={onChangeName}
              placeholder="Juan Dela Cruz"
              autoCapitalize="words"
            />
            <InquiryField
              label="Email"
              value={values.email}
              onChangeText={onChangeEmail}
              placeholder="name@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <InquiryField
              label="Phone"
              value={values.phone}
              onChangeText={onChangePhone}
              placeholder="09xx xxx xxxx"
              keyboardType="phone-pad"
            />
            <InquiryField
              label="Message"
              value={values.message}
              onChangeText={onChangeMessage}
              placeholder="Tell us what you want to know"
              multiline
              style={{ minHeight: 108, textAlignVertical: 'top' }}
            />
          </ScrollView>

          <View className="flex-row gap-2.5 pt-3.5">
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              disabled={isSubmitting}
              className={`flex-1 min-h-[50px] items-center justify-center rounded-2xl border border-border bg-surface active:opacity-[0.78] ${
                isSubmitting ? 'opacity-[0.72]' : ''
              }`}
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
              {isSubmitting ? (
                <ActivityIndicator size="small" color={Colors.textOnDark} />
              ) : (
                <Text className={`text-sm font-black ${isSubmitDisabled ? 'text-textMuted' : 'text-textOnDark'}`}>
                  Submit Inquiry
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
