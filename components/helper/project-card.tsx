import { Colors } from '@/constants/colors';
import type { Project } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { createHomeDashboardStyles } from '../../styles/dashboard.styles';

const styles = createHomeDashboardStyles(Colors);

// ─── Sub-components for home dashboard ───────────────────────────────────────────────────────────
// eslint-disable-next-line react/display-name
export const ProjectCard = React.memo(({ project }: { project: Project }) => (
  <Pressable
    style={({ pressed }) => [styles.projectCard, pressed && styles.pressed]}
    onPress={() => router.push({ pathname: '/property/[id]', params: { id: project.id } })}
  >
    <Image
      source={{ uri: project.image_url }}
      style={styles.projectImage}
      contentFit="cover"
      cachePolicy="memory-disk"
      priority="normal"
      transition={200}
    />
    <View style={styles.projectContent}>
      <Text style={styles.projectName} numberOfLines={1}>
        {project.project_name}
      </Text>
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={14} color={Colors.accent} />
        <Text style={styles.locationText} numberOfLines={1}>
          {project.location ?? 'Location unavailable'}
        </Text>
      </View>
      <View style={styles.projectFooter}>
        <Text style={styles.projectMeta}>
          {project.status} 
        </Text>
        <View style={styles.reservePill}>
          <Text style={styles.reservePillText}>Reserve</Text>
        </View>
      </View>
    </View>
  </Pressable>
));
