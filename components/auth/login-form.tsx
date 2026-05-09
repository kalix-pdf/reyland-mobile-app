import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthMessage } from '@/components/auth/auth-message';
import { AuthScreen } from '@/components/auth/auth-screen';
import { useAppTheme } from '@/context/theme-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { createLoginFormStyles } from '../../styles/auth.styles';

type LoginFormProps = {
  onLogin: (
    email: string,
    password: string,
  ) => { success: boolean; message?: string } | Promise<{ success: boolean; message?: string }>;
  onForgotPassword?: () => void;
  onGoogleLogin: () => void;
  onLoadingGoogleOuth: boolean;
  onLoadingFacebookOuth: boolean;
  onFacebookLogin?: () => void;
  onCreateAccount?: () => void;
};

export function LoginForm({
  onLogin,
  onForgotPassword,
  onGoogleLogin,
  onLoadingGoogleOuth,
  onLoadingFacebookOuth,
  onFacebookLogin,
  onCreateAccount,
}: LoginFormProps) {
  const { colors } = useAppTheme();
  const styles = createLoginFormStyles(colors);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const trimmedEmail = email.trim();

  const shouldValidateEmail = submitted || emailTouched;
  const shouldValidatePassword = submitted || passwordTouched;

  const emailError = shouldValidateEmail && trimmedEmail.length === 0 ? 'Email is required.' : '';

  const passwordError = shouldValidatePassword && password.length === 0 ? 'Password is required.' : '';

  const canSubmit = trimmedEmail.length > 0 && password.length > 0;

  const handleLogin = async () => {
    if (isLoading) return;

    setSubmitted(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setLoginError('');

    if (trimmedEmail.length === 0) return;
    if (password.length === 0) return;

    try {
      setIsLoading(true);

      const result = await onLogin(trimmedEmail, password);

      if (!result.success) {
        // setLoginError(result.message || 'Invalid email or password.');
        setLoginError('Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setLoginError('');

    if (submitted) {
      setEmailTouched(true);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setLoginError('');

    if (submitted) {
      setPasswordTouched(true);
    }
  };

  const handleForgotPassword = () => {
    if (isLoading) return;
    onForgotPassword?.();
  };

  const handleCreateAccount = () => {
    if (isLoading) return;
    onCreateAccount?.();
  };

  return (
    <AuthScreen heroTitle={`Welcome\nBack`}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitleDefault}>
        Sign in to continue browsing verified listings, saved properties, and your latest activity.
      </Text>

      <AuthMessage type="error" message={loginError} />

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
          returnKeyType="next"
          editable={!isLoading}
        />

        <AuthInput
          label="Password"
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
          placeholder="Password"
          value={password}
          onChangeText={handlePasswordChange}
          onBlur={() => {
            if (password.length > 0 || submitted) {
              setPasswordTouched(true);
            }
          }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          editable={!isLoading}
        />
      </View>

      <View style={styles.optionsRow}>
        <Pressable style={styles.rememberRow} onPress={() => setRememberMe((current) => !current)} hitSlop={8}>
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe ? <Ionicons name="checkmark" size={13} color={colors.white} /> : null}
          </View>

          <Text style={styles.rememberText}>Remember Me</Text>
        </Pressable>

        <Pressable style={styles.forgotLinkRow} onPress={handleForgotPassword} hitSlop={8}>
          <Text style={styles.forgotLinkLabel}>Forgot password?</Text>
          <Text style={styles.forgotLinkText}> Reset it here</Text>
        </Pressable>
      </View>

      <View style={styles.buttonWrapTop4}>
        <AuthButton
          title="SIGN IN"
          loadingTitle="Signing in..."
          loading={isLoading}
          onPress={handleLogin}
          disabled={!canSubmit || isLoading || onLoadingFacebookOuth || onLoadingGoogleOuth}
        />
      </View>

      {/* <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or Continue With</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialButtons}>
        <Pressable
          style={({ pressed }) => [
            styles.socialButton,
            pressed && !isLoading && !onLoadingFacebookOuth && styles.socialButtonPressed,
            onLoadingFacebookOuth && styles.socialButtonPressed,
          ]}
          onPress={handleFacebookLogin}
          disabled={isLoading || onLoadingFacebookOuth || onLoadingGoogleOuth}
          accessibilityLabel="Sign-in with Google"
          accessibilityRole="button"
        >
          {onLoadingFacebookOuth ? (
            <ActivityIndicator size="small" color="#4285F4" />
          ) : (
            <Ionicons name="logo-facebook" size={22} color={colors.facebook} />
          )}
          <Text style={styles.socialButtonText}>{onLoadingFacebookOuth ? 'Signing in...' : 'Facebook'}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.socialButton,
            pressed && !isLoading && !onLoadingGoogleOuth && styles.socialButtonPressed,
            onLoadingGoogleOuth && styles.socialButtonPressed,
          ]}
          onPress={handleGoogleLogin}
          disabled={isLoading || onLoadingFacebookOuth || onLoadingGoogleOuth}
          accessibilityLabel="Sign-in with Google"
          accessibilityRole="button"
        >
          {onLoadingGoogleOuth ? (
            <ActivityIndicator size="small" color="#4285F4" />
          ) : (
            <Image source={require('@/assets/images/google-logo.png')} style={styles.googleIcon} />
          )}
          <Text style={styles.socialButtonText}>{onLoadingGoogleOuth ? 'Signing in...' : 'Google'}</Text>
        </Pressable>
      </View> */}

      <View style={styles.accountFooterRowSpacious}>
        <Text style={styles.accountText}>Don’t have an account?</Text>

        <Pressable onPress={handleCreateAccount} hitSlop={8}>
          <Text style={styles.accountLink}> Sign Up</Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}
