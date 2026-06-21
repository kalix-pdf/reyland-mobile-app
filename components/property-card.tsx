import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Property } from '../types/property.types';

// Resolved hex values pulled from tailwind.colors so non-NativeWind APIs
// (Ionicons color prop) stay in sync with the theme.
const AppColors = require('../tailwind.colors');

type Props = {
  property: Property;
};

const STATUS_LABELS: Record<Property['status'], string> = {
  0: 'Available',
  1: 'Sold',
  2: 'Reserved',
};

function PropertyCard({ property }: Props) {
  const router = useRouter();
  const location = property.project?.location?.trim() || 'Location unavailable';
  const statusLabel = STATUS_LABELS[property.status] ?? 'Available';
  const totalPrice = property.total_price ?? Number(property.price ?? 0) * Number(property.area ?? 0);

  const formatPrice = (price: number) => {
    if (price >= 1_000_000) {
      return `₱${(price / 1_000_000).toFixed(1)}M`;
    }
    return `₱${price.toLocaleString()}`;
  };

  return (
    <Pressable
      className="bg-surface rounded-[20px] mx-[18px] mb-3.5 border border-border overflow-hidden active:opacity-90 active:scale-[0.985]"
      onPress={() =>
        router.push({
          pathname: '/property/[id]',
          params: {
            id: property.id.toString(),
          },
        } as unknown as Href)
      }
    >
      <Image
        source={{ uri: property.image_url }}
        transition={200}
        priority={'normal'}
        contentFit="cover"
        cachePolicy={'memory-disk'}
        style={{ backgroundColor: AppColors.border, aspectRatio: 16 / 9}}
      />

      <View className="absolute top-3.5 left-3.5 right-3.5 flex-row justify-between gap-2">
        {/* <View className={property.category === 'For Rent' ? 'px-3 py-1.5 rounded-full bg-rentBadge' : 'px-3 py-1.5 rounded-full bg-saleBadge'}>
          <Text className={property.category === 'For Rent' ? 'text-[11px] font-black text-rentBadgeText' : 'text-[11px] font-black text-saleBadgeText'}>
            {property.category}
          </Text>
        </View> */}
        <View className="px-3 py-1.5 rounded-full bg-black/[0.74]">
          <Text className="text-white text-[11px] font-black">{statusLabel}</Text>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row items-start gap-3">
          <View className="flex-1">
            <Text className="text-xl font-black text-accent mb-1">{formatPrice(totalPrice)}</Text>
            <Text className="text-lg font-black text-textPrimary leading-[23px]" numberOfLines={2}>
              {property.title}
            </Text>
          </View>
          <View className="w-[34px] h-[34px] rounded-full items-center justify-center bg-tag">
            <Ionicons name="chevron-forward" size={18} color={AppColors.accent} />
          </View>
        </View>

        <View className="flex-row items-center gap-1 mt-2 mb-3.5">
          <Ionicons name="location-outline" size={14} color={AppColors.accent} />
          <Text className="flex-1 text-[13px] text-textSecondary font-semibold" numberOfLines={1}>
            {location}
          </Text>
        </View>

        <View className="flex-row items-center pt-3 border-t border-border">
          <View className="flex-row items-center flex-1 justify-center">
            <Ionicons
              name="bed-outline"
              size={14}
              color={AppColors.textSecondary}
              style={{ marginRight: 5 }}
            />
            <Text className="text-xs text-textSecondary font-semibold">{property.units} Units</Text>
          </View>
          <View className="w-px h-4 bg-border mx-2" />
          <View className="flex-row items-center flex-1 justify-center">
            <Ionicons
              name="resize-outline"
              size={14}
              color={AppColors.textSecondary}
              style={{ marginRight: 5 }}
            />
            <Text className="text-xs text-textSecondary font-semibold">{property.area} sqm</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default React.memo(PropertyCard);