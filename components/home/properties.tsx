import PropertyCard from '@/components/property-card';
import { Colors } from '@/constants/colors';
import { fetchPropertyInfo } from '@/services/fetchData/property/fetch-property.api';
import { Property } from '@/types/property.types';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createPropertiesScreenStyles } from '../../styles/dashboard.styles';
import { ErrorScreen } from '../helper/error-project';
import { PropertiesSkeletonScreen } from '../helper/skeleton';

const FILTERS = ['All', 'On Going', 'Completed', 'Sold'] as const
type Filter = (typeof FILTERS)[number];

const STATUS_MAP: Record<string, number> = {
  'On Going': 0,
  'Completed': 1,
  'Sold': 2
};

export function PropertiesScreen() {
  const styles = createPropertiesScreenStyles(Colors);
  // const { user } = useAuth();
  // const insets = useSafeAreaInsets();

  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  //pagination cursor based
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

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

      const { data, nextCursor: cursor, hasMore: more } = await fetchPropertyInfo();

      setProperties(Array.isArray(data) ? data : []);
      setNextCursor(cursor);
      setHasMore(more);
    } catch {
      setError('Failed to load properties. Pull down to retry.');
    } finally {
      clearTimeout(errorTimerRef.current!);
      errorTimerRef.current = null;
      isRefreshing ? setRefreshing(false) : setLoading(false);
    }
  }, []);

  const fetchMoreProperties = useCallback(async () => {
    if (!hasMore || loadingMore || !nextCursor || loading) return;

    try {
      setLoadingMore(true);

      const { data, nextCursor: cursor, hasMore: more } = await fetchPropertyInfo(nextCursor);

      setProperties((prev) => [...prev, ...(Array.isArray(data) ? data : [])]);
      setNextCursor(cursor);
      setHasMore(more);
    } catch {
      // silent fail — user can scroll back up and down to retry
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, nextCursor, loading]);

  useEffect(() => {
    fetchProperties();
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, [fetchProperties]);

 const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return properties.filter((property) => {
      const location = property.project?.location ?? '';
      const matchesFilter =
        activeFilter === 'All' ||
        property.status === STATUS_MAP[activeFilter];

      const matchesSearch =
        normalizedSearch.length === 0 ||
        property.title.toLowerCase().includes(normalizedSearch) ||
        location.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [properties, activeFilter, search]);

  const handleRefresh = useCallback(() => {
    fetchProperties(true); 
  }, [fetchProperties]);


  if (loading) return <PropertiesSkeletonScreen styles={styles} />;
  
  if (error) return <ErrorScreen message={error} onRetry={fetchProperties} />;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* Fixed Header */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.surface }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Properties</Text>

          {/* Search */}
          <View style={[styles.searchRow, isSearchFocused && styles.searchRowFocused]}>
            <Feather
              name="search"
              size={16}
              color={isSearchFocused ? Colors.accent : Colors.textMuted}
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
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </Pressable>
            )}
          </View>

          {/* Filter chips */}
          <View style={styles.filters}>
            {FILTERS.map((f) => {
              const active = activeFilter === f;
              return (
                <Pressable
                  key={f}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setActiveFilter(f)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{f}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeAreaView>

      {/* Scrollable List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PropertyCard property={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchMoreProperties}
        onEndReachedThreshold={0}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size={"small"}
            style={{ marginVertical: 25 }}/>
          ) : null
        }
        ListHeaderComponent={
          <>
            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            <View style={styles.subHeader}>
              <Text style={styles.resultCount}>
                {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found
              </Text>
              <Pressable style={styles.sortBtn}>
                <Ionicons name="options-outline" size={15} color={Colors.accent} />
                <Text style={styles.sortText}>Filter</Text>
              </Pressable>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="home-outline" size={36} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No properties found</Text>
            <Text style={styles.emptyText}>
              Try changing your search or selecting a different filter.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.accent}
          />
        }
      />
    </View>
  );
}
