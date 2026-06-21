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
  addSiteVisit,
  fetchActivePropertySiteVisit,
  SiteVisitApiError,
} from '@/services/site-visits/site-visit.api';
import { Dimensions } from 'react-native';

const PROPERTY_SCREEN_WIDTH = Dimensions.get('window').width;
const CAROUSEL_HEIGHT = 450;
const PICKER_OPTION_HEIGHT = 42;

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

function createVisitDateTime(parts: VisitDateParts, time: VisitTimeParts) {
  const hour =
    time.period === 'PM'
      ? time.hour === 12 ? 12 : time.hour + 12
      : time.hour === 12 ? 0 : time.hour;

  return new Date(parts.year, parts.month, parts.day, hour, time.minute).toISOString();
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
  const [submittingVisit, setSubmittingVisit] = useState(false);
  const [checkingInquiry, setCheckingInquiry] = useState(false);
  const [hasActiveInquiry, setHasActiveInquiry] = useState(false);
  const [checkingSiteVisit, setCheckingSiteVisit] = useState(false);
  const [hasActiveSiteVisit, setHasActiveSiteVisit] = useState(false);
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

  useEffect(() => {
    let cancelled = false;

    const checkActiveSiteVisit = async () => {
      if (!property?.id || !user?.uuid) {
        setHasActiveSiteVisit(false);
        return;
      }

      try {
        setCheckingSiteVisit(true);
        const activeSiteVisit = await fetchActivePropertySiteVisit(property.id);

        if (!cancelled) {
          setHasActiveSiteVisit(Boolean(activeSiteVisit));
        }
      } catch {
        if (!cancelled) {
          setHasActiveSiteVisit(false);
        }
      } finally {
        if (!cancelled) {
          setCheckingSiteVisit(false);
        }
      }
    };

    checkActiveSiteVisit();

    return () => {
      cancelled = true;
    };
  }, [property?.id, user?.uuid]);

  if (!Number.isFinite(propertyId)) {
    return <StateScreen icon="alert-circle-outline" title="Property unavailable" message="This listing could not be opened." />;
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center px-7 bg-background">
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text className="mt-3 text-textSecondary text-sm leading-[21px] font-semibold text-center">
          Loading property details...
        </Text>
      </SafeAreaView>
    );
  }

  if (!property) {
    return <StateScreen icon="home-outline" title="Property not found" message="The listing may have been removed or is no longer available." />;
  }

  const statusLabel = STATUS_LABELS[property.status] ?? 'Available';
  const lotTypeLabel = LOT_TYPE_LABELS[property.lot_type] ?? 'Regular Lot';
  const location = property.project?.location?.trim() || 'Location unavailable';
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
    submittingVisit ||
    hasActiveSiteVisit ||
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

  const handleRequestVisit = async () => {
    if (hasActiveSiteVisit) {
      Alert.alert(
        'Visit already requested',
        'You already have an active site visit request for this property. Our team will contact you soon.',
      );
      return;
    }

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

    try {
      setSubmittingVisit(true);

      await addSiteVisit({
        property_id: property.id,
        name: trimmedInquiryName,
        email: trimmedInquiryEmail || null,
        phone: trimmedInquiryPhone,
        preferred_visit_at: createVisitDateTime(visitDateParts, visitTimeParts),
        notes: visitNotes.trim() || null,
      });

      setHasActiveSiteVisit(true);
      setScheduleVisitVisible(false);
      Alert.alert(
        'Visit requested',
        'Your site visit request has been submitted. Our team will contact you soon.',
      );
    } catch (error) {
      if (error instanceof SiteVisitApiError && error.statusCode === 409) {
        setHasActiveSiteVisit(true);
        Alert.alert(
          'Visit already requested',
          'You already have an active site visit request for this property. Our team will contact you soon.',
        );
        return;
      }

      Alert.alert(
        'Unable to request visit',
        error instanceof Error ? error.message : 'Please try again in a moment.',
      );
    } finally {
      setSubmittingVisit(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <HeaderShell transparent>
        <HeaderNav title='Property Details' rightAction={<HomeAction />} />
      </HeaderShell>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-[60px]"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
      >
        <View className="pt-1 pb-3.5">
          <ReanimatedCarousel
            loop={galleryImages.length > 1}
            autoPlay={galleryImages.length > 1}
            autoPlayInterval={3000}
            width={PROPERTY_SCREEN_WIDTH}
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
              <Pressable
                style={{ width: PROPERTY_SCREEN_WIDTH, height: CAROUSEL_HEIGHT }}
              >
                <Image
                  source={{ uri: item.image_url }}
                  style={{ backgroundColor: Colors.border, width: '100%', height: '100%'}}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                  transition={220}
                />
              </Pressable>
            )}
          />

          <View className="min-h-7 flex-row items-center justify-center mt-2.5">
            <View className="absolute left-[15px] flex-row items-center gap-[5px] px-2.5 py-1.5 rounded-full bg-primary">
              <Ionicons name="images-outline" size={14} color={Colors.textOnDark} />
              <Text className="text-textOnDark text-[11px] font-black">
                {activeImage + 1}/{Math.max(galleryImages.length, 1)}
              </Text>
            </View>

            {galleryImages.length > 1 ? (
              <View className="flex-row items-center justify-center gap-1.5">
                {galleryImages.map((image, index) => (
                  <View
                    key={image.id}
                    className={
                      activeImage === index
                        ? 'w-[22px] h-2 rounded-full bg-tagText'
                        : 'w-2 h-2 rounded-full bg-[#D9D9D9]'
                    }
                  />
                ))}
              </View>
            ) : null}
          </View>
        </View>

        <View className="mx-[15px] p-4 rounded-[22px] bg-surface border border-border shadow-sm" style={{ shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 14 }}>
          <View className="flex-row items-start gap-3.5">
            <View className="flex-1 min-w-0">
              <View className="flex-row flex-wrap gap-2 mb-3">
                <View className="px-[11px] py-1.5 rounded-full bg-tag">
                  <Text className="text-tagText text-[11px] font-black">{category}</Text>
                </View>
                <View className="px-[11px] py-1.5 rounded-full bg-primary">
                  <Text className="text-textOnDark text-[11px] font-black">{statusLabel}</Text>
                </View>
              </View>

              <Text className="text-textMuted text-xs font-extrabold mb-[3px]">Total price</Text>
              <Text className="text-accent text-[27px] font-black">{formatCurrency(totalPrice)}</Text>
              <Text className="mt-[7px] text-textPrimary text-xl leading-[27px] font-black">{property.title}</Text>
            </View>

            <View className="w-[86px] min-h-[106px] items-center justify-center p-2.5 rounded-[18px] bg-background border border-border">
              <Ionicons name="resize-outline" size={20} color={Colors.accent} />
              <Text className="mt-2 text-textPrimary text-[17px] font-black">{formatNumber(property.area)}</Text>
              <Text className="mt-0.5 text-textMuted text-[11px] font-extrabold">sqm</Text>
            </View>
          </View>

          <View className="mt-3.5 flex-row items-start gap-[9px] pt-3.5 border-t border-border">
            <View className="w-[30px] h-[30px] rounded-full items-center justify-center bg-tag">
              <Ionicons name="location-outline" size={16} color={Colors.accent} />
            </View>
            <Text className="flex-1 text-textSecondary text-sm leading-5 font-bold" numberOfLines={2}>{location}</Text>
          </View>
        </View>

        <View className="flex-row gap-2.5 mx-[15px] mt-3.5">
          <StatItem icon="map-outline" label="Lot Type" value={lotTypeLabel} />
          <StatItem icon="pricetag-outline" label="Lot" value={property.lot || 'N/A'} />
          <StatItem icon="calendar-outline" label="Completion" value={property.date_completed || 'TBA'} />
        </View>

        <Section title="Payment Plan">
          <View className="overflow-hidden rounded-[22px] bg-surface border border-border">
            <View className="min-h-[96px] flex-row items-center gap-3.5 p-4 bg-primary">
              <View className="w-[46px] h-[46px] rounded-[23px] items-center justify-center bg-textOnDark/[0.14]">
                <Ionicons name="wallet-outline" size={22} color={Colors.textOnDark} />
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-textOnDark/70 text-xs font-extrabold">Estimated monthly installment</Text>
                <Text className="mt-[5px] text-textOnDark text-[23px] font-black">{formatCurrencyOrFallback(property.monthly_installment)}</Text>
              </View>
            </View>

            <View className="px-4">
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
            <View className="flex-row flex-wrap gap-2.5 p-3.5 rounded-[22px] bg-surface border border-border">
              {amenities.map((amenity) => (
                <View
                  key={amenity}
                  className="min-h-[42px] max-w-full flex-row items-center gap-2 px-3 py-2.5 rounded-2xl bg-tag border border-accent/[0.16]"
                >
                  <View className="w-5 h-5 rounded-full items-center justify-center bg-accent">
                    <Ionicons name="checkmark" size={13} color={Colors.textOnDark} />
                  </View>
                  <Text className="shrink text-tagText text-[13px] leading-[18px] font-extrabold" numberOfLines={2}>{amenity}</Text>
                </View>
              ))}
            </View>
          </Section>
        ) : null}

        {property.short_description ? (
          <Section title="Overview">
            <Text className="p-4 rounded-[20px] bg-surface border border-border text-textSecondary text-sm leading-[23px] font-semibold">
              {property.short_description}
            </Text>
          </Section>
        ) : null}
      </ScrollView>

      <View className="flex-row gap-2.5 px-[15px] pt-3 pb-[50px] bg-surface border-t border-border">
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
          className={`flex-1 min-h-[52px] flex-row items-center justify-center gap-2 rounded-2xl border border-accent bg-surface ${hasActiveInquiry ? 'bg-tag' : ''} ${checkingInquiry ? 'opacity-[0.72]' : ''}`}
        >
          {({ pressed }) => (
            <>
              <Ionicons
                name={hasActiveInquiry ? 'checkmark-circle-outline' : 'chatbubble-ellipses-outline'}
                size={18}
                color={Colors.accent}
                style={pressed ? { opacity: 0.78 } : undefined}
              />
              <Text className="text-accent text-sm font-black" style={pressed ? { opacity: 0.78 } : undefined}>
                {checkingInquiry ? 'Checking...' : hasActiveInquiry ? 'Inquiry Sent' : 'Inquire Now'}
              </Text>
            </>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Schedule visit"
          accessibilityState={{ disabled: checkingSiteVisit }}
          onPress={() => {
            if (checkingSiteVisit) return;

            if (hasActiveSiteVisit) {
              Alert.alert(
                'Visit already requested',
                'You already have an active site visit request for this property. Our team will contact you soon.',
              );
              return;
            }

            setScheduleVisitVisible(true);
          }}
          disabled={checkingSiteVisit}
          className={`flex-[1.1] min-h-[52px] flex-row items-center justify-center gap-2 rounded-2xl bg-accent ${checkingSiteVisit ? 'opacity-[0.72]' : ''}`}
        >
          <Ionicons
            name={hasActiveSiteVisit ? 'checkmark-circle-outline' : 'calendar-outline'}
            size={18}
            color={Colors.textOnDark}
          />
          <Text className="text-textOnDark text-sm font-black">
            {checkingSiteVisit ? 'Checking...' : hasActiveSiteVisit ? 'Visit Requested' : 'Schedule Visit'}
          </Text>
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
          className="flex-1 justify-end"
        >
          <Pressable className="absolute inset-0 bg-black/[0.42]" onPress={() => setInquiryVisible(false)} />

          <View className="max-h-[88%] pt-2.5 px-[15px] pb-[30px] rounded-t-[26px] bg-surface">
            <View className="self-center w-11 h-[5px] rounded-full bg-border mb-4" />

            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-[42px] h-[42px] rounded-[21px] items-center justify-center bg-tag">
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.accent} />
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-textPrimary text-lg font-black">Inquire about this property</Text>
                <Text className="mt-[3px] text-textSecondary text-[13px] font-bold" numberOfLines={1}>
                  {property.title}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close inquiry form"
                hitSlop={10}
                onPress={() => setInquiryVisible(false)}
                className="w-9 h-9 rounded-full items-center justify-center bg-background active:opacity-[0.78]"
              >
                <Ionicons name="close" size={20} color={Colors.textMuted} />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="gap-3 pb-2"
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
                style={{ minHeight: 108, textAlignVertical: 'top' }}
              />
            </ScrollView>

            <View className="flex-row gap-2.5 pt-3.5">
              <Pressable
                accessibilityRole="button"
                onPress={() => setInquiryVisible(false)}
                disabled={submittingInquiry}
                className={`flex-1 min-h-[50px] items-center justify-center rounded-2xl border border-border bg-surface active:opacity-[0.78] ${submittingInquiry ? 'opacity-[0.72]' : ''}`}
              >
                <Text className="text-textSecondary text-sm font-black">Cancel</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: inquirySubmitDisabled }}
                onPress={inquirySubmitDisabled ? undefined : handleSubmitInquiry}
                disabled={inquirySubmitDisabled}
                className={`flex-[1.35] min-h-[50px] items-center justify-center rounded-2xl ${inquirySubmitDisabled ? 'bg-border opacity-[0.72]' : 'bg-accent active:opacity-[0.78]'}`}
              >
                {submittingInquiry ? (
                  <ActivityIndicator size="small" color={Colors.textOnDark} />
                ) : (
                  <Text className={`text-sm font-black ${inquirySubmitDisabled ? 'text-textMuted' : 'text-textOnDark'}`}>
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
          className="flex-1 justify-end"
        >
          <Pressable className="absolute inset-0 bg-black/[0.42]" onPress={() => setScheduleVisitVisible(false)} />

          <View className="max-h-[90%] pt-2.5 px-[15px] pb-[30px] rounded-t-[26px] bg-surface">
            <View className="self-center w-11 h-[5px] rounded-full bg-border mb-4" />

            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-[42px] h-[42px] rounded-[21px] items-center justify-center bg-tag">
                <Ionicons name="calendar-outline" size={20} color={Colors.accent} />
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-textPrimary text-lg font-black">Schedule a Visit</Text>
                <Text className="mt-[3px] text-textSecondary text-[13px] font-bold" numberOfLines={1}>
                  {property.title}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close schedule visit form"
                hitSlop={10}
                onPress={() => setScheduleVisitVisible(false)}
                className="w-9 h-9 rounded-full items-center justify-center bg-background active:opacity-[0.78]"
              >
                <Ionicons name="close" size={20} color={Colors.textMuted} />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="gap-3.5 pb-2"
            >
              <View className="min-h-[82px] flex-row items-center gap-[13px] p-3.5 rounded-2xl bg-primary">
                <View className="w-[42px] h-[42px] rounded-[21px] items-center justify-center bg-textOnDark/[0.14]">
                  <Ionicons name="location-outline" size={20} color={Colors.textOnDark} />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-textOnDark/70 text-xs font-extrabold">Preferred site visit</Text>
                  <Text className="mt-1 text-textOnDark text-sm leading-5 font-black" numberOfLines={2}>
                    {location}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2.5">
                <View className="flex-1 gap-[7px]">
                  <Text className="text-textSecondary text-xs font-black">Preferred date</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Select preferred visit date"
                    onPress={openDatePicker}
                    className="min-h-[50px] flex-row items-center justify-between gap-2 px-3.5 py-3 rounded-2xl border border-border bg-background active:opacity-[0.78]"
                  >
                    <Text className={`flex-1 text-[14px] font-extrabold ${visitDate ? 'text-textPrimary' : 'text-textMuted'}`}>
                      {visitDate || 'Select date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
                  </Pressable>
                </View>

                <View className="flex-1 gap-[7px]">
                  <Text className="text-textSecondary text-xs font-black">Preferred time</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Select preferred visit time"
                    onPress={openTimePicker}
                    className="min-h-[50px] flex-row items-center justify-between gap-2 px-3.5 py-3 rounded-2xl border border-border bg-background active:opacity-[0.78]"
                  >
                    <Text className={`flex-1 text-[14px] font-extrabold ${visitTime ? 'text-textPrimary' : 'text-textMuted'}`}>
                      {visitTime || 'Select time'}
                    </Text>
                    <Ionicons name="time-outline" size={18} color={Colors.textMuted} />
                  </Pressable>
                </View>
              </View>

              <View className="h-px bg-border" />

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
                style={{ minHeight: 108, textAlignVertical: 'top' }}
              />
            </ScrollView>

            <View className="flex-row gap-2.5 pt-3.5">
              <Pressable
                accessibilityRole="button"
                onPress={() => setScheduleVisitVisible(false)}
                className="flex-1 min-h-[50px] items-center justify-center rounded-2xl border border-border bg-surface active:opacity-[0.78]"
              >
                <Text className="text-textSecondary text-sm font-black">Cancel</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: scheduleVisitDisabled }}
                onPress={scheduleVisitDisabled ? undefined : handleRequestVisit}
                disabled={scheduleVisitDisabled}
                className={`flex-[1.35] min-h-[50px] items-center justify-center rounded-2xl ${scheduleVisitDisabled ? 'bg-border opacity-[0.72]' : 'bg-accent active:opacity-[0.78]'}`}
              >
                <Text className={`text-sm font-black ${scheduleVisitDisabled ? 'text-textMuted' : 'text-textOnDark'}`}>
                  {submittingVisit ? 'Requesting...' : 'Request Visit'}
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
        <View className="flex-1 items-center justify-center p-7">
          <Pressable
            className="absolute inset-0 bg-black/[0.35]"
            onPress={() => setSchedulePickerVisible(null)}
          />

          <View
            className="w-full max-w-[360px] p-[22px] rounded-3xl bg-surface"
            style={{ shadowColor: Colors.primary, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.16, shadowRadius: 24, elevation: 8 }}
          >
            <Text className="text-textPrimary text-lg font-extrabold mb-[18px]">
              {schedulePickerVisible === 'date' ? 'Select date' : 'Select time'}
            </Text>

            {schedulePickerVisible === 'date' ? (
              <View className="min-h-[178px] flex-row gap-2.5">
                <View className="flex-1 h-[178px] overflow-hidden rounded-2xl bg-background">
                  <View className="absolute left-0 right-0 top-[68px] h-[42px] border-t-[1.5px] border-b-[1.5px] border-accent bg-accent/[0.07]" />
                  <ScrollView
                    ref={monthPickerRef}
                    className="flex-1 max-h-[178px]"
                    contentContainerClassName="py-[68px]"
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
                          className="h-[42px] items-center justify-center"
                        >
                          <Text
                            className={
                              selected
                                ? 'text-textPrimary text-[16px] font-black text-center'
                                : 'text-textMuted text-[15px] font-bold text-center'
                            }
                          >
                            {month}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                <View className="flex-1 h-[178px] overflow-hidden rounded-2xl bg-background">
                  <View className="absolute left-0 right-0 top-[68px] h-[42px] border-t-[1.5px] border-b-[1.5px] border-accent bg-accent/[0.07]" />
                  <ScrollView
                    ref={dayPickerRef}
                    className="flex-1 max-h-[178px]"
                    contentContainerClassName="py-[68px]"
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
                          className="h-[42px] items-center justify-center"
                        >
                          <Text
                            className={
                              selected
                                ? 'text-textPrimary text-[16px] font-black text-center'
                                : 'text-textMuted text-[15px] font-bold text-center'
                            }
                          >
                            {day}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                <View className="flex-1 h-[178px] overflow-hidden rounded-2xl bg-background">
                  <View className="absolute left-0 right-0 top-[68px] h-[42px] border-t-[1.5px] border-b-[1.5px] border-accent bg-accent/[0.07]" />
                  <ScrollView
                    ref={yearPickerRef}
                    className="flex-1 max-h-[178px]"
                    contentContainerClassName="py-[68px]"
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
                          className="h-[42px] items-center justify-center"
                        >
                          <Text
                            className={
                              selected
                                ? 'text-textPrimary text-[16px] font-black text-center'
                                : 'text-textMuted text-[15px] font-bold text-center'
                            }
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
              <View className="min-h-[178px] flex-row gap-2.5">
                <View className="flex-1 h-[178px] overflow-hidden rounded-2xl bg-background">
                  <View className="absolute left-0 right-0 top-[68px] h-[42px] border-t-[1.5px] border-b-[1.5px] border-accent bg-accent/[0.07]" />
                  <ScrollView
                    ref={hourPickerRef}
                    className="flex-1 max-h-[178px]"
                    contentContainerClassName="py-[68px]"
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
                          className="h-[42px] items-center justify-center"
                        >
                          <Text
                            className={
                              selected
                                ? 'text-textPrimary text-[16px] font-black text-center'
                                : 'text-textMuted text-[15px] font-bold text-center'
                            }
                          >
                            {hour}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                <View className="flex-1 h-[178px] overflow-hidden rounded-2xl bg-background">
                  <View className="absolute left-0 right-0 top-[68px] h-[42px] border-t-[1.5px] border-b-[1.5px] border-accent bg-accent/[0.07]" />
                  <ScrollView
                    ref={minutePickerRef}
                    className="flex-1 max-h-[178px]"
                    contentContainerClassName="py-[68px]"
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
                          className="h-[42px] items-center justify-center"
                        >
                          <Text
                            className={
                              selected
                                ? 'text-textPrimary text-[16px] font-black text-center'
                                : 'text-textMuted text-[15px] font-bold text-center'
                            }
                          >
                            {String(minute).padStart(2, '0')}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                <View className="flex-1 h-[178px] overflow-hidden rounded-2xl bg-background">
                  <View className="absolute left-0 right-0 top-[68px] h-[42px] border-t-[1.5px] border-b-[1.5px] border-accent bg-accent/[0.07]" />
                  <ScrollView
                    ref={periodPickerRef}
                    className="flex-1 max-h-[178px]"
                    contentContainerClassName="py-[68px]"
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
                          className="h-[42px] items-center justify-center"
                        >
                          <Text
                            className={
                              selected
                                ? 'text-textPrimary text-[16px] font-black text-center'
                                : 'text-textMuted text-[15px] font-bold text-center'
                            }
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

            <View className="flex-row justify-end gap-[18px] mt-[18px]">
              <Pressable
                accessibilityRole="button"
                onPress={() => setSchedulePickerVisible(null)}
                className="min-h-9 justify-center px-1 active:opacity-[0.78]"
              >
                <Text className="text-textSecondary text-sm font-extrabold">Cancel</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={handleConfirmSchedulePicker}
                className="min-h-9 justify-center px-1 active:opacity-[0.78]"
              >
                <Text className="text-accent text-sm font-black">Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}