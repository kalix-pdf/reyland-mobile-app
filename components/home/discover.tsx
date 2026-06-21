import { useProjects } from '@/context/project.context';
import { useProjectSearch } from '@/hooks/use-project-search';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator, FlatList, ListRenderItemInfo, Pressable, RefreshControl,
  StatusBar, Text, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderSearchBar, HeaderShell } from '../header';
import { ErrorScreen } from '../helper/error-project';
import { ProjectsSkeletonScreen } from '../helper/skeleton';
import ProjectCard from '../project-card';

import AppColors from '@/tailwind.colors';
import type { Project } from '@/types';

// Module-level constants — created once, not on every render
const CONTAINER_STYLE = { paddingBottom: 104 };

// ---- Memoized leaf pieces -------------------------------------------------
// Each is pulled out of the main component body so it doesn't get redefined
// (and therefore doesn't force FlatList to treat header/footer/empty as new
// elements) on every render of DiscoverScreen.

const ListFooter = React.memo(function ListFooter({
  loadingMore,
  hasActiveSearch,
  showEndMessage,
}: {
  loadingMore: boolean;
  hasActiveSearch: boolean;
  showEndMessage: boolean;
}) {
  if (loadingMore && !hasActiveSearch) {
    return (
      <View className="flex-row items-center justify-center gap-2 py-[22px]">
        <ActivityIndicator size="small" color={AppColors.accent} />
        <Text className="text-xs font-bold text-textMuted">
          Loading more projects
        </Text>
      </View>
    );
  }

  if (showEndMessage) {
    return (
      <Text className="text-xs font-bold text-center py-[18px] text-textMuted">
        You have reached the end
      </Text>
    );
  }

  return null;
});

