import { fetchData, API_URL } from "../fetch.api";
import { Property } from "@/types/property.types";

interface FetchPropertiesResponse {
    success: boolean;
    data: Property[];
}

export async function fetchPropertyInfo(): Promise<Property[]> {
    const response = await fetchData<FetchPropertiesResponse>(`${API_URL}/admin/fetch/properties`);
    
    if (!response.success) {
        throw new Error('Failed to fetch properties');
    }
    
    return response.data;
}