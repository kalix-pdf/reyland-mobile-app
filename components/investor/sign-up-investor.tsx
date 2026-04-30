import { Colors } from "@/constants/colors";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    View,
} from "react-native";

const INVESTOR_TYPES = [
  "Individual investor",
  "Corporate / institutional",
  "Family office",
  "Real estate developer",
  "HNWI (High-net-worth)",
];

function PasswordStrength({ value }: { value: string }) {
  const score = [
    value.length >= 8,
    /[A-Z]/.test(value),
    /[0-9]/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ].filter(Boolean).length;

  const colors = ["", Colors.error, Colors.warning, Colors.accent, Colors.accentDark];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  if (!value) return null;
  return (
    <View style={{ marginTop: 8 }}>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              flex: 1, height: 3, borderRadius: 99,
              backgroundColor: i <= score ? colors[score] : Colors.border,
            }}
          />
        ))}
      </View>
      <Text style={{ fontSize: 11, color: colors[score], marginTop: 4 }}>
        {labels[score]}
      </Text>
    </View>
  );
}

export function SignUpInvestor() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", password: "", investorType: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const set = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!agreed) return Alert.alert("Terms required", "Please accept the terms.");
    if (!form.email || !form.password || !form.firstName)
      return Alert.alert("Missing fields", "Please fill all required fields.");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800)); // replace with real API
    setLoading(false);
    Alert.alert("Welcome!", "Your investor account has been created.");
    router.replace("/");
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <View style={s.logoMark}>
            <Text style={s.logoIcon}>▲</Text>
          </View>
          <Text style={s.logoName}>Verdanta</Text>
        </View>

        {/* Hero text */}
        <View style={s.heroBlock}>
          <Text style={s.eyebrow}>INVESTOR PORTAL</Text>
          <Text style={s.headline}>Create your{"\n"}investor account</Text>
          <Text style={s.sub}>Join 4,200+ investors with verified returns.</Text>
        </View>

        {/* Stats strip */}
        <View style={s.statsRow}>
          {[
            { val: "₱2.4B", label: "Managed" },
            { val: "12.4%", label: "Avg ROI" },
            { val: "98%", label: "Payout" },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && <View style={s.statDivider} />}
              <View style={s.stat}>
                <Text style={s.statVal}>{stat.val}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Form card */}
        <View style={s.card}>
          {/* Name row */}
          <View style={s.row}>
            <View style={[s.field, { flex: 1 }]}>
              <Text style={s.label}>First name</Text>
              <TextInput
                style={s.input}
                placeholder="Juan"
                placeholderTextColor={Colors.textMuted}
                value={form.firstName}
                onChangeText={(v) => set("firstName", v)}
              />
            </View>
            <View style={[s.field, { flex: 1 }]}>
              <Text style={s.label}>Last name</Text>
              <TextInput
                style={s.input}
                placeholder="dela Cruz"
                placeholderTextColor={Colors.textMuted}
                value={form.lastName}
                onChangeText={(v) => set("lastName", v)}
              />
            </View>
          </View>

          <View style={s.field}>
            <Text style={s.label}>Email address</Text>
            <TextInput
              style={s.input}
              placeholder="juan@email.com"
              placeholderTextColor={Colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => set("email", v)}
            />
          </View>

          <View style={s.field}>
            <Text style={s.label}>Mobile number</Text>
            <TextInput
              style={s.input}
              placeholder="+63 917 000 0000"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(v) => set("phone", v)}
            />
          </View>

          {/* Investor type picker */}
          <View style={s.field}>
            <Text style={s.label}>Investor type</Text>
            <TouchableOpacity
              style={[s.input, s.pickerBtn]}
              onPress={() => setTypeOpen(!typeOpen)}
              activeOpacity={0.7}
            >
              <Text style={form.investorType ? s.inputText : s.placeholderText}>
                {form.investorType || "Select your profile"}
              </Text>
              <Text style={s.chevron}>{typeOpen ? "▲" : "▼"}</Text>
            </TouchableOpacity>
            {typeOpen && (
              <View style={s.dropdown}>
                {INVESTOR_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[s.dropItem, form.investorType === type && s.dropItemActive]}
                    onPress={() => { set("investorType", type); setTypeOpen(false); }}
                  >
                    <Text style={[s.dropItemText, form.investorType === type && s.dropItemTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={s.field}>
            <Text style={s.label}>Password</Text>
            <View style={s.pwWrap}>
              <TextInput
                style={[s.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Min. 8 characters"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPw}
                value={form.password}
                onChangeText={(v) => set("password", v)}
              />
              <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPw(!showPw)}>
                <Text style={s.eyeText}>{showPw ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>
            <PasswordStrength value={form.password} />
          </View>

          {/* Terms */}
          <TouchableOpacity
            style={s.checkRow}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.7}
          >
            <View style={[s.checkbox, agreed && s.checkboxActive]}>
              {agreed && <Text style={s.checkmark}>✓</Text>}
            </View>
            <Text style={s.checkLabel}>
              I agree to the{" "}
              <Text style={s.link}>Terms of Service</Text> and{" "}
              <Text style={s.link}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.btn, loading && s.btnLoading]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.btnText}>Create Investor Account →</Text>
            )}
          </TouchableOpacity>

          {/* Trust badges */}
          <View style={s.badges}>
            {["🔒 256-bit SSL", "✓ SEC Registered", "⚡ 2-min setup"].map((b) => (
              <Text key={b} style={s.badge}>{b}</Text>
            ))}
          </View>
        </View>

        <Text style={s.signinText}>
          Already investing?{" "}
          {/* <Text style={s.signinLink} onPress={() => router.push("/sign-in")}>
            Sign in
          </Text> */}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  scroll: { paddingBottom: 48 },
  header: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8,
  },
  logoMark: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: Colors.accent,
    alignItems: "center", justifyContent: "center",
  },
  logoIcon: { color: "#fff", fontSize: 14, fontWeight: "700" },
  logoName: { fontSize: 18, fontWeight: "700", color: "#fff", letterSpacing: -0.3 },

  heroBlock: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 24 },
  eyebrow: {
    fontSize: 10, fontWeight: "700", letterSpacing: 2,
    color: Colors.accentLight, marginBottom: 10,
  },
  headline: {
    fontSize: 32, fontWeight: "800", color: "#fff",
    lineHeight: 38, letterSpacing: -0.5, marginBottom: 8,
  },
  sub: { fontSize: 14, color: "rgba(255,255,255,.5)", lineHeight: 20 },

  statsRow: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 24, marginBottom: 24,
    backgroundColor: Colors.primaryLight,
    borderRadius: 14, padding: 16,
  },
  stat: { flex: 1, alignItems: "center" },
  statVal: { fontSize: 18, fontWeight: "700", color: "#fff" },
  statLabel: { fontSize: 10, color: "rgba(255,255,255,.4)", marginTop: 2, letterSpacing: 0.5 },
  statDivider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,.12)" },

  card: {
    marginHorizontal: 16, backgroundColor: Colors.surface,
    borderRadius: 20, padding: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2, shadowRadius: 32, elevation: 12,
  },

  row: { flexDirection: "row", gap: 12 },
  field: { marginBottom: 16 },
  label: {
    fontSize: 11, fontWeight: "600", color: Colors.textSecondary,
    letterSpacing: 0.3, marginBottom: 6,
  },
  input: {
    height: 46, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 10, paddingHorizontal: 14,
    fontSize: 14, color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  inputText: { fontSize: 14, color: Colors.textPrimary },
  placeholderText: { fontSize: 14, color: Colors.textMuted },
  pickerBtn: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", paddingHorizontal: 14,
  },
  chevron: { fontSize: 10, color: Colors.textMuted },
  dropdown: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 10,
    backgroundColor: Colors.surface, marginTop: -8, marginBottom: 8,
    overflow: "hidden",
  },
  dropItem: { paddingVertical: 12, paddingHorizontal: 14 },
  dropItemActive: { backgroundColor: Colors.tag },
  dropItemText: { fontSize: 14, color: Colors.textSecondary },
  dropItemTextActive: { color: Colors.accentDark, fontWeight: "600" },

  pwWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  eyeBtn: {
    height: 46, paddingHorizontal: 14,
    borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: 10, alignItems: "center", justifyContent: "center",
    backgroundColor: Colors.background,
  },
  eyeText: { fontSize: 12, fontWeight: "600", color: Colors.textSecondary },

  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 20 },
  checkbox: {
    width: 18, height: 18, borderRadius: 5,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: "center", justifyContent: "center",
    marginTop: 1,
  },
  checkboxActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  checkmark: { color: "#fff", fontSize: 11, fontWeight: "700" },
  checkLabel: { flex: 1, fontSize: 12.5, color: Colors.textSecondary, lineHeight: 18 },
  link: { color: Colors.accent, fontWeight: "600" },

  btn: {
    height: 50, backgroundColor: Colors.accent,
    borderRadius: 12, alignItems: "center", justifyContent: "center",
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 14, elevation: 6,
  },
  btnLoading: { backgroundColor: Colors.textMuted, shadowOpacity: 0 },
  btnText: { color: "#fff", fontSize: 15, fontWeight: "700", letterSpacing: 0.2 },

  badges: {
    flexDirection: "row", justifyContent: "center",
    flexWrap: "wrap", gap: 8, marginTop: 14,
  },
  badge: { fontSize: 11, color: Colors.textMuted },

  signinText: {
    textAlign: "center", marginTop: 20,
    fontSize: 13, color: "rgba(255,255,255,.45)",
  },
  signinLink: { color: Colors.accentLight, fontWeight: "600" },
});