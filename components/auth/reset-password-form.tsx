import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthMessage } from '@/components/auth/auth-message';
import { AuthScreen } from '@/components/auth/auth-screen';
import { useAppTheme } from '@/context/theme-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { createResetPasswordFormStyles } from '../../styles/auth.styles';

type ResetPasswordFormProps = {
  onSubmit: (password: string) => Promise<{ success: boolean; message?: string }>;
  onBackToLogin: () => void;
};

export function ResetPasswordForm({ onSubmit, onBackToLogin }: ResetPasswordFormProps) {
  const { colors } = useAppTheme();
  const styles = createResetPasswordFormStyles(colors);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const shouldValidatePassword = submitted || passwordTouched;
  const shouldValidateConfirmPassword = submitted || confirmPasswordTouched;
  const passwordMeetsLength = password.length >= 6;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const passwordError =
    shouldValidatePassword && password.length === 0
      ? 'New password is required.'
      : shouldValidatePassword && !passwordMeetsLength
        ? 'Password must be at least 6 characters.'
        : '';

  const confirmPasswordError =
    shouldValidateConfirmPassword && confirmPassword.length === 0
      ? 'Please confirm your new password.'
      : shouldValidateConfirmPassword && password !== confirmPassword
        ? 'Passwords do not match.'
        : '';

  const canSubmit = passwordMeetsLength && passwordsMatch;

  const handleSubmit = async () => {
    if (isLoading) return;

    setSubmitted(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);
    setError('');
    setSuccessMessage('');

    if (!passwordMeetsLength || password !== confirmPassword) {
      return;
    }

    try {
      setIsLoading(true);

      const result = await onSubmit(password);
      if (!result.success) {
        setError(result.message || 'We couldn’t update your password. Please try again.');
        return;
      }

      setSuccessMessage(result.message || 'Password updated. You can continue into your account.');
      setTimeout(() => {
        onBackToLogin();
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreen heroTitle={`Choose a\nNew Password`}>
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.subtitleDefault}>
        Create a new password for your account. Once saved, you’ll be signed in automatically.
      </Text>

      <AuthMessage type="error" message={error} />
      <AuthMessage type="success" message={successMessage} />

      <View style={styles.inputAreaDefault}>
        <AuthInput
          label="New Password"
          icon={(color) => <Feather name="lock" size={20} color={color} />}
          rightElement={(color) => (
            <Pressable
              onPress={() => setShowPassword((current) => !current)}
              hitSlop={8}
              style={styles.eyeButton}
              disabled={isLoading}
            >
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={21} color={color} />
            </Pressable>
          )}
          error={passwordError}
          placeholder="Enter your new password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setError('');
            setSuccessMessage('');
            if (submitted) {
              setPasswordTouched(true);
            }
          }}
          onBlur={() => {
            if (password.length > 0 || submitted) {
              setPasswordTouched(true);
            }
          }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
          returnKeyType="next"
          editable={!isLoading}
        />

        <AuthInput
          label="Confirm Password"
          icon={(color) => <Feather name="shield" size={20} color={color} />}
          rightElement={(color) => (
            <Pressable
              onPress={() => setShowConfirmPassword((current) => !current)}
              hitSlop={8}
              style={styles.eyeButton}
              disabled={isLoading}
            >
              <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={21} color={color} />
            </Pressable>
          )}
          error={confirmPasswordError}
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChangeText={(value) => {
            setConfirmPassword(value);
            setError('');
            setSuccessMessage('');
            if (submitted) {
              setConfirmPasswordTouched(true);
            }
          }}
          onBlur={() => {
            if (confirmPassword.length > 0 || submitted) {
              setConfirmPasswordTouched(true);
            }
          }}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          editable={!isLoading}
        />
      </View>

      <View style={styles.buttonWrap}>
        <AuthButton
          title="Save New Password"
          loadingTitle="Saving password..."
          loading={isLoading}
          onPress={handleSubmit}
          disabled={!canSubmit}
        />
      </View>

      <View style={styles.passwordChecklist}>
        <Text style={styles.passwordChecklistTitle}>Use a password you can remember</Text>
        <Text style={styles.passwordChecklistItem}>At least 6 characters</Text>
        <Text style={styles.passwordChecklistItem}>Avoid reusing an old password</Text>
        <Text style={styles.passwordChecklistItem}>Mix letters, numbers, or symbols if possible</Text>
      </View>

      <Pressable style={styles.backButton} onPress={onBackToLogin} hitSlop={8}>
        <Ionicons name="arrow-back" size={16} color={colors.accent} />
        <Text style={styles.backButtonText}>Back to Login</Text>
      </Pressable>
    </AuthScreen>
  );
}
