import { Colors } from '@/constants/colors';
import { useProjects } from '@/context/project.context';
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
import ProjectCard from '../project-card';
import { Header } from './header';

export function DiscoverScreen() {
  const styles = createPropertiesScreenStyles(Colors);

  const {
    project,
    filtered,
    loading,
    error,
    refreshing,
    loadingMore,
    hasMore,
    search,
    setSearch,
    loadMore,
    refresh,
    retry,
  } = useProjects();

  const hasActiveSearch = search.trim().length > 0;
  const resultLabel = filtered.length === 1 ? 'project' : 'projects';
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
        renderItem={({ item }) => <ProjectCard project={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={canLoadMore ? loadMore : undefined}
        onEndReachedThreshold={0.35}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color={Colors.accent} />
              <Text style={styles.loadingMoreText}>Loading more projects</Text>
            </View>
          ) : filtered.length > 0 && !hasMore ? (
            <Text style={styles.endText}>You have reached the end</Text>
          ) : null
        }
        ListHeaderComponent={
          <View>
            <View style={styles.summaryCard}>
              <View style={styles.summaryTopRow}>
                <View>
                  <Text style={styles.summaryLabel}>Discover</Text>
                  <Text style={styles.summaryTitle}>Reyland Projects</Text>
                </View>
                <View style={styles.summaryIcon}>
                  <Ionicons name="map-outline" size={21} color={Colors.accent} />
                </View>
              </View>
              <Text style={styles.summaryText}>
                Browse {project.length} development{project.length === 1 ? '' : 's'} by location and project name.
              </Text>
            </View>

            <View style={styles.subHeader}>
              <View>
                <Text style={styles.resultCount}>
                  {filtered.length} {resultLabel} found
                </Text>
                {hasActiveSearch && (
                  <Text style={styles.resultContext}>
                    Search: {search.trim()}
                  </Text>
                )}
              </View>

              {hasActiveSearch && (
                <Pressable
                  style={({ pressed }) => [styles.clearBtn, pressed && styles.chipPressed]}
                  onPress={() => {
                    setSearch('');
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
              <Ionicons name="business-outline" size={28} color={Colors.accent} />
            </View>
            <Text style={styles.emptyTitle}>No projects found</Text>
            <Text style={styles.emptyText}>
              Try changing your search or checking a nearby location.
            </Text>
            {hasActiveSearch && (
              <Pressable
                style={({ pressed }) => [styles.emptyButton, pressed && styles.chipPressed]}
                onPress={() => {
                  setSearch('');
                }}
              >
                <Text style={styles.emptyButtonText}>Clear search</Text>
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
