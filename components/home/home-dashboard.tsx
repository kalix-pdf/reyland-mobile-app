/* eslint-disable react/display-name */
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { useDashboard } from '@/context/dashboard-context';
import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createHomeDashboardStyles } from '../../styles/dashboard.styles';
import { ErrorScreen } from '../helper/error-project';
import { DashboardSkeleton, LocationsSkeleton, ProjectCardsSkeleton, PromotionalCarouselSkeleton, QuickActionsSkeleton, WithRefreshSkeleton } from '../helper/skeleton';
import { PromotionalCarousel } from './carousel';
import { FeaturedProjectsScroll } from './featured-project';
import { Header } from './header';

const QUICK_ACTIONS = [
  { key: 'browse',  label: 'Browse',   icon: 'search-outline'              },
  { key: 'visit',   label: 'Site Visit',icon: 'calendar-outline'           },
  { key: 'reserve', label: 'Reserve',   icon: 'bookmark-outline'           },
  { key: 'Invest', label: 'Invest',   icon: 'cash-outline'              },
  { key: 'support', label: 'Support',   icon: 'chatbubble-ellipses-outline'},
] as const;

const styles = createHomeDashboardStyles(Colors);
// const today = new Date().toLocaleDateString('en-PH', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//   });

const LocationChip = React.memo(({ location }: { location: string }) => {
  return (
    <View style={styles.locationChip}>
        <Text style={styles.locationInitialsText}><Ionicons name="location-outline" size={20} color={Colors.textPrimary} /></Text>
      <Text style={styles.locationChipText}>{location}</Text>
    </View>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────

export function HomeDashboard() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const { data: projects, locations, loading, error, retry, refresh: handleRefresh, refreshing } = useDashboard();
  
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
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <DashboardSkeleton paddingTop={insets.top + 18} />
      </SafeAreaView>
    );
  }
 
  if (error) {
    return <ErrorScreen message={error} onRetry={retry} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <Header mode="home" user={user} 
        onLogin={handleLoginPress} 
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        />

      <ScrollView contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.accentDark}
              progressViewOffset={insets.top + 28}
            />}>

            {/* <Text style={styles.dateText}>{today}</Text> */}

             {/* ── Quick Actions ────────────────────────────────────────────── */}
            <WithRefreshSkeleton refreshing={refreshing} skeleton={<QuickActionsSkeleton />}>
              <View style={styles.quickActionsRow}>
                {QUICK_ACTIONS.map((action) => (
                  <Pressable
                    key={action.key}
                    style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}
                    onPress={handleDiscoverPress}
                  >
                    <View style={styles.quickActionIconBox}>
                      <Ionicons name={action.icon} size={22} color={Colors.accentDark} />
                    </View>
                    <Text style={styles.quickActionLabel}>{action.label}</Text>
                  </Pressable>
                ))}
              </View>
            </WithRefreshSkeleton>

            {/* Featured Projects */}
            <WithRefreshSkeleton refreshing={refreshing} skeleton={<ProjectCardsSkeleton />}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Top Projects</Text>
                  <TouchableOpacity onPress={() => router.push('/(tabs)/discover')}>
                    <Text style={styles.linkText}>Explore More</Text>
                  </TouchableOpacity>
                </View>
                <FeaturedProjectsScroll
                    projects={projects}
                    // onPress={(project) => router.push(`/projects/${project.id}`)}
                  />
              </View>
            </WithRefreshSkeleton>

            {/* ── Hero ────────────────────────────────────────────────────── */}
            <View style={styles.section}>
              <View style={styles.hero}>
                <VideoView
                  player={player}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="cover"
                  nativeControls={false}
                />

                <View style={styles.heroOverlay} />
                <View style={styles.heroGlow} />

                <View style={styles.heroHeader}>
                  <Pressable style={({ pressed }) => [styles.brandPill, pressed && styles.pressed]}>
                    <Text style={styles.helpPillText}>Need Help?</Text>
                  </Pressable>
                </View>

                <View style={styles.heroBody}>
                  <View style={styles.heroCopy}>
                    <Text style={styles.heroTitle}>Find your next property with confidence.</Text>
                    <Text style={styles.heroSubtitle}>
                      Explore verified developments, featured locations, and ready-to-reserve listings.
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <WithRefreshSkeleton refreshing={refreshing} skeleton={<PromotionalCarouselSkeleton />}>
              <PromotionalCarousel />
            </WithRefreshSkeleton>
                  
            {/* ── Project Locations ────────────────────────────────────────── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Project Locations</Text>
                  <Text style={styles.sectionSubtitle}>Browse by city and growth area</Text>
                </View>
                <Pressable
                  style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
                  onPress={handleDiscoverPress}
                >
                  <Text style={styles.linkText}>Explore</Text>
                </Pressable>
              </View>
              <WithRefreshSkeleton refreshing={refreshing} skeleton={<LocationsSkeleton />} >
                <ScrollView
                  horizontal
                  contentInsetAdjustmentBehavior="never"
                  showsHorizontalScrollIndicator={false}
                >
                  {locations.map((location) => (
                    <LocationChip key={location} location={location} />
                  ))}
                </ScrollView>
              </WithRefreshSkeleton>
            </View>

            {/* Featured Properties  */}
            <WithRefreshSkeleton refreshing={refreshing} skeleton={<ProjectCardsSkeleton />}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Featured Properties</Text>
                  <TouchableOpacity onPress={() => router.push('/(tabs)/discover')}>
                    <Text style={styles.linkText}>Explore More</Text>
                  </TouchableOpacity>
                </View>
                <FeaturedProjectsScroll
                    projects={projects}
                    // onPress={(project) => router.push(`/projects/${project.id}`)}
                  />
              </View>
            </WithRefreshSkeleton>

      </ScrollView>
    </SafeAreaView>
  );
}
