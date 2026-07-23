import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  subtext?: string;
  accentColor?: string;
};

export function StatCard({ icon, label, value, subtext, accentColor = Colors.accent }: StatCardProps) {
  return (
    <View className="flex-1 rounded-[18px] border border-border bg-surfaceMuted p-4">
      <View
        className="w-8 h-8 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: `${accentColor}20` }}
      >
        <Ionicons name={icon} size={16} color={accentColor} />
      </View>
      <Text className="text-textSecondary text-[11px] font-bold uppercase tracking-wide">
        {label}
      </Text>
      <Text className="mt-1 text-textPrimary text-lg font-black" numberOfLines={1}>
        {value}
      </Text>
      {subtext ? (
        <Text className="mt-0.5 text-textSecondary text-[11px] font-semibold">{subtext}</Text>
      ) : null}
    </View>
  );
}