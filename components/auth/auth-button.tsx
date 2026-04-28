import { AppColors } from "@/constants/colors";
import { useAppTheme } from "@/context/theme-context";
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
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.white} size="small" />
          <Text style={styles.buttonText}>{loadingTitle}</Text>
        </View>
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </Pressable>
  );
}

const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
    button: {
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
