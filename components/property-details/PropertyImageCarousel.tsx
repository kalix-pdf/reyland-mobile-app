import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ReduceMotion } from 'react-native-reanimated';
import ReanimatedCarousel from 'react-native-reanimated-carousel';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/colors';
import { CAROUSEL_HEIGHT, PROPERTY_SCREEN_WIDTH } from '@/constants/property-details.constants';
import type { GalleryImage } from '@/types/property-details.types';

type PropertyImageCarouselProps = {
  images: GalleryImage[];
  autoPlayInterval?: number;
};

export function PropertyImageCarousel({
  images,
  autoPlayInterval = 3000,
}: PropertyImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleImages = images.length > 1;

  return (
    <View className="pt-1 pb-3.5">
      <ReanimatedCarousel
        loop={hasMultipleImages}
        autoPlay={hasMultipleImages}
        autoPlayInterval={autoPlayInterval}
        width={PROPERTY_SCREEN_WIDTH}
        height={CAROUSEL_HEIGHT}
        data={images}
        withAnimation={{
          type: 'timing',
          config: { duration: 400, reduceMotion: ReduceMotion.Never },
        }}
        onProgressChange={(_, absoluteProgress) => {
          if (images.length === 0) return;
          setActiveIndex(Math.round(absoluteProgress) % images.length);
        }}
        renderItem={({ item }) => (
          <Pressable style={{ width: PROPERTY_SCREEN_WIDTH, height: CAROUSEL_HEIGHT }}>
            <Image
              source={{ uri: item.image_url }}
              style={{ backgroundColor: Colors.border, width: '100%', height: '100%' }}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={220}
            />
          </Pressable>
        )}
      />

      <CarouselIndicator
        activeIndex={activeIndex}
        total={images.length}
        images={images}
      />
    </View>
  );
}

type CarouselIndicatorProps = {
  activeIndex: number;
  total: number;
  images: GalleryImage[];
};

/** Image counter badge ("2/5") + dot progress strip beneath the carousel. */
function CarouselIndicator({ activeIndex, total, images }: CarouselIndicatorProps) {
  return (
    <View className="min-h-7 flex-row items-center justify-center mt-2.5">
      <View className="absolute left-[15px] flex-row items-center gap-[5px] px-2.5 py-1.5 rounded-full bg-primary">
        <Ionicons name="images-outline" size={14} color={Colors.textOnDark} />
        <Text className="text-textOnDark text-[11px] font-black">
          {activeIndex + 1}/{Math.max(total, 1)}
        </Text>
      </View>

      {total > 1 ? (
        <View className="flex-row items-center justify-center gap-1.5">
          {images.map((image, index) => (
            <View
              key={image.id}
              className={
                activeIndex === index
                  ? 'w-[22px] h-2 rounded-full bg-tagText'
                  : 'w-2 h-2 rounded-full bg-[#D9D9D9]'
              }
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
