import { Colors } from "@/constants/color";
import { useState } from "react";
import {
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from "react-native";

export function LoginForm({ onLogin }: { onLogin: (e: string, p: string) => boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    const success = onLogin(email.trim(), password);
    if (!success) setError("Invalid email or password.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome Back</Text>
      <Text style={styles.subheading}>Sign in to your account</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.textMuted}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Hint: juan@email.com / password123
      </Text>
    </View>
  );
}

// function InfoRow({ label, value }: { label: string; value: string }) {
//   return (
//     <View style={styles.infoRow}>
//       <Text style={styles.infoLabel}>{label}</Text>
//       <Text style={styles.infoValue}>{value}</Text>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 24 },
  heading: { fontSize: 28, fontWeight: "800", color: Colors.textPrimary, marginTop: 48 },
  subheading: { fontSize: 14, color: Colors.textSecondary, marginBottom: 32 },
  error: { color: "red", marginBottom: 12, fontSize: 13 },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  hint: { textAlign: "center", color: Colors.textMuted, fontSize: 12, marginTop: 16 },
  profileHeader: { alignItems: "center", marginTop: 32, marginBottom: 24 },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: "800", color: Colors.textPrimary },
  email: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  infoLabel: { fontSize: 14, color: Colors.textSecondary },
  infoValue: { fontSize: 14, fontWeight: "600", color: Colors.textPrimary },
  logoutButton: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  logoutText: { color: "red", fontWeight: "700", fontSize: 15 },
});