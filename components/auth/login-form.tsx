import { AuthButton } from "@/components/auth/auth-button";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthMessage } from "@/components/auth/auth-message";
import { AuthScreen } from "@/components/auth/auth-screen";
import { AppColors } from "@/constants/colors";
import { useAppTheme } from "@/context/theme-context";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type LoginFormProps = {
  onLogin: (email: string, password: string) => boolean | Promise<boolean>;
  onForgotPassword?: () => void;
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  onCreateAccount?: () => void;
};

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
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [email, setEmail] = useState("juan@email.com");
  const [password, setPassword] = useState("password123");

  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

  const handleLogin = async () => {
    if (isLoading) return;

    setSubmitted(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setLoginError("");

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

  const handleForgotPassword = () => {
    if (isLoading) return;
    onForgotPassword?.();
  };

  const handleCreateAccount = () => {
    if (isLoading) return;
    onCreateAccount?.();
  };

  const handleGoogleLogin = () => {
    if (isLoading) return;
    onGoogleLogin?.();
  };

  const handleFacebookLogin = () => {
    if (isLoading) return;
    onFacebookLogin?.();
  };

  return (
    <AuthScreen heroTitle="Log in to find your next property with Reyland.">
      <Text style={styles.title}>Login</Text>

      <View style={styles.accountRow}>
        <Text style={styles.accountText}>Don’t have an account?</Text>

        <Pressable onPress={handleCreateAccount} hitSlop={8}>
          <Text style={styles.accountLink}> Sign Up</Text>
        </Pressable>
      </View>

      <AuthMessage type="error" message={loginError} />

      <View style={styles.inputArea}>
        <AuthInput
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
          icon={(color) => <Feather name="lock" size={20} color={color} />}
          rightElement={(color) => (
            <Pressable
              onPress={() => setShowPassword((current) => !current)}
              hitSlop={8}
              style={styles.eyeButton}
              disabled={isLoading}
            >
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={21} color={color} />
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

        <Pressable onPress={handleForgotPassword} hitSlop={8}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </Pressable>
      </View>

      <AuthButton title="Login" loadingTitle="Logging in..." loading={isLoading} onPress={handleLogin} />

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
          <Ionicons name="logo-facebook" size={22} color={colors.facebook} />
          <Text style={styles.socialButtonText}>Facebook</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.socialButton, pressed && !isLoading && styles.socialButtonPressed]}
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          <Image source={require("@/assets/images/google-logo.png")} style={styles.googleIcon} contentFit="contain" />
          <Text style={styles.socialButtonText}>Google</Text>
        </Pressable>
      </View>

      <Text style={styles.hint}>Hint: juan@email.com / password123</Text>
    </AuthScreen>
  );
}

const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
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
      fontSize: 13,
      fontWeight: "900",
    },

    inputArea: {
      gap: 12,
    },

    eyeButton: {
      paddingLeft: 10,
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
      backgroundColor: Colors.surfaceMuted,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
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
      fontWeight: "800",
    },

    hint: {
      color: Colors.textMuted,
      fontSize: 12,
      textAlign: "center",
      marginTop: 18,
    },
  });
