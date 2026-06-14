import { AppColors } from '@/constants/colors';
import { StyleSheet } from 'react-native';
import { createThemedStyles } from './foundations';

export const createAffiliateStyles = createThemedStyles((Colors: AppColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      backgroundColor: Colors.background,
      paddingHorizontal: 20,
    },
    loadingText: {
      fontSize: 14,
      color: Colors.textSecondary,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 40,
    },

    // ─── Enroll Panel ────────────────────────────────────────────────────────

    panel: {
      borderRadius: 20,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      overflow: 'hidden',
    },
    panelAccentBar: {
      height: 3,
      backgroundColor: Colors.accent,
      opacity: 0.9,
    },
    panelInner: {
      padding: 24,
      paddingBottom: 20,
      gap: 0,
    },
    iconBadge: {
      width: 52,
      height: 52,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.tag,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
      marginBottom: 16,
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: '700',
      color: Colors.accent,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 6,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: Colors.textPrimary,
      lineHeight: 26,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 21,
      color: Colors.textSecondary,
      marginBottom: 20,
    },
    panelDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Colors.border,
      marginBottom: 18,
    },
    benefitsLabel: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.7,
      textTransform: 'uppercase',
      color: Colors.textMuted,
      marginBottom: 10,
    },
    benefitList: {
      gap: 10,
      marginBottom: 0,
    },
    benefitRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    benefitCheck: {
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.tag,
      marginTop: 1,
    },
    benefitText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 21,
      color: Colors.textPrimary,
    },
    termsRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      marginTop: 18,
      marginBottom: 16,
      backgroundColor: Colors.surfaceMuted,
      borderRadius: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
      padding: 12,
    },
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
    checkboxChecked: {
      borderColor: Colors.accent,
      backgroundColor: Colors.accent,
    },
    termsText: {
      flex: 1,
      fontSize: 12.5,
      lineHeight: 18,
      color: Colors.textSecondary,
    },
    termsLink: {
      color: Colors.accent,
    },
    primaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      minHeight: 50,
      borderRadius: 12,
      backgroundColor: Colors.accent,
    },
    primaryButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: Colors.white,
      letterSpacing: 0.1,
    },
    safeNote: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      marginTop: 12,
    },
    safeNoteText: {
      fontSize: 11.5,
      color: Colors.textMuted,
    },

    // ─── Shared Utilities ────────────────────────────────────────────────────

    disabled: {
      opacity: 0.55,
    },
    pressed: {
      opacity: 0.6,
    },

    // ─── Dashboard ───────────────────────────────────────────────────────────

    dashboardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
    },
    activeBadge: {
      borderRadius: 8,
      backgroundColor: Colors.tag,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    activeBadgeText: {
      fontSize: 12,
      fontWeight: '800',
      color: Colors.tagText,
    },
    referralBox: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceMuted,
      padding: 14,
      gap: 6,
    },
    referralLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: Colors.textMuted,
    },
    referralCode: {
      fontSize: 24,
      fontWeight: '900',
      color: Colors.textPrimary,
    },
    referralLink: {
      fontSize: 13,
      color: Colors.textSecondary,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    statTile: {
      width: '48%',
      minHeight: 92,
      borderRadius: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      padding: 12,
      justifyContent: 'space-between',
    },
    statValue: {
      fontSize: 18,
      fontWeight: '900',
      color: Colors.textPrimary,
    },
    statLabel: {
      fontSize: 12,
      lineHeight: 16,
      color: Colors.textMuted,
    },

    // ─── Secondary Button ────────────────────────────────────────────────────

    secondaryButton: {
      minHeight: 48,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      paddingHorizontal: 18,
    },
    secondaryButtonText: {
      fontSize: 14,
      fontWeight: '800',
      color: Colors.textPrimary,
    },

    // ─── Errors ──────────────────────────────────────────────────────────────

    inlineError: {
      marginBottom: 12,
      borderRadius: 8,
      backgroundColor: Colors.errorBackground,
      borderWidth: 1,
      borderColor: Colors.errorBorder,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: Colors.error,
      fontSize: 13,
      fontWeight: '700',
    },
    errorPanel: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      gap: 12,
    },
    errorTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: Colors.textPrimary,
      textAlign: 'center',
    },
    errorText: {
      fontSize: 14,
      lineHeight: 20,
      color: Colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
    },
  }),
);