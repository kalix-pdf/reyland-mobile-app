/* eslint-disable react/display-name */
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { fetchFeaturedProperties } from '@/services/fetchData/property/fetch-property.api';
import { Property } from '@/types/property.types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createHomeDashboardStyles } from '../../styles/dashboard.styles';
import { ErrorScreen } from '../helper/error-project';
import { ProjectCard } from '../helper/project-card';
import { DashboardSkeleton, LocationsSkeleton, ProjectCardsSkeleton, QuickActionsSkeleton, SpotlightSkeleton, WithRefreshSkeleton } from '../helper/skeleton';

const QUICK_ACTIONS = [
  { key: 'browse',  label: 'Browse',   icon: 'search-outline'              },
  { key: 'visit',   label: 'Site Visit',icon: 'calendar-outline'           },
  { key: 'reserve', label: 'Reserve',   icon: 'bookmark-outline'           },
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
  const [properties, setProperties] = useState<Property[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProperties = useCallback(async (isRefreshing = false) => {
      try {
        isRefreshing ? setRefreshing(true) : setLoading(true);
        setError(null);
  
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
  
        errorTimerRef.current = setTimeout(() => {
          setError('Failed to load properties. Pull down to retry.');
          setLoading(false);
          setRefreshing(false);
        }, 5000);
  
        const data = await fetchFeaturedProperties();
        setProperties(Array.isArray(data) ? data : []);
      } catch {
        setError('Failed to load properties. Pull down to retry.');
      } finally {
        clearTimeout(errorTimerRef.current!);
        errorTimerRef.current = null;
        isRefreshing ? setRefreshing(false) : setLoading(false);
      }
    }, []);

   useEffect(() => {
      fetchProperties();
      return () => {
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      };
    }, [fetchProperties]);

  const handleRefresh = useCallback(() => {
      fetchProperties(true); 
    }, [fetchProperties]);

  const featuredProperties = useMemo(() => properties.slice(0, 4), [properties]);

  const locations = useMemo(() =>
    Array.from(
      new Set(
        properties.map((p) => p.location.split(',')[0].trim()),
      ),
    ).slice(0, 6),
  [properties]);

  const firstName = useMemo(() => user?.name?.split(' ')[0] ?? 'Guest', [user?.name]);
  const heroImage = featuredProperties[0]?.image_url;
  const spotlightProperty = featuredProperties[0];

  const handleLoginPress   = useCallback(() => router.push('/welcome'), []);
  const handleDiscoverPress = useCallback(() => { 
    if (!user) {
      router.push('/welcome');
    } else {
      router.push('/(tabs)/discover');
    }
    }, [user]);
  const handleSpotlightPress = useCallback(() => {
    if (!user) {
      router.push('/welcome');
    } else {
      router.push({ pathname: '/property/[id]', params: { id: spotlightProperty?.id } });
    }
  }, [user, spotlightProperty?.id]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <DashboardSkeleton paddingTop={insets.top + 18} />
      </SafeAreaView>
    );
  }

  if (error) return <ErrorScreen message={error} onRetry={fetchProperties} />

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={ { paddingTop: insets.top + 18 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.accentDark}
            progressViewOffset={insets.top + 28}
          />
        }
      >
            {/* ── Hero ────────────────────────────────────────────────────── */}
            <ImageBackground
              source={{ uri: heroImage }}
              style={styles.hero}
              imageStyle={styles.heroImage}
            >
              <View style={styles.heroOverlay} />
              <View style={styles.heroGlow} />

              <View style={styles.heroHeader}>
                <View style={styles.brandPill}>
                  <View style={styles.brandDot} />
                  <Text style={styles.brandPillText}>REYLAND</Text>
                </View>
                <Pressable style={({ pressed }) => [styles.brandPill, pressed && styles.pressed]}>
                  <Text style={styles.helpPillText}>Need Help?</Text>
                </Pressable>
              </View>

              <View style={styles.heroBody}>
                <View style={styles.heroCopy}>
                  <Text style={styles.kicker}>Good day, {firstName}!</Text>
                  <Text style={styles.heroTitle}>Find your next property with confidence.</Text>
                  <Text style={styles.heroSubtitle}>
                    Explore verified developments, featured locations, and ready-to-reserve listings.
                  </Text>
                </View>

                {user ? (
                  <Pressable style={({ pressed }) => [styles.avatar, pressed && styles.headerActionPressed]}>
                    <Text style={styles.loginPillText}>{user.name}</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={({ pressed }) => [styles.loginPill, pressed && styles.headerActionPressed]}
                    onPress={handleLoginPress}
                  >
                    <Ionicons name="person-outline" size={16} color="#FFFFFF" />
                    <Text style={styles.loginPillText}>Login</Text>
                  </Pressable>
                )}
              </View>
            </ImageBackground>

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

            {/* ── Ongoing Projects ─────────────────────────────────────────── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Ongoing Projects</Text>
                  <Text style={styles.sectionSubtitle}>Handpicked developments across key locations</Text>
                </View>
              </View>
              <WithRefreshSkeleton refreshing={refreshing} skeleton={<ProjectCardsSkeleton />}>
                <ScrollView
                  horizontal
                  contentInsetAdjustmentBehavior="never"
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.projectRow}
                  decelerationRate="fast"
                >
                  {featuredProperties.map((property) => (
                    <ProjectCard key={property.id} property={property} />
                  ))}
                </ScrollView>
              </WithRefreshSkeleton>
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

            {/* ── Spotlight ────────────────────────────────────────────────── */}
            <WithRefreshSkeleton
              refreshing={refreshing}
              skeleton={<SpotlightSkeleton />}
            >
              {spotlightProperty ? (
                <Pressable
                  style={({ pressed }) => [styles.spotlightCard, pressed && styles.pressed]}
                  onPress={handleSpotlightPress}
                >
                  <ImageBackground
                    source={{ uri: spotlightProperty.image_url }}
                    style={styles.spotlightBackground}
                    imageStyle={styles.spotlightImage}
                  >
                    <View style={styles.spotlightOverlay} />
                    <View style={styles.spotlightContent}>
                      <View style={styles.spotlightTextWrap}>
                        <Text style={styles.spotlightTitle}>Buy properties for your future</Text>
                        <Text style={styles.spotlightText}>
                          Start with curated listings in high-potential locations and move from discovery to reservation faster.
                        </Text>
                      </View>
                      <View style={styles.spotlightButton}>
                        <Text style={styles.spotlightButtonText}>See Featured Property</Text>
                      </View>
                    </View>
                  </ImageBackground>
                </Pressable>
              ) : null}
            </WithRefreshSkeleton>
      </ScrollView>
    </SafeAreaView>
  );
}