import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Property } from '../types/property.types';

type Props = {
  property: Property;
};

const STATUS_LABELS: Record<Property['status'], string> = {
  0: 'Available',
  1: 'Sold',
  2: 'Reserved',
};

function PropertyCard({ property }: Props) {
  const router = useRouter();
  const location = property.project?.location?.trim() || 'Location unavailable';
  const statusLabel = STATUS_LABELS[property.status] ?? 'Available';

  const formatPrice = (price: number, type: string) => {
    if (price >= 1_000_000) {
      return `₱${(price / 1_000_000).toFixed(1)}M`;
    }
    return `₱${price.toLocaleString()}${type === 'For Rent' ? '/mo' : ''}`;
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push({ pathname: '/property/[id]', params: { id: property.id } } as unknown as Href)}
    >
      <Image source={{ uri: property.image_url }} style={styles.image} />

      <View style={styles.badgeRow}>
        <View style={[styles.badge, property.category === 'For Rent' ? styles.rentBadge : styles.saleBadge]}>
          <Text style={[styles.badgeText, property.category === 'For Rent' ? styles.rentBadgeText : styles.saleBadgeText]}>
            {property.category}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.price}>{formatPrice(property.price, property.category)}</Text>
            <Text style={styles.title} numberOfLines={2}>
              {property.title}
            </Text>
          </View>
          <View style={styles.openButton}>
            <Ionicons name="chevron-forward" size={18} color={Colors.accent} />
          </View>
        </View>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={14} color={Colors.accent} />
          <Text style={styles.address} numberOfLines={1}>
            {location}
          </Text>
        </View>

        <View style={styles.specs}>
          <View style={styles.spec}>
            <Ionicons name="bed-outline" size={14} color={Colors.textSecondary} style={styles.specIcon} />
            <Text style={styles.specText}>{property.units} Units</Text>
          </View>
          <View style={styles.specDivider} />
          <View style={styles.spec}>
            <Ionicons name="resize-outline" size={14} color={Colors.textSecondary} style={styles.specIcon} />
            <Text style={styles.specText}>{property.area} sqm</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default React.memo(PropertyCard);

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
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 23, 28, 0.74)',
  },
  statusText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
  rentBadge: { backgroundColor: Colors.rentBadge },
  saleBadge: { backgroundColor: Colors.saleBadge },
  badgeText: { fontSize: 11, fontWeight: '900' },
  rentBadgeText: { color: Colors.rentBadgeText },
  saleBadgeText: { color: Colors.saleBadgeText },
  content: { padding: 16 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleBlock: {
    flex: 1,
  },
  price: {
    fontSize: 21,
    fontWeight: '900',
    color: Colors.accent,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
    lineHeight: 23,
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
  specs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  spec: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  specIcon: { marginRight: 5 },
  specText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  specDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
});
