import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { PaymentMethodList } from '@/components/payment_methods/paymentMethodList';
import { usePaymentMethods } from '@/hooks/payment-method/usePaymentMethods';
import { usePaymentMethodMutations } from '@/hooks/payment-method/usePaymentMethodMutation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderShell } from '@/components/header/HeaderShell';
import { HeaderNav } from '@/components/header/HeaderNav';
import { Colors } from '@/constants/colors';
import { useState } from 'react';
import { PaymentMethodModal } from '@/components/payment_methods/paymentMethodModal';
import type { PaymentMethod, Provider } from '@/types';

export default function PaymentMethodPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const { methods, loading, error, refresh } = usePaymentMethods();
  const { addMethod, editMethod, removeMethod, isSubmitting } = usePaymentMethodMutations({
    onSuccess: refresh,
  });

  const openAddModal = () => {
    setEditingMethod(null);
    setModalVisible(true);
  };

  const openEditModal = (method: PaymentMethod) => {
    setEditingMethod(method);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingMethod(null);
  };

  const handleSubmit = (
    provider: Provider,
    accountName: string,
    accountNumber: string,
    defaultMethod: boolean
  ) => {
    return editingMethod
      ? editMethod(editingMethod.id, provider, accountName, accountNumber, defaultMethod)
      : addMethod(provider, accountName, accountNumber, defaultMethod);
  };

  const handleRemove = (id: string) => {
    removeMethod(id).catch(() => {
      // mutationError is already captured in usePaymentMethodMutations;
      // swallow here so React Native doesn't log an unhandled rejection.
    });
  };

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: Colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <HeaderShell transparent>
        <HeaderNav title="Payment Methods" />
      </HeaderShell>

      <View className="flex-1 bg-background">
        <ScrollView contentContainerClassName="p-4">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-textPrimary">Payment Methods</Text>
            <Pressable onPress={openAddModal} className="rounded-full bg-primary px-4 py-2">
              <Text className="font-semibold text-textOnDark">+ Add</Text>
            </Pressable>
          </View>

          {loading ? (
            <View className="items-center py-10">
              <ActivityIndicator />
            </View>
          ) : error ? (
            <View className="items-center rounded-2xl border border-dashed border-border py-10">
              <Text className="mb-2 text-error">{error}</Text>
              <Pressable onPress={refresh}>
                <Text className="font-semibold text-primary">Retry</Text>
              </Pressable>
            </View>
          ) : (
            <PaymentMethodList methods={methods ?? []} onRemove={handleRemove} onEdit={openEditModal} />
          )}
        </ScrollView>

        <PaymentMethodModal
          visible={modalVisible}
          onClose={closeModal}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          editingMethod={editingMethod}
        />
      </View>
    </SafeAreaView>
  );
}