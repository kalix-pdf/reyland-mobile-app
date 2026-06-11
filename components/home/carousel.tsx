import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import ReanimatedCarousel from 'react-native-reanimated-carousel';
import { ReduceMotion } from 'react-native-reanimated';
import { Image } from 'expo-image';
// import { PROMO_BANNERS } from '../../data/promotions';
import { PromotionProps } from '@/types';
import { getPromotionImage } from '@/services/fetchData/promotion/fetch-promotion.api';

const { width } = Dimensions.get('window');

export function PromotionalCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [promotionImages, setPromotionImages] = useState<PromotionProps[]>([]);

  const fetchImages = async () => {
    try {
      const result = await getPromotionImage();
      setPromotionImages(result);
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);

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

  