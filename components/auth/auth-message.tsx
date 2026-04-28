import { AppColors } from "@/constants/colors";
import { useAppTheme } from "@/context/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type AuthMessageProps = {
  type: "error" | "success";
  message?: string;
};

export function AuthMessage({ type, message }: AuthMessageProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  if (!message) return null;

  const isError = type === "error";

  return (
    <View style={[styles.box, isError ? styles.errorBox : styles.successBox]}>
      <Ionicons
        name={isError ? "alert-circle-outline" : "checkmark-circle-outline"}
        size={18}
        color={isError ? colors.error : colors.success}
      />

      <Text style={[styles.text, isError ? styles.errorText : styles.successText]}>{message}</Text>
    </View>
  );
}

const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
    box: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      borderWidth: 1,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 14,
    },

    errorBox: {
      backgroundColor: Colors.errorBackground,
      borderColor: Colors.errorBorder,
    },

    successBox: {
      backgroundColor: Colors.rentBadge,
      borderColor: Colors.border,
    },

    text: {
      flex: 1,
      fontSize: 13,
      fontWeight: "700",
    },

    errorText: {
      color: Colors.error,
    },

    successText: {
      color: Colors.success,
    },
  });
