import { Colors } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const INVESTOR_TYPES = [
  'Individual investor',
  'Corporate / institutional',
  'Family office',
  'Real estate developer',
  'HNWI (High-net-worth)',
]

function PasswordStrength({ value }: { value: string }) {
  const score = [value.length >= 8, /[A-Z]/.test(value), /[0-9]/.test(value), /[^A-Za-z0-9]/.test(value)].filter(
    Boolean,
  ).length

  const colors = ['', Colors.error, Colors.warning, Colors.accent, Colors.accentDark]
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  if (!value) return null
  return (
    <View style={{ marginTop: 8 }}>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              backgroundColor: i <= score ? colors[score] : Colors.border,
            }}
          />
        ))}
      </View>
      <Text style={{ fontSize: 11, color: colors[score], marginTop: 4 }}>{labels[score]}</Text>
    </View>
  )
}

export function SignUpInvestorForm() {
  const insets = useSafeAreaInsets()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    investorType: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [typeOpen, setTypeOpen] = useState(false)

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    if (!agreed) return Alert.alert('Terms required', 'Please accept the terms.')
    if (!form.email || !form.password || !form.firstName)
      return Alert.alert('Missing fields', 'Please fill all required fields.')

    setLoading(true)
    await new Promise((r) => setTimeout(r, 1800)) // replace with real API
    setLoading(false)
    Alert.alert('Welcome!', 'Your investor account has been created.')
    router.replace('/')
  }

  return (
    <SafeAreaView style={s.safe} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <View style={[s.hero, { paddingTop: insets.top + 18 }]}>
          <View style={s.heroDecorCircleOne} />
          <View style={s.heroDecorCircleTwo} />

          <View style={s.header}>
            <View style={s.brandPill}>
              <View style={s.brandDot} />
              <Text style={s.brandPillText}>Investor onboarding</Text>
            </View>

            <Pressable
              style={({ pressed }) => [s.headerIconButton, pressed && s.headerIconButtonPressed]}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={s.heroBlock}>
            <Text style={s.heroTitle}>Create your investor account</Text>
            <Text style={s.heroSubtitle}>
              Join verified Reyland investors and unlock portfolio tools, curated opportunities, and a clearer view of
              long-term growth.
            </Text>
          </View>

          <View style={s.statsRow}>
            {[
              { val: '₱2.4B', label: 'Managed' },
              { val: '12.4%', label: 'Avg ROI' },
              { val: '98%', label: 'Payout' },
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
        </View>

        <View style={s.contentPanel}>
          <View style={s.card}>
            <View style={s.cardTopBar} />
            <View style={s.cardHeader}>
              <View>
                <Text style={s.cardEyebrow}>Application Details</Text>
                <Text style={s.cardTitle}>Tell us about your investor profile</Text>
                <Text style={s.cardText}>
                  Complete your details so we can tailor your dashboard, communication, and opportunities.
                </Text>
              </View>

              <View style={s.cardHeaderIcon}>
                <Ionicons name="briefcase-outline" size={22} color={Colors.white} />
              </View>
            </View>

            <View style={s.row}>
              <View style={[s.field, { flex: 1 }]}>
                <Text style={s.label}>First name</Text>
                <TextInput
                  style={s.input}
                  placeholder="Juan"
                  placeholderTextColor={Colors.textMuted}
                  value={form.firstName}
                  onChangeText={(v) => set('firstName', v)}
                  selectionColor={Colors.accent}
                />
              </View>
              <View style={[s.field, { flex: 1 }]}>
                <Text style={s.label}>Last name</Text>
                <TextInput
                  style={s.input}
                  placeholder="dela Cruz"
                  placeholderTextColor={Colors.textMuted}
                  value={form.lastName}
                  onChangeText={(v) => set('lastName', v)}
                  selectionColor={Colors.accent}
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
                onChangeText={(v) => set('email', v)}
                selectionColor={Colors.accent}
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
                onChangeText={(v) => set('phone', v)}
                selectionColor={Colors.accent}
              />
            </View>

            <View style={s.field}>
              <Text style={s.label}>Investor type</Text>
              <Pressable style={s.pickerBtn} onPress={() => setTypeOpen(!typeOpen)}>
                <Text style={form.investorType ? s.inputText : s.placeholderText}>
                  {form.investorType || 'Select your profile'}
                </Text>
                <Ionicons name={typeOpen ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textMuted} />
              </Pressable>
              {typeOpen && (
                <View style={s.dropdown}>
                  {INVESTOR_TYPES.map((type) => (
                    <Pressable
                      key={type}
                      style={({ pressed }) => [
                        s.dropItem,
                        form.investorType === type && s.dropItemActive,
                        pressed && s.dropItemPressed,
                      ]}
                      onPress={() => {
                        set('investorType', type)
                        setTypeOpen(false)
                      }}
                    >
                      <Text style={[s.dropItemText, form.investorType === type && s.dropItemTextActive]}>{type}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={s.field}>
              <Text style={s.label}>Password</Text>
              <View style={s.pwWrap}>
                <TextInput
                  style={[s.input, s.pwInput]}
                  placeholder="Min. 8 characters"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPw}
                  value={form.password}
                  onChangeText={(v) => set('password', v)}
                  selectionColor={Colors.accent}
                />
                <Pressable style={s.eyeBtn} onPress={() => setShowPw(!showPw)}>
                  <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textSecondary} />
                  <Text style={s.eyeText}>{showPw ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
              <PasswordStrength value={form.password} />
            </View>

            <Pressable style={s.checkRow} onPress={() => setAgreed(!agreed)}>
              <View style={[s.checkbox, agreed && s.checkboxActive]}>
                {agreed && <Text style={s.checkmark}>✓</Text>}
              </View>
              <Text style={s.checkLabel}>
                I agree to the <Text style={s.link}>Terms of Service</Text> and{' '}
                <Text style={s.link}>Privacy Policy</Text>
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [s.btn, loading && s.btnLoading, pressed && !loading && s.btnPressed]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={s.btnText}>Create Investor Account</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </>
              )}
            </Pressable>

            <View style={s.badges}>
              {[
                { icon: 'shield-checkmark-outline', label: '256-bit SSL' },
                { icon: 'checkmark-circle-outline', label: 'SEC Registered' },
                { icon: 'flash-outline', label: '2-min setup' },
              ].map((b) => (
                <View key={b.label} style={s.badge}>
                  <Ionicons name={b.icon as never} size={13} color={Colors.accent} />
                  <Text style={s.badgeText}>{b.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text style={s.signinText}>Already investing? Contact the Reyland team to continue your onboarding.</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 48 },
  hero: {
    minHeight: 410,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingBottom: 28,
    overflow: 'hidden',
  },
  heroDecorCircleOne: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    right: -58,
    top: 18,
  },
  heroDecorCircleTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    left: -92,
    bottom: -92,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandPill: {
    alignSelf: 'flex-start',
    minHeight: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.logoGreenLight,
  },
  brandPillText: {
    color: Colors.white,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerIconButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },

  heroBlock: {
    paddingTop: 22,
    paddingBottom: 22,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 38,
    letterSpacing: -0.8,
    maxWidth: 310,
  },
  heroSubtitle: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.82)',
    maxWidth: 330,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,.58)', marginTop: 2, letterSpacing: 0.5 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,.12)' },

  contentPanel: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingTop: 18,
    marginTop: -30,
  },

  card: {
    overflow: 'hidden',
    marginHorizontal: 18,
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  cardTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: Colors.accent,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
  },
  cardHeaderIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEyebrow: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -0.6,
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textSecondary,
    maxWidth: 280,
  },

  row: { flexDirection: 'row', gap: 12 },
  field: { marginBottom: 16 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
  },
  inputText: { fontSize: 14, color: Colors.textPrimary },
  placeholderText: { fontSize: 14, color: Colors.textMuted },
  pickerBtn: {
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  dropdown: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  dropItem: { paddingVertical: 12, paddingHorizontal: 14 },
  dropItemPressed: { backgroundColor: Colors.background },
  dropItemActive: { backgroundColor: Colors.tag },
  dropItemText: { fontSize: 14, color: Colors.textSecondary },
  dropItemTextActive: { color: Colors.accentDark, fontWeight: '600' },

  pwWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pwInput: { flex: 1 },
  eyeBtn: {
    height: 52,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: Colors.background,
  },
  eyeText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },

  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 20 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  checkmark: { color: '#fff', fontSize: 11, fontWeight: '700' },
  checkLabel: { flex: 1, fontSize: 12.5, color: Colors.textSecondary, lineHeight: 18 },
  link: { color: Colors.accent, fontWeight: '600' },

  btn: {
    height: 54,
    backgroundColor: Colors.accent,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  btnLoading: { backgroundColor: Colors.textMuted, shadowOpacity: 0 },
  btnPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },

  badges: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeText: { fontSize: 11, color: Colors.textMuted, fontWeight: '700' },

  signinText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
    color: Colors.textMuted,
  },
  signinLink: { color: Colors.accentLight, fontWeight: '600' },
})
