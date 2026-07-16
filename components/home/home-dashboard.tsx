/* eslint-disable react/display-name */
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { useDashboard } from '@/context/dashboard-context';
import { sharedPressedScale } from '@/styles/shared-primitives';
import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBrand, HeaderSearchBar, HeaderShell } from '../header';
import { ErrorScreen } from '../helper/error-project';
import { DashboardSkeleton, ProjectCardsSkeleton, PromotionalCarouselSkeleton, WithRefreshSkeleton } from '../helper/skeleton';
import { PromotionalCarousel } from './carousel';
import { FeaturedProjectsScroll, FeaturedPropertiesScroll } from './featured-project';

// const QUICK_ACTIONS = [
//   { key: 'browse',  label: 'Browse',   icon: 'search-outline'              },
//   { key: 'visit',   label: 'Site Visit',icon: 'calendar-outline'           },
//   { key: 'reserve', label: 'Reserve',   icon: 'bookmark-outline'           },
//   { key: 'Invest', label: 'Invest',   icon: 'cash-outline'              },
//   { key: 'support', label: 'Support',   icon: 'chatbubble-ellipses-outline'},
// ] as const;

// const today = new Date().toLocaleDateString('en-PH', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//   });

const LocationChip = React.memo(({ location }: { location: string }) => {
  return (
    <View className="flex-row items-center gap-3 bg-surface rounded-full py-[10px] px-3 border border-border me-3 mb-[15px]">
        <Text className="text-textPrimary text-[15px] font-black"><Ionicons name="location-outline" size={20} color={Colors.textPrimary} /></Text>
      <Text className="text-textPrimary text-[14px] font-bold max-w-[140px]">{location}</Text>
    </View>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────

export function HomeDashboard() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const { data, locations, loading, error, retry, refresh: handleRefresh, refreshing } = useDashboard();
  const { projects, featuredProperties, promotionImages } = data;
  
  const player = useVideoPlayer(require('@/assets/vid/welcome-page-bg.mp4'), (p) => {
    p.loop = true;
    p.muted = true;
    p.audioMixingMode = 'mixWithOthers';
    p.play();
  });

  const handleLoginPress = useCallback(() => router.push('/welcome'), []);
  const handleDiscoverPress = useCallback(() => {
    router.push(user ? '/(tabs)/discover' : '/welcome');
  }, [user]);

  const handleSearchSubmit = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    router.push({
      pathname: '/search-home-screen',
      params: { q: trimmedQuery },
    } as unknown as Href);
  }, []);

  // ── Guard Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView className='flex-1 bg-background' edges={['left', 'right']}>
        <DashboardSkeleton paddingTop={insets.top + 18} />
      </SafeAreaView>
    );
  }
 
  if (error) {
    return <ErrorScreen message={error} onRetry={retry} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right']}>
      <HeaderShell withSafeArea={true}>
        <HeaderBrand user={user} onLogin={handleLoginPress}/>
        <HeaderSearchBar value={search} onChange={setSearch} onSubmit={handleSearchSubmit}/>
      </HeaderShell>

      <ScrollView contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.accentDark}
            />}>

             {/* ── Quick Actions ────────────────────────────────────────────── */}
            {/* <View className="mx-[18px] flex-row justify-between gap-3 my-2">
              {QUICK_ACTIONS.map((action) => (
                <Pressable
                  key={action.key}
                  className="flex-1 items-center px-1.5"
                  style={({ pressed }) => pressed && sharedPressedScale}
                  onPress={handleDiscoverPress}
                >
                  <View
                    className="w-[54px] h-[54px] rounded-[18px] items-center justify-center mb-1.5 border bg-surface border-border"
                    style={{
                      shadowColor: '#000',
                      shadowOpacity: 0.04,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: 2 },
                      elevation: 1,
                    }}
                  >
                    <Ionicons name={action.icon} size={22} color={Colors.accentDark} />
                  </View>
                  <Text className="text-[11px] font-semibold text-center tracking-[0.2px] text-textSecondary">
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View> */}

            {/* Featured Projects */}
            <View className="mt-[15px]">
              <View className="mx-[18px] flex-row justify-between items-center mb-[15px]">
                <Text className="text-[23px] font-semibold tracking-[-0.7px]">Top Projects</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/discover')}>
                  <Text className="text-[13px] font-extrabold text-accent">
                    Explore More
                  </Text>
                </TouchableOpacity>
              </View>
              <WithRefreshSkeleton refreshing={refreshing} skeleton={<ProjectCardsSkeleton/>}>
                <FeaturedProjectsScroll user={user} projects={projects} />
              </WithRefreshSkeleton>
            </View>

            {/* ── Hero ────────────────────────────────────────────────────── */}
            <View className="mx-[18px] mt-[15px]">
              <View className="min-h-[260px] rounded-[30px] overflow-hidden px-[22px] pt-[18px] pb-[26px] bg-accentDark">
                <VideoView
                  player={player}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="cover"
                  nativeControls={false}
                />

                <View className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 34, 24, 0.56)' }} />
                <View className="absolute w-[240px] h-[240px] rounded-[120px] top-[-60px] right-[-50px]" style={{ backgroundColor: 'rgba(79, 196, 122, 0.20)' }} />

                <View className="flex-row justify-between items-center">
                  <Pressable className="bg-surfaceDark px-3 py-2 rounded-full"
                    style={({ pressed }) => [
                      { borderColor: 'rgba(255, 255, 255, 0.14)', backgroundColor: 'rgba(0, 23, 28, 0.63)' },
                      pressed && sharedPressedScale,
                    ]}>
                    <Text className="text-white text-[11px] leading-[14px] font-black">
                      Need Help?
                    </Text>
                  </Pressable>
                </View>

                <View className="flex-row items-end gap-4">
                  <View className="flex-1">
                    <Text className="text-[32px] leading-[38px] font-black tracking-[-0.9px] text-textOnDark">
                      Find your next property with confidence.
                    </Text>
                    <Text
                      className="mt-3 text-[14px] leading-[21px] max-w-[330px]"
                      style={{ color: 'rgba(255,255,255,0.82)' }}
                    >
                      Explore verified developments, featured locations, and ready-to-reserve listings.
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <WithRefreshSkeleton refreshing={refreshing} skeleton={<PromotionalCarouselSkeleton />}>
              <PromotionalCarousel promotionImages={promotionImages} />
            </WithRefreshSkeleton>

            {/* ── Project Locations ────────────────────────────────────────── */}
            <View className="mx-[18px] mt-[15px]">
              <View className="flex-row justify-between items-center mb-[15px]">
                <View>
                  <Text className="text-[23px] font-semibold tracking-[-0.7px]">Project Locations</Text>
                  <Text className="mt-1 text-[13px] font-semibold text-textMuted">
                    Browse by city and growth area
                  </Text>
                </View>
                <Pressable
                  className="py-1.5"
                  style={({ pressed }) => pressed && sharedPressedScale}
                  onPress={handleDiscoverPress}
                >
                  <Text className="text-[13px] font-extrabold text-accent">
                    Explore
                  </Text>
                </Pressable>
              </View>
              <ScrollView
                horizontal
                contentInsetAdjustmentBehavior="never"
                showsHorizontalScrollIndicator={false}
              >
                {locations.map((location) => (
                  <LocationChip key={location} location={location} />
                ))}
              </ScrollView>
            </View>

            {/* Featured Properties  */}
            <View className="mt-[15px]">
              <View className="mx-[18px] flex-row justify-between items-center mb-[15px]">
                <Text className="text-[23px] font-semibold tracking-[-0.7px]">Featured Properties</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/discover')}>
                  <Text className="text-[13px] font-extrabold text-accent">
                    Explore More
                  </Text>
                </TouchableOpacity>
              </View>
              <FeaturedPropertiesScroll user={user} properties={featuredProperties} />
            </View>

      </ScrollView>
    </SafeAreaView>
  );
}
