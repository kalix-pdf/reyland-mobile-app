import { AppColors, Colors } from '@/constants/colors';
import { StyleSheet } from 'react-native';

import { createThemedStyles } from './foundations';
import { sharedHeaderActionPressed, sharedLoginPillBase, sharedLoginPillText, sharedSmallAvatarBase } from './shared-primitives';

export const createHeaderStyles = createThemedStyles((colors: AppColors) =>
    StyleSheet.create({
        header: {
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: Colors.border,
            backgroundColor: Colors.background,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: Colors.textPrimary,
            letterSpacing: -0.5,
            textAlign: 'center',
        },
        headerTop: {
            paddingTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        user: {
            flexDirection: 'row', 
            alignItems: 'center', gap: 8
        },
        logo: {
            flexDirection: 'column',
            fontSize: 19,
            fontWeight: '700',
        },
        userSection: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        loginPillText: sharedLoginPillText,
        loginPill: {
            ...sharedLoginPillBase,
            backgroundColor: Colors.primary,
            borderColor: 'rgba(255,255,255,0.35)',
        },
        headerActionPressed: sharedHeaderActionPressed,
        avatar: {
            ...sharedSmallAvatarBase,
            backgroundColor: Colors.primaryLight,
            borderColor: 'rgba(255,255,255,0.24)',
        },
        dateText: {
            marginTop: 8,
            fontSize: 13,
            backgroundColor: Colors.surfaceMuted,
            color: '#666',
            padding: 10
        },
    })
);