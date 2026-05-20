import { apiClient } from "@/lib/axios";
import { Property } from "@/types/property.types";

interface FetchPropertiesResponse {
    success: boolean;
    data: Property[];
}

//we'll add a separate fetch function for fetching featured properties to be display in the home page
// limit by 3-4 properties and then function to fetch all properties for "discover" page tab
// fetch all function should be limit to 4-5 API fetch calls to avoid overloading 

export async function fetchPropertyInfo(): Promise<Property[]> {
  const response = await apiClient.get<FetchPropertiesResponse>('/admin/properties/fetch/properties');

  if (!response.data.success) {
    throw new Error('Failed to fetch properties');
  }

  return response.data.data;
}