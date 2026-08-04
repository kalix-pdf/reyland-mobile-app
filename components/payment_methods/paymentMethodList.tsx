import { View, Text } from 'react-native';
import type { PaymentMethod } from '@/types';
import { PaymentMethodCard } from './paymentMethodCard';

interface PaymentMethodListProps {
  methods: PaymentMethod[];
  onEdit?: (method: PaymentMethod) => void;
  onRemove?: (id: string) => void;
}

export function PaymentMethodList({ methods, onEdit, onRemove }: PaymentMethodListProps) {
  if (methods.length === 0) {
    return (
      <View className="items-center rounded-2xl border border-dashed border-border py-10">
        <Text className="text-sm text-textMuted">No payment methods added yet.</Text>
      </View>
    );
  }

  return (
    <View>
      {methods.map((method) => (
        <PaymentMethodCard key={method.id} method={method} onEdit={onEdit} onRemove={onRemove} />
      ))}
    </View>
  );
}