import { AppColors } from '@/constants/colors'
import { StyleSheet } from 'react-native'
import { createThemedStyles } from './foundations'

export const createProfileScreenStyles = createThemedStyles((Colors: AppColors) =>
  StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
      backgroundColor: Colors.background,
    },
    safe: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    loadingText: {
      fontSize: 14,
      color: Colors.textSecondary,
    },
  }),
)

export const createProfileViewStyles = createThemedStyles((Colors: AppColors) =>
  StyleSheet.create({
    // Root
    safe: {
      flex: 1,
      backgroundColor: Colors.background,
    },

    // Fixed header
    header: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
      backgroundColor: Colors.background,
      marginBottom: 6,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.textPrimary,
      letterSpacing: -0.5,
      textAlign: 'center',
    },

    // Scroll
    scrollContent: {
      paddingBottom: 40,
    },

    heroBrandMarkPrimary: {
      position: 'absolute' as const,
      width: 440,
      height: 440,
      top: -30,
      right: -128,
      opacity: 0.12,
      transform: [{ rotate: '1deg' }],
    },

    // Profile card (top strip)
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginTop: 10,
    },
    avatar: {
      width: 75,
      height: 75,
      borderRadius: 35,
      backgroundColor: Colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 20,
    },
    profileInfo: {
      flex: 1,
      gap: 2,
    },
    profileName: {
      fontSize: 20,
      fontWeight: '700',
      color: Colors.textPrimary,
      letterSpacing: -0.2,
    },
    profileEmail: {
      fontSize: 14,
      color: Colors.textSecondary,
    },
    profilePhone: {
      fontSize: 14,
      color: Colors.textSecondary,
    },
    profileChevron: {
      paddingLeft: 4,
    },

    // Badge
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
    badgeText: {
      fontSize: 16,
      fontWeight: '700',
    },
    pendingText: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors.error,
    },

    // Row
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      gap: 14,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    rowPressed: {
      opacity: 0.5,
    },
    rowIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 10,
      // backgroundColor: Colors.tag,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowIconWrapDanger: {
      backgroundColor: Colors.errorBackground,
    },
    rowLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      color: Colors.textPrimary,
    },
    rowLabelDanger: {
      color: Colors.error,
    },
    rowValue: {
      fontSize: 13,
      color: Colors.textMuted,
    },

    // Version
    version: {
      textAlign: 'center',
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: '600',
      marginTop: 32,
    },
  }),
)

