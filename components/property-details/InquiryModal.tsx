import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { PropertyInquiryField as InquiryField } from '@/components/property-details/property-details';
import { Colors } from '@/constants/colors';

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
  formError: { type: 'network' | 'server' | 'validation'; message: string } | null;
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
  formError,
  onSubmit,
  onClose,
}: InquiryModalProps) {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const shouldScrollAfterKeyboardRef = useRef(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);

      if (shouldScrollAfterKeyboardRef.current) {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 80);
      }
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      shouldScrollAfterKeyboardRef.current = false;
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const scrollFocusedFieldIntoView = () => {
    shouldScrollAfterKeyboardRef.current = true;

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-end">
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
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-3 pb-2"
            contentContainerStyle={{ paddingBottom: keyboardVisible ? 220 : 8 }}
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
              onFocus={scrollFocusedFieldIntoView}
            />
            <InquiryField
              label="Message"
              value={values.message}
              onChangeText={onChangeMessage}
              placeholder="Tell us what you want to know"
              multiline
              onFocus={scrollFocusedFieldIntoView}
              style={{ minHeight: 108, textAlignVertical: 'top' }}
            />
          </ScrollView>

          {formError && (
          <View className="flex-row items-start gap-2 mt-3 px-3.5 py-3 rounded-xl bg-red-50 border border-red-100">
            <Ionicons
              name={formError.type === 'network' ? 'cloud-offline-outline' : 'alert-circle-outline'}
              size={18}
              color="#DC2626"
              style={{ marginTop: 1 }}
            />
            <View className="flex-1 min-w-0">
              <Text className="text-red-700 text-[13px] font-black leading-[18px]">
                {formError.type === 'network' ? "Connection problem" : "Couldn't send inquiry"}
              </Text>
              <Text className="text-red-600 text-xs font-semibold mt-0.5 leading-[16px]">
                {formError.message}
              </Text>
            </View>
          </View>
        )}

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
                  {formError ? 'Try Again' : 'Submit Inquiry'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
