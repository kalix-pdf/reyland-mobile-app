import { Colors } from "@/constants/color";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type LoginFormProps = {
  onLogin: (email: string, password: string) => boolean | Promise<boolean>;
  onForgotPassword?: () => void;
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  onCreateAccount?: () => void;
};

const ERROR_COLOR = Colors.error ?? "#DC2626";
const ERROR_BACKGROUND = Colors.errorBackground ?? "#FEF2F2";
const ERROR_BORDER = Colors.errorBorder ?? "#FCA5A5";

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

const isValidPassword = (value: string) => {
  return value.length >= 6;
};

export function LoginForm({
  onLogin,
  onForgotPassword,
  onGoogleLogin,
  onFacebookLogin,
  onCreateAccount,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const trimmedEmail = email.trim();

  const shouldValidateEmail = submitted || emailTouched;
  const shouldValidatePassword = submitted || passwordTouched;

  const emailError =
    shouldValidateEmail && trimmedEmail.length === 0
      ? "Email is required."
      : shouldValidateEmail && !isValidEmail(trimmedEmail)
        ? "Please enter a valid email address."
        : "";

  const passwordError =
    shouldValidatePassword && password.length === 0
      ? "Password is required."
      : shouldValidatePassword && !isValidPassword(password)
        ? "Password must be at least 6 characters."
        : "";

  const emailHasError = Boolean(emailError);
  const passwordHasError = Boolean(passwordError);

  const handleLogin = async () => {
    if (isLoading) return;

    setSubmitted(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setLoginError("");

    if (!trimmedEmail || !password) return;
    if (!isValidEmail(trimmedEmail)) return;
    if (!isValidPassword(password)) return;

    try {
      setIsLoading(true);

      const success = await onLogin(trimmedEmail, password);

      if (!success) {
        setLoginError("Invalid email or password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (isLoading) return;
    onGoogleLogin?.();
  };

  const handleFacebookLogin = () => {
    if (isLoading) return;
    onFacebookLogin?.();
  };

  const handleForgotPassword = () => {
    if (isLoading) return;
    onForgotPassword?.();
  };

  const handleCreateAccount = () => {
    if (isLoading) return;
    onCreateAccount?.();
  };

  const getInputWrapperStyle = (isFocused: boolean, hasError: boolean) => {
    return [
      styles.inputWrapper,
      isFocused && !hasError && styles.inputWrapperFocused,
      hasError && styles.inputWrapperError,
    ];
  };

  const getIconColor = (isFocused: boolean, hasError: boolean) => {
    if (hasError) return ERROR_COLOR;
    if (isFocused) return Colors.accent;
    return Colors.textMuted;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setLoginError("");

    if (submitted) {
      setEmailTouched(true);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setLoginError("");

    if (submitted) {
      setPasswordTouched(true);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screen}>
          <View style={styles.hero}>
            <View style={styles.heroDecorCircleOne} />
            <View style={styles.heroDecorCircleTwo} />

            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Log in to find your next property with Reyland.</Text>

              <View style={styles.logoCard}>
                <Image source={require("@/assets/images/logo.png")} style={styles.logoImage} contentFit="contain" />
              </View>
            </View>
          </View>

          <View style={styles.formPanel}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.accountRow}>
              <Text style={styles.accountText}>Don’t have an account?</Text>
              <Pressable onPress={handleCreateAccount} hitSlop={8}>
                <Text style={styles.accountLink}> Sign Up</Text>
              </Pressable>
            </View>

            {loginError ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={18} color={ERROR_COLOR} />
                <Text style={styles.errorText}>{loginError}</Text>
              </View>
            ) : null}

            <View style={styles.inputArea}>
              <View style={getInputWrapperStyle(isEmailFocused, emailHasError)}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={getIconColor(isEmailFocused, emailHasError)}
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  placeholderTextColor={Colors.textMuted}
                  value={email}
                  onChangeText={handleEmailChange}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => {
                    setIsEmailFocused(false);

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

                {emailHasError ? <Ionicons name="alert-circle" size={18} color={ERROR_COLOR} /> : null}
              </View>

              {emailError ? <Text style={styles.fieldErrorText}>{emailError}</Text> : null}

              <View style={getInputWrapperStyle(isPasswordFocused, passwordHasError)}>
                <Feather
                  name="lock"
                  size={20}
                  color={getIconColor(isPasswordFocused, passwordHasError)}
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={Colors.textMuted}
                  value={password}
                  onChangeText={handlePasswordChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => {
                    setIsPasswordFocused(false);

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

                <Pressable
                  onPress={() => setShowPassword((current) => !current)}
                  hitSlop={8}
                  style={styles.eyeButton}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={21}
                    color={getIconColor(isPasswordFocused, passwordHasError)}
                  />
                </Pressable>
              </View>

              {passwordError ? <Text style={styles.fieldErrorText}>{passwordError}</Text> : null}
            </View>

            <View style={styles.optionsRow}>
              <Pressable style={styles.rememberRow} onPress={() => setRememberMe((current) => !current)} hitSlop={8}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe ? <Ionicons name="checkmark" size={13} color="#fff" /> : null}
                </View>
                <Text style={styles.rememberText}>Remember Me</Text>
              </Pressable>

              <Pressable onPress={handleForgotPassword} hitSlop={8}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed && !isLoading && styles.buttonPressed,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.loginButtonText}>Logging in...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or Continue With</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtons}>
              <Pressable
                style={({ pressed }) => [styles.socialButton, pressed && !isLoading && styles.socialButtonPressed]}
                onPress={handleFacebookLogin}
                disabled={isLoading}
              >
                <Ionicons name="logo-facebook" size={22} color="#1877F2" />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.socialButton, pressed && !isLoading && styles.socialButtonPressed]}
                onPress={handleGoogleLogin}
                disabled={isLoading}
              >
                <Image
                  source={require("@/assets/images/google-logo.png")}
                  style={styles.googleIcon}
                  contentFit="contain"
                />
                <Text style={styles.socialButtonText}>Google</Text>
              </Pressable>
            </View>

            <Text style={styles.hint}>Hint: juan@email.com / password123</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scrollContent: {
    flexGrow: 1,
  },

  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  hero: {
    minHeight: 390,
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingTop: 80,
    overflow: "hidden",
  },

  heroContent: {
    flex: 1,
    justifyContent: "space-between",
  },

  heroTitle: {
    maxWidth: 300,
    color: "#FFFFFF",
    fontSize: 25,
    lineHeight: 33,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  heroDecorCircleOne: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    right: -50,
    top: 36,
  },

  heroDecorCircleTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    left: -85,
    bottom: 18,
  },

  logoCard: {
    alignSelf: "center",
    width: 170,
    height: 135,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
    shadowColor: Colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 8,
  },

  logoImage: {
    width: 290,
    height: 230,
  },

  formPanel: {
    flex: 1,
    marginTop: -30,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 24,
    paddingTop: 26,
    paddingBottom: 30,
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: -8,
    },
    elevation: 8,
  },

  title: {
    color: Colors.textPrimary,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },

  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  accountText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },

  accountLink: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: "900",
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: ERROR_BACKGROUND,
    borderWidth: 1,
    borderColor: ERROR_BORDER,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },

  errorText: {
    flex: 1,
    color: ERROR_COLOR,
    fontSize: 13,
    fontWeight: "700",
  },

  inputArea: {
    gap: 12,
  },

  inputWrapper: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8F8",
    borderWidth: 1.3,
    borderColor: Colors.border,
    borderRadius: 28,
    paddingHorizontal: 16,
  },

  inputWrapperFocused: {
    borderColor: Colors.accent,
    backgroundColor: Colors.surface,
  },

  inputWrapperError: {
    borderColor: ERROR_COLOR,
    backgroundColor: ERROR_BACKGROUND,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    paddingVertical: 14,
  },

  eyeButton: {
    paddingLeft: 10,
  },

  fieldErrorText: {
    color: ERROR_COLOR,
    fontSize: 12,
    fontWeight: "700",
    marginTop: -6,
    marginLeft: 16,
  },

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 20,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  checkbox: {
    width: 15,
    height: 15,
    borderRadius: 4,
    borderWidth: 1.4,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },

  rememberText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  forgotText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },

  loginButton: {
    minHeight: 56,
    backgroundColor: Colors.accent,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.accent,
    shadowOpacity: 0.26,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 5,
  },

  loginButtonDisabled: {
    opacity: 0.75,
  },

  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 26,
    marginBottom: 18,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },

  dividerText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },

  socialButtons: {
    flexDirection: "row",
    gap: 12,
  },

  socialButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 26,
    backgroundColor: "#F5F6F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#EEF0F0",
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
    fontWeight: "800",
  },

  hint: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 18,
  },
});
