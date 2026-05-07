import { AppColors } from "@/constants/colors";
import { useAppTheme } from "@/context/theme-context";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

type AuthButtonProps = {
  title: string;
  loadingTitle?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function AuthButton({
  title,
  loadingTitle = "Loading...",
  loading = false,
  disabled = false,
  onPress,
}: AuthButtonProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <LinearGradient
        colors={[colors.accent, colors.accentDark, colors.primary]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.buttonFill}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.white} size="small" />
            <Text style={styles.buttonText}>{loadingTitle}</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
    button: {
      borderRadius: 999,
      overflow: "hidden",
      minHeight: 52,
      shadowColor: Colors.primary,
      shadowOpacity: 0.14,
      shadowRadius: 14,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      elevation: 4,
    },

    buttonFill: {
      minHeight: 52,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
    },

    buttonDisabled: {
      opacity: 0.75,
    },

    buttonPressed: {
      opacity: 0.9,
      transform: [{ scale: 0.985 }],
    },

    buttonText: {
      color: Colors.white,
      fontSize: 15,
      fontWeight: "900",
    },

    loadingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
  });
