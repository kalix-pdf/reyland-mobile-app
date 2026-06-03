import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors } from '@/constants/colors';
import { Project } from '@/types';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Image } from 'expo-image';

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
  info: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    gap: 3,
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