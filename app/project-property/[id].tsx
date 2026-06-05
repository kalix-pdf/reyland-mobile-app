import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePropertySearch } from '@/hooks/user-property-search';

import PropertyCard from '@/components/property-card';
import { Colors } from '@/constants/colors';
import { useProjectProperties } from '@/hooks/useProjectProperties';
import type { Property } from '@/types/property.types';

const STATUS_FILTERS: { label: string; value: 'All' | Property['status']}[] = [
  { label: 'All', value: 'All' },
  { label: 'Company Hold', value: 0 },
  { label: 'Reserved', value: 1 },
  { label: 'Sold', value: 2 },
];

export default function ProjectPropertiesScreen() {
  const { id, name } = useLocalSearchParams<{
    id?: string;
    name?: string;
  }>();
  const projectId = Number(id);
  const projectName = name?.trim() || 'Project Properties';
  const hasValidProjectId = Number.isFinite(projectId) && projectId > 0;
  const [activeStatus, setActiveStatus] = useState<'All' | Property['status']>('All');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const {
    properties,
    loading,
    loadingMore,
    refreshing,
    hasMore,
    loadMore,
    refresh,
    retry,
    error,
  } = useProjectProperties(hasValidProjectId ? projectId : 0);

  const {
    inputValue: search,
    results: searchResults,  
    searching,               
    searchError,
    setInputValue: setSearchInput,
    clear: clearSearch,
  } = usePropertySearch({
    projectId,
    localProperties: properties,
  });
  

  const filteredProperties = useMemo(() => {
    if (activeStatus === 'All') return searchResults;
      return searchResults.filter((p) => p.status === activeStatus);
    }, [activeStatus, searchResults]);
  
  const hasActiveSearch = search.trim().length > 0;
  const hasActiveStatusFilter = activeStatus !== 'All';
  const hasActiveFilters = hasActiveSearch || hasActiveStatusFilter;

  const activeStatusLabel =
    STATUS_FILTERS.find((filter) => filter.value === activeStatus)?.label ?? 'All';
  const resultLabel = filteredProperties.length === 1 ? 'property' : 'properties';

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };
  
  const clearFilters = () => {
    clearSearch();
    setActiveStatus('All');
  };

  const renderHeader = () => (
    <View>
      <View style={styles.summaryCard}>
        <View style={styles.summaryTopRow}>
          <View style={styles.summaryTitleWrap}>
            <Text style={styles.summaryLabel}>Properties</Text>
            <Text style={styles.summaryTitle} numberOfLines={2}>
              {projectName}
            </Text>
          </View>
          <View style={styles.summaryIcon}>
            <Ionicons name="home-outline" size={21} color={Colors.accent} />
          </View>
        </View>

        <Text style={styles.summaryText}>
          Browse {properties.length} listing{properties.length === 1 ? '' : 's'} by title, location, category, or price.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {STATUS_FILTERS.map((filter) => {
          const isActive = activeStatus === filter.value;

          return (
            <Pressable
              key={filter.label}
              style={({ pressed }) => [
                styles.chip,
                isActive && styles.chipActive,
                pressed && styles.chipPressed,
              ]}
              onPress={() => setActiveStatus(filter.value)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.subHeader}>
        <View>
          <Text style={styles.resultCount}>
            {searching
              ? 'Searching…'
              : `${filteredProperties.length} ${resultLabel} found`}
          </Text>
          {hasActiveSearch ? (
            <Text style={styles.resultContext}>
              Search: {search.trim()}
            </Text>
          ) : null}
          {hasActiveStatusFilter ? (
            <Text style={styles.resultContext}>
              Status: {activeStatusLabel}
            </Text>
          ) : null}
        </View>

        {hasActiveFilters ? (
          <Pressable
            style={({ pressed }) => [styles.clearBtn, pressed && styles.chipPressed]}
            onPress={clearFilters}
          >
            <Ionicons name="close-circle" size={15} color={Colors.accent} />
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.headerSearchWrap}>
      <View style={[styles.searchRow, isSearchFocused && styles.searchRowFocused]}>
        {searching ? (
          <ActivityIndicator size="small" color={Colors.accent} />
        ) : (
          <Ionicons
            name="search-outline"
            size={18}
            color={isSearchFocused ? Colors.accent : Colors.textMuted}
          />
        )}
  
        <TextInput
          value={search}
          onChangeText={handleSearchChange}
          placeholder="Search properties"
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          returnKeyType="search"
        />
  
        {search ? (
          <Pressable
            onPress={clearSearch}
            accessibilityRole="button"
            accessibilityLabel="Clear property search"
            hitSlop={8}
          >
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
  
      {/* Surface search errors inline below the bar */}
      {searchError ? (
        <Text style={{ color: 'red', fontSize: 12, marginTop: 4, marginHorizontal: 4 }}>
          {searchError}
        </Text>
      ) : null}
    </View>
  );

  const renderTopBar = (showSearch = false) => (
    <View style={styles.topBar}>
      <View style={styles.topBarRow}>
        <Pressable
          style={({ pressed }) => [styles.backButton, pressed && styles.pressedButton]}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </Pressable>

        <View style={styles.topBarTitleWrap}>
          <Text style={styles.topBarTitle}>Properties</Text>
          <Text style={styles.topBarSubtitle} numberOfLines={1}>
            {projectName}
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {showSearch ? renderSearchBar() : null}
    </View>
  );

  const renderFeedback = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    message: string,
    actionLabel?: string,
    onAction?: () => void
  ) => (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      {renderTopBar()}

      <View style={styles.feedbackContainer}>
        <View style={styles.feedbackIcon}>
          <Ionicons name={icon} size={28} color={Colors.accent} />
        </View>
        <Text style={styles.feedbackTitle}>{title}</Text>
        <Text style={styles.feedbackMessage}>{message}</Text>

        {actionLabel && onAction ? (
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressedButton]}
            onPress={onAction}
            accessibilityRole="button"
          >
            <Text style={styles.actionButtonText}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );

  if (!hasValidProjectId) {
    return renderFeedback(
      'alert-circle-outline',
      'Project not found',
      'We could not open the selected project. Please go back and try again.'
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        {renderTopBar()}

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading properties...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return renderFeedback(
      'cloud-offline-outline',
      'Unable to load properties',
      error,
      'Try again',
      retry
    );
  }

  return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      {renderTopBar(true)}

      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.listContent,
          filteredProperties.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasMore && !loadingMore) {
            loadMore();
          }
        }}
        onEndReachedThreshold={0.35}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="home-outline" size={26} color={Colors.accent} />
            </View>
            <Text style={styles.emptyTitle}>No properties yet</Text>
            <Text style={styles.emptyText}>
              {hasActiveFilters
                ? 'No listings match your current filters. Try another search or status.'
                : 'This project does not have available listings at the moment.'}
            </Text>
            {hasActiveFilters ? (
              <Pressable
                style={({ pressed }) => [styles.emptyAction, pressed && styles.pressedButton]}
                onPress={clearFilters}
                accessibilityRole="button"
              >
                <Text style={styles.emptyActionText}>Clear filters</Text>
              </Pressable>
            ) : null}
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={Colors.accent} />
              <Text style={styles.footerText}>Loading more properties...</Text>
            </View>
          ) : filteredProperties.length > 0 && !hasMore ? (
            <Text style={styles.endText}>You have reached the end</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topBarRow: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceMuted,
  },
  pressedButton: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  topBarTitleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  topBarSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  headerSpacer: {
    width: 42,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 96,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  summaryCard: {
    marginHorizontal: 18,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 12,
  },
  summaryTitleWrap: {
    flex: 1,
  },
  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tag,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.accent,
    textTransform: 'uppercase',
  },
  summaryTitle: {
    marginTop: 3,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filters: {
    paddingHorizontal: 18,
    paddingBottom: 12,
    gap: 9,
  },
  chip: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.tag,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.accent,
    fontWeight: '900',
  },
  subHeader: {
    marginHorizontal: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  resultCount: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  resultContext: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.tag,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.accent,
  },
  chipPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  headerSearchWrap: {
    marginTop: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    minHeight: 48,
    shadowColor: Colors.primary,
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  searchRowFocused: {
    borderColor: Colors.accent,
    backgroundColor: Colors.surface,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    color: Colors.textPrimary,
    marginLeft: 9,
    fontWeight: '600',
    paddingVertical: 0,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  feedbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34,
  },
  feedbackIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tag,
    marginBottom: 16,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  feedbackMessage: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 18,
    minHeight: 46,
    paddingHorizontal: 24,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.white,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingTop: 42,
  },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tag,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyAction: {
    marginTop: 16,
    minHeight: 42,
    paddingHorizontal: 18,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tag,
  },
  emptyActionText: {
    fontSize: 13,
    fontWeight: '900',
    color: Colors.accent,
  },
  footerLoader: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  endText: {
    paddingTop: 4,
    paddingBottom: 18,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
