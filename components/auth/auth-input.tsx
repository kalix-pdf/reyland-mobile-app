import { AppColors } from "@/constants/colors";
import { useAppTheme } from "@/context/theme-context";
import { ReactNode, useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type AuthInputProps = TextInputProps & {
  error?: string;
  icon: (color: string) => ReactNode;
  rightElement?: (color: string) => ReactNode;
};

export function AuthInput({ error, icon, rightElement, onFocus, onBlur, ...textInputProps }: AuthInputProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  const iconColor = hasError ? colors.error : isFocused ? colors.accent : colors.textMuted;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          isFocused && !hasError && styles.inputWrapperFocused,
          hasError && styles.inputWrapperError,
        ]}
      >
        <View style={styles.inputIcon}>{icon(iconColor)}</View>

        <TextInput
          {...textInputProps}
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
        />

        {rightElement ? rightElement(iconColor) : null}
      </View>

      {error ? <Text style={styles.fieldErrorText}>{error}</Text> : null}
    </View>
  );
}

const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
    container: {
      gap: 12,
    },

    inputWrapper: {
      minHeight: 56,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.surfaceMuted,
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
      borderColor: Colors.error,
      backgroundColor: Colors.errorBackground,
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

    fieldErrorText: {
      color: Colors.error,
      fontSize: 12,
      fontWeight: "700",
      marginTop: -6,
      marginLeft: 16,
    },
  });
