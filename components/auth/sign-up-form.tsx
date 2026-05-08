import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthMessage } from '@/components/auth/auth-message';
import { AuthScreen } from '@/components/auth/auth-screen';
import { AppColors } from '@/constants/colors';
import { useAppTheme } from '@/context/theme-context';
import { createAuthFormStyles } from '@/styles/global.css';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type SignUpFormProps = {
  onSignUp: (
    name: string,
    email: string,
    password: string,
  ) => { success: boolean; message?: string } | Promise<{ success: boolean; message?: string }>;
  onLogin?: () => void;
  onGoogleSignUp?: () => void;
  onFacebookSignUp?: () => void;
  isGoogleLoading?: boolean;
  isFacebookLoading?: boolean;
};

const isValidName = (value: string) => {
  return value.trim().length >= 2;
};

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

const isValidPassword = (value: string) => {
  return value.length >= 6;
};

export function SignUpForm({
  onSignUp,
  onLogin,
  onGoogleSignUp,
  onFacebookSignUp,
  isGoogleLoading,
  isFacebookLoading,
}: SignUpFormProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [termsTouched, setTermsTouched] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCompletedSignUp, setHasCompletedSignUp] = useState(false);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  const shouldValidateName = !hasCompletedSignUp && (submitted || nameTouched);
  const shouldValidateEmail = !hasCompletedSignUp && (submitted || emailTouched);
  const shouldValidatePassword = !hasCompletedSignUp && (submitted || passwordTouched);
  const shouldValidateConfirmPassword = !hasCompletedSignUp && (submitted || confirmPasswordTouched);
  const shouldValidateTerms = !hasCompletedSignUp && (submitted || termsTouched);
  const hasConfirmPasswordValue = confirmPassword.trim().length > 0;
  const passwordsMatch = password === confirmPassword;
  const isConfirmPasswordReady = password.length > 0 && hasConfirmPasswordValue;
  const canSubmit =
    !hasCompletedSignUp &&
    isValidName(trimmedName) &&
    isValidEmail(trimmedEmail) &&
    isValidPassword(password) &&
    passwordsMatch &&
    acceptTerms;

  const resetValidationState = () => {
    setSubmitted(false);
    setNameTouched(false);
    setEmailTouched(false);
    setPasswordTouched(false);
    setConfirmPasswordTouched(false);
    setTermsTouched(false);
  };

  const nameError =
    shouldValidateName && trimmedName.length === 0
      ? 'Full name is required.'
      : shouldValidateName && !isValidName(trimmedName)
        ? 'Name must be at least 2 characters.'
        : '';

  const emailError =
    shouldValidateEmail && trimmedEmail.length === 0
      ? 'Email is required.'
      : shouldValidateEmail && !isValidEmail(trimmedEmail)
        ? 'Please enter a valid Email address.'
        : '';

  const passwordError =
    shouldValidatePassword && password.length === 0
      ? 'Password is required.'
      : shouldValidatePassword && !isValidPassword(password)
        ? 'Password must be at least 6 characters.'
        : '';

  const confirmPasswordError =
    shouldValidateConfirmPassword && !hasConfirmPasswordValue
      ? 'Please confirm your password.'
      : shouldValidateConfirmPassword && !passwordsMatch
        ? "Passwords don't match."
        : '';

  const termsError = shouldValidateTerms && !acceptTerms ? 'Please accept the terms to continue.' : '';
  // const shouldEnableScroll =
  //   Boolean(signUpSuccess) ||
  //   Boolean(signUpError) ||
  //   Boolean(nameError) ||
  //   Boolean(emailError) ||
  //   Boolean(passwordError) ||
  //   Boolean(confirmPasswordError) ||
  //   Boolean(termsError);

  const handleSignUp = async () => {
    if (isLoading) return;

    setSubmitted(true);
    setNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);
    setTermsTouched(true);
    setSignUpError('');
    setSignUpSuccess('');
    setHasCompletedSignUp(false);

    if (!isValidName(trimmedName)) return;
    if (!isValidEmail(trimmedEmail)) return;
    if (!isValidPassword(password)) return;
    if (!passwordsMatch) return;
    if (!acceptTerms) return;

    try {
      setIsLoading(true);

      const result = await onSignUp(trimmedName, trimmedEmail, password);

      if (!result.success) {
        setSignUpError(result.message || 'Unable to create account. Please try again.');
        return;
      }

      setSignUpSuccess(result.message || 'Account created successfully. You can sign in now.');
      setHasCompletedSignUp(true);
      resetValidationState();
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAcceptTerms(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setSignUpError('');
    if (hasCompletedSignUp) {
      setSignUpSuccess('');
      setHasCompletedSignUp(false);
    }

    if (submitted) {
      setNameTouched(true);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setSignUpError('');
    if (hasCompletedSignUp) {
      setSignUpSuccess('');
      setHasCompletedSignUp(false);
    }

    if (submitted) {
      setEmailTouched(true);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setSignUpError('');
    if (hasCompletedSignUp) {
      setSignUpSuccess('');
      setHasCompletedSignUp(false);
    }

    if (submitted) {
      setPasswordTouched(true);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setSignUpError('');
    if (hasCompletedSignUp) {
      setSignUpSuccess('');
      setHasCompletedSignUp(false);
    }

    if (submitted) {
      setConfirmPasswordTouched(true);
    }
  };

  const handleLogin = () => {
    if (isLoading) return;
    onLogin?.();
  };

  return (
    <AuthScreen heroTitle={`Create Your\nAccount`}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitleCompact}>
        Create your profile to save listings, track favorites, and continue across devices.
      </Text>

      <AuthMessage type="success" message={signUpSuccess} />
      <AuthMessage type="error" message={signUpError} />

      {!hasCompletedSignUp ? (
        <>
          <View style={styles.inputAreaTight}>
            <AuthInput
              label="Full Name"
              icon={(color) => <Feather name="user" size={20} color={color} />}
              error={nameError}
              placeholder="Full name"
              value={name}
              onChangeText={handleNameChange}
              onBlur={() => {
                if (name.trim().length > 0 || submitted) {
                  setNameTouched(true);
                }
              }}
              autoCapitalize="words"
              autoCorrect={false}
              textContentType="name"
              returnKeyType="next"
              editable={!isLoading}
            />

            <AuthInput
              label="Email"
              icon={(color) => <MaterialCommunityIcons name="email-outline" size={20} color={color} />}
              error={emailError}
              placeholder="Enter your Email address"
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
              textContentType="newPassword"
              returnKeyType="next"
              editable={!isLoading}
            />

            <View style={styles.passwordHintRow}>
              <Ionicons
                name={isValidPassword(password) ? 'checkmark-circle' : 'information-circle-outline'}
                size={15}
                color={isValidPassword(password) ? colors.success : colors.textMuted}
              />
              <Text style={[styles.passwordHintText, isValidPassword(password) && styles.passwordHintTextSuccess]}>
                Use at least 6 characters.
              </Text>
            </View>

            <AuthInput
              label="Confirm Password"
              icon={(color) => <Feather name="lock" size={20} color={color} />}
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
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              onBlur={() => {
                if (confirmPassword.length > 0 || submitted) {
                  setConfirmPasswordTouched(true);
                }
              }}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
              editable={!isLoading}
            />

            {isConfirmPasswordReady && !confirmPasswordError ? (
              <View style={styles.matchRow}>
                <Ionicons name="checkmark-circle" size={15} color={colors.success} />
                <Text style={styles.matchText}>Passwords match.</Text>
              </View>
            ) : null}
          </View>

          <Pressable
            style={styles.termsRow}
            onPress={() => {
              setAcceptTerms((current) => !current);
              setTermsTouched(true);
            }}
            hitSlop={8}
          >
            <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
              {acceptTerms ? <Ionicons name="checkmark" size={13} color={colors.white} /> : null}
            </View>

            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </Pressable>

          {termsError ? <Text style={styles.termsErrorText}>{termsError}</Text> : null}
        </>
      ) : (
        <View style={styles.successPanel}>
          <View style={styles.successKicker}>
            <View style={styles.successKickerBar} />
            <Text style={styles.successKickerText}>Account Created</Text>
          </View>
          <Text style={styles.successTitle}>Account Ready</Text>
          <Text style={styles.successSubtitle}>
            Your account was created successfully. Continue to sign in and start exploring Reyland.
          </Text>
        </View>
      )}

      <View style={styles.buttonWrapTop6}>
        <AuthButton
          title={hasCompletedSignUp ? 'CONTINUE TO SIGN IN' : 'SIGN UP'}
          loadingTitle={hasCompletedSignUp ? 'Opening sign in...' : 'Creating account...'}
          loading={isLoading}
          disabled={
            hasCompletedSignUp
              ? false
              : Boolean(signUpSuccess) || !canSubmit || isGoogleLoading || isFacebookLoading
          }
          onPress={hasCompletedSignUp ? handleLogin : handleSignUp}
        />
      </View>

      {!hasCompletedSignUp ? (
        <View style={styles.accountFooterRow}>
          <Text style={styles.accountText}>Already have an account?</Text>

          <Pressable onPress={handleLogin} hitSlop={8}>
            <Text style={styles.accountLink}> Sign in</Text>
          </Pressable>
        </View>
      ) : null}
    </AuthScreen>
  );
}

//par lipat mo to par sa iisang file, lahat ng css ng components
const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
    ...createAuthFormStyles(Colors),

    successPanel: {
      marginTop: 8,
      marginBottom: 4,
      paddingHorizontal: 4,
      paddingVertical: 8,
      alignItems: 'flex-start',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
    },

    successKicker: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14,
      paddingHorizontal: 14,
      paddingTop: 8,
    },

    successKickerBar: {
      width: 28,
      height: 3,
      borderRadius: 999,
      backgroundColor: Colors.success,
    },

    successKickerText: {
      color: Colors.success,
      fontSize: 11,
      fontWeight: '900',
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },

    successTitle: {
      color: Colors.textPrimary,
      fontSize: 24,
      fontWeight: '900',
      marginBottom: 8,
      paddingHorizontal: 14,
    },

    successSubtitle: {
      color: Colors.textSecondary,
      fontSize: 13,
      lineHeight: 20,
      fontWeight: '600',
      textAlign: 'left',
      paddingHorizontal: 14,
      paddingBottom: 8,
    },

    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 22,
      marginBottom: 14,
    },

    divider: {
      flex: 1,
      height: 1,
      backgroundColor: Colors.border,
    },

    dividerText: {
      color: Colors.textMuted,
      fontSize: 13,
      fontWeight: '700',
    },

    socialButtons: {
      flexDirection: 'row',
      gap: 12,
    },

    socialButton: {
      flex: 1,
      minHeight: 52,
      borderRadius: 26,
      backgroundColor: Colors.surfaceMuted,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: Colors.border,
    },

    socialButtonPressed: {
      opacity: 0.82,
      transform: [{ scale: 0.985 }],
    },

    googleIcon: {
      width: 20,
      height: 20,
    },

    socialButtonText: {
      color: Colors.textPrimary,
      fontSize: 14,
      fontWeight: '800',
    },
  });
