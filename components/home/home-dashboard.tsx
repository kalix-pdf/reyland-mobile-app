/* eslint-disable react/display-name */
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { projectsApi } from '@/services/fetchData/project/fetch-project.api';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createHomeDashboardStyles } from '../../styles/dashboard.styles';
import { ErrorScreen } from '../helper/error-project';
import { DashboardSkeleton, LocationsSkeleton, ProjectCardsSkeleton, QuickActionsSkeleton, PromotionalCarouselSkeleton, WithRefreshSkeleton } from '../helper/skeleton';
import { Header } from './header';
import { Image } from 'expo-image';
import { PromotionalCarousel } from './carousel';
import type { Project } from '@/types';

const QUICK_ACTIONS = [
  { key: 'browse',  label: 'Browse',   icon: 'search-outline'              },
  { key: 'visit',   label: 'Site Visit',icon: 'calendar-outline'           },
  { key: 'reserve', label: 'Reserve',   icon: 'bookmark-outline'           },
  { key: 'Invest', label: 'Invest',   icon: 'cash-outline'              },
  { key: 'support', label: 'Support',   icon: 'chatbubble-ellipses-outline'},
] as const;

const styles = createHomeDashboardStyles(Colors);

const LocationChip = React.memo(({ location }: { location: string }) => {
  const initials = location
    .split(' ')
    .slice(0, 2)
    .map((p: string) => p[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <View style={styles.locationChip}>
      <View style={styles.locationInitials}>
        <Text style={styles.locationInitialsText}>{initials}</Text>
      </View>
      <Text style={styles.locationChipText}>{location}</Text>
    </View>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────

export function HomeDashboard() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [projects, setProjects] = useState<Project[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchFeaturedProject = useCallback(async (isRefreshing = false) => {
      try {
        isRefreshing ? setRefreshing(true) : setLoading(true);
        setError(null);
  
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
  
        errorTimerRef.current = setTimeout(() => {
          setError('Failed to load properties. Pull down to retry.');
          setLoading(false);
          setRefreshing(false);
        }, 5000);
  
        const data = await projectsApi.getFeatured();
        setProjects(Array.isArray(data) ? data : []);
      } catch {
        setError('Failed to load projects. Pull down to retry.');
      } finally {
        clearTimeout(errorTimerRef.current!);
        errorTimerRef.current = null;
        isRefreshing ? setRefreshing(false) : setLoading(false);
      }
    }, []);

   useEffect(() => {
      fetchFeaturedProject();
      return () => {
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      };
    }, [fetchFeaturedProject]);

  const handleRefresh = useCallback(() => {
      fetchFeaturedProject(true); 
    }, [fetchFeaturedProject]);

  const locations = useMemo(() =>
    Array.from(
      new Set(
        projects
          .map((p) => p.location?.split(',')[0]?.trim())
          .filter((location): location is string => Boolean(location)),
      ),
    ).slice(0, 6),
  [projects]);

  const handleLoginPress   = useCallback(() => router.push('/welcome'), []);
  const handleDiscoverPress = useCallback(() => { 
    if (!user) {
      router.push('/welcome');
    } else {
      router.push('/(tabs)/discover');
    }
    }, [user]);

  const player = useVideoPlayer(require('@/assets/vid/welcome-page-bg.mp4'), (p) => {
    p.loop = true;
    p.muted = true;
    p.audioMixingMode = 'mixWithOthers';
    p.play();
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <DashboardSkeleton paddingTop={insets.top + 18} />
      </SafeAreaView>
    );
  }

  if (error) return <ErrorScreen message={error} onRetry={fetchFeaturedProject} />

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <Header mode="home" user={user} onLogin={handleLoginPress} />

      <ScrollView contentInsetAdjustmentBehavior="never"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.accentDark}
              progressViewOffset={insets.top + 28}
            />}>
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
                      <Ionicons name={action.icon} size={22} color={Colors.accent} />
                    </View>
                    <Text style={styles.quickActionLabel}>{action.label}</Text>
                  </Pressable>
                ))}
              </View>
            </WithRefreshSkeleton>

            <WithRefreshSkeleton refreshing={refreshing} skeleton={<PromotionalCarouselSkeleton />}>
              <PromotionalCarousel />
            </WithRefreshSkeleton>

            {/* Featured Projects */}
            <WithRefreshSkeleton refreshing={refreshing} skeleton={<ProjectCardsSkeleton />}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Featured Projects</Text>

              </View>
            </WithRefreshSkeleton>
            
            {/* ── Hero ────────────────────────────────────────────────────── */}
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
                  contentContainerStyle={styles.locationList}
                >
                  {locations.map((location) => (
                    <LocationChip key={location} location={location} />
                  ))}
                </ScrollView>
              </WithRefreshSkeleton>
            </View>



      </ScrollView>
    </SafeAreaView>
  );
}