export const createPersonalInformationStyles = createThemedStyles((Colors: AppColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    header: {
      minHeight: 58,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
      backgroundColor: Colors.background,
    },
    headerButton: {
      width: 42,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonPressed: {
      opacity: 0.5,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '700',
      color: Colors.textPrimary,
    },
    scrollContent: {
      paddingHorizontal: 20,
      // paddingTop: 18,
      paddingBottom: 40,
    },
    profileSummary: {
      alignItems: 'center',
      marginVertical: 24,
    },
    avatar: {
      width: 104,
      height: 104,
      borderRadius: 52,
      backgroundColor: Colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      marginBottom: 10,
      borderWidth: 2,
      borderColor: Colors.surface,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarText: {
      color: Colors.white,
      fontSize: 28,
      fontWeight: '700',
    },
    changePhotoButton: {
      minHeight: 28,
      paddingHorizontal: 10,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5,
      backgroundColor: Colors.surfaceMuted,
      marginBottom: 18,
    },
    changePhotoText: {
      fontSize: 12,
      fontWeight: '800',
      color: Colors.accent,
    },
    displayName: {
      fontSize: 20,
      fontWeight: '800',
      color: Colors.textPrimary,
      textAlign: 'center',
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    displayEmail: {
      fontSize: 14,
      color: Colors.textSecondary,
      textAlign: 'center',
    },
    infoPanel: {
      width: '100%',
    },
    fieldRow: {
      minHeight: 66,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 14,
      // borderBottomWidth: StyleSheet.hairlineWidth,
      // borderBottomColor: Colors.border,
    },
    // fieldRowLast: {
    //   // borderBottomWidth: 0,
    // },
    fieldContent: {
      flex: 1,
      gap: 5,
    },
    fieldLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: Colors.textMuted,
    },
    fieldValue: {
      fontSize: 15,
      fontWeight: '700',
      color: Colors.textPrimary,
      lineHeight: 20,
    },
    editAction: {
      minHeight: 32,
      maxWidth: 180,
      paddingHorizontal: 10,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: Colors.surfaceMuted,
    },
    editActionText: {
      flexShrink: 1,
      fontSize: 12,
      fontWeight: '600',
      color: Colors.accent,
    },
    deleteButton: {
      minHeight: 54,
      marginTop: 24,
      borderRadius: 21,
      borderWidth: 1,
      borderColor: Colors.errorBorder,
      backgroundColor: Colors.errorBackground,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    deleteButtonText: {
      fontSize: 15,
      fontWeight: '800',
      color: Colors.error,
    },
    previewOverlay: {
      flex: 1,
      backgroundColor: 'rgba(17, 24, 39, 0.62)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    previewCard: {
      width: '100%',
      maxWidth: 360,
      borderRadius: 8,
      backgroundColor: Colors.surface,
      padding: 18,
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Colors.border,
    },
    previewTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: Colors.textPrimary,
      marginBottom: 14,
    },
    previewImage: {
      width: 188,
      height: 188,
      borderRadius: 94,
      backgroundColor: Colors.surfaceMuted,
      marginBottom: 14,
    },
    previewText: {
      fontSize: 14,
      lineHeight: 20,
      color: Colors.textSecondary,
      textAlign: 'center',
      marginBottom: 18,
    },
    previewActions: {
      width: '100%',
      flexDirection: 'row',
      gap: 10,
    },
    previewCancelButton: {
      flex: 1,
      minHeight: 46,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewCancelText: {
      fontSize: 14,
      fontWeight: '800',
      color: Colors.textPrimary,
    },
    previewConfirmButton: {
      flex: 1,
      minHeight: 46,
      borderRadius: 8,
      backgroundColor: Colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewConfirmText: {
      fontSize: 14,
      fontWeight: '800',
      color: Colors.background,
    },
  }),
)

export const createChangePersonalInfoStyles = createThemedStyles((Colors: AppColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: Colors.surface,
    },
    keyboardView: {
      flex: 1,
    },
    header: {
      minHeight: 56,
      paddingHorizontal: 12,
      justifyContent: 'center',
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonPressed: {
      opacity: 0.5,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 12,
    },
    title: {
      fontSize: 24,
      fontWeight: '500',
      color: Colors.textPrimary,
      marginBottom: 28,
    },
    fieldGroup: {
      marginBottom: 24,
      gap: 8,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: Colors.textPrimary,
    },
    currentValueBox: {
      minHeight: 58,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      paddingHorizontal: 16,
      justifyContent: 'center',
    },
    currentValue: {
      fontSize: 14,
      fontWeight: '700',
      color: Colors.textPrimary,
      textTransform: 'uppercase',
    },
    input: {
      minHeight: 58,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surface,
      paddingHorizontal: 16,
      fontSize: 14,
      color: Colors.textPrimary,
      marginBottom: 8,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 26,
      paddingTop: 12,
      backgroundColor: Colors.surface,
    },
    nextButton: {
      minHeight: 56,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.accent,
      marginBottom: 6,
    },
    nextButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: Colors.white,
    },
  }),
)

export const createChangePasswordStyles = createThemedStyles((Colors: AppColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: Colors.surface,
    },
    keyboardView: {
      flex: 1,
    },
    header: {
      minHeight: 56,
      paddingHorizontal: 12,
      justifyContent: 'center',
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonPressed: {
      opacity: 0.5,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors.textPrimary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: Colors.textSecondary,
      marginBottom: 22,
    },
    inputArea: {
      gap: 2,
    },
    currentValueSection: {
      marginBottom: 22,
      gap: 8,
    },
    currentValueLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: Colors.textPrimary,
    },
    currentValueBox: {
      minHeight: 52,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceMuted,
      paddingHorizontal: 14,
      justifyContent: 'center',
    },
    currentValue: {
      fontSize: 14,
      fontWeight: '700',
      color: Colors.textPrimary,
      textTransform: 'uppercase',
    },
    eyeButton: {
      width: 34,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 4,
    },
    passwordChecklist: {
      marginTop: 10,
      padding: 14,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.border,
      backgroundColor: Colors.surfaceMuted,
      gap: 6,
    },
    passwordChecklistTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: Colors.textPrimary,
      marginBottom: 2,
    },
    passwordChecklistItem: {
      fontSize: 13,
      lineHeight: 18,
      color: Colors.textSecondary,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 26,
      paddingTop: 12,
      backgroundColor: Colors.surface,
    },
    saveButton: {
      minHeight: 56,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.accent,
      marginBottom: 6,
    },
    saveButtonDisabled: {
      opacity: 0.75,
    },
    saveButtonLoadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    saveButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: Colors.white,
    },
  }),
)
