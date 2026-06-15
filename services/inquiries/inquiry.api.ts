import { apiClient } from '@/lib/axios';
import axios from 'axios';

const ADD_INQUIRY_ENDPOINT = '/inquiries/add/inquiry';
const ACTIVE_PROPERTY_INQUIRY_ENDPOINT = '/inquiries/fetch/property';

export type AddInquiryPayload = {
  property_id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
};

export type Inquiry = {
  id: string;
  property_id: number;
  project_id: number | null;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  status: number;
  inquiry_type: number;
  created_at: string;
};

type AddInquiryResponse = {
  success: boolean;
  message?: string;
  data?: Inquiry;
};

type ActiveInquiryResponse = {
  success: boolean;
  message?: string;
  data?: Inquiry | null;
};

export class InquiryApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly inquiry?: Inquiry,
  ) {
    super(message);
    this.name = 'InquiryApiError';
  }
}

export async function addInquiry(payload: AddInquiryPayload): Promise<Inquiry> {
  try {
    const response = await apiClient.post<AddInquiryResponse>(ADD_INQUIRY_ENDPOINT, payload);

    if (!response.data.success || !response.data.data) {
      throw new InquiryApiError(
        response.data.message ?? 'Unable to submit inquiry right now.',
        response.status,
      );
    }

    return response.data.data;
  } catch (error) {
    if (error instanceof InquiryApiError) throw error;

    if (axios.isAxiosError<AddInquiryResponse>(error)) {
      throw new InquiryApiError(
        error.response?.data?.message ?? 'Unable to submit inquiry right now.',
        error.response?.status,
        error.response?.data?.data,
      );
    }

    throw error;
  }
}

export async function fetchActivePropertyInquiry(propertyId: number): Promise<Inquiry | null> {
  try {
    const response = await apiClient.get<ActiveInquiryResponse>(
      `${ACTIVE_PROPERTY_INQUIRY_ENDPOINT}/${propertyId}/active`,
    );

    if (!response.data.success) {
      throw new InquiryApiError(
        response.data.message ?? 'Unable to check inquiry status right now.',
        response.status,
      );
    }

    return response.data.data ?? null;
  } catch (error) {
    if (error instanceof InquiryApiError) throw error;

    if (axios.isAxiosError<ActiveInquiryResponse>(error)) {
      throw new InquiryApiError(
        error.response?.data?.message ?? 'Unable to check inquiry status right now.',
        error.response?.status,
        error.response?.data?.data ?? undefined,
      );
    }

    throw error;
  }
}
