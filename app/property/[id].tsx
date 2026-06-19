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
import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';
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
import { useProperty } from '@/hooks/useProperty';
import {
  addInquiry,
  fetchActivePropertyInquiry,
  InquiryApiError,
} from '@/services/inquiries/inquiry.api';
import {
  CAROUSEL_HEIGHT,
  propertyDetailsStyles as styles,
  PROPERTY_SCREEN_WIDTH as width,
} from '@/styles/property.styles';


const STATUS_LABELS: Record<number, string> = {
  0: 'Available',
  1: 'Sold',
  2: 'Reserved',
};

const LOT_TYPE_LABELS: Record<number, string> = {
  0: 'Regular Lot',
  1: 'Corner Lot',
};

const MONTH_OPTIONS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const TIME_PERIOD_OPTIONS = ['AM', 'PM'];
const HOUR_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);
const MINUTE_OPTIONS = Array.from({ length: 12 }, (_, index) => index * 5);
const PICKER_OPTION_HEIGHT = 42;

type VisitDateParts = {
  month: number;
  day: number;
  year: number;
};

type VisitTimeParts = {
  hour: number;
  minute: number;
  period: string;
};

type SchedulePicker = 'date' | 'time' | null;

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

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function createYearOptions() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, index) => currentYear + index);
}

function createInitialVisitDateParts(): VisitDateParts {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    month: tomorrow.getMonth(),
    day: tomorrow.getDate(),
    year: tomorrow.getFullYear(),
  };
}

function formatVisitDate(parts: VisitDateParts) {
  return `${MONTH_OPTIONS[parts.month]} ${parts.day}, ${parts.year}`;
}

