import { View, Text } from 'react-native';
import type { PaymentMethod } from '@/types';
import { PaymentMethodCard } from './paymentMethodCard';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface PaymentMethodListProps {
  methods: PaymentMethod[];
  onEdit?: (method: PaymentMethod) => void;
  onRemove?: (id: string) => void;
}

export function PaymentMethodList({ methods, onEdit, onRemove }: PaymentMethodListProps) {
  if (methods.length === 0) {
    return (
      <View className="items-center rounded-[22px] border border-dashed border-border bg-surface px-6 py-10">
        <View className="mb-3 h-14 w-14 items-center justify-center rounded-[20px] bg-tag">
          <Ionicons name="wallet-outline" size={26} color={Colors.accent} />
        </View>

        <Text className="text-center text-[16px] font-black text-textPrimary">
          No payout methods yet
        </Text>

        <Text className="mt-2 text-center text-[13px] leading-5 font-semibold text-textSecondary">
          Add a bank or e-wallet account so withdrawal payouts have a saved destination.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-0">
      {methods.map((method) => (
        <PaymentMethodCard key={method.id} method={method} onEdit={onEdit} onRemove={onRemove} />
      ))}
    </View>
  );
}
