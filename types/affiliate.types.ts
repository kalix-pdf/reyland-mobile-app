export type AffiliateStatus = {
  isAffiliate: boolean;
  code?: string | null;
  referralLink?: string | null;
  totalReferrals?: number;
  pendingRewards?: number;
  approvedRewards?: number;
  totalEarnings?: number;
};

export type AffiliateDashboardStats = {
  code: string;
  referralLink: string;
  totalReferrals: number;
  pendingRewards: number;
  approvedRewards: number;
  totalEarnings: number;
};

