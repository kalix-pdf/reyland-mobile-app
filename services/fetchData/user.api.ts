import { User } from "@/types/user.types";
import { fetchData, API_URL } from "./fetch.api";

export async function getUserInfo(token: string): Promise<User> {
    return fetchData<User>(`${API_URL}/api/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
}