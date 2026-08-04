import { View, Text, Pressable, Alert } from 'react-native';
import type { PaymentMethod } from '@/types';
import { getProviderDisplayName } from '@/utils/payment-method.utils';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onRemove?: (id: string) => void;
  onEdit?: (method: PaymentMethod) => void;
}

export function PaymentMethodCard({ method, onRemove, onEdit }: PaymentMethodCardProps) {
  const handleRemovePress = () => {
    if (!onRemove) return;
    if (method.is_default) return Alert.alert('Cannot remove default payment method', 'Please set another payment method as default before removing this one.');

    Alert.alert(
      'Remove Payment Method',
      `Are you sure you want to remove ${getProviderDisplayName(method)} (${method.account_number})? This can't be undone.`,
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
    <View className="mb-3 flex-row items-center justify-between rounded-2xl border border-border bg-surface p-4">
      <View className="flex-1">
        <View className="mb-1 flex-row items-center">
          <Text className="text-base font-semibold text-textPrimary">{method.provider_name}</Text>
          <View className="ml-2 rounded-full bg-tag px-2 py-0.5">
            <Text className="text-[10px] uppercase text-tagText">
              {method.method_type === 'bank' ? 'Bank' : 'E-Wallet'}
            </Text>
          </View>
        </View>
        <Text className="">{method.account_name}</Text>
        <Text className="text-textMuted">{method.account_number}</Text>
      </View>

      <View className="ml-3 flex-row items-center">
        {method.is_default && (
          <View className="mr-3 rounded-full px-2 py-0.5">
            <Text className="text-[12px] uppercase text-primaryDark">Default</Text>
          </View>
        )}
        {onEdit && (
          <Pressable onPress={() => onEdit(method)} hitSlop={10} className="mr-3">
            <Text className="text-sm text-primary">Edit</Text>
          </Pressable>
        )}
        {onRemove && (
          <Pressable onPress={handleRemovePress} hitSlop={10} className="ml-3">
            <Text className="text-sm text-error">Remove</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}