import { fetchOne, postOne, putOne, deleteOne } from '@/services/fetchData/api-client';
import type { PaymentMethod, Provider } from '@/types';

export interface PaymentMethodPayload {
  method_type: Provider['type'];
  provider_name: string | null;
  account_name: string;
  account_number: string;
  is_default: boolean;
}

export const paymentMethodApi = {
  addPaymentMethod: (payload: PaymentMethodPayload): Promise<PaymentMethod> =>
    postOne<PaymentMethod>(`/payment-method/add`, payload),

  updatePaymentMethod: (id: string, payload: PaymentMethodPayload): Promise<PaymentMethod> =>
    putOne<PaymentMethod>(`/payment-method/edit/${id}`, payload),

  deletePaymentMethod: (id: string): Promise<void> =>
    deleteOne<void>(`/payment-method/delete/${id}`),
};

// Helper: turns a selected Provider + form fields into the API payload shape.
export function buildPaymentMethodPayload(
  provider: Provider,
  accountName: string,
  accountNumber: string,
  isDefault: boolean
): PaymentMethodPayload {
  return {
    method_type: provider.type,
    provider_name: provider.name,
    account_name: accountName,
    account_number: accountNumber,
    is_default: isDefault,
  };
}