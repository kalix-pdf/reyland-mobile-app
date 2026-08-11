import { View, Text, Pressable, Alert } from 'react-native';
import type { PaymentMethod } from '@/types';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import {
  getPaymentMethodTypeLabel,
  getProviderDisplayName,
  maskAccountNumber,
} from '@/utils/payment-method.utils';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onRemove?: (id: string) => void;
  onEdit?: (method: PaymentMethod) => void;
}

export function PaymentMethodCard({ method, onRemove, onEdit }: PaymentMethodCardProps) {
  const providerName = getProviderDisplayName(method);
  const typeLabel = getPaymentMethodTypeLabel(method);
  const isBank = method.method_type === 'bank';

  const handleRemovePress = () => {
    if (!onRemove) return;
    if (method.is_default) return Alert.alert('Cannot remove default payment method', 'Please set another payment method as default before removing this one.');

    Alert.alert(
      'Remove Payment Method',
      `Are you sure you want to remove ${providerName} (${maskAccountNumber(method.account_number)})? This can't be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => onRemove(method.id),
        },
      ]
    )
  }
 
  return (
    <View className="mb-3 rounded-[20px] border border-border bg-surface p-4 shadow-sm">
      <View className="flex-row items-start gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-[16px] bg-tag">
          <Ionicons
            name={isBank ? 'business-outline' : 'wallet-outline'}
            size={22}
            color={Colors.accent}
          />
        </View>

        <View className="min-w-0 flex-1">
          <View className="mb-1 flex-row flex-wrap items-center gap-2">
            <Text className="text-[16px] font-black text-textPrimary" numberOfLines={1}>
              {providerName}
            </Text>

            {method.is_default ? (
              <View className="rounded-full bg-primary px-2.5 py-1">
                <Text className="text-[10px] font-black uppercase text-textOnDark">Default</Text>
              </View>
            ) : null}
          </View>

          <Text className="text-[12px] font-black uppercase text-textMuted">
            {typeLabel}
          </Text>

          <Text className="mt-2 text-[14px] font-bold text-textPrimary" numberOfLines={1}>
            {method.account_name ?? 'Account name not provided'}
          </Text>

          <Text className="mt-0.5 text-[13px] font-semibold text-textSecondary">
            {maskAccountNumber(method.account_number)}
          </Text>
        </View>

        <View className="items-end gap-2">
        {onEdit && (
          <Pressable
            onPress={() => onEdit(method)}
            hitSlop={10}
            className="min-h-[34px] flex-row items-center justify-center gap-1.5 rounded-[13px] bg-tag px-3 active:opacity-70"
            accessibilityLabel={`Edit ${providerName} payment method`}
          >
            <Ionicons name="create-outline" size={14} color={Colors.accent} />
            <Text className="text-[12px] font-black text-accent">Edit</Text>
          </Pressable>
        )}

        {onRemove && (
          <Pressable
            onPress={handleRemovePress}
            hitSlop={10}
            className={`min-h-[34px] flex-row items-center justify-center gap-1.5 rounded-[13px] px-3 ${
              method.is_default ? 'bg-surfaceMuted opacity-50' : 'bg-errorBackground active:opacity-70'
            }`}
            accessibilityLabel={`Remove ${providerName} payment method`}
          >
            <Ionicons
              name="trash-outline"
              size={14}
              color={method.is_default ? Colors.textMuted : Colors.error}
            />
            <Text
              className={`text-[12px] font-black ${
                method.is_default ? 'text-textMuted' : 'text-error'
              }`}
            >
              Remove
            </Text>
          </Pressable>
        )}
        </View>
      </View>
    </View>
  );
}