const ListHeader = React.memo(function ListHeader({
  totalCount,
  resultLabel,
  filteredCount,
  searching,
  hasActiveSearch,
  search,
  searchError,
  onClearSearch,
}: {
  totalCount: number;
  resultLabel: string;
  filteredCount: number;
  searching: boolean;
  hasActiveSearch: boolean;
  search: string;
  searchError: string | null | undefined;
  onClearSearch: () => void;
}) {
  return (
    <View>
      <View className="mx-[18px] mt-4 p-4 rounded-[20px] border border-border bg-surface shadow-sm">
        <View className="flex-row items-center justify-between gap-3.5">
          <View>
            <Text className="text-xs font-black uppercase mb-1 text-accent">
              Explore
            </Text>
            <Text className="text-[22px] font-black text-textPrimary">
              Reyland Projects
            </Text>
          </View>
          <View className="w-11 h-11 rounded-2xl items-center justify-center bg-tag">
            <Ionicons name="map-outline" size={21} color={AppColors.accent} />
          </View>
        </View>
        <Text className="text-[13px] leading-5 font-semibold mt-2.5 text-textSecondary">
          Browse {totalCount} development{totalCount === 1 ? '' : 's'} by location and project name.
        </Text>
      </View>

      <View className="flex-row items-start justify-between px-[18px] pt-3 pb-3 gap-3">
        <View>
          <Text className="text-[15px] font-black text-textPrimary">
            {searching ? 'Searching…' : `${filteredCount} ${resultLabel} found`}
          </Text>
          {hasActiveSearch && !searching && (
            <Text className="text-xs leading-[18px] font-semibold mt-[3px] text-textMuted">
              Search: {search.trim()}
            </Text>
          )}
          {searchError ? (
            <Text className="text-xs leading-[18px] font-semibold mt-[3px] text-error">
              {searchError}
            </Text>
          ) : null}
        </View>

        {hasActiveSearch && (
          <Pressable
            className="flex-row items-center gap-[5px] px-2.5 py-[7px] rounded-[14px] bg-tag active:opacity-80 active:scale-[0.98]"
            onPress={onClearSearch}
          >
            <Ionicons name="close-circle" size={15} color={AppColors.accent} />
            <Text className="text-xs font-extrabold text-accent">
              Clear
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
});

const EmptyState = React.memo(function EmptyState({
  hasActiveSearch,
  onClearSearch,
}: {
  hasActiveSearch: boolean;
  onClearSearch: () => void;
}) {
  return (
    <View className="items-center mx-[18px] mt-3.5 px-8 py-[34px] rounded-[20px] border border-border bg-surface">
      <View className="w-[54px] h-[54px] rounded-2xl items-center justify-center mb-3 bg-tag">
        <Ionicons name="business-outline" size={28} color={AppColors.accent} />
      </View>
      <Text className="text-base font-black mb-1 text-textPrimary">
        No projects found
      </Text>
      <Text className="text-sm leading-5 text-center font-semibold text-textMuted">
        Try changing your search or checking a nearby location.
      </Text>
      {hasActiveSearch && (
        <Pressable
          className="mt-4 rounded-2xl px-4 py-2.5 bg-accent active:opacity-80 active:scale-[0.98]"
          onPress={onClearSearch}
        >
          <Text className="text-[13px] font-black text-white">
            Clear search
          </Text>
        </Pressable>
      )}
    </View>
  );
});

// ---- Main screen -----------------------------------------------------------

export function DiscoverScreen() {
  const {
    project, loading, error, refreshing, loadingMore,
    hasMore, loadMore, refresh, retry,
  } = useProjects();

  const {
    inputValue: search,
    results: filtered,
    searching,
    searchError,
    setInputValue: setSearch,
    clear: clearSearch,
  } = useProjectSearch({ localProjects: project });

  const hasActiveSearch = search.trim().length > 0;
  const resultLabel = filtered.length === 1 ? 'project' : 'projects';
  const canLoadMore = hasMore && !loadingMore && filtered.length > 0 && !hasActiveSearch;

  // Fix for the empty-state flash:
  // Only declare "empty" once we're not mid-search AND not mid-refresh/load-more,
  // i.e. the list has actually settled. Without the refreshing/loadingMore guard,
  // a transient [] from `filtered` while project/search state is still syncing
  // renders "No projects found" for a frame before real data lands.
  const [showEmptyDebounced, setShowEmptyDebounced] = React.useState(false);
  const rawEmpty = !searching && !refreshing && !loadingMore && filtered.length === 0;

  React.useEffect(() => {
    if (!rawEmpty) {
      setShowEmptyDebounced(false);
      return;
    }
    const t = setTimeout(() => setShowEmptyDebounced(true), 220);
    return () => clearTimeout(t);
  }, [rawEmpty]);

  // showEndMessage is derived once per relevant change, not recomputed inline
  // inside the footer render prop on every FlatList re-render.
  const showEndMessage = filtered.length > 0 && !hasMore && !hasActiveSearch;

  const keyExtractor = useCallback((item: Project) => item.id.toString(), []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Project>) => <ProjectCard project={item} />,
    []
  );

  const handleSearchChange = useCallback((value: string) => setSearch(value), [setSearch]);
  const handleClearSearch = useCallback(() => clearSearch(), [clearSearch]);
  const handleEndReached = useCallback(() => {
    if (canLoadMore) loadMore();
  }, [canLoadMore, loadMore]);

  const listHeader = useMemo(
    () => (
      <ListHeader
        totalCount={project.length}
        resultLabel={resultLabel}
        filteredCount={filtered.length}
        searching={searching}
        hasActiveSearch={hasActiveSearch}
        search={search}
        searchError={searchError}
        onClearSearch={handleClearSearch}
      />
    ),
    [project.length, resultLabel, filtered.length, searching, hasActiveSearch, search, searchError, handleClearSearch]
  );

  const listFooter = useMemo(
    () => (
      <ListFooter
        loadingMore={loadingMore}
        hasActiveSearch={hasActiveSearch}
        showEndMessage={showEndMessage}
      />
    ),
    [loadingMore, hasActiveSearch, showEndMessage]
  );

  const listEmpty = useMemo(
    () =>
      showEmptyDebounced ? (
        <EmptyState hasActiveSearch={hasActiveSearch} onClearSearch={handleClearSearch} />
      ) : null,
    [showEmptyDebounced, hasActiveSearch, handleClearSearch]
  );

  if (loading) return <ProjectsSkeletonScreen />;
  if (error) return <ErrorScreen message={error} onRetry={retry} />;

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      <SafeAreaView edges={['top']} className="bg-surface pt-5">
        <HeaderShell>
          <HeaderSearchBar value={search} onChange={handleSearchChange} />
        </HeaderShell>
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={CONTAINER_STYLE}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0}
        ListFooterComponent={listFooter}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={AppColors.accent} />
        }
        // Memory/perf knobs: bounds the rendered window and recycling batch
        // size so long project lists don't keep every row mounted at once.
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={7}
        initialNumToRender={8}
      />
    </View>
  );
}