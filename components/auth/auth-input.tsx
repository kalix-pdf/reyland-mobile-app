import { AppColors } from "@/constants/colors";
import { useAppTheme } from "@/context/theme-context";
import { ReactNode, useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type AuthInputProps = TextInputProps & {
  error?: string;
  icon: (color: string) => ReactNode;
  rightElement?: (color: string) => ReactNode;
  label?: string;
};

export function AuthInput({ error, icon, rightElement, label, onFocus, onBlur, ...textInputProps }: AuthInputProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  const iconColor = hasError ? colors.error : isFocused ? colors.accent : colors.textMuted;

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, hasError && styles.labelError]}>{label}</Text> : null}
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
      gap: 6,
    },

    label: {
      color: Colors.accent,
      fontSize: 13,
      fontWeight: "800",
    },

    labelError: {
      color: Colors.error,
    },

    inputWrapper: {
      minHeight: 48,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "transparent",
      borderBottomWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: 0,
    },

    inputWrapperFocused: {
      borderColor: Colors.accent,
    },

    inputWrapperError: {
      borderColor: Colors.error,
    },

    inputIcon: {
      marginRight: 10,
    },

    input: {
      flex: 1,
      color: Colors.textPrimary,
      fontSize: 14,
      paddingVertical: 12,
    },

    fieldErrorText: {
      color: Colors.error,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 2,
    },
  });
