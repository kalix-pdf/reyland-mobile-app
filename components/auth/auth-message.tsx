import { useAppTheme } from "@/context/theme-context";
import { createAuthComponentStyles } from "@/styles/global.css";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type AuthMessageProps = {
  type: "error" | "success";
  message?: string;
};

export function AuthMessage({ type, message }: AuthMessageProps) {
  const { colors } = useAppTheme();
  const styles = createAuthComponentStyles(colors);

  if (!message) return null;

  const isError = type === "error";

  return (
    <View style={[styles.messageBox, isError ? styles.messageErrorBox : styles.messageSuccessBox]}>
      <Ionicons
        name={isError ? "alert-circle-outline" : "checkmark-circle-outline"}
        size={18}
        color={isError ? colors.error : colors.success}
      />

      <Text style={[styles.messageText, isError ? styles.messageErrorText : styles.messageSuccessText]}>{message}</Text>
    </View>
  );
}
