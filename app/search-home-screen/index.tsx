import ProjectCard from '@/components/project-card';
import PropertyCard from '@/components/property-card';
import { Colors } from '@/constants/colors';
import {
  searchProject_and_Properties,
  type SearchProjectAndPropertiesResult,
} from '@/services/fetchData/search.service';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const emptyResults: SearchProjectAndPropertiesResult = {
  projects: { data: [], pagination: null },
  properties: { data: [], pagination: null },
};

export default function SearchHomeScreen() {
  const insets = useSafeAreaInsets();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const routeQuery = useMemo(() => (q ?? '').trim(), [q]);

  const [inputValue, setInputValue] = useState(routeQuery);
  const [results, setResults] = useState<SearchProjectAndPropertiesResult>(emptyResults);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(
    async (query: string, signal?: AbortSignal, refresh = false) => {
      const trimmed = query.trim();
      if (!trimmed) {
        setResults(emptyResults);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await searchProject_and_Properties({
          query: trimmed,
          signal: signal ?? new AbortController().signal,
        });

        setResults(response ?? emptyResults);
      } catch (err) {
        const errorName = err instanceof Error ? err.name : '';
        if (errorName === 'AbortError' || errorName === 'CanceledError') return;
        setError('Search failed. Please try again.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    setInputValue(routeQuery);

    const controller = new AbortController();
    runSearch(routeQuery, controller.signal);

    return () => controller.abort();
  }, [routeQuery, runSearch]);

  const handleSubmit = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    router.setParams({ q: trimmed });
  }, [inputValue]);

  const handleRefresh = useCallback(() => {
    runSearch(routeQuery, undefined, true);
  }, [routeQuery, runSearch]);

  const projects = results.projects.data;
  const properties = results.properties.data;
  const totalProjects = results.projects.pagination?.total ?? projects.length;
  const totalProperties = results.properties.pagination?.total ?? properties.length;
  const hasResults = projects.length > 0 || properties.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['left', 'right']}>
      <View
        className="px-[18px] pb-[14px] bg-surface border-b border-border"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center gap-3 mb-[14px]">
          <Pressable
            className="w-10 h-10 rounded-full items-center justify-center bg-surfaceMuted active:opacity-80"
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
          </Pressable>

          <View className="flex-1">
            <Text className="text-xl font-black text-textPrimary">Search results</Text>
            <Text className="mt-0.5 text-[13px] font-bold text-textSecondary" numberOfLines={1}>
              {routeQuery || 'Enter a search term'}
            </Text>
          </View>
        </View>

        <View className="min-h-[46px] flex-row items-center gap-2 border border-border rounded-2xl px-[14px] bg-background">
          <Feather name="search" size={16} color={Colors.textMuted} />
          <TextInput
            className="flex-1 min-h-[44px] text-sm font-bold text-textPrimary"
            placeholder="Search by title or location"
            placeholderTextColor={Colors.textMuted}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
          />
          {inputValue.length > 0 ? (
            <Pressable onPress={() => setInputValue('')} hitSlop={8} accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pt-4 pb-8"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.accentDark}
          />
        }
      >
        {loading ? (
          <View className="min-h-[360px] items-center justify-center px-7">
            <ActivityIndicator color={Colors.accent} />
            <Text className="mt-2 text-sm leading-5 font-bold text-textSecondary text-center">
              Searching listings
            </Text>
          </View>
        ) : error ? (
          <View className="min-h-[360px] items-center justify-center px-7">
            <Ionicons name="alert-circle-outline" size={28} color={Colors.error} />
            <Text className="mt-3 text-lg font-black text-textPrimary text-center">
              Unable to search
            </Text>
            <Text className="mt-2 text-sm leading-5 font-bold text-textSecondary text-center">
              {error}
            </Text>
            <Pressable
              className="mt-[18px] px-[18px] py-[11px] rounded-2xl bg-accent active:opacity-80"
              onPress={handleRefresh}
            >
              <Text className="text-white font-black">Try again</Text>
            </Pressable>
          </View>
        ) : !hasResults ? (
          <View className="min-h-[360px] items-center justify-center px-7">
            <Ionicons name="search-outline" size={30} color={Colors.textMuted} />
            <Text className="mt-3 text-lg font-black text-textPrimary text-center">
              No results found
            </Text>
            <Text className="mt-2 text-sm leading-5 font-bold text-textSecondary text-center">
              Try another project, property, or location.
            </Text>
          </View>
        ) : (
          <>
            <View className="flex-row items-center gap-2 mx-[18px] mb-4">
              <Text className="text-[13px] font-extrabold text-textSecondary">
                {totalProjects} projects
              </Text>
              <View className="w-1 h-1 rounded-full bg-textMuted" />
              <Text className="text-[13px] font-extrabold text-textSecondary">
                {totalProperties} properties
              </Text>
            </View>

            {projects.length > 0 ? (
              <View className="mb-2">
                <Text className="mx-[18px] mb-2.5 text-lg font-black text-textPrimary">
                  Projects
                </Text>
                {projects.map((project) => (
                  <ProjectCard key={`project-${project.id}`} project={project} />
                ))}
              </View>
            ) : null}

            {properties.length > 0 ? (
              <View className="mb-2">
                <Text className="mx-[18px] mb-2.5 text-lg font-black text-textPrimary">
                  Properties
                </Text>
                {properties.map((property) => (
                  <PropertyCard key={`property-${property.id}`} property={property} />
                ))}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}