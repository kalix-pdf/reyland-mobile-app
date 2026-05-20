import { User } from "@/types/user.types";
import { apiClient } from "@/lib/axios";

export async function getUserInfo(): Promise<User> {
  const response = await apiClient.get<User>('/api/user/me');
  return response.data;
}