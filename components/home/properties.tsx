import PropertyCard from '@/components/property-card';
import { Colors } from '@/constants/colors';
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
import { useProperties, FILTERS } from '@/context/properties.context';

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
        
        <View style={styles.filters}>
          {FILTERS.map((f) => {
            const active = activeFilter === f;
            return (
              <Pressable
                key={f}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PropertyCard property={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" style={{ marginVertical: 25 }} />
          ) : null
        }
        ListHeaderComponent={
          <View style={styles.subHeader}>
            <Text style={styles.resultCount}>
              {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found
            </Text>
            <Pressable style={styles.sortBtn}>
              <Ionicons name="options-outline" size={15} color={Colors.accent} />
              <Text style={styles.sortText}>Filter</Text>
            </Pressable>
          </View>
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
            onRefresh={refresh}
            tintColor={Colors.accent}
          />
        }
      />
    </View>
  );
}