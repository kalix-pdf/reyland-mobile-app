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
