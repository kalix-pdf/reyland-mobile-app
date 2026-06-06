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
  StyleSheet,
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
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.topRow}>
          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
          </Pressable>

          <View style={styles.titleBlock}>
            <Text style={styles.title}>Search results</Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {routeQuery || 'Enter a search term'}
            </Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <Feather name="search" size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
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
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.accentDark}
          />
        }
      >
        {loading ? (
          <View style={styles.stateBlock}>
            <ActivityIndicator color={Colors.accent} />
            <Text style={styles.stateText}>Searching listings</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBlock}>
            <Ionicons name="alert-circle-outline" size={28} color={Colors.error} />
            <Text style={styles.stateTitle}>Unable to search</Text>
            <Text style={styles.stateText}>{error}</Text>
            <Pressable style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]} onPress={handleRefresh}>
              <Text style={styles.actionText}>Try again</Text>
            </Pressable>
          </View>
        ) : !hasResults ? (
          <View style={styles.stateBlock}>
            <Ionicons name="search-outline" size={30} color={Colors.textMuted} />
            <Text style={styles.stateTitle}>No results found</Text>
            <Text style={styles.stateText}>Try another project, property, or location.</Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>{totalProjects} projects</Text>
              <View style={styles.summaryDot} />
              <Text style={styles.summaryText}>{totalProperties} properties</Text>
            </View>

            {projects.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Projects</Text>
                {projects.map((project) => (
                  <ProjectCard key={`project-${project.id}`} project={project} />
                ))}
              </View>
            ) : null}

            {properties.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Properties</Text>
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 18,
    paddingBottom: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceMuted,
  },
  pressed: {
    opacity: 0.82,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  searchRow: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: Colors.background,
  },
  searchInput: {
    flex: 1,
    minHeight: 44,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 18,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  summaryDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textMuted,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginHorizontal: 18,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  stateBlock: {
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  stateTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  stateText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: Colors.accent,
  },
  actionText: {
    color: Colors.white,
    fontWeight: '900',
  },
});
