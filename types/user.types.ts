import { AppColors } from "@/constants/colors";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";

export type ViewProfileProps = {
  user: User;
  onLogout: () => void;
};

export type Styles = ReturnType<typeof createStyles>;

export type SettingItemProps = {
  styles: Styles;
  colors: AppColors;
  icon: ReactNode;
  label: string;
  value?: string;
  danger?: boolean;
  showArrow?: boolean;
  isLast?: boolean;
  onPress?: () => void;
};

export type ToggleItemProps = {
  styles: Styles;
  colors: AppColors;
  icon: ReactNode;
  label: string;
  value: boolean;
  isLast?: boolean;
  onValueChange: (value: boolean) => void;
};

//user types
export type User = {
  uuid: string;
  name: string;
  email: string;
  accessToken: string;
  password: string;
  avatar: string;
  phone: string;
  memberSince: string;
  role: number;
};


export const createStyles = (Colors: AppColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: Colors.background,
    },

    scrollContent: {
      paddingBottom: 28,
    },

    hero: {
      minHeight: 231,
      backgroundColor: Colors.primary,
      paddingHorizontal: 24,
      paddingTop: 24,
      overflow: "hidden",
    },

    heroDecorCircleOne: {
      position: "absolute",
      width: 170,
      height: 170,
      borderRadius: 85,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
      right: -58,
      top: 18,
    },

    heroDecorCircleTwo: {
      position: "absolute",
      width: 220,
      height: 220,
      borderRadius: 110,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
      left: -92,
      bottom: -92,
    },

    heroHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },

    brandPill: {
      alignSelf: "flex-start",
      minHeight: 30,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.14)",
      backgroundColor: "rgba(255,255,255,0.06)",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      marginBottom: 12,
    },

    brandDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors.logoGreenLight,
    },

    brandPillText: {
      color: Colors.white,
      fontSize: 11,
      lineHeight: 14,
      fontWeight: "900",
      letterSpacing: 1.4,
    },

    heroKicker: {
      color: "rgba(255,255,255,0.82)",
      fontSize: 13,
      fontWeight: "800",
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },

    heroTitle: {
      color: "#FFFFFF",
      fontSize: 32,
      fontWeight: "900",
      letterSpacing: -0.8,
    },

    heroSubtitle: {
      marginTop: 10,
      maxWidth: 290,
      color: "rgba(255,255,255,0.72)",
      fontSize: 13,
      lineHeight: 20,
      fontWeight: "600",
    },

    headerIconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: Colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      borderColor: "rgba(255,255,255,0.2)",
    },

    headerIconButtonPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.97 }],
    },

    contentPanel: {
      backgroundColor: Colors.background,
      borderTopLeftRadius: 34,
      borderTopRightRadius: 34,
      paddingTop: 18,
      marginTop: -30,
    },

    profileCard: {
      backgroundColor: Colors.surface,
      marginHorizontal: 20,
      borderRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 18,
      alignItems: "center",
      borderWidth: 1,
      borderColor: Colors.border,
      shadowColor: Colors.primary,
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      elevation: 4,
    },

    avatarWrap: {
      position: "relative",
      marginBottom: 12,
    },

    avatar: {
      width: 82,
      height: 82,
      borderRadius: 41,
      backgroundColor: Colors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: Colors.surface,
      overflow: "hidden",
    },

    avatarImage: {
      width: "100%",
      height: "100%",
      borderRadius: 41,
    },

    avatarText: {
      color: "#FFFFFF",
      fontWeight: "900",
      fontSize: 25,
      letterSpacing: -0.4,
    },

    onlineDot: {
      width: 17,
      height: 17,
      borderRadius: 8.5,
      backgroundColor: Colors.success,
      position: "absolute",
      right: 4,
      bottom: 5,
      borderWidth: 3,
      borderColor: Colors.surface,
    },

    name: {
      fontSize: 22,
      fontWeight: "900",
      color: Colors.textPrimary,
      letterSpacing: -0.4,
    },

    type: {
      fontSize: 15,
      color: Colors.textMuted,
    },

    memberSince: {
      fontSize: 12,
      color: Colors.textSecondary,
      fontWeight: "700",
      marginTop: 4,
    },

    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      backgroundColor: Colors.tag,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      marginTop: 12,
    },

    badgeText: {
      color: Colors.tagText,
      fontSize: 12,
      fontWeight: "900",
    },

    statsCard: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.background,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: Colors.border,
      paddingVertical: 16,
      marginTop: 18,
    },

    statItem: {
      flex: 1,
      alignItems: "center",
    },

    statValue: {
      color: Colors.accent,
      fontSize: 21,
      fontWeight: "900",
    },

    statLabel: {
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 2,
    },

    statDivider: {
      width: 1,
      height: 32,
      backgroundColor: Colors.border,
    },

    sectionBlock: {
      marginTop: 24,
    },

    sectionTitle: {
      color: Colors.textPrimary,
      fontSize: 20,
      fontWeight: "900",
      letterSpacing: -0.4,
      paddingHorizontal: 22,
      marginBottom: 10,
    },

    sectionCard: {
      backgroundColor: Colors.surface,
      marginHorizontal: 20,
      borderRadius: 24,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: Colors.border,
      shadowColor: Colors.primary,
      shadowOpacity: 0.04,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      elevation: 2,
    },

    settingRow: {
      minHeight: 62,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },

    settingRowLast: {
      borderBottomWidth: 0,
    },

    settingRowPressed: {
      backgroundColor: Colors.background,
    },

    settingLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 12,
    },

    settingIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 14,
      backgroundColor: Colors.tag,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    settingIconWrapDanger: {
      backgroundColor: Colors.errorBackground,
    },

    settingLabel: {
      color: Colors.textPrimary,
      fontSize: 15,
      fontWeight: "700",
    },

    settingRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    settingValue: {
      color: Colors.textMuted,
      fontSize: 13,
      fontWeight: "700",
    },

    dangerText: {
      color: Colors.error,
      fontWeight: "800",
    },

    version: {
      textAlign: "center",
      color: Colors.textMuted,
      fontSize: 12,
      fontWeight: "700",
      marginTop: 24,
      marginBottom: 8,
    },
  });
