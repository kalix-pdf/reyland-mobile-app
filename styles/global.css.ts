import { AppColors } from '@/constants/colors';

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  '2xl': 14,
  '3xl': 16,
  '4xl': 18,
  '5xl': 20,
  '6xl': 22,
  '7xl': 24,
  '8xl': 28,
} as const;

export const radii = {
  sm: 4,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 999,
} as const;

export const fontSizes = {
  xs: 11,
  sm: 12,
  md: 13,
  lg: 14,
  xl: 15,
  '2xl': 18,
  '3xl': 24,
  '4xl': 30,
  '5xl': 34,
} as const;

export const lineHeights = {
  xs: 14,
  sm: 18,
  md: 20,
  lg: 21,
  xl: 34,
  '2xl': 38,
} as const;

export const shadows = {
  authButton: {
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },
  authSheet: {
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: -10,
    },
    elevation: 8,
  },
} as const;

export function createThemedStyles<T, TArgs extends unknown[] = []>(factory: (colors: AppColors, ...args: TArgs) => T) {
  return factory;
}

export const createCommonStyles = createThemedStyles((Colors: AppColors) => ({
  centeredRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  fullWidth: {
    width: '100%' as const,
  },
  accentLinkText: {
    color: Colors.accent,
    fontWeight: '900' as const,
  },
}));

export const createTypographyStyles = createThemedStyles((Colors: AppColors) => ({
  authTitle: {
    color: Colors.textPrimary,
    fontSize: fontSizes['4xl'],
    fontWeight: '900' as const,
    textAlign: 'center' as const,
  },
  authSubtitleDefault: {
    color: Colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.lg,
    textAlign: 'center' as const,
    fontWeight: '600' as const,
  },
  authSubtitleCompact: {
    color: Colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.sm,
    textAlign: 'center' as const,
    fontWeight: '600' as const,
  },
  helperText: {
    color: Colors.textMuted,
    fontSize: fontSizes.sm,
    fontWeight: '600' as const,
  },
  helperLink: {
    color: Colors.accent,
    fontSize: fontSizes.sm,
    fontWeight: '900' as const,
  },
}));

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
    color: Colors.accent,
    fontSize: fontSizes.md,
    fontWeight: '800' as const,
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
  (Colors: AppColors, isCompact: boolean, panelVariant: 'sheet' | 'transparent') => ({
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
      justifyContent: panelVariant === 'transparent' ? 'center' : 'flex-start',
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
