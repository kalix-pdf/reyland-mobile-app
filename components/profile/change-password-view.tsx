import { AuthInput } from '@/components/auth/auth-input';
import { AuthMessage } from '@/components/auth/auth-message';
import { useAppTheme } from '@/context/theme-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderNav, HeaderShell } from '../header';

type ChangePasswordViewProps = {
  onSubmit: (currentPassword: string, password: string) => Promise<{ success: boolean; message?: string }>;
};

type PasswordField = 'current' | 'new' | 'confirm';

export function ChangePasswordView({ onSubmit }: ChangePasswordViewProps) {
  const { colors } = useAppTheme();
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
      className='w-[34px] h-[34px] items-center justify-center mr-1'
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
    <SafeAreaView className='flex-1 bg-surface' edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <HeaderShell >
          <HeaderNav title='Change Password' />
        </HeaderShell>

        <ScrollView
          className='flex-1'
          contentContainerClassName='px-5 p-6'
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text className='text-2xl font-semibold text-textPrimary mb-2'>Change Password</Text>
          <Text className='text-sm leading-5 text-textSecondary mb-[22px]'>Enter your current password, then choose a new one for your account.</Text>

          <AuthMessage type="error" message={error} />
          <AuthMessage type="success" message={successMessage} />

          <View className='gap-0.5'>
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

          <View className='mt-2.5 p-3.5 rounded-lg border border-border bg-surfaceMuted gap-1.5'>
            <Text className=''>Password requirements</Text>
            <Text className='text-[13px] font-extrabold text-textPrimary mb-0.5'>At least 6 characters</Text>
            <Text className='text-[13px] leading-[18px] text-textSecondary'>Different from your current password</Text>
            <Text className='text-[13px] leading-[18px] text-textSecondary'>Confirmed before saving</Text>
          </View>
        </ScrollView>

        <View className='px-5 pb-[26px] pt-3 bg-surface'>
          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit || isLoading}
            className={`min-h-[56px] rounded-[21px] items-center justify-center bg-accent mb-1.5 active:opacity-50 ${
              !canSubmit || isLoading ? 'opacity-75' : ''
            }`}
          >
            {isLoading ? (
              <View className='flex-row items-center gap-2.5'>
                <ActivityIndicator color={colors.white} size="small" />
                <Text className='text-[15px] font-bold text-white'>Saving password...</Text>
              </View>
            ) : (
              <Text className='text-[15px] font-bold text-white'>Save Password</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
