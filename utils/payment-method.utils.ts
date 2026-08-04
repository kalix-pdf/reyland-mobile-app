import { PROVIDERS, Provider, PaymentMethod } from '@/types';

/**
 * A PaymentMethod stores the provider as bank_name / ewallet_provider strings,
 * not a Provider object. This finds the matching Provider from the static
 * PROVIDERS list so forms (like the edit modal) can pre-select it.
 */
export function resolveProvider(method: PaymentMethod): Provider | null {
  const name = method.provider_name
  if (!name) return null;

  return PROVIDERS.find((p) => p.type === method.method_type && p.name === name) ?? null;
}

/** Display name for a PaymentMethod card, e.g. "BDO" or "GCash". */
export function getProviderDisplayName(method: PaymentMethod): string {
  const name = method.provider_name;
  return name ?? 'Unknown Provider';
}