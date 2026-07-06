import { apiClient } from '@/lib/axios';
import axios from 'axios';

const REQUEST_INVESTOR_ACCESS_ENDPOINT = '/investors/request';

type InvestorRequestResponse = {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    user_type?: number;
  };
};

export type InvestorAccessRequestPayload = {
  investment_plan_range: number;
  is_lock_in: boolean;
  preferred_signing_at: string;
};

export class InvestorApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly userType?: number,
  ) {
    super(message);
    this.name = 'InvestorApiError';
  }
}

export async function requestInvestorAccess(payload: InvestorAccessRequestPayload): Promise<number> {
  try {
    const response = await apiClient.post<InvestorRequestResponse>(
      REQUEST_INVESTOR_ACCESS_ENDPOINT,
      payload,
    );

    if (!response.data.success || response.data.data?.user_type === undefined) {
      throw new InvestorApiError(
        response.data.message ?? 'Unable to submit investor registration right now.',
        response.status,
        response.data.data?.user_type,
      );
    }

    return response.data.data.user_type;
  } catch (error) {
    if (error instanceof InvestorApiError) throw error;

    if (axios.isAxiosError<InvestorRequestResponse>(error)) {
      const status = error.response?.status;
      const responseMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === 'string' ? error.response.data : undefined);

      throw new InvestorApiError(
        responseMessage ??
          (status === 404
            ? 'Investor registration endpoint was not found. Please restart the backend server.'
            : `Unable to submit investor registration right now${status ? ` (${status})` : ''}.`),
        status,
        error.response?.data?.data?.user_type,
      );
    }

    throw error;
  }
}
