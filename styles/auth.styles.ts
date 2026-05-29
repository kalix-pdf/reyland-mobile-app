import { AppColors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

import { createThemedStyles, fontSizes, lineHeights, radii, shadows, spacing } from './foundations';
import {
  sharedAuthDivider,
  sharedAuthDividerRow,
  sharedAuthDividerText,
  sharedAuthSocialButtonBase,
  sharedAuthSocialButtonPressed,
  sharedAuthSocialButtonText,
  sharedAuthSocialButtonsRow,
  sharedGoogleIcon,
} from './shared-primitives';

export const createAuthComponentStyles = createThemedStyles((Colors: AppColors) => ({
  button: {
    borderRadius: radii.pill,
    overflow: 'hidden' as const,
    minHeight: 52,
    shadowColor: Colors.primary,
    ...shadows.authButton,
  },
  buttonFill: {
    minHeight: 52,
    borderRadius: radii.pill,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
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
    fontSize: fontSizes.xl,
    fontWeight: '900' as const,
  },
  buttonLoadingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.lg,
  },
  inputContainer: {
    gap: spacing.sm,
  },
  inputLabel: {
    color: Colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600' as const,
  },
  inputLabelError: {
    color: Colors.error,
  },
  inputWrapper: {
    minHeight: 48,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 0,
  },
  inputWrapperFocused: {
    borderColor: Colors.accent,
  },
  inputWrapperError: {
    borderColor: Colors.error,
  },
  inputIcon: {
    marginRight: spacing.lg,
  },
  inputField: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: fontSizes.lg,
    paddingVertical: spacing.xl,
  },
  inputErrorText: {
    color: Colors.error,
    fontSize: fontSizes.sm,
    fontWeight: '700' as const,
    marginTop: spacing.xxs,
  },
  messageBox: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  messageErrorBox: {
    backgroundColor: Colors.errorBackground,
    borderColor: Colors.errorBorder,
  },
  messageSuccessBox: {
    backgroundColor: Colors.rentBadge,
    borderColor: Colors.border,
  },
  messageText: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: '700' as const,
  },
  messageErrorText: {
    color: Colors.error,
  },
  messageSuccessText: {
    color: Colors.success,
  },
}));

export const createAuthScreenStyles = createThemedStyles(
  (Colors: AppColors, isCompact: boolean, panelVariant: 'sheet' | 'transparent') =>
    StyleSheet.create({
      keyboardView: {
        flex: 1,
        backgroundColor: panelVariant === 'transparent' ? Colors.logoBackground : Colors.background,
      },
      scrollContent: {
        flexGrow: 1,
      },
      screen: {
        flex: 1,
      },
      hero: {
        backgroundColor: Colors.logoBackground,
        paddingHorizontal: 24,
        paddingBottom: panelVariant === 'transparent' ? (isCompact ? 26 : 34) : isCompact ? 22 : 28,
        overflow: 'hidden' as const,
        position: 'relative' as const,
        borderBottomLeftRadius: panelVariant === 'transparent' ? 30 : 0,
        borderBottomRightRadius: panelVariant === 'transparent' ? 30 : 0,
        marginHorizontal: panelVariant === 'transparent' ? 18 : 0,
        marginTop: 0,
      },
      heroBackground: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      heroOverlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      heroBrandMarkPrimary: {
        position: 'absolute' as const,
        width: 360,
        height: 360,
        top: -42,
        right: -128,
        opacity: 0.12,
        transform: [{ rotate: '2deg' }],
      },
      heroBrandMarkSecondary: {
        position: 'absolute' as const,
        width: 248,
        bottom: -92,
        left: -108,
        opacity: 0.08,
        transform: [{ rotate: '-10deg' }],
      },
      heroContent: {
        flex: 1,
        justifyContent: 'space-between' as const,
        zIndex: 2,
      },
      heroTopRow: {
        flex: 1,
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        gap: 16,
      },
      heroCopy: {
        flex: 1,
        justifyContent: panelVariant === 'transparent' ? ('center' as const) : ('flex-start' as const),
        gap: isCompact ? spacing.md : spacing.xl,
        maxWidth: 312,
      },
      heroRule: {
        width: 44,
        height: 3,
        borderRadius: radii.pill,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        marginBottom: spacing.xs,
      },
      heroTitle: {
        color: Colors.white,
        fontSize: isCompact ? fontSizes['4xl'] : fontSizes['5xl'],
        lineHeight: isCompact ? lineHeights.xl : lineHeights['2xl'],
        fontWeight: '900' as const,
        letterSpacing: -1,
        maxWidth: 196,
      },
      heroSubtitle: {
        maxWidth: 250,
        color: 'rgba(255, 255, 255, 0.72)',
        fontSize: isCompact ? fontSizes.sm : fontSizes.md,
        lineHeight: isCompact ? lineHeights.sm : lineHeights.md,
        fontWeight: '600' as const,
        minHeight: 100,
      },
      formPanel: {
        flex: panelVariant === 'transparent' ? 0 : 1,
        marginTop: panelVariant === 'transparent' ? -6 : -81,
        backgroundColor: panelVariant === 'transparent' ? 'transparent' : Colors.surface,
        borderTopLeftRadius: panelVariant === 'transparent' ? 0 : 34,
        borderTopRightRadius: panelVariant === 'transparent' ? 0 : 34,
        paddingHorizontal: panelVariant === 'transparent' ? 28 : 24,
        paddingTop: panelVariant === 'transparent' ? 0 : isCompact ? 16 : 20,
        paddingBottom: panelVariant === 'transparent' ? 0 : isCompact ? 16 : 22,
        shadowColor: Colors.black,
        shadowOpacity: panelVariant === 'transparent' ? 0 : shadows.authSheet.shadowOpacity,
        shadowRadius: panelVariant === 'transparent' ? 0 : shadows.authSheet.shadowRadius,
        shadowOffset: panelVariant === 'transparent' ? { width: 0, height: 0 } : shadows.authSheet.shadowOffset,
        elevation: panelVariant === 'transparent' ? 0 : shadows.authSheet.elevation,
      },
    }),
);

