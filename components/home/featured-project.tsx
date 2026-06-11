import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors } from '@/constants/colors';
import { Project, Property } from '@/types';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Image } from 'expo-image';
import { Href, router } from 'expo-router';

interface Props {
  projects: Project[];
  onPress?: (project: Project) => void;
}

export function FeaturedProjectsScroll({ projects, onPress }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {projects.map((project) => (
        <Pressable
          key={project.id}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          onPress={() => onPress?.(project)}
        >
          <Image
            source={{ uri: project.image_url }}
            style={styles.image}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
          />
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {project.project_name}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={15} color={Colors.textMuted} />
              <Text style={styles.location} numberOfLines={1}>
                {project.location}
              </Text>
            </View>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

interface FeaturedPropertiesProps {
  properties: Property[];
}

const STATUS_LABELS: Record<Property['status'], string> = {
  0: 'Available',
  1: 'Sold',
  2: 'Reserved',
};

function formatPrice(value?: number | null) {
  const price = Number(value ?? 0);

  if (price >= 1_000_000) {
    return `₱${(price / 1_000_000).toFixed(1)}M`;
  }

  return `₱${price.toLocaleString()}`;
}

export function FeaturedPropertiesScroll({ properties }: FeaturedPropertiesProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {properties.map((property) => {
        const location = property.project?.location?.trim() || 'Location unavailable';
        const totalPrice = property.total_price ?? Number(property.price ?? 0) * Number(property.area ?? 0);

        return (
          <Pressable
            key={property.id}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            onPress={() =>
              router.push({
                pathname: '/property/[id]',
                params: { id: property.id.toString() },
              } as unknown as Href)
            }
          >
            <Image
              source={{ uri: property.image_url }}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
            />
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{STATUS_LABELS[property.status] ?? 'Available'}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.price}>{formatPrice(totalPrice)}</Text>
              <Text style={styles.name} numberOfLines={1}>
                {property.title}
              </Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={15} color={Colors.textMuted} />
                <Text style={styles.location} numberOfLines={1}>
                  {location}
                </Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: 17,
    paddingBottom: 16, 
    paddingRight: 4,   
  },
  card: {
    width: 180,
    borderRadius: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 10 },
    shadowOpacity: 0.10,
    elevation: 10,            
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  image: {
    borderRadius: 18,
    width: '100%',
    height: 160,
  },
  statusPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 23, 28, 0.74)',
  },
  statusText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
  info: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    gap: 3,
  },
  price: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: '900',
  },
  name: {
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  location: {
    fontSize: 14,
    color: Colors.textMuted,
    flex: 1,
  },
});
