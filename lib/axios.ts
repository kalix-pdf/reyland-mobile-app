import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshSession } from '@/services/auth/auth-refresh';
import { authEvents } from '@/lib/auth-events';

export const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export type ApiRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Refresh logic ────────────────────────────────────────────────────────────
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const flushQueue = (error: unknown, token: string | null = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  pendingQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config as ApiRequestConfig | undefined;

    const is401 = error.response?.status === 401;
    const alreadyRetried = originalRequest?._retry;
    const shouldSkipAuthRefresh = originalRequest?.skipAuthRefresh;

    if (!is401 || alreadyRetried || shouldSkipAuthRefresh || !originalRequest) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { token } = await refreshSession();
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
      originalRequest.headers.Authorization = `Bearer ${token}`;
      flushQueue(null, token);
      return apiClient(originalRequest); 
    } catch (refreshError) {
      flushQueue(refreshError);
      // Force logout — tokens are dead
      await AsyncStorage.multiRemove(['token', 'refreshToken']);
      // Emit event so AuthContext can react 
      authEvents.emit('SESSION_EXPIRED');
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
