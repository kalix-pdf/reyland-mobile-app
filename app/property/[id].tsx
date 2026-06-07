import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { ReduceMotion } from 'react-native-reanimated';
import ReanimatedCarousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { useProperty } from '@/hooks/useProperty';

const { width } = Dimensions.get('window');
const PAGE_PADDING = 15;
const CAROUSEL_HEIGHT = 300;

const STATUS_LABELS: Record<number, string> = {
  0: 'Available',
  1: 'Sold',
  2: 'Reserved',
};

const LOT_TYPE_LABELS: Record<number, string> = {
  0: 'Regular Lot',
  1: 'Corner Lot',
};

type GalleryImage = {
  id: string;
  image_url: string;
  public_id?: string;
};

function formatCurrency(value?: number | null) {
  return `₱${Number(value ?? 0).toLocaleString()}`;
}

function formatCurrencyOrFallback(value?: number | null) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return 'Not specified';
  }

  return formatCurrency(value);
}

function formatNumber(value?: number | null, fallback = 'Not specified') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return fallback;
  }

  return Number(value).toLocaleString();
}

export default function PropertyDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const propertyId = Number(id);
  const { property, loading } = useProperty(propertyId);
  const [activeImage, setActiveImage] = useState(0);

  const galleryImages = useMemo<GalleryImage[]>(() => {
    if (!property) return [];

    const images = [
      {
        id: `cover-${property.public_id || property.id}`,
        image_url: property.image_url,
        public_id: property.public_id,
      },
      ...(property.property_images ?? []).map((image) => ({
        id: `gallery-${image.image_id}-${image.public_id}`,
        image_url: image.image_url,
        public_id: image.public_id,
      })),
    ];

    const seen = new Set<string>();
    return images.filter((image) => {
      if (!image.image_url || seen.has(image.image_url)) return false;
      seen.add(image.image_url);
      return true;
    });
  }, [property]);

  if (!Number.isFinite(propertyId)) {
    return <StateScreen icon="alert-circle-outline" title="Property unavailable" message="This listing could not be opened." />;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.stateText}>Loading property details...</Text>
      </SafeAreaView>
    );
  }

  if (!property) {
    return <StateScreen icon="home-outline" title="Property not found" message="The listing may have been removed or is no longer available." />;
  }

  const statusLabel = STATUS_LABELS[property.status] ?? 'Available';
  const lotTypeLabel = LOT_TYPE_LABELS[property.lot_type] ?? 'Regular Lot';
  const location = property.project?.location?.trim() || 'Location unavailable';
  const projectName = property.project?.project_name?.trim() || 'Reyland property';
  const category = property.category?.trim() || 'Property';
  const totalPrice = property.total_price ?? property.price;
  const yearsToPay = Number(property.years_to_pay ?? 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
        </Pressable>

        <View style={styles.topTitleBlock}>
          <Text style={styles.topTitle}>Property Details</Text>
          <Text style={styles.topSubtitle} numberOfLines={1}>{projectName}</Text>
        </View>

        <View style={styles.backButtonGhost} />
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.carouselSection}>
          <ReanimatedCarousel
            loop={galleryImages.length > 1}
            autoPlay={galleryImages.length > 1}
            autoPlayInterval={3000}
            width={width}
            height={CAROUSEL_HEIGHT}
            data={galleryImages}
            withAnimation={{
              type: 'timing',
              config: {
                duration: 400,
                reduceMotion: ReduceMotion.Never,
              },
            }}
            onProgressChange={(_, absoluteProgress) => {
              if (galleryImages.length === 0) return;
              setActiveImage(Math.round(absoluteProgress) % galleryImages.length);
            }}
            renderItem={({ item }) => (
              <Pressable style={styles.carouselCard}>
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.carouselImage}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={220}
                />
              </Pressable>
            )}
          />

          <View style={styles.carouselMeta}>
            <View style={styles.imageCountPill}>
              <Ionicons name="images-outline" size={14} color={Colors.white} />
              <Text style={styles.imageCountText}>
                {activeImage + 1}/{Math.max(galleryImages.length, 1)}
              </Text>
            </View>

            {galleryImages.length > 1 ? (
              <View style={styles.dots}>
                {galleryImages.map((image, index) => (
                  <View
                    key={image.id}
                    style={[styles.dot, activeImage === index && styles.activeDot]}
                  />
                ))}
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryCopy}>
              <View style={styles.badgeRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{statusLabel}</Text>
                </View>
              </View>

              <Text style={styles.priceLabel}>Total price</Text>
              <Text style={styles.price}>{formatCurrency(totalPrice)}</Text>
              <Text style={styles.title}>{property.title}</Text>
            </View>

            <View style={styles.sidePanel}>
              <Ionicons name="resize-outline" size={20} color={Colors.accent} />
              <Text style={styles.sideValue}>{formatNumber(property.area)}</Text>
              <Text style={styles.sideLabel}>sqm</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <View style={styles.locationIcon}>
              <Ionicons name="location-outline" size={16} color={Colors.accent} />
            </View>
            <Text style={styles.location} numberOfLines={2}>{location}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatItem icon="map-outline" label="Lot Type" value={lotTypeLabel} />
          <StatItem icon="pricetag-outline" label="Lot" value={property.lot || 'N/A'} />
          <StatItem icon="calendar-outline" label="Completion" value={property.date_completed || 'TBA'} />
        </View>

        <Section title="Payment Plan">
          <View style={styles.paymentCard}>
            <View style={styles.monthlyBlock}>
              <View style={styles.monthlyIcon}>
                <Ionicons name="wallet-outline" size={22} color={Colors.white} />
              </View>
              <View style={styles.monthlyCopy}>
                <Text style={styles.monthlyLabel}>Estimated monthly installment</Text>
                <Text style={styles.monthlyValue}>{formatCurrencyOrFallback(property.monthly_installment)}</Text>
              </View>
            </View>

            <View style={styles.breakdownList}>
              <BreakdownRow label="Down payment (Installment)" value={formatCurrencyOrFallback(property.installment_down_payment)} />
              <BreakdownRow
                label="Payment term"
                value={yearsToPay > 0 ? `${yearsToPay} year${yearsToPay === 1 ? '' : 's'} to pay` : 'Not specified'}
                last
              />
            </View>
          </View>
        </Section>

        {property.short_description ? (
          <Section title="Overview">
            <Text style={styles.description}>{property.short_description}</Text>
          </Section>
        ) : null}
      </ScrollView>

      <View style={styles.actionBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Inquire now"
          onPress={() => Alert.alert('Inquiry', 'Inquiry feature coming soon.')}
          style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
          >
          <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.accent} />
          <Text style={styles.secondaryActionText}>Inquire Now</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Schedule visit"
          onPress={() => Alert.alert('Schedule Visit', 'Site visit scheduling coming soon.')}
          style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}
        >
          <Ionicons name="calendar-outline" size={18} color={Colors.white} />
          <Text style={styles.primaryActionText}>Schedule Visit</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function StateScreen({ icon, title, message }: { icon: keyof typeof Ionicons.glyphMap; title: string; message: string }) {
  return (
    <SafeAreaView style={styles.stateContainer}>
      <Ionicons name={icon} size={36} color={icon === 'alert-circle-outline' ? Colors.error : Colors.textMuted} />
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateText}>{message}</Text>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function StatItem({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={18} color={Colors.accent} />
      </View>
      <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function BreakdownRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.breakdownRow, last && styles.lastRow]}>
      <Text style={styles.breakdownLabel}>{label}</Text>
      <Text style={styles.breakdownValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PAGE_PADDING,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.78,
  },
  backButtonGhost: {
    width: 42,
    height: 42,
  },
  topTitleBlock: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  topTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  topSubtitle: {
    marginTop: 3,
    maxWidth: '100%',
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  carouselSection: {
    paddingTop: 4,
    paddingBottom: 14,
  },
  carouselCard: {
    width,
    height: CAROUSEL_HEIGHT,
    paddingHorizontal: PAGE_PADDING,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: Colors.border,
  },
  carouselMeta: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  imageCountPill: {
    position: 'absolute',
    left: PAGE_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  imageCountText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
  },
  activeDot: {
    width: 22,
    backgroundColor: Colors.tagText,
  },
  summaryCard: {
    marginHorizontal: PAGE_PADDING,
    padding: 16,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  summaryCopy: {
    flex: 1,
    minWidth: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.tag,
  },
  categoryText: {
    color: Colors.tagText,
    fontSize: 11,
    fontWeight: '900',
  },
  statusBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },
  statusText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
  priceLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 3,
  },
  price: {
    color: Colors.accent,
    fontSize: 27,
    fontWeight: '900',
  },
  title: {
    marginTop: 7,
    color: Colors.textPrimary,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '900',
  },
  sidePanel: {
    width: 86,
    minHeight: 106,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 18,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sideValue: {
    marginTop: 8,
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '900',
  },
  sideLabel: {
    marginTop: 2,
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
  },
  locationRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  locationIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tag,
  },
  location: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: PAGE_PADDING,
    marginTop: 14,
  },
  statItem: {
    flex: 1,
    minHeight: 98,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tag,
    marginBottom: 7,
  },
  statValue: {
    maxWidth: '100%',
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '900',
  },
  statLabel: {
    marginTop: 4,
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
  },
  section: {
    marginHorizontal: PAGE_PADDING,
    marginTop: 18,
  },
  sectionTitle: {
    marginBottom: 12,
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  paymentCard: {
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  monthlyBlock: {
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: Colors.primary,
  },
  monthlyIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  monthlyCopy: {
    flex: 1,
    minWidth: 0,
  },
  monthlyLabel: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12,
    fontWeight: '800',
  },
  monthlyValue: {
    marginTop: 5,
    color: Colors.white,
    fontSize: 23,
    fontWeight: '900',
  },
  breakdownList: {
    paddingHorizontal: 16,
  },
  breakdownRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  breakdownLabel: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  breakdownValue: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'right',
  },
  description: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 23,
    fontWeight: '600',
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: Colors.background,
  },
  stateTitle: {
    marginTop: 12,
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  stateText: {
    marginTop: 8,
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: PAGE_PADDING,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  secondaryAction: {
    flex: 1,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.accent,
    backgroundColor: Colors.surface,
  },
  primaryAction: {
    flex: 1.1,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 16,
    backgroundColor: Colors.accent,
  },
  secondaryActionText: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '900',
  },
  primaryActionText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '900',
  },
});
