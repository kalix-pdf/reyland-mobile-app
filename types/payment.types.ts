export type ProviderType = 'bank' | 'ewallet';

export interface Provider {
    id: string;
    name: string;
    type: ProviderType;
}

//"is_default":false,"created_at":"2026-08-03T10:52:16.940268+00:00"}]}

export interface PaymentMethod {
    id: string;
    user_id: string | null;
    method_type: ProviderType;
    provider_name: string | null;
    account_name: string | null;
    account_number: string;
    is_default: boolean | null;
    created_at: string | null;
}

export const PROVIDERS: Provider[] = [
  { id: 'bdo', name: 'BDO', type: 'bank' },
  { id: 'bpi', name: 'BPI', type: 'bank' },
  { id: 'metrobank', name: 'Metrobank', type: 'bank' },
  { id: 'unionbank', name: 'UnionBank', type: 'bank' },
  { id: 'landbank', name: 'Landbank', type: 'bank' },
  { id: 'gcash', name: 'GCash', type: 'ewallet' },
  { id: 'maya', name: 'Maya', type: 'ewallet' },
  { id: 'grabpay', name: 'GrabPay', type: 'ewallet' },
];