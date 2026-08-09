import { Transaction } from "@/types";
import { Ionicons } from "@expo/vector-icons";

export const TYPE_CONFIG: Record<
  number,
  { label: string; icon: keyof typeof Ionicons.glyphMap; iconBg: string; iconColor: string; amountPrefix: string; amountClass: string }
> = {
  0: {
    label: 'Purchase',
    icon: 'bag-handle-outline',
    iconBg: 'bg-primary/10',
    iconColor: '#4F46E5', // swap to your `primary` hex
    amountPrefix: '',
    amountClass: 'text-textPrimary',
  },
  1: {
    label: 'Investment',
    icon: 'trending-up-outline',
    iconBg: 'bg-accent/10',
    iconColor: '#D4AF37', // swap to your `accent` hex
    amountPrefix: '+',
    amountClass: 'text-accent',
  },
  2: {
    label: 'Investment Withdrawal',
    icon: 'arrow-down-circle-outline',
    iconBg: 'bg-error/10',
    iconColor: '#DC2626', // swap to your `error` hex
    amountPrefix: '-',
    amountClass: 'text-error',
  },
};
    
export const STATUS_STYLES: Record<Transaction['status'], { bg: string; text: string }> = {
  completed: { bg: 'bg-accent/10', text: 'text-accent' },
  pending: { bg: 'bg-tag', text: 'text-textSecondary' },
};

export const PAYMENT_TYPE_LABELS: Record<number, string> = {
  0: 'Full payment',
  1: 'Installment',
};

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Transaction type: 0 = Purchase, 1 = Investment, 2 = Withdrawal
export type TransactionType = 0 | 1 | 2;

export interface StatementConfigEntry {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  accentSoft: string;
  accentBorder: string;
  entryLabel: string;
  entryIcon: keyof typeof Ionicons.glyphMap;
  sign: '+' | '-';
}

export const STATEMENT_CONFIG: Record<TransactionType, StatementConfigEntry> = {
  0: {
    label: 'Property Purchase',
    icon: 'home-outline',
    accent: '#01690f',
    accentSoft: '#EFF6FF',
    accentBorder: '#DBEAFE',
    entryLabel: 'Installment Payments',
    entryIcon: 'card-outline',
    sign: '+',
  },
  1: {
    label: 'Investment Account',
    icon: 'trending-up-outline',
    accent: '#059669',
    accentSoft: '#ECFDF5',
    accentBorder: '#D1FAE5',
    entryLabel: 'Payout History',
    entryIcon: 'cash-outline',
    sign: '+',
  },
  2: {
    label: 'Withdrawal Request',
    icon: 'arrow-down-circle-outline',
    accent: '#D97706',
    accentSoft: '#FFFBEB',
    accentBorder: '#FDE68A',
    entryLabel: 'Processing History',
    entryIcon: 'time-outline',
    sign: '-',
  },
};