import { AppColors, DarkColors, LightColors, ThemeMode } from "@/constants/colors";
import React, { createContext, ReactNode, useContext, useMemo, useState } from "react";

type AppThemeContextValue = {
  themeMode: ThemeMode;
  colors: AppColors;
  isDarkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleDarkMode: (value: boolean) => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  const colors = themeMode === "dark" ? DarkColors : LightColors;

  const value = useMemo(
    () => ({
      themeMode,
      colors,
      isDarkMode: themeMode === "dark",
      setThemeMode,
      toggleDarkMode: (enabled: boolean) => {
        setThemeMode(enabled ? "dark" : "light");
      },
    }),
    [themeMode, colors],
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }

  return context;
}
