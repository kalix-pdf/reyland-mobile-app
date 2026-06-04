import { fetchOne, fetchPaginated, PaginatedResult, BASE } from '@/services/fetchData/api-client';
import type { Property } from '@/types';

export const propertiesApi = {
  /**
   * Fetch a paginated list of properties (for the Discover page).
   */
  getPaginated: (cursor?: string, limit = 2): Promise<PaginatedResult<Property>> =>
    fetchPaginated<Property>(`${BASE}/properties`, { cursor, limit }),

  /**
   * Fetch featured properties for the Home page (small fixed set).
   */
  getFeatured: (): Promise<Property[]> =>
    fetchOne<Property[]>(`${BASE}/featured-properties`),

  /**
   * Fetch a paginated list of properties belonging to a specific project.
   */
  getPaginatedByProjectId: (project_id: number, cursor?: string, limit = 2): Promise<PaginatedResult<Property>> =>
    fetchPaginated<Property>(`${BASE}/properties/${project_id}`, { cursor, limit }),

  
  getById: (id: number): Promise<Property> =>
    fetchOne<Property>(`${BASE}/property/${id}`)
};