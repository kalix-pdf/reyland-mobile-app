import { HeaderNav, HeaderShell, HomeAction } from '@/components/header';
import { DateTimePickerModal, InquiryModal, PropertyActionBar, PropertyAmenities, PropertyHeaderCard,
  PropertyImageCarousel, PropertyOverview, PropertyPaymentPlan, PropertyQuickStats, ScheduleVisitModal } from '@/components/property-details';
import { PropertyStateScreen as StateScreen } from '@/components/property-details/property-details'
import { useAuth } from '@/context/auth-context';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StatusBar, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { LOT_TYPE_LABELS, PROPERTY_STATUS_LABELS } from '@/constants/property-details.constants';
import { useGalleryImages } from '@/hooks/property_details/useGalleryImages';
import { useInquiryForm } from '@/hooks/property_details/useInquiryForm';
import { useProperty } from '@/hooks/useProperty';
import { useSchedulePicker } from '@/hooks/property_details/useSchedulePicker';
import { useSiteVisitForm } from '@/hooks/property_details/useSiteVisitForm';

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const propertyId = Number(id);

  const { property, loading, refreshing, refresh } = useProperty(propertyId);
  const galleryImages = useGalleryImages(property);
  const schedulePicker = useSchedulePicker();

  const inquiry = useInquiryForm({
    propertyId,
    propertyTitle: property?.title ?? '',
    defaultName: user?.name ?? '',
    defaultEmail: user?.email ?? '',
    defaultPhone: user?.phone ?? '',
    userUuid: user?.uuid,
  });

  const siteVisit = useSiteVisitForm({ propertyId, userUuid: user?.uuid });

  const [inquiryModalVisible, setInquiryModalVisible] = useState(false);
  const [scheduleVisitModalVisible, setScheduleVisitModalVisible] = useState(false);

  if (!Number.isFinite(propertyId)) {
    return (
      <StateScreen
        icon="alert-circle-outline"
        title="Property unavailable"
        message="This listing could not be opened."
      />
    );
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
    return (
      <StateScreen
        icon="home-outline"
        title="Property not found"
        message="The listing may have been removed or is no longer available."
      />
    );
  }

  const statusLabel = PROPERTY_STATUS_LABELS[property.status] ?? 'Available';
  const lotTypeLabel = LOT_TYPE_LABELS[property.lot_type] ?? 'Regular Lot';
  const location = property.project?.location?.trim() || 'Location unavailable';
  const category = property.category?.trim() || 'Property';
  const totalPrice = property.total_price ?? property.price;
  const yearsToPay = Number(property.years_to_pay ?? 0);
  const amenities = (property.amenities ?? []).filter((amenity) => amenity.trim().length > 0);

  const handlePressInquire = () => {
    if (inquiry.checkingActiveInquiry) return;

    if (inquiry.hasActiveInquiry) {
      Alert.alert(
        'Inquiry already active',
        'You already have an active inquiry for this property. Our team will contact you soon.',
      );
      return;
    }

    setInquiryModalVisible(true);
  };

  const handleSubmitInquiry = async () => {
    const outcome = await inquiry.submit();

    if (outcome.status === 'success') {
      setInquiryModalVisible(false);
      Alert.alert('Inquiry sent', 'Your inquiry has been submitted. Our team will contact you soon.');
    } else if (outcome.status === 'already_active') {
      Alert.alert(
        'Inquiry already active',
        'You already have an active inquiry for this property. Our team will contact you soon.',
      );
    } else {
      Alert.alert('Unable to send inquiry', outcome.message);
    }
  };

  const handlePressScheduleVisit = () => {
    if (siteVisit.checkingActiveVisit) return;

    if (siteVisit.hasActiveVisit) {
      Alert.alert(
        'Visit already requested',
        'You already have an active site visit request for this property. Our team will contact you soon.',
      );
      return;
    }

    setScheduleVisitModalVisible(true);
  };

  const handleSubmitSiteVisit = async () => {
    const outcome = await siteVisit.submit({
      name: inquiry.values.name,
      email: inquiry.values.email,
      phone: inquiry.values.phone,
      visitDate: schedulePicker.committedDate,
      visitTime: schedulePicker.committedTime,
      visitDateLabel: schedulePicker.visitDateLabel,
      visitTimeLabel: schedulePicker.visitTimeLabel,
    });

    if (outcome.status === 'success') {
      setScheduleVisitModalVisible(false);
      Alert.alert('Visit requested', 'Your site visit request has been submitted. Our team will contact you soon.');
    } else if (outcome.status === 'already_active') {
      Alert.alert(
        'Visit already requested',
        'You already have an active site visit request for this property. Our team will contact you soon.',
      );
    } else {
      Alert.alert('Unable to request visit', outcome.message);
    }
  };

  const scheduleVisitSubmitDisabled =
    siteVisit.submitting ||
    siteVisit.hasActiveVisit ||
    inquiry.values.name.trim().length === 0 ||
    inquiry.values.phone.trim().length === 0 ||
    inquiry.phoneIsInvalid ||
    schedulePicker.visitDateLabel.trim().length === 0 ||
    schedulePicker.visitTimeLabel.trim().length === 0;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <HeaderShell transparent>
        <HeaderNav title="Property Details" rightAction={<HomeAction />} />
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
        <PropertyImageCarousel images={galleryImages} />

        <PropertyHeaderCard
          category={category}
          statusLabel={statusLabel}
          totalPrice={totalPrice}
          title={property.title}
          areaSqm={property.area}
          location={location}
        />

        <PropertyQuickStats
          lotTypeLabel={lotTypeLabel}
          lot={property.lot}
          dateCompleted={property.date_completed}
        />

        <PropertyPaymentPlan
          monthlyInstallment={property.monthly_installment}
          downPayment={property.installment_down_payment}
          yearsToPay={yearsToPay}
        />

        <PropertyAmenities amenities={amenities} />

        <PropertyOverview description={property.short_description} />
      </ScrollView>

      <PropertyActionBar
        checkingInquiry={inquiry.checkingActiveInquiry}
        hasActiveInquiry={inquiry.hasActiveInquiry}
        onPressInquire={handlePressInquire}
        user={user}
        checkingSiteVisit={siteVisit.checkingActiveVisit}
        hasActiveSiteVisit={siteVisit.hasActiveVisit}
        onPressScheduleVisit={handlePressScheduleVisit}
      />

      <InquiryModal
        visible={inquiryModalVisible}
        propertyTitle={property.title}
        values={inquiry.values}
        onChangeName={inquiry.setters.setName}
        onChangeEmail={inquiry.setters.setEmail}
        onChangePhone={inquiry.setters.setPhone}
        onChangeMessage={inquiry.setters.setMessage}
        isSubmitDisabled={inquiry.isSubmitDisabled}
        isSubmitting={inquiry.submitting}
        onSubmit={handleSubmitInquiry}
        onClose={() => setInquiryModalVisible(false)}
      />

      <ScheduleVisitModal
        visible={scheduleVisitModalVisible}
        propertyTitle={property.title}
        location={location}
        contactValues={{
          name: inquiry.values.name,
          email: inquiry.values.email,
          phone: inquiry.values.phone,
        }}
        onChangeName={inquiry.setters.setName}
        onChangeEmail={inquiry.setters.setEmail}
        onChangePhone={inquiry.setters.setPhone}
        notes={siteVisit.notes}
        onChangeNotes={siteVisit.setNotes}
        visitDateLabel={schedulePicker.visitDateLabel}
        visitTimeLabel={schedulePicker.visitTimeLabel}
        onPressDate={schedulePicker.openDatePicker}
        onPressTime={schedulePicker.openTimePicker}
        isSubmitDisabled={scheduleVisitSubmitDisabled}
        isSubmitting={siteVisit.submitting}
        onSubmit={handleSubmitSiteVisit}
        onClose={() => setScheduleVisitModalVisible(false)}
      />

      <DateTimePickerModal
        visible={schedulePicker.activePicker}
        draftDate={schedulePicker.draftDate}
        draftTime={schedulePicker.draftTime}
        onChangeDraftDate={schedulePicker.updateDraftDate}
        onChangeDraftTime={schedulePicker.updateDraftTime}
        onConfirm={schedulePicker.confirmPicker}
        onCancel={schedulePicker.cancelPicker}
      />
    </SafeAreaView>
  );
}
