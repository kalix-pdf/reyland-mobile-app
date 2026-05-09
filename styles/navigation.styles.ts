import { AppColors } from '@/constants/colors';
import { Platform, StyleSheet } from 'react-native';

import { createThemedStyles } from './foundations';

export const createAuthCallbackStyles = createThemedStyles((Colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: 24,
      backgroundColor: Colors.background,
    },
    text: {
      fontSize: 16,
      color: '#4B5563',
    },
  }),
);

export const createTabLayoutStyles = createThemedStyles((Colors: AppColors) =>
  StyleSheet.create({
    tabBar: {
      height: Platform.OS === 'ios' ? 92 : 78,
      paddingTop: 10,
      paddingBottom: Platform.OS === 'ios' ? 24 : 12,
      paddingHorizontal: 14,
      backgroundColor: Colors.surface,
      borderTopWidth: 0,
      shadowColor: Colors.primary,
      shadowOpacity: 0.12,
      shadowRadius: 22,
      shadowOffset: {
        width: 0,
        height: -8,
      },
      elevation: 10,
    },
    tabBarItem: {
      borderRadius: 22,
      paddingTop: 2,
    },
    tabBarLabel: {
      marginTop: 4,
    },
    tabLabelText: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.1,
    },
    tabLabelTextActive: {
      fontWeight: '900',
    },
  }),
);
