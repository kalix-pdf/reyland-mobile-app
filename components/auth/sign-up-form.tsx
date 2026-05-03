import { AuthButton } from "@/components/auth/auth-button";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthMessage } from "@/components/auth/auth-message";
import { AuthScreen } from "@/components/auth/auth-screen";
import { AppColors } from "@/constants/colors";
import { useAppTheme } from "@/context/theme-context";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

type SignUpFormProps = {
  onSignUp: (name: string, email: string, password: string) => boolean | Promise<boolean>;
  onLogin?: () => void;
  onGoogleSignUp?: () => void;
  onFacebookSignUp?: () => void;
  isGoogleLoading?: boolean;
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

export function SignUpForm({ onSignUp, onLogin, onGoogleSignUp, onFacebookSignUp, isGoogleLoading }: SignUpFormProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signUpError, setSignUpError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [termsTouched, setTermsTouched] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  const shouldValidateName = submitted || nameTouched;
  const shouldValidateEmail = submitted || emailTouched;
  const shouldValidatePassword = submitted || passwordTouched;
  const shouldValidateTerms = submitted || termsTouched;

  const nameError =
    shouldValidateName && trimmedName.length === 0
      ? "Full name is required."
      : shouldValidateName && !isValidName(trimmedName)
        ? "Name must be at least 2 characters."
        : "";

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

  const termsError = shouldValidateTerms && !acceptTerms ? "Please accept the terms to continue." : "";

  const handleSignUp = async () => {
    if (isLoading) return;

    setSubmitted(true);
    setNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setTermsTouched(true);
    setSignUpError("");

    if (!isValidName(trimmedName)) return;
    if (!isValidEmail(trimmedEmail)) return;
    if (!isValidPassword(password)) return;
    if (!acceptTerms) return;

    try {
      setIsLoading(true);

      const success = await onSignUp(trimmedName, trimmedEmail, password);

      if (!success) {
        setSignUpError("Unable to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setSignUpError("");

    if (submitted) {
      setNameTouched(true);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setSignUpError("");

    if (submitted) {
      setEmailTouched(true);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setSignUpError("");

    if (submitted) {
      setPasswordTouched(true);
    }
  };

  const handleLogin = () => {
    if (isLoading) return;
    onLogin?.();
  };

  const handleGoogleSignUp = () => {
    if (isLoading) return;
    onGoogleSignUp?.();
  };

  const handleFacebookSignUp = () => {
    if (isLoading) return;
    onFacebookSignUp?.();
  };

  return (
    <AuthScreen heroTitle="Create your account and start exploring Reyland properties.">
      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.accountRow}>
        <Text style={styles.accountText}>Already have an account?</Text>

        <Pressable onPress={handleLogin} hitSlop={8}>
          <Text style={styles.accountLink}> Login</Text>
        </Pressable>
      </View>

      <AuthMessage type="error" message={signUpError} />

      <View style={styles.inputArea}>
        <AuthInput
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
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={handleSignUp}
          editable={!isLoading}
        />
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
          I agree to the <Text style={styles.termsLink}>Terms</Text> and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </Pressable>

      {termsError ? <Text style={styles.termsErrorText}>{termsError}</Text> : null}

      <View style={styles.buttonWrap}>
        <AuthButton
          title="Create Account"
          loadingTitle="Creating account..."
          loading={isLoading}
          onPress={handleSignUp}
        />
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or Continue With</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialButtons}>
        <Pressable
          style={({ pressed }) => [styles.socialButton, pressed && !isLoading && styles.socialButtonPressed]}
          onPress={handleFacebookSignUp}
          disabled={isLoading}
        >
          <Ionicons name="logo-facebook" size={22} color={colors.facebook} />
          <Text style={styles.socialButtonText}>Facebook</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.socialButton,
            pressed && !isLoading && !isGoogleLoading && styles.socialButtonPressed,
            isGoogleLoading && styles.socialButtonPressed,
          ]}
          onPress={onGoogleSignUp}
          disabled={isLoading || isGoogleLoading}
          accessibilityLabel="Sign up with Google"
          accessibilityRole="button"
        >
          {isGoogleLoading ? (
            <ActivityIndicator size="small" color="#4285F4" />
          ) : (
            <Image
              source={require('@/assets/images/google-logo.png')}
              style={styles.googleIcon}
              contentFit="contain"
            />
          )}
          <Text style={styles.socialButtonText}>
            {isGoogleLoading ? 'Signing in…' : 'Google'}
          </Text>
        </Pressable>
      </View>
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

    termsRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      marginTop: 16,
      marginBottom: 8,
    },

    checkbox: {
      width: 16,
      height: 16,
      borderRadius: 4,
      borderWidth: 1.4,
      borderColor: Colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 2,
    },

    checkboxChecked: {
      backgroundColor: Colors.accent,
      borderColor: Colors.accent,
    },

    termsText: {
      flex: 1,
      color: Colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "600",
    },

    termsLink: {
      color: Colors.accent,
      fontWeight: "900",
    },

    termsErrorText: {
      color: Colors.error,
      fontSize: 12,
      fontWeight: "700",
      marginBottom: 8,
      marginLeft: 24,
    },

    buttonWrap: {
      marginTop: 8,
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
  });
