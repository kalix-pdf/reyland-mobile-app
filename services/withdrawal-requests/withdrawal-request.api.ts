import { apiClient } from '@/lib/axios';
import axios from 'axios';

export const WITHDRAWAL_TYPE = {
  ROI_ONLY: 0,
  FULL_INVESTMENT: 1,
} as const;

export const WITHDRAWAL_STATUS = {
  PENDING_REVIEW: 0,
  APPROVED: 1,
  PROCESSING: 2,
  PAID: 3,
  REJECTED: 4,
  CANCELLED: 5,
} as const;

export type WithdrawalType = (typeof WITHDRAWAL_TYPE)[keyof typeof WITHDRAWAL_TYPE];

export type WithdrawalRequestPayload = {
  investment_id: number;
  withdrawal_type: WithdrawalType;
  requested_amount?: number;
  payment_method_id: string;
  notes?: string | null;
};

export type WithdrawalRequest = {
  id: string;
  user_id: string | {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    phone_number: string | null;
  };
  investment_id: number | {
    id: number;
    investment_ref: string | null;
    principal_amount: number | string | null;
    status: string | null;
    matures_at?: string | null;
  };
  withdrawal_type: WithdrawalType;
  requested_amount: number | string;
  available_roi_at_request: number | string;
  principal_at_request: number | string;
  estimated_payout: number | string;
  status: number;
  payment_method_id?: string | null;
  payout_method: string;
  account_name: string;
  account_number: string;
  bank_name: string | null;
  notes: string | null;
  admin_notes: string | null;
  reviewed_at: string | null;
  processed_at: string | null;
  paid_at: string | null;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
};

type WithdrawalRequestResponse = {
  success: boolean;
  message?: string;
  data?: WithdrawalRequest | null;
};

type WithdrawalRequestListResponse = {
  success: boolean;
  message?: string;
  data?: WithdrawalRequest[];
};

export class WithdrawalRequestApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly withdrawalRequest?: WithdrawalRequest | null,
  ) {
    super(message);
    this.name = 'WithdrawalRequestApiError';
  }
}

export async function addWithdrawalRequest(payload: WithdrawalRequestPayload): Promise<WithdrawalRequest> {
  try {
    const response = await apiClient.post<WithdrawalRequestResponse>('/withdrawal-requests', payload);

    if (!response.data.success || !response.data.data) {
      throw new WithdrawalRequestApiError(
        response.data.message ?? 'Unable to submit withdrawal request right now.',
        response.status,
      );
    }

    return response.data.data;
  } catch (error) {
    if (error instanceof WithdrawalRequestApiError) throw error;

    if (axios.isAxiosError<WithdrawalRequestResponse>(error)) {
      throw new WithdrawalRequestApiError(
        error.response?.data?.message ?? 'Unable to submit withdrawal request right now.',
        error.response?.status,
        error.response?.data?.data,
      );
    }

    throw error;
  }
}

export async function fetchMyWithdrawalRequests(): Promise<WithdrawalRequest[]> {
  try {
    const response = await apiClient.get<WithdrawalRequestListResponse>('/withdrawal-requests/me');

    if (!response.data.success) {
      throw new WithdrawalRequestApiError(
        response.data.message ?? 'Unable to load withdrawal requests right now.',
        response.status,
      );
    }

    return response.data.data ?? [];
  } catch (error) {
    if (error instanceof WithdrawalRequestApiError) throw error;

    if (axios.isAxiosError<WithdrawalRequestListResponse>(error)) {
      throw new WithdrawalRequestApiError(
        error.response?.data?.message ?? 'Unable to load withdrawal requests right now.',
        error.response?.status,
      );
    }

    throw error;
  }
}
