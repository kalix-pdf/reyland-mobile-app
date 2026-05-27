import { AuthInput } from '@/components/auth/auth-input';
import { AuthMessage } from '@/components/auth/auth-message';
import { useAppTheme } from '@/context/theme-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createChangePasswordStyles } from '../../styles/profile.styles';

type ChangePasswordViewProps = {
  onSubmit: (currentPassword: string, password: string) => Promise<{ success: boolean; message?: string }>;
};

type PasswordField = 'current' | 'new' | 'confirm';

export function ChangePasswordView({ onSubmit }: ChangePasswordViewProps) {
  const { colors } = useAppTheme();
  const styles = createChangePasswordStyles(colors);

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState<Record<PasswordField, boolean>>({
    current: false,
    new: false,
    confirm: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState<Record<PasswordField, boolean>>({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordMeetsLength = password.length >= 6;
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isSameAsCurrent = currentPassword.length > 0 && currentPassword === password;

  const shouldValidateCurrent = submitted || touched.current;
  const shouldValidatePassword = submitted || touched.new;
  const shouldValidateConfirm = submitted || touched.confirm;

  const currentPasswordError =
    shouldValidateCurrent && currentPassword.length === 0 ? 'Current password is required.' : '';

  const passwordError =
    shouldValidatePassword && password.length === 0
      ? 'New password is required.'
      : shouldValidatePassword && !passwordMeetsLength
        ? 'Password must be at least 6 characters.'
        : shouldValidatePassword && isSameAsCurrent
          ? 'New password must be different from your current password.'
          : '';

  const confirmPasswordError =
    shouldValidateConfirm && confirmPassword.length === 0
      ? 'Please confirm your new password.'
      : shouldValidateConfirm && password !== confirmPassword
        ? 'Passwords do not match.'
        : '';

  const canSubmit = currentPassword.length > 0 && passwordMeetsLength && passwordsMatch && !isSameAsCurrent;

  const markTouched = (field: PasswordField) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  const toggleVisible = (field: PasswordField) => {
    setVisible((current) => ({ ...current, [field]: !current[field] }));
  };

  const renderEyeButton = (field: PasswordField, color: string) => (
    <Pressable
      onPress={() => toggleVisible(field)}
      hitSlop={8}
      style={styles.eyeButton}
      disabled={isLoading}
    >
      <Ionicons name={visible[field] ? 'eye-off-outline' : 'eye-outline'} size={21} color={color} />
    </Pressable>
  );

  const handleSubmit = async () => {
    if (isLoading) return;

    setSubmitted(true);
    setTouched({ current: true, new: true, confirm: true });
    clearMessages();

    if (!canSubmit) return;

    try {
      setIsLoading(true);
      const result = await onSubmit(currentPassword, password);

      if (!result.success) {
        setError(result.message || 'We couldn’t change your password. Please try again.');
        return;
      }

      setSuccessMessage(result.message || 'Password changed successfully.');
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
      setSubmitted(false);
      setTouched({ current: false, new: false, confirm: false });

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
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>Enter your current password, then choose a new one for your account.</Text>

          <AuthMessage type="error" message={error} />
          <AuthMessage type="success" message={successMessage} />

          <View style={styles.inputArea}>
            <AuthInput
              label="Current Password"
              icon={(color) => <Feather name="lock" size={20} color={color} />}
              rightElement={(color) => renderEyeButton('current', color)}
              error={currentPasswordError}
              placeholder="Current password"
              value={currentPassword}
              onChangeText={(value) => {
                setCurrentPassword(value);
                clearMessages();
              }}
              onBlur={() => {
                if (currentPassword.length > 0 || submitted) markTouched('current');
              }}
              secureTextEntry={!visible.current}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              returnKeyType="next"
              editable={!isLoading}
            />

            <AuthInput
              label="New Password"
              icon={(color) => <Feather name="shield" size={20} color={color} />}
              rightElement={(color) => renderEyeButton('new', color)}
              error={passwordError}
              placeholder="New password"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                clearMessages();
                if (submitted) markTouched('new');
              }}
              onBlur={() => {
                if (password.length > 0 || submitted) markTouched('new');
              }}
              secureTextEntry={!visible.new}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              returnKeyType="next"
              editable={!isLoading}
            />

            <AuthInput
              label="Confirm Password"
              icon={(color) => <Feather name="check-circle" size={20} color={color} />}
              rightElement={(color) => renderEyeButton('confirm', color)}
              error={confirmPasswordError}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                clearMessages();
                if (submitted) markTouched('confirm');
              }}
              onBlur={() => {
                if (confirmPassword.length > 0 || submitted) markTouched('confirm');
              }}
              secureTextEntry={!visible.confirm}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              editable={!isLoading}
            />
          </View>

          <View style={styles.passwordChecklist}>
            <Text style={styles.passwordChecklistTitle}>Password requirements</Text>
            <Text style={styles.passwordChecklistItem}>At least 6 characters</Text>
            <Text style={styles.passwordChecklistItem}>Different from your current password</Text>
            <Text style={styles.passwordChecklistItem}>Confirmed before saving</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && canSubmit && !isLoading && styles.buttonPressed,
              (!canSubmit || isLoading) && styles.saveButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit || isLoading}
          >
            {isLoading ? (
              <View style={styles.saveButtonLoadingRow}>
                <ActivityIndicator color={colors.white} size="small" />
                <Text style={styles.saveButtonText}>Saving password...</Text>
              </View>
            ) : (
              <Text style={styles.saveButtonText}>Save Password</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
