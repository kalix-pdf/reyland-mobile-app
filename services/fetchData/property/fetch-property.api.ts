import { apiClient } from "@/lib/axios";
import { Property } from "@/types/property.types";

interface FetchPropertiesResponse {
  success: boolean;
  data: Property[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
    total: number;
  };
}

//we'll add a separate fetch function for fetching featured properties to be display in the home page
// limit by 3-4 properties and then function to fetch all properties for "discover" page tab
// fetch all function should be limit to 4-5 API fetch calls to avoid overloading 

export async function fetchPropertyInfo(cursor?: string): Promise<{
  data: Property[]; nextCursor: string | null; hasMore: boolean; }> {
  const params = new URLSearchParams({ mode: 'mobile', limit: '2', ...(cursor ? { cursor } : {}) });

  const response = await apiClient.get<FetchPropertiesResponse>(
    `/admin/properties/fetch/properties?${params.toString()}`
  );

  if (!response.data.success) {
    throw new Error('Failed to fetch properties');
  }

  return {
    data: response.data.data,
    nextCursor: response.data.pagination.nextCursor,
    hasMore: response.data.pagination.hasMore,
  };
}

export async function fetchFeaturedProperties(): Promise<Property[]> {
  const response = await apiClient.get<FetchPropertiesResponse>('/admin/properties/fetch/featured-properties');

  if (!response.data.success) {
    throw new Error('Failed to fetch featured properties');
  }

  return response.data.data;
}