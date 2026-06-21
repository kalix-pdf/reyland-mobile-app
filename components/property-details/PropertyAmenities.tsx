import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { PropertySection as Section } from '@/components/property-details/property-details';

type PropertyAmenitiesProps = {
  amenities: string[];
};

export function PropertyAmenities({ amenities }: PropertyAmenitiesProps) {
  if (amenities.length === 0) return null;

  return (
    <Section title="Amenities">
      <View className="flex-row flex-wrap gap-2.5 p-3.5 rounded-[22px] bg-surface border border-border">
        {amenities.map((amenity) => (
          <View
            key={amenity}
            className="min-h-[42px] max-w-full flex-row items-center gap-2 px-3 py-2.5 rounded-2xl bg-tag border border-accent/[0.16]"
          >
            <View className="w-5 h-5 rounded-full items-center justify-center bg-accent">
              <Ionicons name="checkmark" size={13} color={Colors.textOnDark} />
            </View>
            <Text
              className="shrink text-tagText text-[13px] leading-[18px] font-extrabold"
              numberOfLines={2}
            >
              {amenity}
            </Text>
          </View>
        ))}
      </View>
    </Section>
  );
}
