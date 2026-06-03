import { AppColors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

import { createThemedStyles } from './foundations';
import { sharedHeaderActionPressed, sharedLoginPillBase, sharedLoginPillText, sharedSmallAvatarBase } from './shared-primitives';

export const createHeaderStyles = createThemedStyles((colors: AppColors) =>
    StyleSheet.create({
        header: {
            paddingHorizontal: 18,
            paddingTop: 12,
            paddingBottom: 14,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
            backgroundColor: colors.surface,
        },
        headerTitle: {
            fontSize: 22,
            lineHeight: 28,
            fontWeight: '900',
            color: colors.textPrimary,
            textAlign: 'center',
            marginBottom: 12,
        },
        headerTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 14,
            marginBottom: 14,
        },
        user: {
            flexDirection: 'row', 
            alignItems: 'center',
            gap: 8,
            maxWidth: 180,
        },
        greetingText: {
            color: colors.textSecondary,
            fontSize: 13,
            fontWeight: '800',
            flexShrink: 1,
        },
        userSection: {
            flexDirection: 'row',
            alignItems: 'center',
            flexShrink: 0,
        },
        loginPillText: sharedLoginPillText,
        loginPill: {
            ...sharedLoginPillBase,
            minHeight: 40,
            paddingHorizontal: 14,
            paddingVertical: 9,
            backgroundColor: colors.primary,
            borderColor: 'rgba(255,255,255,0.35)',
        },
        headerActionPressed: sharedHeaderActionPressed,
        avatar: {
            ...sharedSmallAvatarBase,
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: colors.primaryLight,
            borderColor: colors.border,
        },
        
        logoImage: {
            width: 128,
            height: 36,
        },
        // Search bar
        searchRow: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.background,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 14,
            minHeight: 48,
            shadowColor: colors.primary,
            shadowOpacity: 0.03,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 1,
        },
        searchRowFocused: {
            borderColor: colors.accent,
            backgroundColor: colors.surface,
        },
        searchInput: {
            flex: 1,
            fontSize: 14,
            lineHeight: 19,
            color: colors.textPrimary,
            marginLeft: 9,
            fontWeight: '600',
            paddingVertical: 0,
        },
    })
);
