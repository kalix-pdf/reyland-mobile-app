export type InvestorStatusKey = 'active' | 'matured' | 'pending' | 'cancelled' | 'paid' | 'overdue';

export const STATUS_STYLES: Record<InvestorStatusKey, { bg: string; text: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-700' },
  matured: { bg: 'bg-blue-100', text: 'text-blue-700' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
  paid: { bg: 'bg-green-100', text: 'text-green-700' },
  overdue: { bg: 'bg-red-100', text: 'text-red-700' },
};

export const DEFAULT_STATUS_STYLE = STATUS_STYLES.pending;