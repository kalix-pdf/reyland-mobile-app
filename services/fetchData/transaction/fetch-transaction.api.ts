import { fetchOne, fetchPaginated, PaginatedResult } from '@/services/fetchData/api-client';
import type { Transaction } from '@/types';

const BASE = '/transaction/fetch';

export const transactionsAPI = {
  /**
   * Fetch a paginated list of transaction.
   */
  getPaginated: (cursor?: string, limit = 5): Promise<PaginatedResult<Transaction>> =>
    fetchPaginated<Transaction>(`${BASE}/byuser`, { cursor, limit }),

  /**
   * Fetch a paginated list of properties belonging to a specific project.
   */
  
  getById: (id: number): Promise<Transaction> =>
    fetchOne<Transaction>(`${BASE}/Transaction/${id}`)
};