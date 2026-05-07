import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserInfo } from "@/services/fetchData/user.api";
import { user_auth_api } from "@/services/auth/auth.api";
import { User } from "@/types/user.types";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => false,
  logout: async () => {},
  setUser: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { token } = await user_auth_api.login(email, password);
      const userInfo = await getUserInfo(token);

      if (!userInfo.uuid) {
        return false;
      }

      await AsyncStorage.setItem('token', token);
      setUser({
        ...userInfo,
        accessToken: userInfo.accessToken || token,
      });
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      await AsyncStorage.removeItem('token');
      await AsyncStorage.clear();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, logout, setUser }),
    [user, isLoading, login, logout, setUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
