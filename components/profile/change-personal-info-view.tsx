import { useAppTheme } from '@/context/theme-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createChangePersonalInfoStyles } from '../../styles/profile.styles';

type InputConfig = {
  key: string;
  placeholder: string;
  secure?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
};

type ChangePersonalInfoViewProps = {
  title: string;
  currentLabel: string;
  currentValue: string;
  currentInput?: InputConfig;
  inputs: InputConfig[];
};

export function ChangePersonalInfoView({
  title,
  currentLabel,
  currentValue,
  currentInput,
  inputs,
}: ChangePersonalInfoViewProps) {
  const { colors } = useAppTheme();
  const styles = createChangePersonalInfoStyles(colors);
  const [values, setValues] = useState<Record<string, string>>({});

  const setValue = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>{currentLabel}</Text>
            {currentInput ? (
              <TextInput
                style={styles.input}
                placeholder={currentInput.placeholder}
                placeholderTextColor={colors.textMuted}
                value={values[currentInput.key] ?? ''}
                onChangeText={(value) => setValue(currentInput.key, value)}
                secureTextEntry={currentInput.secure}
                keyboardType={currentInput.keyboardType ?? 'default'}
                autoCapitalize="none"
                autoCorrect={false}
                selectionColor={colors.accent}
              />
            ) : (
              <View style={styles.currentValueBox}>
                <Text style={styles.currentValue}>{currentValue || 'Not provided'}</Text>
              </View>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>New {currentLabel.replace('Current ', '')}</Text>
            {inputs.map((input) => (
              <TextInput
                key={input.key}
                style={styles.input}
                placeholder={input.placeholder}
                placeholderTextColor={colors.textMuted}
                value={values[input.key] ?? ''}
                onChangeText={(value) => setValue(input.key, value)}
                secureTextEntry={input.secure}
                keyboardType={input.keyboardType ?? 'default'}
                autoCapitalize={input.keyboardType === 'email-address' ? 'none' : 'words'}
                autoCorrect={false}
                selectionColor={colors.accent}
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={({ pressed }) => [styles.nextButton, pressed && styles.buttonPressed]}>
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
