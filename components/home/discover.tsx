import { useProjects } from '@/context/project.context';
import { useProjectSearch } from '@/hooks/use-project-search';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator, FlatList, Pressable, RefreshControl,
  StatusBar, Text, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderSearchBar, HeaderShell } from '../header';
import { ErrorScreen } from '../helper/error-project';
import { ProjectsSkeletonScreen } from '../helper/skeleton';
import ProjectCard from '../project-card';

import AppColors from '@/tailwind.colors';

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

  if (loading) return <ProjectsSkeletonScreen />;
  if (error) return <ErrorScreen message={error} onRetry={retry} />;

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      <SafeAreaView edges={['top']} className="bg-surface">
        <HeaderShell>
          <HeaderSearchBar value={search} onChange={setSearch} />
        </HeaderShell>
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProjectCard project={item} />}
        contentContainerClassName="pb-[104px]"
        showsVerticalScrollIndicator={false}
        onEndReached={canLoadMore ? loadMore : undefined}
        onEndReachedThreshold={0}
        ListFooterComponent={
          loadingMore && !hasActiveSearch ? (
            <View className="flex-row items-center justify-center gap-2 py-[22px]">
              <ActivityIndicator size="small" color={AppColors.accent} />
              <Text className="text-xs font-bold text-textMuted">
                Loading more projects
              </Text>
            </View>
          ) : filtered.length > 0 && !hasMore && !hasActiveSearch ? (
            <Text className="text-xs font-bold text-center py-[18px] text-textMuted">
              You have reached the end
            </Text>
          ) : null
        }
        ListHeaderComponent={
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
                Browse {project.length} development{project.length === 1 ? '' : 's'} by location and project name.
              </Text>
            </View>

            <View className="flex-row items-start justify-between px-[18px] pt-3 pb-3 gap-3">
              <View>
                <Text className="text-[15px] font-black text-textPrimary">
                  {searching ? 'Searching…' : `${filtered.length} ${resultLabel} found`}
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
                  onPress={clearSearch}
                >
                  <Ionicons name="close-circle" size={15} color={AppColors.accent} />
                  <Text className="text-xs font-extrabold text-accent">
                    Clear
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          !searching ? (
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
                  onPress={clearSearch}
                >
                  <Text className="text-[13px] font-black text-white">
                    Clear search
                  </Text>
                </Pressable>
              )}
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={AppColors.accent} />
        }
      />
    </View>
  );
}