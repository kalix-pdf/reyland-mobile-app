import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { Colors } from '@/constants/colors';
import { useProperty } from '@/hooks/useProperty';

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { property, loading } = useProperty(Number(id));

  if (loading || !property) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: property.image_url }}
        style={styles.heroImage}
      />

      <View style={styles.content}>
        <Text style={styles.price}>
          ₱{Number(property.price || 0).toLocaleString()}
        </Text>

        <Text style={styles.title}>
          {property.title}
        </Text>

        <Text style={styles.location}>
          {property.project?.location}
        </Text>

        <View style={styles.stats}>
          <Text>{property.units} Units</Text>
          <Text>{property.area} sqm</Text>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroImage: {
    width: '100%',
    height: 320,
  },
  content: {
    padding: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.accent,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  location: {
    marginTop: 6,
    color: Colors.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
  },
  sectionTitle: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    marginTop: 8,
    lineHeight: 24,
  },
});