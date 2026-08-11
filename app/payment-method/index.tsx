import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';

export default function PaymentMethodPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const { methods, loading, error, refresh, refreshing } = usePaymentMethods();
  const { addMethod, editMethod, removeMethod, isSubmitting, mutationError } = usePaymentMethodMutations({
    onSuccess: refresh,
  });
  const defaultMethod = methods?.find((method) => method.is_default) ?? null;
  const methodCount = methods?.length ?? 0;

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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-5 pb-10 pt-2"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.accent} />
          }
        >
          <View className="mb-4 rounded-[24px] bg-primary p-5">
            <View className="mb-5 flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="text-[12px] font-black uppercase tracking-[1px] text-textOnDark/60">
                  Payout setup
                </Text>
                <Text className="mt-1 text-[23px] leading-[29px] font-black text-textOnDark">
                  Payment Methods
                </Text>
                <Text className="mt-2 text-[13px] leading-5 font-semibold text-textOnDark/70">
                  Manage saved payout destinations for ROI and investment withdrawals.
                </Text>
              </View>

              <View className="h-12 w-12 items-center justify-center rounded-[18px] bg-textOnDark/10">
                <Ionicons name="card-outline" size={24} color={Colors.textOnDark} />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1 rounded-[18px] bg-textOnDark/10 p-3">
                <Text className="text-[11px] font-black uppercase text-textOnDark/55">Saved</Text>
                <Text className="mt-1 text-[20px] font-black text-textOnDark">{methodCount}</Text>
              </View>

              <View className="flex-[1.5] rounded-[18px] bg-textOnDark/10 p-3">
                <Text className="text-[11px] font-black uppercase text-textOnDark/55">Default</Text>
                <Text className="mt-1 text-[14px] font-black text-textOnDark" numberOfLines={1}>
                  {defaultMethod?.provider_name ?? 'Not set'}
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-4 flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <Text className="text-[16px] font-black text-textPrimary">Saved destinations</Text>
              <Text className="mt-0.5 text-[12px] font-semibold text-textMuted">
                Select one when submitting a withdrawal request.
              </Text>
            </View>

            <Pressable
              onPress={openAddModal}
              className="min-h-[42px] flex-row items-center justify-center gap-1.5 rounded-[16px] bg-accent px-4 active:opacity-80"
            >
              <Ionicons name="add" size={18} color={Colors.textOnDark} />
              <Text className="text-[13px] font-black text-textOnDark">Add</Text>
            </Pressable>
          </View>

          {mutationError ? (
            <View className="mb-3 rounded-[18px] border border-errorBorder bg-errorBackground p-3.5">
              <Text className="text-[13px] font-bold text-error">{mutationError}</Text>
            </View>
          ) : null}

          {loading && methodCount === 0 ? (
            <View className="items-center rounded-[22px] border border-border bg-surface px-6 py-10">
              <ActivityIndicator color={Colors.accent} />
              <Text className="mt-3 text-[13px] font-semibold text-textSecondary">
                Loading payment methods...
              </Text>
            </View>
          ) : error ? (
            <View className="items-center rounded-[22px] border border-errorBorder bg-errorBackground px-6 py-10">
              <View className="mb-3 h-12 w-12 items-center justify-center rounded-[18px] bg-surface">
                <Ionicons name="alert-circle-outline" size={25} color={Colors.error} />
              </View>
              <Text className="text-center text-[14px] font-bold text-error">{error}</Text>
              <Pressable
                onPress={refresh}
                className="mt-4 min-h-[40px] items-center justify-center rounded-[14px] bg-accent px-5 active:opacity-80"
              >
                <Text className="text-[13px] font-black text-textOnDark">Retry</Text>
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
