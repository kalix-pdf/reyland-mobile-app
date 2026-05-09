import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthMessage } from '@/components/auth/auth-message';
import { AuthScreen } from '@/components/auth/auth-screen';
import { useAppTheme } from '@/context/theme-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { createForgotPasswordFormStyles } from '../../styles/auth.styles';

type ForgotPasswordFormProps = {
  onSubmit: (email: string) => boolean | Promise<boolean>;
  onLogin?: () => void;
};

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export function ForgotPasswordForm({ onSubmit, onLogin }: ForgotPasswordFormProps) {
  const { colors } = useAppTheme();
  const styles = createForgotPasswordFormStyles(colors);

  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const trimmedEmail = email.trim();
  const shouldValidateEmail = submitted || emailTouched;
  const canSubmit = isValidEmail(trimmedEmail);

  const emailError =
    shouldValidateEmail && trimmedEmail.length === 0
      ? 'Email is required.'
      : shouldValidateEmail && !isValidEmail(trimmedEmail)
        ? 'Please enter a valid email address.'
        : '';

  const handleSubmit = async () => {
    if (isLoading) return;

    setSubmitted(true);
    setEmailTouched(true);
    setError('');
    setSuccessMessage('');

    if (!isValidEmail(trimmedEmail)) return;

    try {
      setIsLoading(true);

      const success = await onSubmit(trimmedEmail);

      if (!success) {
        setError('We couldn’t send the reset link. Please try again.');
        return;
      }

      setSuccessMessage('Password reset instructions have been sent to your email.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'We couldn’t send the reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError('');
    setSuccessMessage('');

    if (submitted) {
      setEmailTouched(true);
    }
  };

  const handleLogin = () => {
    if (isLoading) return;
    onLogin?.();
  };

  return (
    <AuthScreen heroTitle={`Forgot Your\nPassword?`}>
      <Text style={styles.title}>Reset Password</Text>

      <Text style={styles.subtitleDefault}>
        Enter the email linked to your account and we’ll send you instructions to reset your password.
      </Text>

      <AuthMessage type="error" message={error} />
      <AuthMessage type="success" message={successMessage} />

      <View style={styles.inputAreaDefault}>
        <AuthInput
          label="Email"
          icon={(color) => <MaterialCommunityIcons name="email-outline" size={20} color={color} />}
          error={emailError}
          placeholder="Enter your email address"
          value={email}
          onChangeText={handleEmailChange}
          onBlur={() => {
            if (email.trim().length > 0 || submitted) {
              setEmailTouched(true);
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
          editable={!isLoading}
        />
      </View>

      <View style={styles.buttonWrap}>
        <AuthButton
          title="Send Reset Link"
          loadingTitle="Sending link..."
          loading={isLoading}
          onPress={handleSubmit}
          disabled={!canSubmit}
        />
      </View>

      <View style={styles.supportCard}>
        <View style={styles.supportIconWrap}>
          <Ionicons name="mail-open-outline" size={18} color={colors.accent} />
        </View>

        <View style={styles.supportCopy}>
          <Text style={styles.supportTitle}>Check your inbox and spam folder</Text>
          <Text style={styles.supportText}>
            Reset emails can take a minute to arrive. If nothing shows up, try requesting a new link.
          </Text>
        </View>
      </View>

      <View style={styles.helpRow}>
        <Text style={styles.helpLabel}>Still having trouble?</Text>
        <Pressable hitSlop={8}>
          <Text style={styles.helpLink}> Contact support</Text>
        </Pressable>
      </View>

      <Pressable style={styles.backButton} onPress={handleLogin} hitSlop={8}>
        <Ionicons name="arrow-back" size={16} color={colors.accent} />
        <Text style={styles.backButtonText}>Back to Login</Text>
      </Pressable>
    </AuthScreen>
  );
}
