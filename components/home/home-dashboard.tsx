import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { useRefreshControl } from '@/hooks/use-refresh-control';
import { fetchPropertyInfo } from '@/services/fetchData/property/fetch-property.api';
import { Property } from '@/types/property.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createHomeDashboardStyles } from '../../styles/dashboard.styles';

const QUICK_ACTIONS = [
  { key: 'browse',  label: 'Browse',   icon: 'search-outline'              },
  { key: 'visit',   label: 'Site Visit',icon: 'calendar-outline'           },
  { key: 'reserve', label: 'Reserve',   icon: 'bookmark-outline'           },
  { key: 'support', label: 'Support',   icon: 'chatbubble-ellipses-outline'},
] as const;

const styles = createHomeDashboardStyles(Colors);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBox({ width, height, borderRadius = 8, style }: {
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

function DashboardSkeleton({ paddingTop }: { paddingTop: number }) {
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

// ─── Sub-components ───────────────────────────────────────────────────────────

const ProjectCard = React.memo(({ property }: { property: Property }) => (
  <Pressable
    style={({ pressed }) => [styles.projectCard, pressed && styles.pressed]}
    onPress={() => router.push({ pathname: '/property/[id]', params: { id: property.id } })}
  >
    <Image
      source={{ uri: property.image_url }}
      style={styles.projectImage}
      contentFit="cover"
      cachePolicy="memory-disk"
      priority="normal"
      transition={200}
    />
    <View style={styles.projectContent}>
      <View style={styles.projectBadge}>
        <Text style={styles.projectBadgeText}>{property.category}</Text>
      </View>
      <Text style={styles.projectName} numberOfLines={1}>{property.title}</Text>
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={14} color={Colors.accent} />
        <Text style={styles.locationText} numberOfLines={1}>{property.location}</Text>
      </View>
      <View style={styles.projectFooter}>
        <Text style={styles.projectMeta}>{property.area} SQM • {property.units} Units</Text>
        <View style={styles.reservePill}>
          <Text style={styles.reservePillText}>Reserve</Text>
        </View>
      </View>
    </View>
  </Pressable>
));

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
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);


  const fetchProperties = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchPropertyInfo();
      setProperties(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load properties. Pull down to retry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // ── Refresh control wired to re-fetch ──────────────────────────────────────
  const { refreshing, onRefresh } = useRefreshControl(fetchProperties);

  const featuredProperties = useMemo(() => properties.slice(0, 4), [properties]);

  const locations = useMemo(() =>
    Array.from(
      new Set(
        properties.map((p) => p.location.split(',')[0].trim()),
      ),
    ).slice(0, 6),
  [properties]);

  const firstName        = useMemo(() => user?.name.split(' ')[0] ?? 'Guest', [user?.name]);
  const heroImage        = featuredProperties[0]?.image_url;
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
      <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
        <DashboardSkeleton paddingTop={insets.top + 18} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <ScrollView
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 18 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accentDark}
            progressViewOffset={insets.top + 28}
          />
        }
      >
        {error ? (
          // Error state: full-screen within scroll so pull-to-retry still works
          <View style={[styles.errorBanner, { marginTop: 40 }]}>
            <Ionicons name="alert-circle-outline" size={20} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <>
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
                    <Image
                      source={{ uri: user.avatar }}
                      style={styles.avatarImage}
                      contentFit="cover"
                      cachePolicy="memory-disk"
                    />
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

            {/* ── Ongoing Projects ─────────────────────────────────────────── */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Ongoing Projects</Text>
                  <Text style={styles.sectionSubtitle}>Handpicked developments across key locations</Text>
                </View>
              </View>
              <ScrollView
                horizontal
                contentInsetAdjustmentBehavior="never"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.projectRow}
                // Decelerates smoothly on Android
                decelerationRate="fast"
              >
                {featuredProperties.map((property) => (
                  <ProjectCard key={property.id} property={property} />
                ))}
              </ScrollView>
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
            </View>

            {/* ── Spotlight ────────────────────────────────────────────────── */}
            {spotlightProperty && (
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
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}