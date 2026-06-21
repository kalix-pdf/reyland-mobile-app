/** @type {import('tailwindcss').Config} */
const AppColors = require('./tailwind.colors');

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: AppColors.primary,
        primaryLight: AppColors.primaryLight,
        primaryDark: AppColors.primaryDark,
 
        accent: AppColors.accent,
        accentLight: AppColors.accentLight,
        accentDark: AppColors.accentDark,
 
        background: AppColors.background,
        surface: AppColors.surface,
        surfaceMuted: AppColors.surfaceMuted,
        surfaceDark: AppColors.surfaceDark,
 
        textPrimary: AppColors.textPrimary,
        textSecondary: AppColors.textSecondary,
        textMuted: AppColors.textMuted,
        textOnDark: AppColors.textOnDark,
 
        border: AppColors.border,
        borderDark: AppColors.borderDark,
 
        success: AppColors.success,
        warning: AppColors.warning,
        error: AppColors.error,
        errorBackground: AppColors.errorBackground,
        errorBorder: AppColors.errorBorder,
 
        tag: AppColors.tag,
        tagText: AppColors.tagText,
        rentBadge: AppColors.rentBadge,
        rentBadgeText: AppColors.rentBadgeText,
        saleBadge: AppColors.saleBadge,
        saleBadgeText: AppColors.saleBadgeText,
 
        logoBackground: AppColors.logoBackground,
        logoGreen: AppColors.logoGreen,
        logoGreenLight: AppColors.logoGreenLight,
        logoGreenDark: AppColors.logoGreenDark,
        heroBackground: AppColors.heroBackground,
        heroText: AppColors.heroText,
 
        facebook: AppColors.facebook,
      }
    },
  },
  plugins: [],
}