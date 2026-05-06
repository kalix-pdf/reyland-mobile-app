//wala na to par, delete na to, may home dashboard na tayo
// 'wag mo idelete, ito yung discover page sa loob ng mobile app.

import PropertyCard from '@/components/property-card'
import { Colors } from '@/constants/colors'
import { useAuth } from '@/context/auth-context'
import { PROPERTIES } from '@/data/properties'
import { useRefreshControl } from '@/hooks/use-refresh-control'
import { Feather, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { FlatList, Image, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const FILTERS = ['All', 'For Sale', 'For Rent'] as const

type Filter = (typeof FILTERS)[number]

export function PropertiesScreen() {
  const { user } = useAuth()
  const insets = useSafeAreaInsets()
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const [search, setSearch] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { refreshing, onRefresh } = useRefreshControl()

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return PROPERTIES.filter((property) => {
      const matchesFilter = activeFilter === 'All' || property.type === activeFilter
      const matchesSearch =
        normalizedSearch.length === 0 ||
        property.title.toLowerCase().includes(normalizedSearch) ||
        property.address.toLowerCase().includes(normalizedSearch)

      return matchesFilter && matchesSearch
    })
  }, [activeFilter, search])

  const clearSearch = () => {
    setSearch('')
  }

  const handleLoginPress = () => {
    router.push('/login')
  }

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <FlatList
        // alwaysBounceVertical={false}
        // bounces={false}
        contentInsetAdjustmentBehavior="never"
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListHeaderComponent={
          <View>
            <View style={[styles.hero, { paddingTop: insets.top + 18 }]}>
              <View style={styles.heroDecorCircleOne} />
              <View style={styles.heroDecorCircleTwo} />

              <View style={styles.header}>
                <View style={styles.headerTextGroup}>
                  <View style={styles.brandPill}>
                    <View style={styles.brandDot} />
                    <Text style={styles.brandPillText}>DISCOVER</Text>
                  </View>

                  <Text style={styles.greeting}>Reyland Development</Text>
                  <Text style={styles.headline}>Find your dream home</Text>
                  <Text style={styles.subtitle}>
                    Search curated properties for sale and rent across verified Reyland locations.
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
            </View>

            <View style={styles.contentPanel}>
              <View style={[styles.searchWrap, isSearchFocused && styles.searchWrapFocused]}>
                <Feather
                  name="search"
                  size={20}
                  color={isSearchFocused ? Colors.accent : Colors.textMuted}
                  style={styles.searchIcon}
                />

                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by title or location"
                  placeholderTextColor={Colors.textMuted}
                  value={search}
                  onChangeText={setSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  returnKeyType="search"
                />

                {search.length > 0 ? (
                  <Pressable onPress={clearSearch} hitSlop={8}>
                    <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
                  </Pressable>
                ) : null}
              </View>

              <View style={styles.filters}>
                {FILTERS.map((filter) => {
                  const isActive = activeFilter === filter

                  return (
                    <Pressable
                      key={filter}
                      style={({ pressed }) => [
                        styles.filterBtn,
                        isActive && styles.filterBtnActive,
                        pressed && styles.filterBtnPressed,
                      ]}
                      onPress={() => setActiveFilter(filter)}
                    >
                      <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter}</Text>
                    </Pressable>
                  )
                })}
              </View>

              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Available Properties</Text>
                  <Text style={styles.resultCount}>
                    {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found
                  </Text>
                </View>

                <Pressable style={({ pressed }) => [styles.sortPill, pressed && styles.sortPillPressed]}>
                  <Ionicons name="options-outline" size={16} color={Colors.accent} />
                  <Text style={styles.sortText}>Filter</Text>
                </Pressable>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="home-outline" size={42} color={Colors.accent} />
            </View>

            <Text style={styles.emptyTitle}>No properties found</Text>
            <Text style={styles.emptyText}>Try changing your search or selecting a different filter.</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
            progressViewOffset={insets.top + 28}
          />
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  list: {
    paddingBottom: 28,
  },

  hero: {
    minHeight: 228,
    backgroundColor: Colors.primary,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 42,
    overflow: 'hidden',
  },

  heroDecorCircleOne: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    right: -58,
    top: 18,
  },

  heroDecorCircleTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    left: -92,
    bottom: -80,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  headerTextGroup: {
    flex: 1,
    paddingRight: 18,
  },

  brandPill: {
    alignSelf: 'flex-start',
    minHeight: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
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

  greeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  headline: {
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.9,
    maxWidth: 300,
  },

  subtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.82)',
    maxWidth: 320,
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

  avatarText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
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

  loginPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  headerActionPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },

  contentPanel: {
    marginTop: -33,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 16,
    shadowColor: Colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: -8,
    },
    elevation: 6,
  },

  searchWrap: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 28,
    borderWidth: 1.4,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },

  searchWrapFocused: {
    backgroundColor: Colors.surface,
    borderColor: Colors.accent,
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 14,
  },

  filters: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },

  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.background,
    borderWidth: 1.3,
    borderColor: Colors.border,
  },

  filterBtnActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },

  filterBtnPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },

  filterText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '800',
  },

  filterTextActive: {
    color: '#FFFFFF',
  },

  sectionHeader: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },

  resultCount: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
    marginTop: 3,
  },

  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.tag,
  },

  sortPillPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },

  sortText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '900',
  },

  empty: {
    alignItems: 'center',
    paddingTop: 70,
    paddingHorizontal: 32,
  },

  emptyIconWrap: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: Colors.tag,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 41,
  },
})
