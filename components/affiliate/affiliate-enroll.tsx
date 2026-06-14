import { useAppTheme } from '@/context/theme-context';
import { createAffiliateStyles } from '@/styles/affiliate.styles';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

export function AffiliateEnrollPanel({ onEnroll, enrolling }: { onEnroll: () => void; enrolling: boolean }) {
  const { colors } = useAppTheme();
  const styles = createAffiliateStyles(colors);
  const [agreed, setAgreed] = useState(false);

  const isDisabled = !agreed || enrolling;

  return (
    <View style={styles.panel}>
      <View style={styles.panelAccentBar} />

      <View style={styles.panelInner}>
        <View style={styles.iconBadge}>
          <Feather name="users" size={24} color={colors.accent} />
        </View>

        <Text style={styles.eyebrow}>Affiliate Program</Text>
        <Text style={styles.title}>Start earning with every referral</Text>
        <Text style={styles.subtitle}>
          Refer buyers and investors to Reyland PH and track your commissions
          from your personal affiliate dashboard.
        </Text>

        <View style={styles.panelDivider} />

        <Text style={styles.benefitsLabel}>What you get</Text>

        <View style={styles.benefitList}>
          {[
            'A unique referral code and shareable link you control',
            'Live dashboard to track referrals, status, and rewards',
            'Commission credited upon successful property sale',
          ].map((benefit, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.benefitCheck}>
                <Ionicons name="checkmark" size={12} color={colors.accent} />
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => setAgreed((v) => !v)}
          style={({ pressed }) => [styles.termsRow, pressed && styles.pressed]}
          hitSlop={4}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Ionicons name="checkmark" size={11} color={colors.white} />}
          </View>
          <Text style={styles.termsText}>
            I agree to the affiliate{' '}
            <Text style={styles.termsLink}>terms & conditions</Text>,{' '}
            <Text style={styles.termsLink}>privacy policy</Text>, and referral
            reward rules.
          </Text>
        </Pressable>

        <Pressable
          onPress={onEnroll}
          disabled={isDisabled}
          style={({ pressed }) => [
            styles.primaryButton,
            isDisabled && styles.disabled,
            pressed && !isDisabled && styles.pressed,
          ]}
        >
          {enrolling ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Enroll now</Text>
              {!isDisabled && (
                <Ionicons name="arrow-forward" size={16} color={colors.white} />
              )}
            </>
          )}
        </Pressable>

        <View style={styles.safeNote}>
          <Ionicons name="shield-checkmark-outline" size={12} color={colors.textMuted} />
          <Text style={styles.safeNoteText}>Your information is encrypted and secure</Text>
        </View>
      </View>
    </View>
  );
}