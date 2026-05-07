import { Colors } from '@/constants/colors'
import { useAuth } from '@/context/auth-context'
import { PROPERTIES } from '@/data/properties'
import { useRefreshControl } from '@/hooks/use-refresh-control'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useMemo } from 'react'
import { Image, ImageBackground, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const QUICK_ACTIONS = [
  { key: 'browse', label: 'Browse', icon: 'search-outline' as const },
  { key: 'visit', label: 'Site Visit', icon: 'calendar-outline' as const },
  { key: 'reserve', label: 'Reserve', icon: 'bookmark-outline' as const },
  { key: 'support', label: 'Support', icon: 'chatbubble-ellipses-outline' as const },
] as const

export function HomeDashboard() {
  const { user } = useAuth()
  const insets = useSafeAreaInsets()
  const { refreshing, onRefresh } = useRefreshControl()

  const featuredProperties = useMemo(() => PROPERTIES.slice(0, 4), [])

  const locations = useMemo(() => {
    return Array.from(
      new Set(
        PROPERTIES.map((property) => {
          const segments = property.address.split(',').map((segment) => segment.trim())
          return segments[0]
        }),
      ),
    ).slice(0, 6)
  }, [])

  const handleLoginPress = () => {
    router.push('/welcome')
  }

  const firstName = user?.name.split(' ')[0] ?? 'Guest'
  const heroImage = featuredProperties[0]?.image[0]?.image_url
  const spotlightProperty = featuredProperties[0]

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
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    paddingBottom: 32,
  },

  hero: {
    minHeight: 300,
    marginHorizontal: 18,
    borderRadius: 30,
    overflow: 'hidden',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 26,
    justifyContent: 'space-between',
    backgroundColor: Colors.accentDark,
  },

  heroImage: {
    borderRadius: 30,
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 34, 24, 0.56)',
  },

  heroGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(79, 196, 122, 0.20)',
    top: -60,
    right: -50,
  },

  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brandBadge: {
    backgroundColor: 'rgba(0, 23, 28, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },

  brandBadgeText: {
    color: Colors.textOnDark,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.logoGreenLight,
  },

  brandPillText: {
    color: Colors.white,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  brandPill: {
    alignSelf: 'flex-start',
    minHeight: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    backgroundColor: 'rgba(0, 23, 28, 0.63)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },

  helpPillText: {
    color: Colors.white,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '900',
  },

  heroBody: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },

  heroCopy: {
    flex: 1,
  },

  kicker: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 10,
  },

  heroTitle: {
    color: Colors.textOnDark,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: -0.9,
  },

  heroSubtitle: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 330,
  },

  // avatarFrame: {
  //   width: 96,
  //   height: 120,
  //   borderRadius: 28,
  //   overflow: "hidden",
  //   borderWidth: 2,
  //   borderColor: "rgba(255,255,255,0.24)",
  //   backgroundColor: "rgba(255,255,255,0.12)",
  // },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  quickActionsRow: {
    marginTop: 18,
    marginHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  quickAction: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  quickActionIconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  quickActionLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  section: {
    marginTop: 28,
  },

  sectionHeader: {
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
  },

  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: -0.7,
  },

  sectionSubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600',
  },

  linkButton: {
    paddingVertical: 6,
  },

  linkText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '800',
  },

  projectRow: {
    paddingLeft: 18,
    paddingRight: 6,
    paddingTop: 18,
    gap: 14,
  },

  projectCard: {
    width: 280,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  projectImage: {
    width: '100%',
    height: 158,
    backgroundColor: Colors.surfaceMuted,
  },

  projectContent: {
    padding: 16,
  },

  projectBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.tag,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 10,
  },

  projectBadgeText: {
    color: Colors.tagText,
    fontSize: 11,
    fontWeight: '900',
  },

  projectName: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  locationText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },

  projectPrice: {
    color: Colors.accent,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 14,
    letterSpacing: -0.4,
  },

  projectFooter: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },

  projectMeta: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },

  reservePill: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },

  reservePillText: {
    color: Colors.textOnDark,
    fontSize: 12,
    fontWeight: '900',
  },

  locationList: {
    paddingLeft: 18,
    paddingRight: 6,
    paddingTop: 18,
    gap: 12,
  },

  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  locationInitials: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  locationInitialsText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '900',
  },

  locationChipText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    maxWidth: 140,
  },

  spotlightCard: {
    marginTop: 28,
    marginHorizontal: 18,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },

  spotlightBackground: {
    minHeight: 214,
    justifyContent: 'flex-end',
  },

  spotlightImage: {
    borderRadius: 28,
  },

  spotlightOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 44, 34, 0.58)',
  },

  spotlightContent: {
    padding: 22,
  },

  spotlightTextWrap: {
    maxWidth: 240,
  },

  spotlightTitle: {
    color: Colors.textOnDark,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
  },

  spotlightText: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 14,
    lineHeight: 21,
  },

  spotlightButton: {
    marginTop: 18,
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 999,
  },

  spotlightButtonText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },

  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  //login
  loginPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  loginPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },

  headerActionPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.24)',
  },
})
