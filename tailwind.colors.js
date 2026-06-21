/**
 * tailwind.colors.js
 *
 * Plain CommonJS mirror of LightColors from constants/color.ts.
 * Exists only so tailwind.config.js (which runs in plain Node, no
 * TypeScript support) can require it directly.
 *
 * ⚠️ If you change a value in constants/color.ts's LightColors object,
 * update it here too — these are not linked at runtime.
 */

module.exports = {
  // Brand
  primary: "#00171C",
  primaryLight: "#06343A",
  primaryDark: "#000D10",

  accent: "#008C4F",
  accentLight: "#4FC47A",
  accentDark: "#005530",

  // App surfaces
  background: "#F4F8F6",
  surface: "#FFFFFF",
  surfaceMuted: "rgba(233, 238, 235, 0.91)",
  surfaceDark: "#00171C",

  // Text
  textPrimary: "#00171C",
  textSecondary: "#3E5F57",
  textMuted: "#7A918A",
  textOnDark: "#FFFFFF",

  // Borders
  border: "#CBD5D1",
  borderDark: "#12383E",

  // Feedback
  success: "#008C4F",
  warning: "#F59E0B",
  error: "#DC2626",
  errorBackground: "#FEF2F2",
  errorBorder: "#FCA5A5",

  // Tags / badges
  tag: "#E5F5EC",
  tagText: "#006B3D",

  rentBadge: "#E5F5EC",
  rentBadgeText: "#006B3D",

  saleBadge: "#ECFDF5",
  saleBadgeText: "#047857",

  // Logo / hero
  logoBackground: "#00171C",
  logoGreen: "#008C4F",
  logoGreenLight: "#4FC47A",
  logoGreenDark: "#006B3D",
  heroBackground: "#008C4F",
  heroText: "#FFFFFF",

  // Social / base
  facebook: "#1877F2",
  white: "#FFFFFF",
  black: "#000000",
};