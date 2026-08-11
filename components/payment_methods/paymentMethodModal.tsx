import { Colors } from '@/constants/colors';
import { PaymentMethod, Provider, PROVIDERS } from '@/types';
import { resolveProvider } from '@/utils/payment-method.utils';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

interface PaymentMethodModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (provider: Provider, accountName: string, accountNumber: string, defaultMethod: boolean) => Promise<unknown>;
  isSubmitting: boolean;
  editingMethod?: PaymentMethod | null;
}

export function PaymentMethodModal({
  visible,
  onClose,
  onSubmit,
  isSubmitting,
  editingMethod,
}: PaymentMethodModalProps) {
  const isEditing = Boolean(editingMethod);

  const [provider, setProvider] = useState<Provider | null>(null);
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [defaultMethod, setDefaultMethod] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const banks = PROVIDERS.filter((item) => item.type === 'bank');
  const ewallets = PROVIDERS.filter((item) => item.type === 'ewallet');
  const isValid =
    provider !== null &&
    accountName.trim().length > 0 &&
    accountNumber.trim().length > 0;

  const reset = () => {
    setProvider(null);
    setAccountName('');
    setAccountNumber('');
    setDefaultMethod(false);
    setError(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;

    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!isValid || !provider) {
      setError('Select a provider and complete the account details.');
      return;
    }

    setError(null);

    try {
      await onSubmit(provider, accountName.trim(), accountNumber.trim(), defaultMethod);
      reset();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save payment method.';
      setError(message);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end"
      >
        <Pressable className="absolute inset-0 bg-black/[0.42]" onPress={handleClose} />

        <View className="max-h-[90%] rounded-t-[26px] bg-surface">
          <View className="self-center mt-2.5 h-[5px] w-11 rounded-full bg-border" />

          <View className="flex-row items-center justify-between px-5 pb-3 pt-4">
            <View className="flex-1 pr-4">
              <Text className="text-[18px] font-black text-textPrimary">
                {isEditing ? 'Edit payout method' : 'Add payout method'}
              </Text>
              <Text className="mt-1 text-[13px] leading-5 font-semibold text-textSecondary">
                Save a bank or e-wallet account for withdrawal payouts.
              </Text>
            </View>

            <Pressable
              onPress={handleClose}
              hitSlop={10}
              className="h-9 w-9 items-center justify-center rounded-full bg-background active:opacity-70"
              accessibilityLabel="Close payment method form"
            >
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView
            className="px-5"
            contentContainerClassName="gap-4 pb-4"
            keyboardShouldPersistTaps="handled"
          >
            <ProviderSection title="Banks" providers={banks} selectedProvider={provider} onSelect={setProvider} />
            <ProviderSection title="E-Wallets" providers={ewallets} selectedProvider={provider} onSelect={setProvider} />

            <View className="gap-3">
              <FieldLabel label="Account name" />
              <TextInput
                value={accountName}
                onChangeText={setAccountName}
                placeholder="Juan Dela Cruz"
                placeholderTextColor={Colors.textMuted}
                className="min-h-[50px] rounded-[16px] border border-border bg-background px-3.5 text-[14px] font-semibold text-textPrimary"
              />

              <FieldLabel label="Account number" />
              <TextInput
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="0917xxxxxxx or 0123456789"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
                className="min-h-[50px] rounded-[16px] border border-border bg-background px-3.5 text-[14px] font-semibold text-textPrimary"
              />
            </View>

            <Pressable
              onPress={() => setDefaultMethod(!defaultMethod)}
              className="flex-row items-center justify-between rounded-[18px] border border-border bg-background p-3.5 active:opacity-75"
            >
              <View className="flex-1 pr-3">
                <Text className="text-[14px] font-black text-textPrimary">Set as default</Text>
                <Text className="mt-1 text-[12px] leading-4 font-semibold text-textSecondary">
                  This method will be preselected when requesting withdrawals.
                </Text>
              </View>

              <View
                className={`h-8 w-14 justify-center rounded-full px-1 ${
                  defaultMethod ? 'bg-accent' : 'bg-border'
                }`}
              >
                <View className={`h-6 w-6 rounded-full bg-white ${defaultMethod ? 'ml-6' : 'ml-0'}`} />
              </View>
            </Pressable>

            {error ? (
              <View className="rounded-[16px] border border-errorBorder bg-errorBackground p-3">
                <Text className="text-[13px] font-bold text-error">{error}</Text>
              </View>
            ) : null}
          </ScrollView>

          <View className="border-t border-border px-5 pb-5 pt-3">
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting || !isValid}
              className={`min-h-[52px] items-center justify-center rounded-[18px] ${
                isSubmitting || !isValid ? 'bg-border opacity-70' : 'bg-accent active:opacity-80'
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.textOnDark} />
              ) : (
                <Text className="text-[14px] font-black text-textOnDark">
                  {isEditing ? 'Save Changes' : 'Add Payment Method'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function ProviderSection({
  title,
  providers,
  selectedProvider,
  onSelect,
}: {
  title: string;
  providers: Provider[];
  selectedProvider: Provider | null;
  onSelect: (provider: Provider) => void;
}) {
  return (
    <View>
      <Text className="mb-2 text-[12px] font-black uppercase text-textSecondary">
        {title}
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {providers.map((provider) => (
          <ProviderPill
            key={provider.id}
            provider={provider}
            selected={selectedProvider?.id === provider.id}
            onPress={() => onSelect(provider)}
          />
        ))}
      </View>
    </View>
  );
}

function ProviderPill({
  provider,
  selected,
  onPress,
}: {
  provider: Provider;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`min-h-[40px] flex-row items-center gap-1.5 rounded-[15px] border px-3 active:opacity-80 ${
        selected ? 'border-accent bg-tag' : 'border-border bg-background'
      }`}
    >
      <Ionicons
        name={provider.type === 'bank' ? 'business-outline' : 'wallet-outline'}
        size={15}
        color={selected ? Colors.accent : Colors.textMuted}
      />
      <Text
        className={`text-[12px] font-black ${
          selected ? 'text-accent' : 'text-textSecondary'
        }`}
      >
        {provider.name}
      </Text>
    </Pressable>
  );
}

function FieldLabel({ label }: { label: string }) {
  return (
    <Text className="-mb-1 text-[12px] font-black uppercase text-textSecondary">
      {label}
    </Text>
  );
}
