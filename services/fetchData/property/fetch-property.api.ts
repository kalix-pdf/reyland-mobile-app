import { fetchOne, fetchPaginated, PaginatedResult, BASE } from '@/services/fetchData/api-client';
import type { Property } from '@/types';

export const propertiesApi = {
  /**
   * Fetch a paginated list of properties (for the Discover page).
   */
  getPaginated: (cursor?: string, limit = 5): Promise<PaginatedResult<Property>> =>
    fetchPaginated<Property>(`${BASE}/properties`, { cursor, limit }),

  /**
   * Fetch featured properties for the Home page (small fixed set).
   */
  getFeatured: (): Promise<Property[]> =>
    fetchOne<Property[]>(`${BASE}/featured-properties`),
};
