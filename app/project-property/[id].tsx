import { usePropertySearch } from '@/hooks/user-property-search';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderNav, HeaderSearchBar, HeaderShell } from '@/components/header';
import { AccountApprovalRequired } from '@/components/helper/account-approval-required';
import PropertyCard from '@/components/property-card';
import { useAuth } from '@/context/auth-context';
import { useProjectProperties } from '@/hooks/useProjectProperties';
import type { Property } from '@/types/property.types';
import { ErrorScreen } from '@/components/helper/error-project';

// Resolved hex values pulled from tailwind.colors so non-NativeWind APIs
// (ActivityIndicator color, StatusBar backgroundColor, Ionicons color) stay in sync.
const AppColors = require('@/tailwind.colors');

const STATUS_FILTERS: { label: string; value: 'All' | Property['status'] }[] = [
  { label: 'All', value: 'All' },
  { label: 'Company Hold', value: 0 },
  { label: 'Reserved', value: 1 },
  { label: 'Sold', value: 2 },
];

export default function ProjectPropertiesScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const { id, name } = useLocalSearchParams<{
    id?: string;
    name?: string;
  }>();
  const projectId = Number(id);
  const projectName = name?.trim() || 'Properties';
  const hasValidProjectId = Number.isFinite(projectId) && projectId > 0;
  const [activeStatus, setActiveStatus] = useState<'All' | Property['status']>('All');

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
  const isApproved = user?.status === 1;

  const activeStatusLabel =
    STATUS_FILTERS.find((filter) => filter.value === activeStatus)?.label ?? 'All';
  const resultLabel = filteredProperties.length === 1 ? 'property' : 'properties';

  const handleSearchChange = (value: string) => {
    if (value.length === 0) {
      clearSearch();
      return;
    }

    setSearchInput(value);
  };

  const renderHeader = () => (
    <HeaderShell transparent>
      <HeaderNav title={projectName} />
      <HeaderSearchBar
        value={search}
        onChange={handleSearchChange}
        placeholder="Search properties"
      />
    </HeaderShell>
  );

  const renderListHeader = () => (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-[18px] pb-3 gap-[9px]"
      >
        {STATUS_FILTERS.map((filter) => {
          const isActive = activeStatus === filter.value;

          return (
            <Pressable
              key={filter.label}
              className={`min-h-[38px] px-3.5 rounded-full border items-center justify-center active:opacity-80 active:scale-[0.98] ${
                isActive ? 'border-accent bg-tag' : 'border-border bg-surface'
              }`}
              onPress={() => setActiveStatus(filter.value)}
            >
              <Text
                className={`text-[13px] font-extrabold ${
                  isActive ? 'text-accent font-black' : 'text-textSecondary'
                }`}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="mx-[18px] mb-3 flex-row items-center justify-between gap-3">
        <View>
          <Text className="text-[15px] font-black text-textPrimary">
            {searching ? 'Searching…' : `${filteredProperties.length} ${resultLabel} found`}
          </Text>
          {hasActiveSearch ? (
            <Text className="mt-0.5 text-xs font-bold text-textMuted">
              Search: {search.trim()}
            </Text>
          ) : null}
          {hasActiveStatusFilter ? (
            <Text className="mt-0.5 text-xs font-bold text-textMuted">
              Status: {activeStatusLabel}
            </Text>
          ) : null}
          {searchError ? (
            <Text className="mt-0.5 text-xs font-bold text-error">{searchError}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );

  const renderFeedback = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    message: string,
    actionLabel?: string,
    onAction?: () => void
  ) => (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      {renderHeader()}
      {renderListHeader()}

      <View className="flex-1 items-center justify-center px-[34px]">
        <View className="w-[62px] h-[62px] rounded-full items-center justify-center bg-tag mb-4">
          <Ionicons name={icon} size={28} color={AppColors.accent} />
        </View>
        <Text className="text-xl font-black text-textPrimary text-center mb-2">{title}</Text>
        <Text className="text-sm leading-5 font-semibold text-textSecondary text-center">
          {message}
        </Text>

        {actionLabel && onAction ? (
          <Pressable
            className="mt-[18px] min-h-[46px] px-6 rounded-full items-center justify-center bg-accent active:opacity-80 active:scale-[0.98]"
            onPress={onAction}
            accessibilityRole="button"
          >
            <Text className="text-sm font-black text-white">{actionLabel}</Text>
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

  if (authLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
        {renderHeader()}

        <View className="flex-1 items-center justify-center px-8">
          <ActivityIndicator size="large" color={AppColors.accent} />
          <Text className="mt-3 text-sm font-bold text-textSecondary">
            Loading properties...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isApproved) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
        <HeaderShell transparent>
          <HeaderNav title={projectName} />
        </HeaderShell>

        <AccountApprovalRequired message="Your account needs approval before you can view property listings under this project." />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
        {renderHeader()}

        <View className="flex-1 items-center justify-center px-8">
          <ActivityIndicator size="large" color={AppColors.accent} />
          <Text className="mt-3 text-sm font-bold text-textSecondary">
            Loading properties...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
        {renderHeader()}
        <ErrorScreen message='Unable to load properties' onRetry={retry} />
      </SafeAreaView>
    ); 
    // return renderFeedback('cloud-offline-outline', 'Unable to load properties', error, 'Try again', retry);
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      {renderHeader()}

      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListHeaderComponent={renderListHeader}
        contentContainerClassName={`pt-4 pb-24 ${filteredProperties.length === 0 ? 'flex-grow' : ''}`}
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
            tintColor={AppColors.accent}
            colors={[AppColors.accent]}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-9 pt-[42px]">
            <View className="w-[58px] h-[58px] rounded-full items-center justify-center bg-tag mb-[14px]">
              <Ionicons name="home-outline" size={26} color={AppColors.accent} />
            </View>
            <Text className="text-lg font-black text-textPrimary mb-1.5">No properties yet</Text>
            <Text className="text-sm leading-5 font-semibold text-textSecondary text-center">
              {hasActiveFilters
                ? 'No listings match your current filters. Try another search or status.'
                : 'This project does not have available listings at the moment.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View className="py-[18px] items-center justify-center gap-2">
              <ActivityIndicator size="small" color={AppColors.accent} />
              <Text className="text-xs font-bold text-textMuted">Loading more properties...</Text>
            </View>
          ) : filteredProperties.length > 0 && !hasMore ? (
            <Text className="pt-1 pb-[18px] text-xs font-bold text-textMuted text-center">
              You have reached the end
            </Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
