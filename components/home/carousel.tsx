import { useState } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import ReanimatedCarousel from 'react-native-reanimated-carousel';
import { ReduceMotion } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { PROMO_BANNERS } from '../../data/promotions';
import { createHomeDashboardStyles } from '@/styles/dashboard.styles';
import { Colors } from '@/constants/colors';

const styles = createHomeDashboardStyles(Colors);
const { width } = Dimensions.get('window');

export function PromotionalCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.promoSection}>
      <ReanimatedCarousel
        loop
        autoPlay
        autoPlayInterval={2000}
        width={width}
        height={140}
        data={PROMO_BANNERS}
        withAnimation={{
          type: 'timing',
          config: {
            duration: 400,
            reduceMotion: ReduceMotion.Never,
          },
        }}
        onProgressChange={(_, absoluteProgress) => {
          setActiveIndex(Math.round(absoluteProgress) % PROMO_BANNERS.length);
        }}
        renderItem={({ item }) => (
          <Pressable style={styles.promoCard}>
            <Image
              source={{ uri: item.image }}
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
        {PROMO_BANNERS.map((_, index) => (
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