export const createAuthFormStyles = createThemedStyles((Colors: AppColors) => ({
  title: {
    color: Colors.textPrimary,
    fontSize: fontSizes['4xl'],
    fontWeight: '900' as const,
    textAlign: 'center' as const,
    marginBottom: 6,
  },
  subtitleDefault: {
    color: Colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.lg,
    textAlign: 'center' as const,
    fontWeight: '600' as const,
    marginBottom: 16,
    minHeight: 42,
  },
  subtitleCompact: {
    color: Colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: 18,
    textAlign: 'center' as const,
    fontWeight: '600' as const,
    marginBottom: 16,
    minHeight: 40,
  },
  accountFooterRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: 20,
  },
  accountFooterRowSpacious: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: 22,
  },
  accountText: {
    color: Colors.textMuted,
    fontSize: fontSizes.md,
    fontWeight: '600' as const,
  },
  accountLink: {
    color: Colors.accent,
    fontSize: fontSizes.md,
    fontWeight: '900' as const,
  },
  inputAreaTight: {
    gap: 10,
  },
  inputAreaDefault: {
    gap: 12,
  },
  eyeButton: {
    paddingLeft: 10,
  },
  buttonWrapFull: {
    width: '100%' as const,
  },
  buttonWrapTop6: {
    width: '100%' as const,
    marginTop: 6,
  },
  buttonWrapTop4: {
    width: '100%' as const,
    marginTop: 4,
  },
  passwordHintRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginTop: -4,
    marginBottom: 0,
    marginLeft: 16,
  },
  passwordHintText: {
    color: Colors.textMuted,
    fontSize: fontSizes.sm,
    fontWeight: '600' as const,
  },
  passwordHintTextSuccess: {
    color: Colors.success,
  },
  matchRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    marginTop: -4,
    marginBottom: 0,
    marginLeft: 16,
  },
  matchText: {
    color: Colors.success,
    fontSize: fontSizes.sm,
    fontWeight: '700' as const,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: radii.sm,
    borderWidth: 1.4,
    borderColor: Colors.border,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  termsRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  termsText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: 18,
    fontWeight: '600' as const,
  },
  termsLink: {
    color: Colors.accent,
    fontWeight: '900' as const,
  },
  termsErrorText: {
    color: Colors.error,
    fontSize: fontSizes.sm,
    fontWeight: '700' as const,
    marginBottom: 8,
    marginLeft: 24,
  },
}));

export const createWelcomeScreenStyles = createThemedStyles((Colors: AppColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: Colors.logoBackground,
    },
    screen: {
      flex: 1,
      paddingHorizontal: 32,
    },
    glowTopRight: {
      position: 'absolute',
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: 'rgba(255,255,255,0.08)',
      top: -40,
      right: -95,
    },
    glowBottomLeft: {
      position: 'absolute',
      width: 210,
      height: 210,
      borderRadius: 105,
      backgroundColor: 'rgba(255,255,255,0.08)',
      bottom: 130,
      left: -95,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 96,
    },
    brandBlock: {
      alignItems: 'center',
    },
    logo: {
      width: 360,
      height: 360,
    },
    brandText: {
      color: Colors.white,
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '900',
      letterSpacing: 1.8,
      textAlign: 'center',
    },
    title: {
      color: Colors.white,
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '900',
      textAlign: 'center',
      marginTop: 30,
    },
    actions: {
      width: '100%',
      gap: 16,
      marginTop: 54,
      marginBottom: 60,
    },
    signInButton: {
      minHeight: 56,
      borderRadius: 999,
      borderWidth: 1.4,
      borderColor: 'rgba(255,255,255,0.42)',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    signInText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '900',
      letterSpacing: 0.3,
    },
    signUpButton: {
      minHeight: 56,
      borderRadius: 999,
      backgroundColor: Colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: Colors.black,
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      elevation: 2,
    },
    signUpText: {
      color: Colors.textPrimary,
      fontSize: 16,
      fontWeight: '900',
      letterSpacing: 0.3,
    },
    socialSection: {
      alignItems: 'center',
    },
    socialLabel: {
      color: 'rgba(255,255,255,0.74)',
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 18,
    },
    socialRow: {
      flexDirection: 'row',
      gap: 20,
    },
    socialButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    googleIcon: {
      width: 27,
      height: 27,
    },
  }),
);

