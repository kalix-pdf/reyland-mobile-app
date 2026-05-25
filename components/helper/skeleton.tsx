import { Animated, Pressable, View, Text, StatusBar } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import React, { useEffect, useRef } from 'react';
import { createPropertiesScreenStyles } from '../../styles/dashboard.styles';

interface RefreshSkeletonProps {
  refreshing: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}

export function WithRefreshSkeleton({ refreshing, skeleton, children }: RefreshSkeletonProps) {
  return <>{refreshing ? skeleton : children}</>;
}

export function SkeletonBox({ width, height, borderRadius = 8, style }: {
  width: number | string; height: number; borderRadius?: number; style?: object;
}) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1,   duration: 750, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 750, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor: '#E5E7EB', opacity }, style]}
    />
  );
}

// __ DASHBOARD SKELETON COMPONENT __
export function DashboardSkeleton({ paddingTop }: { paddingTop: number }) {
  return (
    <View style={{ paddingTop }}>
      <SkeletonBox width="100%" height={320} borderRadius={0} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, gap: 8 }}>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={{ alignItems: 'center', gap: 6 }}>
            <SkeletonBox width={48} height={48} borderRadius={12} />
            <SkeletonBox width={40} height={10} />
          </View>
        ))}
      </View>

      {/* Cards */}
      <View style={{ paddingHorizontal: 16, gap: 8 }}>
        <SkeletonBox width={160} height={14} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[...Array(3)].map((_, i) => (
            <SkeletonBox key={i} width={180} height={220} borderRadius={16} />
          ))}
        </View>
      </View>
    </View>
  );
}

// Reusable skeletons per section
export function QuickActionsSkeleton() {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, gap: 8 }}>
      {[...Array(4)].map((_, i) => (
        <View key={i} style={{ alignItems: 'center', gap: 6 }}>
          <SkeletonBox width={48} height={48} borderRadius={12} />
          <SkeletonBox width={40} height={10} />
        </View>
      ))}
    </View>
  );
}

export function LocationsSkeleton() {
  return (
    <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16 }}>
      {[...Array(4)].map((_, i) => (
        <SkeletonBox key={i} width={100} height={36} borderRadius={20} />
      ))}
    </View>
  );
}

export function SpotlightSkeleton() {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      <SkeletonBox width="100%" height={180} borderRadius={16} />
    </View>
  );
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
function PropertyCardSkeleton() {
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

export function PropertiesSkeletonScreen({ styles }: { styles: ReturnType<typeof createPropertiesScreenStyles> }) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* Fixed header skeleton */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.surface }}>
        <View style={styles.header}>
          {/* Title */}
          <SkeletonBox width={130} height={24} borderRadius={6} style={{ marginBottom: 12 }} />

          {/* Search bar */}
          <SkeletonBox width="100%" height={40} borderRadius={10} style={{ marginBottom: 12 }} />

          {/* Filter chips */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[40, 72, 80, 48].map((w, i) => (
              <SkeletonBox key={i} width={w} height={28} borderRadius={14} />
            ))}
          </View>
        </View>
      </SafeAreaView>

      {/* Count row */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        <SkeletonBox width={140} height={14} borderRadius={4} />
      </View>

      {/* Card skeletons */}
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </View>
  );
}
