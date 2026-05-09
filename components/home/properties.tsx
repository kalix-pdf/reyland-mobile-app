//wala na to par, delete na to, may home dashboard na tayo
// 'wag mo idelete, ito yung discover page sa loob ng mobile app.

import PropertyCard from '@/components/property-card';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { PROPERTIES } from '@/data/properties';
import { useRefreshControl } from '@/hooks/use-refresh-control';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { createPropertiesScreenStyles } from '../../styles/dashboard.styles';

const FILTERS = ['All', 'For Sale', 'For Rent'] as const;

type Filter = (typeof FILTERS)[number];

export function PropertiesScreen() {
  const styles = createPropertiesScreenStyles(Colors);
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { refreshing, onRefresh } = useRefreshControl();

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return PROPERTIES.filter((property) => {
      const matchesFilter = activeFilter === 'All' || property.type === activeFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        property.title.toLowerCase().includes(normalizedSearch) ||
        property.address.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  const clearSearch = () => {
    setSearch('');
  };

  const handleLoginPress = () => {
    router.push('/login');
  };

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
                  const isActive = activeFilter === filter;

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
                  );
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
  );
}
