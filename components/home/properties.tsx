import PropertyCard from '@/components/property-card';
import { Colors } from '@/constants/colors';
import { FILTERS, useProperties } from '@/context/properties.context';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createPropertiesScreenStyles } from '../../styles/dashboard.styles';
import { ErrorScreen } from '../helper/error-project';
import { PropertiesSkeletonScreen } from '../helper/skeleton';
import { Header } from './header';

export function PropertiesScreen() {
  const styles = createPropertiesScreenStyles(Colors);

  const {
    filtered,
    loading,
    error,
    refreshing,
    loadingMore,
    hasMore,
    activeFilter,
    setActiveFilter,
    search,
    setSearch,
    loadMore,
    refresh,
    retry,
  } = useProperties();

  const hasActiveSearch = search.trim().length > 0;
  const hasActiveFilter = activeFilter !== 'All';
  const resultLabel = filtered.length === 1 ? 'property' : 'properties';
  const canLoadMore = hasMore && !loadingMore && filtered.length > 0;

  if (loading) return <PropertiesSkeletonScreen styles={styles} />;
  if (error) return <ErrorScreen message={error} onRetry={retry} />;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView edges={['top']} style={{ backgroundColor: Colors.surface }}>
        <Header
          mode="properties"
          search={search}
          onSearchChange={setSearch}
        />
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PropertyCard property={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={canLoadMore ? loadMore : undefined}
        onEndReachedThreshold={0.35}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color={Colors.accent} />
              <Text style={styles.loadingMoreText}>Loading more properties</Text>
            </View>
          ) : filtered.length > 0 && !hasMore ? (
            <Text style={styles.endText}>You have reached the end</Text>
          ) : null
        }
        ListHeaderComponent={
          <View>
            {/* <View style={styles.summaryCard}>
              <View style={styles.summaryTopRow}>
                <View>
                  <Text style={styles.summaryLabel}>Discover</Text>
                  <Text style={styles.summaryTitle}>Available Properties</Text>
                </View>
                <View style={styles.summaryIcon}>
                  <Ionicons name="business-outline" size={21} color={Colors.accent} />
                </View>
              </View>
              <Text style={styles.summaryText}>
                {properties.length} listed {properties.length === 1 ? 'property' : 'properties'} across Reyland projects.
              </Text>
            </View> */}

            <View style={styles.filters}>
              {FILTERS.map((f) => {
                const active = activeFilter === f;
                return (
                  <Pressable
                    key={f}
                    style={({ pressed }) => [
                      styles.chip,
                      active && styles.chipActive,
                      pressed && styles.chipPressed,
                    ]}
                    onPress={() => setActiveFilter(f)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {f}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.subHeader}>
              <View>
                <Text style={styles.resultCount}>
                  {filtered.length} {resultLabel} found
                </Text>
                {(hasActiveSearch || hasActiveFilter) && (
                  <Text style={styles.resultContext}>
                    {hasActiveSearch ? `Search: "${search.trim()}"` : `Showing ${activeFilter.toLowerCase()} listings`}
                  </Text>
                )}
              </View>

              {(hasActiveSearch || hasActiveFilter) && (
                <Pressable
                  style={({ pressed }) => [styles.clearBtn, pressed && styles.chipPressed]}
                  onPress={() => {
                    setSearch('');
                    setActiveFilter('All');
                  }}
                >
                  <Ionicons name="close-circle" size={15} color={Colors.accent} />
                  <Text style={styles.clearText}>Clear</Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="home-outline" size={28} color={Colors.accent} />
            </View>
            <Text style={styles.emptyTitle}>No properties found</Text>
            <Text style={styles.emptyText}>
              Try changing your search or selecting a different filter.
            </Text>
            {(hasActiveSearch || hasActiveFilter) && (
              <Pressable
                style={({ pressed }) => [styles.emptyButton, pressed && styles.chipPressed]}
                onPress={() => {
                  setSearch('');
                  setActiveFilter('All');
                }}
              >
                <Text style={styles.emptyButtonText}>Reset filters</Text>
              </Pressable>
            )}
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={Colors.accent}
          />
        }
      />
    </View>
  );
}
