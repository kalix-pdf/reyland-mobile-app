import { User } from "@/types/user.types";
import { apiClient } from "@/lib/axios";

export async function getUserInfo(accessToken?: string): Promise<User> {
  const response = await apiClient.get<User>('/api/user/me', {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });
  return response.data;
}