function formatVisitTime(parts: VisitTimeParts) {
  return `${parts.hour}:${String(parts.minute).padStart(2, '0')} ${parts.period}`;
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
  const [scheduleVisitVisible, setScheduleVisitVisible] = useState(false);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [schedulePickerVisible, setSchedulePickerVisible] = useState<SchedulePicker>(null);
  const [visitDateParts, setVisitDateParts] = useState(createInitialVisitDateParts);
  const [draftVisitDateParts, setDraftVisitDateParts] = useState(createInitialVisitDateParts);
  const [visitTimeParts, setVisitTimeParts] = useState<VisitTimeParts>({
    hour: 10,
    minute: 0,
    period: 'AM',
  });
  const [draftVisitTimeParts, setDraftVisitTimeParts] = useState<VisitTimeParts>({
    hour: 10,
    minute: 0,
    period: 'AM',
  });
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [checkingInquiry, setCheckingInquiry] = useState(false);
  const [hasActiveInquiry, setHasActiveInquiry] = useState(false);
  const monthPickerRef = useRef<ScrollView>(null);
  const dayPickerRef = useRef<ScrollView>(null);
  const yearPickerRef = useRef<ScrollView>(null);
  const hourPickerRef = useRef<ScrollView>(null);
  const minutePickerRef = useRef<ScrollView>(null);
  const periodPickerRef = useRef<ScrollView>(null);

  const visitYearOptions = useMemo(() => createYearOptions(), []);
  const visitDayOptions = useMemo(
    () => Array.from(
      { length: getDaysInMonth(draftVisitDateParts.month, draftVisitDateParts.year) },
      (_, index) => index + 1,
    ),
    [draftVisitDateParts.month, draftVisitDateParts.year],
  );
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

  const scrollPickerColumnToIndex = (
    ref: RefObject<ScrollView | null>,
    index: number,
    animated = true,
  ) => {
    requestAnimationFrame(() => {
      ref.current?.scrollTo({
        y: Math.max(index, 0) * PICKER_OPTION_HEIGHT,
        animated,
      });
    });
  };

  const getPickerIndexFromOffset = (offsetY: number, maxIndex: number) => {
    return Math.min(
      Math.max(Math.round(offsetY / PICKER_OPTION_HEIGHT), 0),
      maxIndex,
    );
  };

  useEffect(() => {
    if (schedulePickerVisible === 'date') {
      scrollPickerColumnToIndex(monthPickerRef, draftVisitDateParts.month, false);
      scrollPickerColumnToIndex(dayPickerRef, draftVisitDateParts.day - 1, false);
      scrollPickerColumnToIndex(
        yearPickerRef,
        visitYearOptions.indexOf(draftVisitDateParts.year),
        false,
      );
    }

    if (schedulePickerVisible === 'time') {
      scrollPickerColumnToIndex(hourPickerRef, draftVisitTimeParts.hour - 1, false);
      scrollPickerColumnToIndex(
        minutePickerRef,
        MINUTE_OPTIONS.indexOf(draftVisitTimeParts.minute),
        false,
      );
      scrollPickerColumnToIndex(
        periodPickerRef,
        TIME_PERIOD_OPTIONS.indexOf(draftVisitTimeParts.period),
        false,
      );
    }
  }, [
    draftVisitDateParts.day,
    draftVisitDateParts.month,
    draftVisitDateParts.year,
    draftVisitTimeParts.hour,
    draftVisitTimeParts.minute,
    draftVisitTimeParts.period,
    schedulePickerVisible,
    visitYearOptions,
  ]);

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
  const scheduleVisitDisabled =
    trimmedInquiryName.length === 0 ||
    trimmedInquiryPhone.length === 0 ||
    inquiryPhoneIsInvalid ||
    visitDate.trim().length === 0 ||
    visitTime.trim().length === 0;

  const openDatePicker = () => {
    setDraftVisitDateParts(visitDateParts);
    setSchedulePickerVisible('date');
  };

  const openTimePicker = () => {
    setDraftVisitTimeParts(visitTimeParts);
    setSchedulePickerVisible('time');
  };

  const handleDraftDateChange = (nextParts: Partial<VisitDateParts>) => {
    setDraftVisitDateParts((currentParts) => {
      const mergedParts = { ...currentParts, ...nextParts };
      const maxDay = getDaysInMonth(mergedParts.month, mergedParts.year);

      return {
        ...mergedParts,
        day: Math.min(mergedParts.day, maxDay),
      };
    });
  };

  const handleConfirmSchedulePicker = () => {
    if (schedulePickerVisible === 'date') {
      setVisitDateParts(draftVisitDateParts);
      setVisitDate(formatVisitDate(draftVisitDateParts));
    }

    if (schedulePickerVisible === 'time') {
      setVisitTimeParts(draftVisitTimeParts);
      setVisitTime(formatVisitTime(draftVisitTimeParts));
    }

    setSchedulePickerVisible(null);
  };

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

  const handleRequestVisit = () => {
    if (!trimmedInquiryName) {
      Alert.alert('Name required', 'Please enter your name so our team knows who to expect.');
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

    if (!visitDate.trim()) {
      Alert.alert('Date required', 'Please enter your preferred visit date.');
      return;
    }

    if (!visitTime.trim()) {
      Alert.alert('Time required', 'Please enter your preferred visit time.');
      return;
    }

    setScheduleVisitVisible(false);
    Alert.alert(
      'Visit request prepared',
      `On-site visit selected for ${visitDate.trim()} at ${visitTime.trim()}. We can connect this to the visit request API next.`,
    );
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
          onPress={() => setScheduleVisitVisible(true)}
          style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}
        >
          <Ionicons name="calendar-outline" size={18} color={Colors.white} />
          <Text style={styles.primaryActionText}>Schedule Visit</Text>
        </Pressable>
      </View>

      {/* INQUIRY MODAL */}
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

      {/* SCHEDULE VISIT MODAL */}
      <Modal
        visible={scheduleVisitVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setScheduleVisitVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalRoot}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setScheduleVisitVisible(false)} />

          <View style={styles.scheduleSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.inquiryHeader}>
              <View style={styles.scheduleIcon}>
                <Ionicons name="calendar-outline" size={20} color={Colors.accent} />
              </View>
              <View style={styles.inquiryHeaderCopy}>
                <Text style={styles.inquiryTitle}>Schedule a Visit</Text>
                <Text style={styles.inquirySubtitle} numberOfLines={1}>
                  {property.title}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close schedule visit form"
                hitSlop={10}
                onPress={() => setScheduleVisitVisible(false)}
                style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
              >
                <Ionicons name="close" size={20} color={Colors.textMuted} />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scheduleForm}
            >
              <View style={styles.visitHero}>
                <View style={styles.visitHeroIcon}>
                  <Ionicons name="location-outline" size={20} color={Colors.white} />
                </View>
                <View style={styles.visitHeroCopy}>
                  <Text style={styles.visitHeroLabel}>Preferred site visit</Text>
                  <Text style={styles.visitHeroText} numberOfLines={2}>
                    {location}
                  </Text>
                </View>
              </View>

              <View style={styles.schedulePickerRow}>
                <View style={styles.schedulePickerField}>
                  <Text style={styles.inputLabel}>Preferred date</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Select preferred visit date"
                    onPress={openDatePicker}
                    style={({ pressed }) => [
                      styles.schedulePickerInput,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.schedulePickerInputText,
                        !visitDate && styles.schedulePickerPlaceholder,
                      ]}
                    >
                      {visitDate || 'Select date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
                  </Pressable>
                </View>

                <View style={styles.schedulePickerField}>
                  <Text style={styles.inputLabel}>Preferred time</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Select preferred visit time"
                    onPress={openTimePicker}
                    style={({ pressed }) => [
                      styles.schedulePickerInput,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.schedulePickerInputText,
                        !visitTime && styles.schedulePickerPlaceholder,
                      ]}
                    >
                      {visitTime || 'Select time'}
                    </Text>
                    <Ionicons name="time-outline" size={18} color={Colors.textMuted} />
                  </Pressable>
                </View>
              </View>

              <View style={styles.scheduleDivider} />

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
                label="Notes for the visit"
                value={visitNotes}
                onChangeText={setVisitNotes}
                placeholder="Add companions, timing details, or questions"
                multiline
                inputStyle={styles.visitNotesInput}
              />
            </ScrollView>

            <View style={styles.inquiryActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setScheduleVisitVisible(false)}
                style={({ pressed }) => [
                  styles.cancelInquiryButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.cancelInquiryText}>Cancel</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: scheduleVisitDisabled }}
                onPress={scheduleVisitDisabled ? undefined : handleRequestVisit}
                disabled={scheduleVisitDisabled}
                style={({ pressed }) => [
                  styles.submitInquiryButton,
                  scheduleVisitDisabled && styles.submitInquiryButtonDisabled,
                  scheduleVisitDisabled && styles.disabledButton,
                  pressed && !scheduleVisitDisabled && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.submitInquiryText,
                    scheduleVisitDisabled && styles.submitInquiryTextDisabled,
                  ]}
                >
                  Request Visit
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={schedulePickerVisible !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setSchedulePickerVisible(null)}
      >
        <View style={styles.schedulePickerModalRoot}>
          <Pressable
            style={styles.schedulePickerBackdrop}
            onPress={() => setSchedulePickerVisible(null)}
          />

          <View style={styles.schedulePickerCard}>
            <Text style={styles.schedulePickerTitle}>
              {schedulePickerVisible === 'date' ? 'Select date' : 'Select time'}
            </Text>

            {schedulePickerVisible === 'date' ? (
              <View style={styles.schedulePickerColumns}>
                <View style={styles.schedulePickerColumnFrame}>
                  <View style={styles.schedulePickerSelectionFrame} />
                  <ScrollView
                    ref={monthPickerRef}
                    style={styles.schedulePickerColumn}
                    contentContainerStyle={styles.schedulePickerColumnContent}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={PICKER_OPTION_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(event) => {
                      handleDraftDateChange({
                        month: getPickerIndexFromOffset(
                          event.nativeEvent.contentOffset.y,
                          MONTH_OPTIONS.length - 1,
                        ),
                      });
                    }}
                  >
                    {MONTH_OPTIONS.map((month, index) => {
                      const selected = draftVisitDateParts.month === index;

                      return (
                        <Pressable
                          key={month}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          onPress={() => {
                            handleDraftDateChange({ month: index });
                            scrollPickerColumnToIndex(monthPickerRef, index);
                          }}
                          style={styles.schedulePickerOption}
                        >
                          <Text
                            style={[
                              styles.schedulePickerOptionText,
                              selected && styles.schedulePickerOptionTextSelected,
                            ]}
                          >
                            {month}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                <View style={styles.schedulePickerColumnFrame}>
                  <View style={styles.schedulePickerSelectionFrame} />
                  <ScrollView
                    ref={dayPickerRef}
                    style={styles.schedulePickerColumn}
                    contentContainerStyle={styles.schedulePickerColumnContent}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={PICKER_OPTION_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(event) => {
                      handleDraftDateChange({
                        day: getPickerIndexFromOffset(
                          event.nativeEvent.contentOffset.y,
                          visitDayOptions.length - 1,
                        ) + 1,
                      });
                    }}
                  >
                    {visitDayOptions.map((day) => {
                      const selected = draftVisitDateParts.day === day;

                      return (
                        <Pressable
                          key={day}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          onPress={() => {
                            handleDraftDateChange({ day });
                            scrollPickerColumnToIndex(dayPickerRef, day - 1);
                          }}
                          style={styles.schedulePickerOption}
                        >
                          <Text
                            style={[
                              styles.schedulePickerOptionText,
                              selected && styles.schedulePickerOptionTextSelected,
                            ]}
                          >
                            {day}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                <View style={styles.schedulePickerColumnFrame}>
                  <View style={styles.schedulePickerSelectionFrame} />
                  <ScrollView
                    ref={yearPickerRef}
                    style={styles.schedulePickerColumn}
                    contentContainerStyle={styles.schedulePickerColumnContent}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={PICKER_OPTION_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(event) => {
                      const yearIndex = getPickerIndexFromOffset(
                        event.nativeEvent.contentOffset.y,
                        visitYearOptions.length - 1,
                      );
                      handleDraftDateChange({ year: visitYearOptions[yearIndex] });
                    }}
                  >
                    {visitYearOptions.map((year, index) => {
                      const selected = draftVisitDateParts.year === year;

                      return (
                        <Pressable
                          key={year}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          onPress={() => {
                            handleDraftDateChange({ year });
                            scrollPickerColumnToIndex(yearPickerRef, index);
                          }}
                          style={styles.schedulePickerOption}
                        >
                          <Text
                            style={[
                              styles.schedulePickerOptionText,
                              selected && styles.schedulePickerOptionTextSelected,
                            ]}
                          >
                            {year}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            ) : (
              <View style={styles.schedulePickerColumns}>
                <View style={styles.schedulePickerColumnFrame}>
                  <View style={styles.schedulePickerSelectionFrame} />
                  <ScrollView
                    ref={hourPickerRef}
                    style={styles.schedulePickerColumn}
                    contentContainerStyle={styles.schedulePickerColumnContent}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={PICKER_OPTION_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(event) => {
                      setDraftVisitTimeParts((current) => ({
                        ...current,
                        hour: getPickerIndexFromOffset(
                          event.nativeEvent.contentOffset.y,
                          HOUR_OPTIONS.length - 1,
                        ) + 1,
                      }));
                    }}
                  >
                    {HOUR_OPTIONS.map((hour) => {
                      const selected = draftVisitTimeParts.hour === hour;

                      return (
                        <Pressable
                          key={hour}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          onPress={() => {
                            setDraftVisitTimeParts((current) => ({ ...current, hour }));
                            scrollPickerColumnToIndex(hourPickerRef, hour - 1);
                          }}
                          style={styles.schedulePickerOption}
                        >
                          <Text
                            style={[
                              styles.schedulePickerOptionText,
                              selected && styles.schedulePickerOptionTextSelected,
                            ]}
                          >
                            {hour}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                <View style={styles.schedulePickerColumnFrame}>
                  <View style={styles.schedulePickerSelectionFrame} />
                  <ScrollView
                    ref={minutePickerRef}
                    style={styles.schedulePickerColumn}
                    contentContainerStyle={styles.schedulePickerColumnContent}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={PICKER_OPTION_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(event) => {
                      const minuteIndex = getPickerIndexFromOffset(
                        event.nativeEvent.contentOffset.y,
                        MINUTE_OPTIONS.length - 1,
                      );
                      setDraftVisitTimeParts((current) => ({
                        ...current,
                        minute: MINUTE_OPTIONS[minuteIndex],
                      }));
                    }}
                  >
                    {MINUTE_OPTIONS.map((minute, index) => {
                      const selected = draftVisitTimeParts.minute === minute;

                      return (
                        <Pressable
                          key={minute}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          onPress={() => {
                            setDraftVisitTimeParts((current) => ({ ...current, minute }));
                            scrollPickerColumnToIndex(minutePickerRef, index);
                          }}
                          style={styles.schedulePickerOption}
                        >
                          <Text
                            style={[
                              styles.schedulePickerOptionText,
                              selected && styles.schedulePickerOptionTextSelected,
                            ]}
                          >
                            {String(minute).padStart(2, '0')}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                <View style={styles.schedulePickerColumnFrame}>
                  <View style={styles.schedulePickerSelectionFrame} />
                  <ScrollView
                    ref={periodPickerRef}
                    style={styles.schedulePickerColumn}
                    contentContainerStyle={styles.schedulePickerColumnContent}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={PICKER_OPTION_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(event) => {
                      const periodIndex = getPickerIndexFromOffset(
                        event.nativeEvent.contentOffset.y,
                        TIME_PERIOD_OPTIONS.length - 1,
                      );
                      setDraftVisitTimeParts((current) => ({
                        ...current,
                        period: TIME_PERIOD_OPTIONS[periodIndex],
                      }));
                    }}
                  >
                    {TIME_PERIOD_OPTIONS.map((period, index) => {
                      const selected = draftVisitTimeParts.period === period;

                      return (
                        <Pressable
                          key={period}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          onPress={() => {
                            setDraftVisitTimeParts((current) => ({ ...current, period }));
                            scrollPickerColumnToIndex(periodPickerRef, index);
                          }}
                          style={styles.schedulePickerOption}
                        >
                          <Text
                            style={[
                              styles.schedulePickerOptionText,
                              selected && styles.schedulePickerOptionTextSelected,
                            ]}
                          >
                            {period}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            )}

            <View style={styles.schedulePickerActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setSchedulePickerVisible(null)}
                style={({ pressed }) => [
                  styles.schedulePickerAction,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.schedulePickerCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={handleConfirmSchedulePicker}
                style={({ pressed }) => [
                  styles.schedulePickerAction,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.schedulePickerConfirmText}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

