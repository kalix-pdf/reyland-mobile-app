import { useCallback, useState } from 'react';
import { paymentMethodApi, buildPaymentMethodPayload } from '@/services/payment-method/payment-method.api';
import type { PaymentMethod, Provider } from '@/types';

interface UsePaymentMethodMutationsParams {
  /** Called after a successful add/edit/remove, e.g. pass your fetcher's refetch */
  onSuccess?: () => void;
}

export function usePaymentMethodMutations({ onSuccess }: UsePaymentMethodMutationsParams = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const addMethod = useCallback(
    async (
      provider: Provider,
      accountName: string,
      accountNumber: string,
      isDefault: boolean = false
    ): Promise<PaymentMethod> => {
      setIsSubmitting(true);
      setMutationError(null);
      try {
        const payload = buildPaymentMethodPayload(provider, accountName, accountNumber, isDefault);
        const result = await paymentMethodApi.addPaymentMethod(payload);
        onSuccess?.();
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add payment method.';
        setMutationError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess]
  );

  const editMethod = useCallback(
    async (
      id: string,
      provider: Provider,
      accountName: string,
      accountNumber: string,
      isDefault: boolean = false
    ): Promise<PaymentMethod> => {
      setIsSubmitting(true);
      setMutationError(null);
      try {
        const payload = buildPaymentMethodPayload(provider, accountName, accountNumber, isDefault);
        const result = await paymentMethodApi.updatePaymentMethod(id, payload);
        onSuccess?.();
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update payment method.';
        setMutationError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess]
  );

  const removeMethod = useCallback(
    async (id: string): Promise<void> => {
      setIsSubmitting(true);
      setMutationError(null);
      try {
        await paymentMethodApi.deletePaymentMethod(id);
        onSuccess?.();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to remove payment method.';
        setMutationError(message);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSuccess]
  );

  return {
    addMethod,
    editMethod,
    removeMethod,
    isSubmitting,
    mutationError,
  };
}