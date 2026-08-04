import { fetchOne } from '@/services/fetchData/api-client';
import type { PaymentMethod } from '@/types';

export const paymentMethodApi = {
    getPaymentMethodsByUserId: (): Promise<PaymentMethod[]> =>
        fetchOne<PaymentMethod[]>(`/payment-method/fetch`),
}