import { AppColors } from '@/constants/colors';
import { createThemedStyles, fontSizes, lineHeights } from './global.css';

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
