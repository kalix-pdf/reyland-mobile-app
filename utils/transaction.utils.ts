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
