import { apiClient } from '@/lib/axios';
import axios from 'axios';

const ADD_INVESTMENT_CONTRACT_SCHEDULE_ENDPOINT = '/investment-contract-schedules';
const ACTIVE_INVESTMENT_CONTRACT_SCHEDULE_ENDPOINT = '/investment-contract-schedules/active';

export type AddInvestmentContractSchedulePayload = {
  investment_plan_range: number;
  is_lock_in: boolean;
  preferred_signing_at: string;
};

export type InvestmentContractSchedule = {
  id: string;
  investor_id: string;
  investment_plan_range: number;
  annual_rate: number;
  is_lock_in: boolean;
  preferred_signing_at: string;
  status: number;
  created_at: string;
  updated_at?: string | null;
};

type InvestmentContractScheduleResponse = {
  success: boolean;
  message?: string;
  data?: InvestmentContractSchedule | null;
};

export class InvestmentContractScheduleApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly schedule?: InvestmentContractSchedule | null,
  ) {
    super(message);
    this.name = 'InvestmentContractScheduleApiError';
  }
}

export async function addInvestmentContractSchedule(
  payload: AddInvestmentContractSchedulePayload,
): Promise<InvestmentContractSchedule> {
  try {
    const response = await apiClient.post<InvestmentContractScheduleResponse>(
      ADD_INVESTMENT_CONTRACT_SCHEDULE_ENDPOINT,
      payload,
    );

    if (!response.data.success || !response.data.data) {
      throw new InvestmentContractScheduleApiError(
        response.data.message ?? 'Unable to request a contract signing schedule right now.',
        response.status,
      );
    }

    return response.data.data;
  } catch (error) {
    if (error instanceof InvestmentContractScheduleApiError) throw error;

    if (axios.isAxiosError<InvestmentContractScheduleResponse>(error)) {
      throw new InvestmentContractScheduleApiError(
        error.response?.data?.message ?? 'Unable to request a contract signing schedule right now.',
        error.response?.status,
        error.response?.data?.data,
      );
    }

    throw error;
  }
}

export async function fetchActiveInvestmentContractSchedule(): Promise<InvestmentContractSchedule | null> {
  try {
    const response = await apiClient.get<InvestmentContractScheduleResponse>(
      ACTIVE_INVESTMENT_CONTRACT_SCHEDULE_ENDPOINT,
    );

    if (!response.data.success) {
      throw new InvestmentContractScheduleApiError(
        response.data.message ?? 'Unable to check contract signing schedule status right now.',
        response.status,
      );
    }

    return response.data.data ?? null;
  } catch (error) {
    if (error instanceof InvestmentContractScheduleApiError) throw error;

    if (axios.isAxiosError<InvestmentContractScheduleResponse>(error)) {
      throw new InvestmentContractScheduleApiError(
        error.response?.data?.message ?? 'Unable to check contract signing schedule status right now.',
        error.response?.status,
        error.response?.data?.data,
      );
    }

    throw error;
  }
}
