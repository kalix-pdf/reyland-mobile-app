import { AuthInput } from '@/components/auth/auth-input';
import { AuthMessage } from '@/components/auth/auth-message';
import { useAppTheme } from '@/context/theme-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createChangePasswordStyles } from '../../styles/profile.styles';

type InputConfig = {
  key: string;
  placeholder: string;
  secure?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
};

type SubmitValues = {
  phone?: string;
  email?: string;
  fullName?: string;
  password: string;
};

type ChangePersonalInfoViewProps = {
  title: string;
  currentLabel: string;
  currentValue: string;
  currentInput?: InputConfig;
  inputs: InputConfig[];
  subtitle?: string;
  submitLabel?: string;
  loadingLabel?: string;
  onSubmit?: (values: SubmitValues) => Promise<{ success: boolean; message?: string }>;
};

type Field = 'primary' | 'confirm' | 'password';

export function ChangePersonalInfoView({
  title,
  currentLabel,
  currentValue,
  inputs,
  subtitle = 'Update your account information and confirm your password before saving.',
  submitLabel = 'Save',
  loadingLabel = 'Saving...',
  onSubmit,
}: ChangePersonalInfoViewProps) {
  const { colors } = useAppTheme();
  const styles = createChangePasswordStyles(colors);
  const primaryInput = inputs[0];
  const confirmInput = inputs[1];
  const isEmailChange = primaryInput?.key === 'email';
  const isPhoneChange = primaryInput?.key === 'phone';
  const fieldName = currentLabel.replace('Current ', '');

  const [primaryValue, setPrimaryValue] = useState('');
  const [confirmValue, setConfirmValue] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [touched, setTouched] = useState<Record<Field, boolean>>({
    primary: false,
    confirm: false,
    password: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const trimmedPrimaryValue = primaryValue.trim();
  const normalizedCurrentName = currentValue.trim().toLowerCase();
  const normalizedPrimaryValue = trimmedPrimaryValue.toLowerCase();
  const isSameAsCurrent = normalizedPrimaryValue === normalizedCurrentName;
  const needsConfirmation = isEmailChange || isPhoneChange;
  const confirmedValueMatches = !needsConfirmation || trimmedPrimaryValue.length > 0 && trimmedPrimaryValue === confirmValue.trim();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedPrimaryValue);
  const phoneIsValid = /^[+()\d\s-]{7,20}$/.test(trimmedPrimaryValue) && trimmedPrimaryValue.replace(/\D/g, '').length >= 10;

  const shouldValidatePrimary = submitted || touched.primary;
  const shouldValidateConfirm = submitted || touched.confirm;
  const shouldValidatePassword = submitted || touched.password;

  const primaryError =
    shouldValidatePrimary && trimmedPrimaryValue.length === 0
      ? `${fieldName} is required.`
      : shouldValidatePrimary && isEmailChange && !emailIsValid
        ? 'Enter a valid email address.'
        : shouldValidatePrimary && isPhoneChange && !phoneIsValid
          ? 'Enter a valid phone number.'
        : shouldValidatePrimary && !isEmailChange && !isPhoneChange && trimmedPrimaryValue.length < 2
          ? 'Full name must be at least 2 characters.'
        : shouldValidatePrimary && isSameAsCurrent
          ? `New ${fieldName.toLowerCase()} must be different from your current ${fieldName.toLowerCase()}.`
          : '';

  const confirmError =
    needsConfirmation && shouldValidateConfirm && confirmValue.trim().length === 0
      ? `Please confirm your new ${fieldName.toLowerCase()}.`
      : needsConfirmation && shouldValidateConfirm && !confirmedValueMatches
        ? `${fieldName} entries do not match.`
        : '';

  const passwordError = shouldValidatePassword && password.length === 0 ? 'Password is required.' : '';
  const primaryValueIsValid = isEmailChange
    ? emailIsValid && confirmedValueMatches
    : isPhoneChange
      ? phoneIsValid && confirmedValueMatches
      : trimmedPrimaryValue.length >= 2;
  const canSubmit = primaryValueIsValid && password.length > 0 && !isSameAsCurrent;

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const markTouched = (field: Field) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    if (!onSubmit) return;

    setSubmitted(true);
    setTouched({ primary: true, confirm: true, password: true });
    clearMessages();

    if (!canSubmit) return;

    try {
      setIsLoading(true);
      const submitValues = isEmailChange
        ? { email: normalizedPrimaryValue, password }
        : isPhoneChange
          ? { phone: trimmedPrimaryValue, password }
          : { fullName: trimmedPrimaryValue, password };

      const result = await onSubmit(submitValues);

      if (!result.success) {
        setError(result.message || `We couldn’t update your ${fieldName.toLowerCase()}. Please try again.`);
        return;
      }

      setSuccessMessage(result.message || `${fieldName} updated successfully.`);
      setPrimaryValue('');
      setConfirmValue('');
      setPassword('');
      setSubmitted(false);
      setTouched({ primary: false, confirm: false, password: false });

      setTimeout(() => {
        router.back();
      }, 1200);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.buttonPressed]}
            hitSlop={10}
            disabled={isLoading}
          >
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <AuthMessage type="error" message={error} />
          <AuthMessage type="success" message={successMessage} />

          <View style={styles.currentValueSection}>
            <Text style={styles.currentValueLabel}>{currentLabel}</Text>
            <View style={styles.currentValueBox}>
              <Text style={styles.currentValue}>{currentValue || 'Not provided'}</Text>
            </View>
          </View>

          <View style={styles.inputArea}>
            <AuthInput
              label={`New ${fieldName}`}
              icon={(color) => <Feather name={isEmailChange ? 'mail' : isPhoneChange ? 'phone' : 'user'} size={20} color={color} />}
              error={primaryError}
              placeholder={primaryInput?.placeholder ?? fieldName}
              value={primaryValue}
              onChangeText={(value) => {
                setPrimaryValue(value);
                clearMessages();
                if (submitted) markTouched('primary');
              }}
              onBlur={() => {
                if (primaryValue.length > 0 || submitted) markTouched('primary');
              }}
              keyboardType={primaryInput?.keyboardType ?? 'default'}
              autoCapitalize={isEmailChange || isPhoneChange ? 'none' : 'words'}
              autoCorrect={false}
              textContentType={isEmailChange ? 'emailAddress' : isPhoneChange ? 'telephoneNumber' : 'name'}
              returnKeyType="next"
              editable={!isLoading}
            />

            {needsConfirmation && confirmInput ? (
              <AuthInput
                label={`Confirm New ${fieldName}`}
                icon={(color) => <Feather name="check-circle" size={20} color={color} />}
                error={confirmError}
                placeholder={confirmInput.placeholder}
                value={confirmValue}
                onChangeText={(value) => {
                  setConfirmValue(value);
                  clearMessages();
                  if (submitted) markTouched('confirm');
                }}
                onBlur={() => {
                  if (confirmValue.length > 0 || submitted) markTouched('confirm');
                }}
                keyboardType={confirmInput.keyboardType ?? primaryInput?.keyboardType ?? 'default'}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType={isEmailChange ? 'emailAddress' : 'telephoneNumber'}
                editable={!isLoading}
              />
            ) : null}

            {onSubmit ? (
              <AuthInput
                label="Password"
                icon={(color) => <Feather name="lock" size={20} color={color} />}
                rightElement={(color) => (
                  <Pressable
                    onPress={() => setPasswordVisible((current) => !current)}
                    hitSlop={8}
                    style={styles.eyeButton}
                    disabled={isLoading}
                  >
                    <Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={21} color={color} />
                  </Pressable>
                )}
                error={passwordError}
                placeholder="Confirm with password"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  clearMessages();
                  if (submitted) markTouched('password');
                }}
                onBlur={() => {
                  if (password.length > 0 || submitted) markTouched('password');
                }}
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                editable={!isLoading}
              />
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && canSubmit && !isLoading && styles.buttonPressed,
              (onSubmit ? !canSubmit || isLoading : isLoading) && styles.saveButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={onSubmit ? !canSubmit || isLoading : isLoading}
          >
            {isLoading ? (
              <View style={styles.saveButtonLoadingRow}>
                <ActivityIndicator color={colors.white} size="small" />
                <Text style={styles.saveButtonText}>{loadingLabel}</Text>
              </View>
            ) : (
              <Text style={styles.saveButtonText}>{submitLabel}</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
