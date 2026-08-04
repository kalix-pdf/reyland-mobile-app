import { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { PaymentMethod, Provider, PROVIDERS } from '@/types';
import { resolveProvider } from '@/utils/payment-method.utils';
import { KeyboardAvoidingView, Platform } from 'react-native';

interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (provider: Provider, accountName: string, accountNumber: string, defaultMethod: boolean) => Promise<unknown>;
  isSubmitting: boolean;
  editingMethod?: PaymentMethod | null;
}

export function PaymentMethodModal({ visible, onClose, onSubmit,
  isSubmitting, editingMethod }: PaymentMethodModalProps) {
  const isEditing = Boolean(editingMethod);

  const [provider, setProvider] = useState<Provider | null>(null);
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [defaultMethod, setDefaultMethod] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prefill (or reset) fields whenever the modal opens.
  useEffect(() => {
    if (!visible) return;

    if (editingMethod) {
      setProvider(resolveProvider(editingMethod));
      setAccountName(editingMethod.account_name ?? '');
      setAccountNumber(editingMethod.account_number);
      setDefaultMethod(Boolean(editingMethod.is_default));
    } else {
      setProvider(null);
      setAccountName('');
      setAccountNumber('');
      setDefaultMethod(false);
    }
    setError(null);
  }, [visible, editingMethod]);

  const isValid =
    provider !== null && accountName.trim().length > 0 && accountNumber.trim().length > 0;

  const reset = () => {
    setProvider(null);
    setAccountName('');
    setAccountNumber('');
    setDefaultMethod(false);
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!isValid || !provider) {
      setError('Please fill in all fields and select a provider.');
      return;
    }
    setError(null);
    try {
      await onSubmit(provider, accountName, accountNumber, defaultMethod);
      reset();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit payment method.';
      setError(message);
    }
  };

  const banks = PROVIDERS.filter((p) => p.type === 'bank');
  const ewallets = PROVIDERS.filter((p) => p.type === 'ewallet');

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View className="flex-1 justify-end bg-black/50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View className="max-h-[90%] rounded-t-3xl bg-surface">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-border px-5 py-4">
            <Text className="text-lg font-semibold text-textPrimary">
              {isEditing ? 'Edit Payment Method' : 'Add Payment Method'}
            </Text>
            <Pressable onPress={handleClose} hitSlop={10}>
              <Text className="text-sm text-textSecondary">Cancel</Text>
            </Pressable>
          </View>

          {/* Scrollable body */}
          <ScrollView
            className="px-5"
            contentContainerClassName="py-4"
            keyboardShouldPersistTaps="handled"
          >
            {/* Provider type: banks */}
            <Text className="mb-2 font-medium uppercase text-textMuted">Banks</Text>
            <View className="mb-4 flex-row flex-wrap gap-2">
              {banks.map((p) => {
                const isSelected = provider?.id === p.id;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => setProvider(p)}
                    className={`text-[12px] rounded-full border px-4 py-2 ${
                      isSelected ? 'border-primary bg-primaryLight' : 'border-border bg-surfaceMuted'
                    }`}
                  >
                    <Text
                      className={`text-[12px] ${
                        isSelected ? 'font-semibold text-white' : 'text-textSecondary'
                      }`}
                    >
                      {p.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Provider type: e-wallets */}
            <Text className="mb-2 text-[12px] font-medium uppercase text-textMuted">E-Wallets</Text>
            <View className="mb-5 flex-row flex-wrap gap-2">
              {ewallets.map((p) => {
                const isSelected = provider?.id === p.id;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => setProvider(p)}
                    className={`text-[12px] rounded-full border px-4 py-2 ${
                      isSelected ? 'border-primary bg-primaryLight' : 'border-border bg-surfaceMuted'
                    }`}
                  >
                    <Text
                      className={`text-[12px] ${
                        isSelected ? 'font-semibold text-white' : 'text-textSecondary'
                      }`}
                    >
                      {p.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Account name */}
            <Text className="mb-1 font-medium text-textMuted">Account Name</Text>
            <TextInput
              value={accountName}
              onChangeText={setAccountName}
              placeholder="Juan Dela Cruz"
              placeholderTextColor={AppColors_textMutedFallback}
              className="mb-4 rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-textPrimary"
            />

            {/* Account number */}
            <Text className="mb-1 font-medium text-textMuted">Account Number</Text>
            <TextInput
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="e.g. 0917xxxxxxx or 0123456789"
              placeholderTextColor={AppColors_textMutedFallback}
              keyboardType="number-pad"
              className="mb-2 rounded-xl border border-border bg-surfaceMuted px-4 py-3 text-textPrimary"
            />

            {error && <Text className="mt-2 text-sm text-error">{error}</Text>}

            {/* Default method toggle */}
            <Text className="mb-1 mt-3 font-medium text-neutral-400">
              Set as default payment method
            </Text>
            <Pressable onPress={() => setDefaultMethod(!defaultMethod)} className="ml-2">
              <View
                className={`h-9 w-14 justify-center rounded-full px-1 ${
                  defaultMethod ? 'bg-accent' : 'bg-neutral-600'
                }`}
              >
                <View className={`h-6 w-6 rounded-full bg-white ${defaultMethod ? 'ml-5' : 'ml-0'}`} />
              </View>
            </Pressable>
          </ScrollView>

          {/* Sticky submit button */}
          <View className="border-t border-border px-5 py-4">
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`items-center rounded-xl py-3 ${isSubmitting ? 'bg-primaryLight' : 'bg-primary'}`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-semibold text-textOnDark">
                  {isEditing ? 'Save Changes' : 'Add Payment Method'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// placeholder — replace with your actual textMuted hex from tailwind.colors.js
const AppColors_textMutedFallback = '#9ca3af';