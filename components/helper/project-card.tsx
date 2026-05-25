import { Colors } from '@/constants/colors';
import { Property } from '@/types/property.types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { createHomeDashboardStyles } from '../../styles/dashboard.styles';

const styles = createHomeDashboardStyles(Colors);

// ─── Sub-components for home dashboard ───────────────────────────────────────────────────────────
export const ProjectCard = React.memo(({ property }: { property: Property }) => (
  <Pressable
    style={({ pressed }) => [styles.projectCard, pressed && styles.pressed]}
    onPress={() => router.push({ pathname: '/property/[id]', params: { id: property.id } })}
  >
    <Image
      source={{ uri: property.image_url }}
      style={styles.projectImage}
      contentFit="cover"
      cachePolicy="memory-disk"
      priority="normal"
      transition={200}
    />
    <View style={styles.projectContent}>
      <View style={styles.projectBadge}>
        <Text style={styles.projectBadgeText}>{property.category}</Text>
      </View>
      <Text style={styles.projectName} numberOfLines={1}>
        {property.title}
      </Text>
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={14} color={Colors.accent} />
        <Text style={styles.locationText} numberOfLines={1}>
          {property.location}
        </Text>
      </View>
      <View style={styles.projectFooter}>
        <Text style={styles.projectMeta}>
          {property.area} SQM • {property.units} Units
        </Text>
        <View style={styles.reservePill}>
          <Text style={styles.reservePillText}>Reserve</Text>
        </View>
      </View>
    </View>
  </Pressable>
));
