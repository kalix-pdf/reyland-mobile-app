import { fetchOne, fetchPaginated, PaginatedResult } from '@/services/fetchData/api-client';
import type { Project } from '@/types';

export const BASE = '/admin/fetch';

export const projectsApi = {
  /**
   * Fetch a paginated list of projects.
   */
  getPaginated: (cursor?: string, limit = 5): Promise<PaginatedResult<Project>> =>
    fetchPaginated<Project>(`${BASE}/projects`, { cursor, limit }),

  /**
   * Fetch featured projects for the Home page.
   */
  getFeatured: (): Promise<Project[]> =>
    fetchOne<Project[]>(`${BASE}/featured-projects`),
};