export const createLoginFormStyles = createThemedStyles((Colors: AppColors) =>
  StyleSheet.create({
    ...createAuthFormStyles(Colors),
    optionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 6,
      marginBottom: 14,
    },
    forgotLinkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 12,
    },
    forgotLinkLabel: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: '600',
    },
    forgotLinkText: {
      color: Colors.accent,
      fontSize: 12,
      fontWeight: '900',
    },
    rememberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    rememberText: {
      color: Colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    dividerRow: {
      ...sharedAuthDividerRow,
      marginBottom: 18,
    },
    divider: {
      ...sharedAuthDivider,
      backgroundColor: Colors.border,
    },
    dividerText: {
      ...sharedAuthDividerText,
      color: Colors.textMuted,
    },
    socialButtons: {
      ...sharedAuthSocialButtonsRow,
    },
    socialButton: {
      ...sharedAuthSocialButtonBase,
      backgroundColor: Colors.surfaceMuted,
      borderColor: Colors.border,
    },
    socialButtonPressed: sharedAuthSocialButtonPressed,
    googleIcon: {
      ...sharedGoogleIcon,
    },
    socialButtonText: {
      ...sharedAuthSocialButtonText,
      color: Colors.textPrimary,
    },
  }),
);

export const createForgotPasswordFormStyles = createThemedStyles((Colors: AppColors) =>
  StyleSheet.create({
    ...createAuthFormStyles(Colors),
    buttonWrap: {
      marginTop: 8,
    },
    supportCard: {
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      backgroundColor: Colors.background,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingHorizontal: 14,
      paddingVertical: 14,
    },
    supportIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: Colors.tag,
      alignItems: 'center',
      justifyContent: 'center',
    },
    supportCopy: {
      flex: 1,
      gap: 3,
    },
    supportTitle: {
      color: Colors.textPrimary,
      fontSize: 13,
      fontWeight: '800',
    },
    supportText: {
      color: Colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '600',
    },
    helpRow: {
      marginTop: 16,
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    helpLabel: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: '600',
    },
    helpLink: {
      color: Colors.accent,
      fontSize: 12,
      fontWeight: '900',
    },
    backButton: {
      marginTop: 18,
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    backButtonText: {
      color: Colors.accent,
      fontSize: 13,
      fontWeight: '900',
    },
  }),
);

export const createResetPasswordFormStyles = createThemedStyles((Colors: AppColors) =>
  StyleSheet.create({
    ...createForgotPasswordFormStyles(Colors),
    passwordChecklist: {
      marginTop: 16,
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.background,
    },
    passwordChecklistTitle: {
      color: Colors.textPrimary,
      fontSize: 13,
      fontWeight: '800',
    },
    passwordChecklistItem: {
      color: Colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '600',
    },
  }),
);

export const createSignUpFormStyles = createThemedStyles((Colors: AppColors) =>
  StyleSheet.create({
    ...createAuthFormStyles(Colors),
    successPanel: {
      marginTop: 8,
      marginBottom: 4,
      paddingHorizontal: 4,
      paddingVertical: 8,
      alignItems: 'flex-start',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
    },
    successKicker: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14,
      paddingHorizontal: 14,
      paddingTop: 8,
    },
    successKickerBar: {
      width: 28,
      height: 3,
      borderRadius: 999,
      backgroundColor: Colors.success,
    },
    successKickerText: {
      color: Colors.success,
      fontSize: 11,
      fontWeight: '900',
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
    successTitle: {
      color: Colors.textPrimary,
      fontSize: 24,
      fontWeight: '900',
      marginBottom: 8,
      paddingHorizontal: 14,
    },
    successSubtitle: {
      color: Colors.textSecondary,
      fontSize: 13,
      lineHeight: 20,
      fontWeight: '600',
      textAlign: 'left',
      paddingHorizontal: 14,
      paddingBottom: 8,
    },
    dividerRow: {
      ...sharedAuthDividerRow,
      marginBottom: 14,
    },
    divider: {
      ...sharedAuthDivider,
      backgroundColor: Colors.border,
    },
    dividerText: {
      ...sharedAuthDividerText,
      color: Colors.textMuted,
    },
    socialButtons: {
      ...sharedAuthSocialButtonsRow,
    },
    socialButton: {
      ...sharedAuthSocialButtonBase,
      backgroundColor: Colors.surfaceMuted,
      borderColor: Colors.border,
    },
    socialButtonPressed: sharedAuthSocialButtonPressed,
    googleIcon: {
      ...sharedGoogleIcon,
    },
    socialButtonText: {
      ...sharedAuthSocialButtonText,
      color: Colors.textPrimary,
    },
  }),
);
