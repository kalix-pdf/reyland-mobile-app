
//generic reusable function for all fetching API Data
import { apiClient } from '@/lib/axios';
import { AxiosRequestConfig } from 'axios';

export const fetchData = async <T>(endpoint: string, options?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.get<T>(endpoint, options);
  return response.data;
};