import { useCallback } from 'react';
import { PaymentMethod } from '@/types';
import { paymentMethodApi } from '@/services/fetchData/payment_method/payment-method.api';
import { useDataFetcher } from '../useDataFetcher';

export function usePaymentMethods() {
  const fetcher = useCallback(() => {
    return paymentMethodApi.getPaymentMethodsByUserId();
  }, []);
 
  const { data: methods, ...rest } = useDataFetcher<PaymentMethod[]>(fetcher, {
    initialData: [],
    errorMessage: 'Failed to load payment methods. Pull down to retry.',
  });
 
  return {
    methods,
    ...rest,
  };
}