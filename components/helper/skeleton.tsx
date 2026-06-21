import { Colors } from '@/constants/colors';
import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RefreshSkeletonProps {
  refreshing: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}

export function WithRefreshSkeleton({ refreshing, skeleton, children }: RefreshSkeletonProps) {
  return <>{refreshing ? skeleton : children}</>;
}

export function SkeletonBox({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return <Animated.View style={[{ width, height, borderRadius, backgroundColor: '#E5E7EB', opacity }, style]} />;
}

// __ DASHBOARD SKELETON COMPONENT __
export function DashboardSkeleton({ paddingTop }: { paddingTop: number }) {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />

      <View
        style={{
          paddingTop,
          paddingHorizontal: 20,
          paddingBottom: 14,
          backgroundColor: Colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <SkeletonBox width={110} height={32} borderRadius={8} />
          <SkeletonBox width={42} height={42} borderRadius={21} />
        </View>
        <SkeletonBox width="100%" height={40} borderRadius={10} style={{ marginTop: 12 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 18, gap: 8 }}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={{ alignItems: 'center', gap: 7, flex: 1 }}>
              <SkeletonBox width={48} height={48} borderRadius={16} />
              <SkeletonBox width={44} height={10} borderRadius={5} />
            </View>
          ))}
        </View>

        <DashboardSectionSkeleton cardCount={3} />

        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <SkeletonBox width="100%" height={270} borderRadius={26} />
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <SkeletonBox width="100%" height={140} borderRadius={24} />
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 22 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <View>
              <SkeletonBox width={142} height={18} borderRadius={6} />
              <SkeletonBox width={160} height={12} borderRadius={6} style={{ marginTop: 7 }} />
            </View>
            <SkeletonBox width={58} height={16} borderRadius={6} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[120, 108, 132, 116].map((width, i) => (
              <SkeletonBox key={i} width={width} height={42} borderRadius={21} />
            ))}
          </View>
        </View>

        <DashboardSectionSkeleton cardCount={3} />
      </ScrollView>
    </View>
  );
}

function DashboardSectionSkeleton({ cardCount }: { cardCount: number }) {
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 22 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <SkeletonBox width={132} height={18} borderRadius={6} />
        <SkeletonBox width={82} height={14} borderRadius={6} />
      </View>
      <View style={{ flexDirection: 'row', gap: 17 }}>
        {[...Array(cardCount)].map((_, i) => (
          <View key={i} style={{ width: 180 }}>
            <SkeletonBox width={180} height={160} borderRadius={18} />
            <View style={{ paddingVertical: 14, gap: 7 }}>
              <SkeletonBox width={132} height={16} borderRadius={6} />
              <SkeletonBox width={150} height={13} borderRadius={6} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}


export function PromotionalCarouselSkeleton() {
  return (
    <View style={{ paddingHorizontal: 16, gap: 12 }}>
      <SkeletonBox width="100%" height={140} borderRadius={24} />
    </View>
  )
}

export function ProjectCardsSkeleton() {
  return (
    <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16 }}>
      {[...Array(3)].map((_, i) => (
        <SkeletonBox key={i} width={180} height={220} borderRadius={16} />
      ))}
    </View>
  );
}

// __ PROJECT CARD COMPONENT __
function ProjectCardSkeleton() {
  return (
    <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
      {/* Image placeholder */}
      <SkeletonBox width="100%" height={160} borderRadius={12} />
      {/* Title */}
      <SkeletonBox width="60%" height={16} borderRadius={4} style={{ marginTop: 12 }} />
      {/* Location */}
      <SkeletonBox width="40%" height={13} borderRadius={4} style={{ marginTop: 8 }} />
      {/* Price / status row */}
      <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
        <SkeletonBox width={90} height={13} borderRadius={4} />
        <SkeletonBox width={60} height={13} borderRadius={4} />
      </View>
    </View>
  );
}

const SKELETON_COUNT = 4;

export function ProjectsSkeletonScreen() {
  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      <SafeAreaView edges={['top']} className="bg-surface">
        <View className="px-4 pb-3 border-b border-border">
          <SkeletonBox width={130} height={24} borderRadius={6} style={{ marginBottom: 12 }} />
          <SkeletonBox width="100%" height={40} borderRadius={10} style={{ marginBottom: 12 }} />

          <View className="flex-row gap-2">
            {[40, 72, 80, 48].map((w, i) => (
              <SkeletonBox key={i} width={w} height={28} borderRadius={14} />
            ))}
          </View>
        </View>
      </SafeAreaView>

      <View className="px-4 py-2.5">
        <SkeletonBox width={140} height={14} borderRadius={4} />
      </View>

      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </View>
  );
}
