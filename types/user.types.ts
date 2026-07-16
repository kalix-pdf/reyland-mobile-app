import { AppColors } from "@/constants/colors";
import { ReactNode } from "react";

export type ViewProfileProps = {
  user: User;
  onLogout: () => void;
  onRefresh?: () => Promise<void> | void;
  refreshing?: boolean;
  refreshOffset?: number;
};

// export type Styles = ReturnType<typeof createProfileViewStyles>;

export type SettingItemProps = {
  // styles: Styles;
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
  // styles: Styles;
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
  status: number;
};

