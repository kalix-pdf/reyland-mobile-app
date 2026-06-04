import type { Project } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';

type Props = {
  project: Project;
};

function ProjectCard({ project }: Props) {
  const router = useRouter();
  const location = project.location?.trim() || 'Location unavailable';
  const completionLabel = project.date_completed?.trim() || 'Completion TBA';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() =>
        router.push({
          pathname: '/project-property/[id]',
          params: {
            id: project.id.toString(),
            name: project.project_name,
          },
        })
      }
    >
      <Image source={{ uri: project.image_url }} style={styles.image} />

      <View style={styles.badgeRow}>
        {project.is_featured ? (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={11} color={Colors.accent} />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={2}>
              {project.project_name}
            </Text>
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={14} color={Colors.accent} />
              <Text style={styles.address} numberOfLines={1}>
                {location}
              </Text>
            </View>
          </View>

          <View style={styles.openButton}>
            <Ionicons name="chevron-forward" size={18} color={Colors.accent} />
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {completionLabel}
            </Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="home-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>View properties</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default React.memo(ProjectCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    marginHorizontal: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },
  image: {
    width: '100%',
    height: 190,
    backgroundColor: Colors.border,
  },
  badgeRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.tag,
  },
  featuredText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '900',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  openButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tag,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    marginBottom: 14,
  },
  address: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  metaText: {
    flexShrink: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
});
