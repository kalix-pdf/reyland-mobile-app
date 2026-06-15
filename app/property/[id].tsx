import { HeaderNav, HeaderShell, HomeAction } from '@/components/header';
import {
  PropertyBreakdownRow as BreakdownRow,
  PropertyInquiryField as InquiryField,
  PropertySection as Section,
  PropertyStateScreen as StateScreen,
  PropertyStatItem as StatItem,
} from '@/components/property-details-components';
import { useAuth } from '@/context/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { ReduceMotion } from 'react-native-reanimated';
import ReanimatedCarousel from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import {
  CAROUSEL_HEIGHT,
  propertyDetailsStyles as styles,
  PROPERTY_SCREEN_WIDTH as width,
} from '@/styles/property.styles';
import { useProperty } from '@/hooks/useProperty';
import {
  addInquiry,
  fetchActivePropertyInquiry,
  InquiryApiError,
} from '@/services/inquiries/inquiry.api';


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

function isValidMobilePhone(value: string) {
  if (!/^[+()\d\s-]{7,20}$/.test(value)) return false;

  const digits = value.replace(/\D/g, '');
  return (
    (digits.length === 11 && digits.startsWith('09')) ||
    (digits.length === 12 && digits.startsWith('639'))
  );
}

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const propertyId = Number(id);
  const {
    property,
    loading,
    refreshing,
    refresh,
  } = useProperty(propertyId);
  const [activeImage, setActiveImage] = useState(0);
  const [inquiryVisible, setInquiryVisible] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [checkingInquiry, setCheckingInquiry] = useState(false);
  const [hasActiveInquiry, setHasActiveInquiry] = useState(false);

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

  useEffect(() => {
    setInquiryName(user?.name ?? '');
    setInquiryEmail(user?.email ?? '');
    setInquiryPhone(user?.phone ?? '');

    if (property?.title) {
      setInquiryMessage(`Hi, I would like to inquire about ${property.title}.`);
    }
  }, [property?.title, user?.email, user?.name, user?.phone]);

  useEffect(() => {
    let cancelled = false;

    const checkActiveInquiry = async () => {
      if (!property?.id || !user?.uuid) {
        setHasActiveInquiry(false);
        return;
      }

      try {
        setCheckingInquiry(true);
        const activeInquiry = await fetchActivePropertyInquiry(property.id);

        if (!cancelled) {
          setHasActiveInquiry(Boolean(activeInquiry));
        }
      } catch {
        if (!cancelled) {
          setHasActiveInquiry(false);
        }
      } finally {
        if (!cancelled) {
          setCheckingInquiry(false);
        }
      }
    };

    checkActiveInquiry();

    return () => {
      cancelled = true;
    };
  }, [property?.id, user?.uuid]);

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
  // const projectName = property.project?.project_name?.trim() || 'Reyland property';
  const category = property.category?.trim() || 'Property';
  const totalPrice = property.total_price ?? property.price;
  const yearsToPay = Number(property.years_to_pay ?? 0);
  const amenities = (property.amenities ?? []).filter((amenity) => amenity.trim().length > 0);
  const trimmedInquiryName = inquiryName.trim();
  const trimmedInquiryEmail = inquiryEmail.trim();
  const trimmedInquiryPhone = inquiryPhone.trim();
  const inquiryPhoneIsInvalid =
    trimmedInquiryPhone.length > 0 && !isValidMobilePhone(trimmedInquiryPhone);
  const inquirySubmitDisabled =
    submittingInquiry ||
    trimmedInquiryName.length === 0 ||
    trimmedInquiryPhone.length === 0 ||
    inquiryPhoneIsInvalid;

  const handleSubmitInquiry = async () => {
    if (!trimmedInquiryName) {
      Alert.alert('Name required', 'Please enter your name so our team knows who to contact.');
      return;
    }

    if (!trimmedInquiryPhone) {
      Alert.alert('Phone required', 'Please enter your mobile number.');
      return;
    }

    if (inquiryPhoneIsInvalid) {
      Alert.alert(
        'Invalid mobile number',
        'Please enter a valid Philippine mobile number like 09171234567 or +639171234567.',
      );
      return;
    }

    try {
      setSubmittingInquiry(true);

      await addInquiry({
        property_id: property.id,
        name: trimmedInquiryName,
        email: trimmedInquiryEmail || null,
        phone: trimmedInquiryPhone || null,
        message: inquiryMessage.trim() || null,
      });

      setHasActiveInquiry(true);
      setInquiryVisible(false);
      Alert.alert(
        'Inquiry sent',
        'Your inquiry has been submitted. Our team will contact you soon.',
      );
    } catch (error) {
      if (error instanceof InquiryApiError && error.statusCode === 409) {
        setHasActiveInquiry(true);
        Alert.alert(
          'Inquiry already active',
          'You already have an active inquiry for this property. Our team will contact you soon.',
        );
        return;
      }

      Alert.alert(
        'Unable to send inquiry',
        error instanceof Error ? error.message : 'Please try again in a moment.',
      );
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <HeaderShell transparent>
        <HeaderNav title='Property Details' rightAction={<HomeAction />} />
      </HeaderShell>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
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

        {amenities.length > 0 ? (
          <Section title="Amenities">
            <View style={styles.amenitiesCard}>
              {amenities.map((amenity) => (
                <View key={amenity} style={styles.amenityChip}>
                  <View style={styles.amenityIcon}>
                    <Ionicons name="checkmark" size={13} color={Colors.white} />
                  </View>
                  <Text style={styles.amenityText} numberOfLines={2}>{amenity}</Text>
                </View>
              ))}
            </View>
          </Section>
        ) : null}

        {property.short_description ? (
          <Section title="Overview">
            <Text style={styles.description}>{property.short_description}</Text>
          </Section>
        ) : null}
      </ScrollView>

      <View style={styles.actionBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            checkingInquiry
              ? 'Checking inquiry status'
              : hasActiveInquiry
                ? 'Inquiry already sent'
                : 'Inquire now'
          }
          onPress={() => {
            if (checkingInquiry) return;

            if (hasActiveInquiry) {
              Alert.alert(
                'Inquiry already active',
                'You already have an active inquiry for this property. Our team will contact you soon.',
              );
              return;
            }

            setInquiryVisible(true);
          }}
          disabled={checkingInquiry}
          style={({ pressed }) => [
            styles.secondaryAction,
            hasActiveInquiry && styles.activeInquiryAction,
            checkingInquiry && styles.disabledButton,
            pressed && styles.pressed,
          ]}
          >
          <Ionicons
            name={hasActiveInquiry ? 'checkmark-circle-outline' : 'chatbubble-ellipses-outline'}
            size={18}
            color={Colors.accent}
          />
          <Text style={styles.secondaryActionText}>
            {checkingInquiry ? 'Checking...' : hasActiveInquiry ? 'Inquiry Sent' : 'Inquire Now'}
          </Text>
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

      <Modal
        visible={inquiryVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setInquiryVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalRoot}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setInquiryVisible(false)} />

          <View style={styles.inquirySheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.inquiryHeader}>
              <View style={styles.inquiryIcon}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.accent} />
              </View>
              <View style={styles.inquiryHeaderCopy}>
                <Text style={styles.inquiryTitle}>Inquire about this property</Text>
                <Text style={styles.inquirySubtitle} numberOfLines={1}>
                  {property.title}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close inquiry form"
                hitSlop={10}
                onPress={() => setInquiryVisible(false)}
                style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
              >
                <Ionicons name="close" size={20} color={Colors.textMuted} />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.inquiryForm}
            >
              <InquiryField
                label="Full name"
                value={inquiryName}
                onChangeText={setInquiryName}
                placeholder="Juan Dela Cruz"
                autoCapitalize="words"
              />
              <InquiryField
                label="Email"
                value={inquiryEmail}
                onChangeText={setInquiryEmail}
                placeholder="name@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <InquiryField
                label="Phone"
                value={inquiryPhone}
                onChangeText={setInquiryPhone}
                placeholder="09xx xxx xxxx"
                keyboardType="phone-pad"
              />
              <InquiryField
                label="Message"
                value={inquiryMessage}
                onChangeText={setInquiryMessage}
                placeholder="Tell us what you want to know"
                multiline
                inputStyle={styles.messageInput}
              />
            </ScrollView>

            <View style={styles.inquiryActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setInquiryVisible(false)}
                disabled={submittingInquiry}
                style={({ pressed }) => [
                  styles.cancelInquiryButton,
                  pressed && styles.pressed,
                  submittingInquiry && styles.disabledButton,
                ]}
              >
                <Text style={styles.cancelInquiryText}>Cancel</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: inquirySubmitDisabled }}
                onPress={inquirySubmitDisabled ? undefined : handleSubmitInquiry}
                disabled={inquirySubmitDisabled}
                style={({ pressed }) => [
                  styles.submitInquiryButton,
                  inquirySubmitDisabled && styles.submitInquiryButtonDisabled,
                  inquirySubmitDisabled && styles.disabledButton,
                  pressed && !inquirySubmitDisabled && styles.pressed,
                ]}
              >
                {submittingInquiry ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text
                    style={[
                      styles.submitInquiryText,
                      inquirySubmitDisabled && styles.submitInquiryTextDisabled,
                    ]}
                  >
                    Submit Inquiry
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

