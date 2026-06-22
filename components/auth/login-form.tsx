import { AuthButton } from '@/components/auth/auth-button';
import { AuthInput } from '@/components/auth/auth-input';
import { AuthMessage } from '@/components/auth/auth-message';
import { AuthScreen } from '@/components/auth/auth-screen';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type LoginFormProps = {
  onLogin: (
    email: string,
    password: string,
  ) => { success: boolean; message?: string } | Promise<{ success: boolean; message?: string }>;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
};


export function LoginForm({onLogin, onForgotPassword, onCreateAccount}: LoginFormProps) {
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
        setLoginError(result.message ?? 'Invalid Credentials');
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
      <Text className="text-2xl text-center font-bold text-textPrimary">Sign In</Text>
      <Text className="text-sm text-center text-textSecondary mt-1 mb-5 leading-5">
        Sign in to continue browsing verified listings, saved properties, and your latest activity.
      </Text>

      <AuthMessage type="error" message={loginError} />

      <View className="gap-4">
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
              className="p-1"
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

      <View className="flex-row justify-between items-center mt-1.5 mb-3.5">
        <Pressable
          className="flex-row items-center gap-1.5"
          onPress={() => setRememberMe((current) => !current)}
          hitSlop={8}
        >
          <View
            className={`w-[18px] h-[18px] rounded-[4px] border items-center justify-center ${
              rememberMe ? 'bg-accent border-accent' : 'bg-surface border-border'
            }`}
          >
            {rememberMe ? <Ionicons name="checkmark" size={13} color="white" /> : null}
          </View>

          <Text className="text-sm font-semibold text-textSecondary">Remember Me</Text>
        </Pressable>

        <Pressable className="flex-row items-center ml-3" onPress={handleForgotPassword} hitSlop={8}>
          <Text className="text-sm font-black text-accent">Forgot password?</Text>
        </Pressable>
      </View>

      <View className="mt-2">
        <AuthButton
          title="SIGN IN"
          loadingTitle="Signing in..."
          loading={isLoading}
          onPress={handleLogin}
          disabled={!canSubmit || isLoading}
        />
      </View>

      <View className="flex-row justify-center items-center mt-6">
        <Text className="text-textSecondary">Don’t have an account?</Text>

        <Pressable onPress={handleCreateAccount} hitSlop={8}>
          <Text className="font-bold text-accent"> Sign Up</Text>
        </Pressable>
      </View>
    </AuthScreen>
  );
}
