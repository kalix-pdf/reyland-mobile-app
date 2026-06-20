import { apiClient } from '@/lib/axios';
import axios from 'axios';

const ADD_SITE_VISIT_ENDPOINT = '/site-visits';
const ACTIVE_PROPERTY_SITE_VISIT_ENDPOINT = '/site-visits/property';

export type AddSiteVisitPayload = {
  property_id: number;
  name: string;
  phone: string;
  email?: string | null;
  preferred_visit_at: string;
  notes?: string | null;
};

export type SiteVisit = {
  id: string;
  property_id: number;
  project_id: number | null;
  user_id: string;
  name: string;
  phone: string;
  email: string | null;
  preferred_visit_at: string;
  notes: string | null;
  status: number;
  confirmed_visit_at: string | null;
  created_at: string;
  updated_at?: string | null;
};

type SiteVisitResponse = {
  success: boolean;
  message?: string;
  data?: SiteVisit | null;
};

export class SiteVisitApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly siteVisit?: SiteVisit | null,
  ) {
    super(message);
    this.name = 'SiteVisitApiError';
  }
}

export async function addSiteVisit(payload: AddSiteVisitPayload): Promise<SiteVisit> {
  try {
    const response = await apiClient.post<SiteVisitResponse>(ADD_SITE_VISIT_ENDPOINT, payload);

    if (!response.data.success || !response.data.data) {
      throw new SiteVisitApiError(
        response.data.message ?? 'Unable to request a site visit right now.',
        response.status,
      );
    }

    return response.data.data;
  } catch (error) {
    if (error instanceof SiteVisitApiError) throw error;

    if (axios.isAxiosError<SiteVisitResponse>(error)) {
      throw new SiteVisitApiError(
        error.response?.data?.message ?? 'Unable to request a site visit right now.',
        error.response?.status,
        error.response?.data?.data,
      );
    }

    throw error;
  }
}

export async function fetchActivePropertySiteVisit(propertyId: number): Promise<SiteVisit | null> {
  try {
    const response = await apiClient.get<SiteVisitResponse>(
      `${ACTIVE_PROPERTY_SITE_VISIT_ENDPOINT}/${propertyId}/active`,
    );

    if (!response.data.success) {
      throw new SiteVisitApiError(
        response.data.message ?? 'Unable to check site visit status right now.',
        response.status,
      );
    }

    return response.data.data ?? null;
  } catch (error) {
    if (error instanceof SiteVisitApiError) throw error;

    if (axios.isAxiosError<SiteVisitResponse>(error)) {
      throw new SiteVisitApiError(
        error.response?.data?.message ?? 'Unable to check site visit status right now.',
        error.response?.status,
        error.response?.data?.data,
      );
    }

    throw error;
  }
}
