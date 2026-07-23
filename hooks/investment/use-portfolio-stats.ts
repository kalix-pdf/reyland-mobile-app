import type { investment } from '@/types/investor.types';
import { useMemo } from 'react';

export type PortfolioStats = {
  totalPrincipal: number;
  totalMonthlyPayout: number;
  activeCount: number;
  totalPayoutsMade: number;
  totalPayoutsPending: number;
  nextPayout: { amount: number; date: string } | null;
};

const EMPTY_STATS: PortfolioStats = {
  totalPrincipal: 0,
  totalMonthlyPayout: 0,
  activeCount: 0,
  totalPayoutsMade: 0,
  totalPayoutsPending: 0,
  nextPayout: null,
};

export function usePortfolioStats(investments: investment[] | undefined): PortfolioStats {
  return useMemo(() => {
    if (!investments?.length) return EMPTY_STATS;

    const active = investments.filter((inv) => inv.status?.toLowerCase() === 'active');

    const totalPrincipal = active.reduce((sum, inv) => sum + (inv.principal_amount ?? 0), 0);
    const totalMonthlyPayout = active.reduce((sum, inv) => sum + (inv.monthly_payout_amount ?? 0), 0);

    const allPayouts = investments.flatMap((inv) => inv.investment_payouts ?? []);
    const totalPayoutsMade = allPayouts.filter((p) => p.status?.toLowerCase() === 'paid').length;
    const totalPayoutsPending = allPayouts.filter((p) => p.status?.toLowerCase() === 'pending').length;
    // const totalValue = investments.

    const upcoming = active
      .filter((inv) => inv.next_payout_at)
      .sort((a, b) => new Date(a.next_payout_at).getTime() - new Date(b.next_payout_at).getTime());

    const nextPayout = upcoming[0]
      ? { amount: upcoming[0].monthly_payout_amount, date: upcoming[0].next_payout_at }
      : null;

    return {
      totalPrincipal,
      totalMonthlyPayout,
      activeCount: active.length,
      totalPayoutsMade,
      totalPayoutsPending,
      nextPayout,
    };
  }, [investments]);
}