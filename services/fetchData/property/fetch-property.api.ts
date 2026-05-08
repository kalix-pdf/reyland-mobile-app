import { fetchData, API_URL } from "../fetch.api";
import { Property } from "@/types/property.types";

//hindi pa to nagana par -> do not touch hwhaha
export async function getUserInfo(): Promise<Property[]> {
    return fetchData<Property[]>(`${API_URL}/admin/fetch/properties`);
}