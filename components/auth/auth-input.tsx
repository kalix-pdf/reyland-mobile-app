import { useAppTheme } from "@/context/theme-context";
import { createAuthComponentStyles } from "@/styles/global.css";
import { ReactNode, useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

type AuthInputProps = TextInputProps & {
  error?: string;
  icon: (color: string) => ReactNode;
  rightElement?: (color: string) => ReactNode;
  label?: string;
};

export function AuthInput({ error, icon, rightElement, label, onFocus, onBlur, ...textInputProps }: AuthInputProps) {
  const { colors } = useAppTheme();
  const styles = createAuthComponentStyles(colors);

  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  const iconColor = hasError ? colors.error : isFocused ? colors.accent : colors.textMuted;

  return (
    <View style={styles.inputContainer}>
      {label ? <Text style={[styles.inputLabel, hasError && styles.inputLabelError]}>{label}</Text> : null}
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
          style={styles.inputField}
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

      {error ? <Text style={styles.inputErrorText}>{error}</Text> : null}
    </View>
  );
}
