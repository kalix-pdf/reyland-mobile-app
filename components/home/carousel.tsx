import { PromotionProps } from '@/types';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { ReduceMotion } from 'react-native-reanimated';
import ReanimatedCarousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

interface PromotionalCarouselProps {
  promotionImages: PromotionProps[];
}

export function PromotionalCarousel({ promotionImages }: PromotionalCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.promoSection}>
      <ReanimatedCarousel
        loop
        autoPlay
        autoPlayInterval={3000}
        width={width}
        height={130}
        data={promotionImages}
        withAnimation={{
          type: 'timing',
          config: {
            duration: 400,
            reduceMotion: ReduceMotion.Never,
          },
        }}
        onProgressChange={(_, absoluteProgress) => {
            if (promotionImages.length === 0) return;
            setActiveIndex(Math.round(absoluteProgress) % promotionImages.length);
        }}
        renderItem={({ item }) => (
          <Pressable style={styles.promoCard}>
            <Image
              source={{ uri: item.image_url }}
              style={styles.promoImage}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
            />
          </Pressable>
        )}
      />

      {/* Pagination dots */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginTop: 10,
      }}>
        {promotionImages.map((_, index) => (
          <View
            key={index}
            style={{
              width: activeIndex === index ? 20 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: activeIndex === index ? '#006B3D' : '#D9D9D9',
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  promoSection: {
    marginTop: 25,
    marginBottom: 10,
  },

  promoCard: {
    width,
    height: 130,
    paddingHorizontal: 16,
  },

  promoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
});

  
