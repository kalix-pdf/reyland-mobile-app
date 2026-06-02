const MISSING_PHONE_VALUES = new Set(['null', 'undefined', 'not provided', 'none', 'n/a', 'na']);

export function getPhoneValue(phone?: string | null) {
  const value = phone?.trim();
  if (!value) return null;

  return MISSING_PHONE_VALUES.has(value.toLowerCase()) ? null : value;
}
