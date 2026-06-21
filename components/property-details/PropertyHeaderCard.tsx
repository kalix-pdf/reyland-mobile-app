import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { formatCurrency, formatNumber } from '@/utils/property-details.utils';

type PropertyHeaderCardProps = {
  category: string;
  statusLabel: string;
  totalPrice: number | null | undefined;
  title: string;
  areaSqm: number | null | undefined;
  location: string;
};

export function PropertyHeaderCard({
  category,
  statusLabel,
  totalPrice,
  title,
  areaSqm,
  location,
}: PropertyHeaderCardProps) {
  return (
    <View
      className="mx-[15px] p-4 rounded-[22px] bg-surface border border-border shadow-sm"
      style={{
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 14,
      }}
    >
      <View className="flex-row items-start gap-3.5">
        <View className="flex-1 min-w-0">
          <View className="flex-row flex-wrap gap-2 mb-3">
            <Tag label={category} variant="muted" />
            <Tag label={statusLabel} variant="primary" />
          </View>

          <Text className="text-textMuted text-xs font-extrabold mb-[3px]">Total price</Text>
          <Text className="text-accent text-[27px] font-black">{formatCurrency(totalPrice)}</Text>
          <Text className="mt-[7px] text-textPrimary text-xl leading-[27px] font-black">
            {title}
          </Text>
        </View>

        <AreaBadge areaSqm={areaSqm} />
      </View>

      <View className="mt-3.5 flex-row items-start gap-[9px] pt-3.5 border-t border-border">
        <View className="w-[30px] h-[30px] rounded-full items-center justify-center bg-tag">
          <Ionicons name="location-outline" size={16} color={Colors.accent} />
        </View>
        <Text
          className="flex-1 text-textSecondary text-sm leading-5 font-bold"
          numberOfLines={2}
        >
          {location}
        </Text>
      </View>
    </View>
  );
}

function Tag({ label, variant }: { label: string; variant: 'muted' | 'primary' }) {
  if (variant === 'primary') {
    return (
      <View className="px-[11px] py-1.5 rounded-full bg-primary">
        <Text className="text-textOnDark text-[11px] font-black">{label}</Text>
      </View>
    );
  }

  return (
    <View className="px-[11px] py-1.5 rounded-full bg-tag">
      <Text className="text-tagText text-[11px] font-black">{label}</Text>
    </View>
  );
}

function AreaBadge({ areaSqm }: { areaSqm: number | null | undefined }) {
  return (
    <View className="w-[86px] min-h-[106px] items-center justify-center p-2.5 rounded-[18px] bg-background border border-border">
      <Ionicons name="resize-outline" size={20} color={Colors.accent} />
      <Text className="mt-2 text-textPrimary text-[17px] font-black">{formatNumber(areaSqm)}</Text>
      <Text className="mt-0.5 text-textMuted text-[11px] font-extrabold">sqm</Text>
    </View>
  );
}
