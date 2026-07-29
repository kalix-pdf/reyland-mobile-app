import { apiClient } from '@/lib/axios';
import type { Inquiry } from '@/services/inquiries/inquiry.api';
import type { InvestmentContractSchedule } from '@/services/investment-contract-schedules/investment-contract-schedule.api';
import type { SiteVisit } from '@/services/site-visits/site-visit.api';
import axios from 'axios';

export type RequestKind = 'investment' | 'site_visit' | 'inquiry';
export type RequestFilter = 'all' | RequestKind;
export type RequestTone = 'pending' | 'success' | 'warning' | 'muted' | 'error';

type PropertyRelation = {
  id: number;
  title: string | null;
};

type ProjectRelation = {
  id: number;
  project_name: string | null;
};

type RelatedInquiry = Inquiry & {
  property?: PropertyRelation | null;
  project?: ProjectRelation | null;
};

type RelatedSiteVisit = SiteVisit & {
  property?: PropertyRelation | null;
  project?: ProjectRelation | null;
};

type ListResponse<T> = {
  success: boolean;
  message?: string;
  data?: T[];
};

export type UserRequest = {
  id: string;
  kind: RequestKind;
  title: string;
  subtitle: string;
  status: string;
  tone: RequestTone;
  requestedAt: string;
  scheduledAt?: string | null;
  confirmedAt?: string | null;
  detail?: string | null;
};

export class RequestsApiError extends Error {
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
    this.name = 'RequestsApiError';
  }
}

const SITE_VISIT_STATUS_LABELS: Record<number, { label: string; tone: RequestTone }> = {
  0: { label: 'Requested', tone: 'pending' },
  1: { label: 'Confirmed', tone: 'success' },
  2: { label: 'Rescheduled', tone: 'warning' },
  3: { label: 'Completed', tone: 'muted' },
  4: { label: 'Cancelled', tone: 'error' },
  5: { label: 'No Show', tone: 'error' },
};

const INQUIRY_STATUS_LABELS: Record<number, { label: string; tone: RequestTone }> = {
  0: { label: 'New', tone: 'pending' },
  1: { label: 'Contacted', tone: 'success' },
  2: { label: 'Qualified', tone: 'success' },
  3: { label: 'Closed', tone: 'muted' },
  4: { label: 'Cancelled', tone: 'error' },
};

const INVESTMENT_STATUS_LABELS: Record<number, { label: string; tone: RequestTone }> = {
  0: { label: 'Pending', tone: 'pending' },
  1: { label: 'Confirmed', tone: 'success' },
  2: { label: 'Completed', tone: 'muted' },
  3: { label: 'Cancelled', tone: 'error' },
};

function relatedTitle(property?: PropertyRelation | null, project?: ProjectRelation | null) {
  return property?.title || project?.project_name || 'Property request';
}

function mapInquiry(inquiry: RelatedInquiry): UserRequest {
  const status = INQUIRY_STATUS_LABELS[inquiry.status] ?? INQUIRY_STATUS_LABELS[0];

  return {
    id: `inquiry-${inquiry.id}`,
    kind: 'inquiry',
    title: relatedTitle(inquiry.property, inquiry.project),
    subtitle: 'Property inquiry',
    status: status.label,
    tone: status.tone,
    requestedAt: inquiry.created_at,
    detail: inquiry.message,
  };
}

function mapSiteVisit(siteVisit: RelatedSiteVisit): UserRequest {
  const status = SITE_VISIT_STATUS_LABELS[siteVisit.status] ?? SITE_VISIT_STATUS_LABELS[0];

  return {
    id: `site-visit-${siteVisit.id}`,
    kind: 'site_visit',
    title: relatedTitle(siteVisit.property, siteVisit.project),
    subtitle: 'Site visit',
    status: status.label,
    tone: status.tone,
    requestedAt: siteVisit.created_at,
    scheduledAt: siteVisit.preferred_visit_at,
    confirmedAt: siteVisit.confirmed_visit_at,
    detail: siteVisit.notes,
  };
}

function mapInvestment(schedule: InvestmentContractSchedule): UserRequest {
  const status = INVESTMENT_STATUS_LABELS[schedule.status] ?? INVESTMENT_STATUS_LABELS[0];

  return {
    id: `investment-${schedule.id}`,
    kind: 'investment',
    title: 'Investment request',
    subtitle: String(schedule.investment_plan_range || 'Selected plan'),
    status: status.label,
    tone: status.tone,
    requestedAt: schedule.created_at,
    scheduledAt: schedule.preferred_signing_at,
  };
}

async function getList<T>(endpoint: string, fallbackMessage: string) {
  const response = await apiClient.get<ListResponse<T>>(endpoint);

  if (!response.data.success) {
    throw new RequestsApiError(response.data.message ?? fallbackMessage, response.status);
  }

  return response.data.data ?? [];
}

export async function fetchUserRequests(): Promise<UserRequest[]> {
  try {
    const [inquiries, siteVisits, investmentSchedules] = await Promise.all([
      getList<RelatedInquiry>('/inquiries/fetch/me', 'Unable to load inquiries right now.'),
      getList<RelatedSiteVisit>('/site-visits/me', 'Unable to load site visits right now.'),
      getList<InvestmentContractSchedule>(
        '/investment-contract-schedules/me',
        'Unable to load investment requests right now.',
      ),
    ]);

    return [
      ...inquiries.map(mapInquiry),
      ...siteVisits.map(mapSiteVisit),
      ...investmentSchedules.map(mapInvestment),
    ].sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  } catch (error) {
    if (error instanceof RequestsApiError) throw error;

    if (axios.isAxiosError<ListResponse<unknown>>(error)) {
      throw new RequestsApiError(
        error.response?.data?.message ?? 'Unable to load your requests right now.',
        error.response?.status,
      );
    }

    throw error;
  }
}
