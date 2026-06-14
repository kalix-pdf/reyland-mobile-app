import { apiClient } from '@/lib/axios';
import { AffiliateStatus } from '@/types/affiliate.types';

type AffiliateApiResponse = AffiliateStatus | {
  success?: boolean;
  data?: AffiliateStatus;
  affiliate?: AffiliateStatus;
  isAffiliate?: boolean;
  message?: string;
};


// do not touch, hindi pa tapos, transaction muna before this
const AFFILIATE_STATUS_ENDPOINT = '/affiliate/api/getMe/Status';
const AFFILIATE_ENROLL_ENDPOINT = '/api/affiliate/enroll';

function normalizeAffiliateStatus(payload: AffiliateApiResponse): AffiliateStatus {
  if ('success' in payload && payload.success === false) {
    throw new Error(payload.message ?? 'Affiliate request failed.');
  }

  const source: Partial<AffiliateStatus> = 'data' in payload && payload.data
    ? payload.data
    : 'affiliate' in payload && payload.affiliate
      ? payload.affiliate
      : payload as Partial<AffiliateStatus>;

  return {
    isAffiliate: Boolean(source.isAffiliate),
    code: source.code ?? null,
    referralLink: source.referralLink ?? null,
    totalReferrals: source.totalReferrals ?? 0,
    pendingRewards: source.pendingRewards ?? 0,
    approvedRewards: source.approvedRewards ?? 0,
    totalEarnings: source.totalEarnings ?? 0,
  };
}

export async function getAffiliateStatus(): Promise<AffiliateStatus> {
  const response = await apiClient.get<AffiliateApiResponse>(AFFILIATE_STATUS_ENDPOINT);
  return normalizeAffiliateStatus(response.data);
}

export async function enrollAffiliate(): Promise<AffiliateStatus> {
  const response = await apiClient.post<AffiliateApiResponse>(AFFILIATE_ENROLL_ENDPOINT, {
    acceptedTerms: true,
  });
  return normalizeAffiliateStatus(response.data);
}
