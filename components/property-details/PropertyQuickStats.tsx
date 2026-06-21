import { View } from 'react-native';

import { PropertyStatItem as StatItem } from '@/components/property-details/property-details';

type PropertyQuickStatsProps = {
  lotTypeLabel: string;
  lot: string | null | undefined;
  dateCompleted: string | null | undefined;
};

export function PropertyQuickStats({
  lotTypeLabel,
  lot,
  dateCompleted,
}: PropertyQuickStatsProps) {
  return (
    <View className="flex-row gap-2.5 mx-[15px] mt-3.5">
      <StatItem icon="map-outline" label="Lot Type" value={lotTypeLabel} />
      <StatItem icon="pricetag-outline" label="Lot" value={lot || 'N/A'} />
      <StatItem icon="calendar-outline" label="Completion" value={dateCompleted || 'TBA'} />
    </View>
  );
}
