import { fetchOne, fetchPaginated, PaginatedResult } from '@/services/fetchData/api-client';
import type { investment } from '@/types/investor.types';


export const investmentsAPI = {
  /**
   * Fetch a paginated list of projects.
   */
  getPaginated: (cursor?: string, limit = 1): Promise<PaginatedResult<investment>> =>
    fetchPaginated<investment>(`/investments/fetch`, { cursor, limit }),

};