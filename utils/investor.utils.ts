export function formatPeso(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `PHP ${millions.toFixed(value % 1_000_000 === 0 ? 0 : 2)}M`;
  }

  return `PHP ${Math.round(value / 1000)}k`;
}

export function calculateEstimatedAnnualReturn(minimum: number, annualRatePercent: number): number {
  return minimum * (annualRatePercent / 100);
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
}

// principal_amount / monthly_payout_amount can come back unrealistically large
// (test data), so this scales up to billions instead of assuming thousands/millions.
export function formatCompactCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';

  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) return `₱${(amount / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `₱${(amount / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `₱${(amount / 1_000).toFixed(1)}K`;

  return formatCurrency(amount);
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function daysUntil(dateString: string | null | undefined): number | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}