import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthMessage } from '@/components/auth/auth-message';
import { AuthScreen } from '@/components/auth/auth-screen';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type SignUpFormProps = {
  onSignUp: (
    name: string,
    email: string,
    password: string,
  ) => { success: boolean; message?: string } | Promise<{ success: boolean; message?: string }>;
  onLogin?: () => void;
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

export function SignUpForm({onSignUp, onLogin}: SignUpFormProps) {
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
    <AuthScreen heroTitle={`Let's Find \nYour Home`}>
      <Text className="text-2xl font-black text-center text-textPrimary mb-1.5">Create Account</Text>
      <Text className="text-base leading-[18px] text-center font-semibold text-textSecondary mb-4 min-h-[40px]">
        Create your profile to save listings, track favorites, and continue across devices.
      </Text>

      <AuthMessage type="success" message={signUpSuccess} />
      <AuthMessage type="error" message={signUpError} />

      {!hasCompletedSignUp ? (
        <>
          <View className="gap-2.5">
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
                  className="pl-2.5"
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

            <View className="flex-row items-center gap-2 -mt-1 ml-4">
              <Ionicons
                name={isValidPassword(password) ? 'checkmark-circle' : 'information-circle-outline'}
                size={15}
                className={isValidPassword(password) ? 'text-success' : 'text-textMuted'}
              />
              <Text
                className={`text-xs font-semibold ${
                  isValidPassword(password) ? 'text-success' : 'text-textMuted'
                }`}
              >
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
                  className="pl-2.5"
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
              <View className="flex-row items-center gap-2 -mt-1 ml-4">
                <Ionicons name="checkmark-circle" size={15} className="text-success" />
                <Text className="text-xs font-bold text-success">Passwords match.</Text>
              </View>
            ) : null}
          </View>

          <Pressable
            className="flex-row items-start gap-2 mt-2 mb-1"
            onPress={() => {
              setAcceptTerms((current) => !current);
              setTermsTouched(true);
            }}
            hitSlop={8}
          >
            <View
              className={`w-4 h-4 rounded-[4px] border items-center justify-center mt-0.5 ${
                acceptTerms ? 'bg-accent border-accent' : 'border-borderDark'
              }`}
            >
              {acceptTerms ? <Ionicons name="checkmark" size={13} color="white" /> : null}
            </View>

            <Text className="flex-1 leading-[18px] font-semibold text-textSecondary">
              I agree to the <Text className="font-black text-accent">Terms</Text> and{' '}
              <Text className="font-black text-accent">Privacy Policy</Text>
            </Text>
          </Pressable>

          {termsError ? (
            <Text className="text-xs font-bold text-error mb-2 ml-6">{termsError}</Text>
          ) : null}
        </>
      ) : (
        <View className="mt-2 mb-1 px-1 py-2 items-start rounded-3xl border border-border bg-surface">
          <Text className="text-2xl font-black text-textPrimary mb-2 px-3.5">Check Your Inbox</Text>
          <Text className="text-[13px] leading-5 font-semibold text-left text-textSecondary px-3.5 pb-2">
            Your account has been created. Open the confirmation email we sent you to verify your address and finish
            setting up access.
          </Text>
        </View>
      )}

      <View className="w-full mt-1.5">
        <AuthButton
          title={hasCompletedSignUp ? 'BACK TO SIGN IN' : 'SIGN UP'}
          loadingTitle={hasCompletedSignUp ? 'Opening sign in...' : 'Creating account...'}
          loading={isLoading}
          disabled={
            hasCompletedSignUp ? false : Boolean(signUpSuccess) || !canSubmit
          }
          onPress={hasCompletedSignUp ? handleLogin : handleSignUp}
        />
      </View>

      {!hasCompletedSignUp ? (
        <View className="flex-row items-center justify-center mt-5">
          <Text className="text-base font-semibold text-textMuted">Already have an account?</Text>

          <Pressable onPress={handleLogin} hitSlop={8}>
            <Text className="text-base font-black text-accent"> Sign in</Text>
          </Pressable>
        </View>
      ) : null}
    </AuthScreen>
  );
}
