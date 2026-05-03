import { InvestorDashboard } from "@/components/investor/investor-dashboard";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/auth-context";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Investor() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  if (user?.role === 1) {
    return <InvestorDashboard />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <View style={[styles.hero, { paddingTop: insets.top + 24 }]}>
        <View style={styles.heroDecorCircleOne} />
        <View style={styles.heroDecorCircleTwo} />

        <Text style={styles.kicker}>Investor Access</Text>
        <Text style={styles.title}>Become an Investor</Text>
        <Text style={styles.subtitle}>
          Join our platform and unlock portfolio tools, performance tracking, and curated opportunities.
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Build with Reyland</Text>
          <Text style={styles.cardText}>
            Get access to investor dashboards, property insights, and a clearer view of your holdings in one place.
          </Text>

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => {
              router.push("/investor-signup");
            }}
          >
            <Text style={styles.buttonText}>Sign Up as Investor</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    minHeight: 220,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingBottom: 28,
    overflow: "hidden",
  },
  heroDecorCircleOne: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    right: -58,
    top: 18,
  },
  heroDecorCircleTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    left: -92,
    bottom: -92,
  },
  kicker: {
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(255,255,255,0.76)",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.white,
    letterSpacing: -0.8,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(255,255,255,0.8)",
    maxWidth: 340,
  },
  content: {
    flex: 1,
    marginTop: -18,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "900",
  },
});
