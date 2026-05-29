import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "@/services/auth/auth-login";
import { logoutUser } from "@/services/auth/auth-logout";
import { clearCachedUser, establishAuthenticatedSession, getCachedUser } from "@/services/auth/auth-session";
import { User } from "@/types/user.types";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authEvents } from "@/lib/auth-events";

type LoginResult = {
  success: boolean;
  message?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  setUser: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //persistent login session restoration
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return; 

        const cachedUser = await getCachedUser();
        if (cachedUser) {
          setUser(cachedUser); 
        }

        // try {
        //   const refreshToken = await AsyncStorage.getItem('refreshToken');
        //   await establishAuthenticatedSession(token, setUser, refreshToken ?? undefined);
        // } catch (networkError) {
        //   // Offline or server error — cached user is already set, stay logged in
        //   // Optional: set a flag like setIsOnline(false) for UI indicators
        //   console.warn('Session re-validation failed, using cached user:', networkError);
        // }

      } catch (err) {
        await AsyncStorage.multiRemove(['token', 'refreshToken']);
        await clearCachedUser();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  //Listen for forced logout from axios interceptor
  useEffect(() => {
    const handleExpired = async () => {
      await AsyncStorage.multiRemove(['token', 'refreshToken']);
      setUser(null);
    };

    authEvents.on('SESSION_EXPIRED', handleExpired);
    return () => { authEvents.off('SESSION_EXPIRED', handleExpired); };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const { token, refreshToken } = await loginUser(email, password);
      const success = await establishAuthenticatedSession(token, setUser, refreshToken);
      return {
        success,
        message: success ? undefined : 'Unable to load your account. Please try again.',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to sign in right now.',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await logoutUser(token);
      }
    } catch (error) {
      console.error(error);
      alert('Something Went Wrong During Logout. Please try again.');
    } finally {
      await AsyncStorage.multiRemove(['token', 'refreshToken']);
      await clearCachedUser(); 
      setUser(null);
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
