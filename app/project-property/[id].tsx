import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useProjectProperties } from '@/hooks/useProjectProperties';
import PropertyCard from '@/components/property-card';

export default function ProjectPropertiesScreen() {
  const { id, name } = useLocalSearchParams<{
    id: string;
    name: string;
  }>();

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
  } = useProjectProperties(Number(id));

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={properties}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PropertyCard property={item} />
      )}
      ListHeaderComponent={
        <View style={{ padding: 16 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '700',
            }}
          >
            {name}
          </Text>

          <Text>
            {properties.length} properties found
          </Text>
        </View>
      }
      onEndReached={() => {
        if (hasMore) {
          loadMore();
        }
      }}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
        />
      }
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator size="small" />
        ) : null
      }
    />
  );
}