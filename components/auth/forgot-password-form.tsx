import { AuthButton } from "@/components/auth/auth-button";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthMessage } from "@/components/auth/auth-message";
import { AuthScreen } from "@/components/auth/auth-screen";
import { AppColors } from "@/constants/colors";
import { useAppTheme } from "@/context/theme-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ForgotPasswordFormProps = {
  onSubmit: (email: string) => boolean | Promise<boolean>;
  onLogin?: () => void;
};

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};

export function ForgotPasswordForm({ onSubmit, onLogin }: ForgotPasswordFormProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const trimmedEmail = email.trim();
  const shouldValidateEmail = submitted || emailTouched;

  const emailError =
    shouldValidateEmail && trimmedEmail.length === 0
      ? "Email is required."
      : shouldValidateEmail && !isValidEmail(trimmedEmail)
        ? "Please enter a valid email address."
        : "";

  const handleSubmit = async () => {
    if (isLoading) return;

    setSubmitted(true);
    setEmailTouched(true);
    setError("");
    setSuccessMessage("");

    if (!isValidEmail(trimmedEmail)) return;

    try {
      setIsLoading(true);

      const success = await onSubmit(trimmedEmail);

      if (!success) {
        setError("We couldn’t send the reset link. Please try again.");
        return;
      }

      setSuccessMessage("Password reset instructions have been sent to your email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError("");
    setSuccessMessage("");

    if (submitted) {
      setEmailTouched(true);
    }
  };

  const handleLogin = () => {
    if (isLoading) return;
    onLogin?.();
  };

  return (
    <AuthScreen heroTitle="Reset your password and get back to exploring Reyland properties.">
      <Text style={styles.title}>Forgot Password</Text>

      <Text style={styles.description}>
        Enter the email linked to your account and we’ll send you instructions to reset your password.
      </Text>

      <View style={styles.accountRow}>
        <Text style={styles.accountText}>Remember your password?</Text>

        <Pressable onPress={handleLogin} hitSlop={8}>
          <Text style={styles.accountLink}> Login</Text>
        </Pressable>
      </View>

      <AuthMessage type="error" message={error} />
      <AuthMessage type="success" message={successMessage} />

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
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
          editable={!isLoading}
        />
      </View>

      <View style={styles.buttonWrap}>
        <AuthButton title="Send Reset Link" loadingTitle="Sending link..." loading={isLoading} onPress={handleSubmit} />
      </View>

      <Pressable style={styles.backButton} onPress={handleLogin} hitSlop={8}>
        <Ionicons name="arrow-back" size={16} color={colors.accent} />
        <Text style={styles.backButtonText}>Back to Login</Text>
      </Pressable>
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
      marginBottom: 10,
    },

    description: {
      color: Colors.textSecondary,
      fontSize: 13,
      lineHeight: 20,
      textAlign: "center",
      fontWeight: "600",
      marginBottom: 14,
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

    buttonWrap: {
      marginTop: 22,
    },

    backButton: {
      marginTop: 22,
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    backButtonText: {
      color: Colors.accent,
      fontSize: 13,
      fontWeight: "900",
    },
  });
