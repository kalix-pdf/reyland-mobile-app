// services/fetchData/transaction/fetch-transaction.api.ts
import { fetchOne, fetchPaginated, PaginatedResult } from '@/services/fetchData/api-client';
import type { Transaction, FetchInstallmentResponseData } from '@/types';

const BASE = '/transaction/fetch';

export const transactionsAPI = {
  /**
   * Fetch a paginated list of transactions.
   */
  getPaginated: (cursor?: string, limit = 5): Promise<PaginatedResult<Transaction>> =>
    fetchPaginated<Transaction>(`${BASE}/byuser`, { cursor, limit }),

  /**
   * Fetch installment payment history + summary for a given transaction.
   */
  getPaymentHistoryByUserId: (id: number): Promise<FetchInstallmentResponseData> =>
    fetchOne<FetchInstallmentResponseData>(`${BASE}/payment-history/${id}`),
};