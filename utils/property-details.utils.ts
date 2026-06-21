import {
  MONTH_OPTIONS,
  VISIT_YEAR_RANGE,
} from '@/constants/property-details.constants';
import type { VisitDateParts, VisitTimeParts } from '@/types/property-details.types';

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export function formatCurrency(value?: number | null): string {
  return `₱${Number(value ?? 0).toLocaleString()}`;
}

export function formatCurrencyOrFallback(
  value?: number | null,
  fallback = 'Not specified',
): string {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return fallback;
  }

  return formatCurrency(value);
}

export function formatNumber(value?: number | null, fallback = 'Not specified'): string {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return fallback;
  }

  return Number(value).toLocaleString();
}

// ---------------------------------------------------------------------------
// Date / time
// ---------------------------------------------------------------------------

export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function createYearOptions(rangeYears: number = VISIT_YEAR_RANGE): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: rangeYears }, (_, index) => currentYear + index);
}

export function createInitialVisitDateParts(): VisitDateParts {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    month: tomorrow.getMonth(),
    day: tomorrow.getDate(),
    year: tomorrow.getFullYear(),
  };
}

export function createInitialVisitTimeParts(): VisitTimeParts {
  return { hour: 10, minute: 0, period: 'AM' };
}

export function formatVisitDate(parts: VisitDateParts): string {
  return `${MONTH_OPTIONS[parts.month]} ${parts.day}, ${parts.year}`;
}

export function formatVisitTime(parts: VisitTimeParts): string {
  return `${parts.hour}:${String(parts.minute).padStart(2, '0')} ${parts.period}`;
}

/** Combines date + time parts into a single ISO datetime string (for API submission). */
export function createVisitDateTimeISO(parts: VisitDateParts, time: VisitTimeParts): string {
  const hour =
    time.period === 'PM'
      ? time.hour === 12
        ? 12
        : time.hour + 12
      : time.hour === 12
        ? 0
        : time.hour;

  return new Date(parts.year, parts.month, parts.day, hour, time.minute).toISOString();
}

/** Clamps a date's day-of-month when month/year changes would overflow (e.g. Feb 30 -> Feb 28). */
export function clampDateParts(parts: VisitDateParts): VisitDateParts {
  const maxDay = getDaysInMonth(parts.month, parts.year);
  return { ...parts, day: Math.min(parts.day, maxDay) };
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Validates Philippine mobile numbers in local (09xxxxxxxxx) or international (+639xxxxxxxxx) format. */
export function isValidPhMobilePhone(value: string): boolean {
  if (!/^[+()\d\s-]{7,20}$/.test(value)) return false;

  const digits = value.replace(/\D/g, '');
  return (
    (digits.length === 11 && digits.startsWith('09')) ||
    (digits.length === 12 && digits.startsWith('639'))
  );
}
