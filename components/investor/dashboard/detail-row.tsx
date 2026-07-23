import { Text, View } from 'react-native';

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-1.5">
      <Text className="text-textSecondary text-[12px] font-semibold">{label}</Text>
      <Text className="text-textPrimary text-[12px] font-bold text-right flex-1 ml-4" numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}