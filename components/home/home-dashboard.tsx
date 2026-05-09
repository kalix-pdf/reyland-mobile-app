import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { PROPERTIES } from '@/data/properties';
import { useRefreshControl } from '@/hooks/use-refresh-control';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, ImageBackground, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createHomeDashboardStyles } from '../../styles/dashboard.styles';

const QUICK_ACTIONS = [
  { key: 'browse', label: 'Browse', icon: 'search-outline' as const },
  { key: 'visit', label: 'Site Visit', icon: 'calendar-outline' as const },
  { key: 'reserve', label: 'Reserve', icon: 'bookmark-outline' as const },
  { key: 'support', label: 'Support', icon: 'chatbubble-ellipses-outline' as const },
] as const;

export function HomeDashboard() {
  const styles = createHomeDashboardStyles(Colors);
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { refreshing, onRefresh } = useRefreshControl();

  const featuredProperties = useMemo(() => PROPERTIES.slice(0, 4), []);

  const locations = useMemo(() => {
    return Array.from(
      new Set(
        PROPERTIES.map((property) => {
          const segments = property.address.split(',').map((segment) => segment.trim());
          return segments[0];
        }),
      ),
    ).slice(0, 6);
  }, []);

  const handleLoginPress = () => {
    router.push('/welcome');
  };

  const firstName = user?.name.split(' ')[0] ?? 'Guest';
  const heroImage = featuredProperties[0]?.image[0]?.image_url;
  const spotlightProperty = featuredProperties[0];

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
        <ImageBackground source={{ uri: heroImage }} style={[styles.hero]} imageStyle={styles.heroImage}>
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
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
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

        <View style={styles.quickActionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action.key}
              style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}
              onPress={() => router.push('/(tabs)/discover')}
            >
              <View style={styles.quickActionIconBox}>
                <Ionicons name={action.icon} size={22} color={Colors.accent} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Ongoing Projects</Text>
              <Text style={styles.sectionSubtitle}>Handpicked developments across key locations</Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
              onPress={() => router.push('/(tabs)/discover')}
            >
              <Text style={styles.linkText}>View All</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            contentInsetAdjustmentBehavior="never"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.projectRow}
          >
            {featuredProperties.map((property) => (
              <Pressable
                key={property.id}
                style={({ pressed }) => [styles.projectCard, pressed && styles.pressed]}
                onPress={() => router.push({ pathname: '/property/[id]', params: { id: property.id } })}
              >
                <Image source={{ uri: property.image[0].image_url }} style={styles.projectImage} />

                <View style={styles.projectContent}>
                  <View style={styles.projectBadge}>
                    <Text style={styles.projectBadgeText}>{property.type}</Text>
                  </View>

                  <Text style={styles.projectName} numberOfLines={1}>
                    {property.title}
                  </Text>

                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color={Colors.accent} />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {property.address}
                    </Text>
                  </View>

                  <Text style={styles.projectPrice}>
                    ₱{property.price.toLocaleString()}
                    {property.type === 'For Rent' ? '/mo' : ''}
                  </Text>

                  <View style={styles.projectFooter}>
                    <Text style={styles.projectMeta}>
                      {property.bedrooms} Beds • {property.bathrooms} Baths
                    </Text>

                    <View style={styles.reservePill}>
                      <Text style={styles.reservePillText}>Reserve</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Project Locations</Text>
              <Text style={styles.sectionSubtitle}>Browse by city and growth area</Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
              onPress={() => router.push('/(tabs)/discover')}
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
              <View key={location} style={styles.locationChip}>
                <View style={styles.locationInitials}>
                  <Text style={styles.locationInitialsText}>
                    {location
                      .split(' ')
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase() ?? '')
                      .join('')}
                  </Text>
                </View>

                <Text style={styles.locationChipText}>{location}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {spotlightProperty ? (
          <Pressable
            style={({ pressed }) => [styles.spotlightCard, pressed && styles.pressed]}
            onPress={() => router.push({ pathname: '/property/[id]', params: { id: spotlightProperty.id } })}
          >
            <ImageBackground
              source={{ uri: spotlightProperty.image[0].image_url }}
              style={styles.spotlightBackground}
              imageStyle={styles.spotlightImage}
            >
              <View style={styles.spotlightOverlay} />
              <View style={styles.spotlightContent}>
                <View style={styles.spotlightTextWrap}>
                  <Text style={styles.spotlightTitle}>Buy properties for your future</Text>
                  <Text style={styles.spotlightText}>
                    Start with curated listings in high-potential locations and move from discovery to reservation
                    faster.
                  </Text>
                </View>

                <View style={styles.spotlightButton}>
                  <Text style={styles.spotlightButtonText}>See Featured Property</Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
