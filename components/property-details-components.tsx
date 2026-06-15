import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { propertyDetailsStyles as styles } from '@/styles/property.styles';

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
    <SafeAreaView style={styles.stateContainer}>
      <Ionicons
        name={icon}
        size={36}
        color={icon === 'alert-circle-outline' ? Colors.error : Colors.textMuted}
      />
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateText}>{message}</Text>
    </SafeAreaView>
  );
}

export function PropertySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
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
    <View style={styles.statItem}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={18} color={Colors.accent} />
      </View>
      <Text style={styles.statValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
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
    <View style={[styles.breakdownRow, last && styles.lastRow]}>
      <Text style={styles.breakdownLabel}>{label}</Text>
      <Text style={styles.breakdownValue}>{value}</Text>
    </View>
  );
}

type InquiryFieldProps = ComponentProps<typeof TextInput> & {
  label: string;
  inputStyle?: ComponentProps<typeof TextInput>['style'];
};

export function PropertyInquiryField({ label, inputStyle, ...props }: InquiryFieldProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={Colors.textMuted}
        style={[styles.input, inputStyle]}
      />
    </View>
  );
}
