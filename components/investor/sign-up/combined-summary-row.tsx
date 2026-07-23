import { Text, View } from 'react-native';

type CombinedSummaryRowProps = {
  label: string;
  value: string;
  last?: boolean;
};

export function CombinedSummaryRow({ label, value, last }: CombinedSummaryRowProps) {
  return (
    <View className={`flex-row items-center justify-between gap-3 py-2 ${last ? '' : 'border-b border-white/15'}`}>
      <Text className="text-white text-sm font-black">{label}</Text>
      <Text className="flex-1 text-right text-white text-[13px] font-black" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}