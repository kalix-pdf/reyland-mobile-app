import { AppColors } from '@/constants/colors';
import { StyleSheet } from 'react-native';
import { createThemedStyles } from './foundations';

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
);

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
      marginBottom: 6
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
      marginTop: 10
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
);