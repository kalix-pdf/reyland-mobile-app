import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function PropertyStateScreen({
  icon,
  title,
  message,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center px-7 bg-background">
      <Ionicons
        name={icon}
        size={36}
        color={icon === 'alert-circle-outline' ? Colors.error : Colors.textMuted}
      />
      <Text className="mt-3 text-textPrimary text-xl font-black text-center">{title}</Text>
      <Text className="mt-2 text-textSecondary text-sm leading-[21px] font-semibold text-center">
        {message}
      </Text>
    </SafeAreaView>
  );
}

export function PropertySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="mx-[15px] mt-[18px]">
      <Text className="mb-3 text-textPrimary text-lg font-black">{title}</Text>
      {children}
    </View>
  );
}

export function PropertyStatItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-1 min-h-[98px] items-center justify-center p-2.5 rounded-[18px] bg-surface border border-border">
      <View className="w-[34px] h-[34px] rounded-[17px] items-center justify-center bg-tag mb-[7px]">
        <Ionicons name={icon} size={18} color={Colors.accent} />
      </View>
      <Text className="max-w-full text-textPrimary text-[13px] font-black" numberOfLines={1}>
        {value}
      </Text>
      <Text className="mt-1 text-textMuted text-[11px] font-extrabold">{label}</Text>
    </View>
  );
}

export function PropertyBreakdownRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      className={`min-h-[52px] flex-row items-center justify-between gap-3.5 ${
        last ? 'border-b-0' : 'border-b border-border'
      }`}
    >
      <Text className="flex-1 text-textSecondary text-[13px] font-bold">{label}</Text>
      <Text className="text-textPrimary text-sm font-black text-right">{value}</Text>
    </View>
  );
}

type InquiryFieldProps = ComponentProps<typeof TextInput> & {
  label: string;
  inputClassName?: string;
};

export function PropertyInquiryField({ label, inputClassName, ...props }: InquiryFieldProps) {
  return (
    <View className="gap-[7px]">
      <Text className="text-textSecondary text-xs font-black">{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={Colors.textMuted}
        className={`min-h-[48px] px-3.5 py-3 rounded-2xl border border-border bg-background text-textPrimary text-sm font-bold ${inputClassName ?? ''}`}
      />
    </View>
  );
}