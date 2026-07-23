import { DateTimePickerModal } from '@/components/property-details';
import { INVESTOR_PLANS, InvestorPlan } from '@/constants/investor-plans';
import { useAppTheme } from '@/context/theme-context';
import { useSchedulePicker } from '@/hooks/property_details/useSchedulePicker';
import { calculateEstimatedAnnualReturn } from '@/utils/investor.utils';
import { createVisitDateTimeISO } from '@/utils/property-details.utils';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InvestorInfoNotice } from '../sign-up/investor-info-notice';
import { InvestorLockInToggle } from '../sign-up/investor-lock-in-toggle';
import { InvestorPlanPicker } from '../sign-up/investor-plan-picker';
import { InvestorScheduleSection } from '../sign-up/investor-schedule-section';
import { InvestorSummaryCard } from '../sign-up/investor-summary-card';

type NewInvestmentPlanModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (plan: InvestorPlan, lockIn: boolean, preferredSigningAt: string) => void;
  submitting: boolean;
};

export function NewInvestmentPlanModal({
  visible,
  onClose,
  onSubmit,
  submitting,
}: NewInvestmentPlanModalProps) {
  const { colors } = useAppTheme();
  const [selectedPlanId, setSelectedPlanId] = useState(INVESTOR_PLANS[0].id);
  const [lockIn, setLockIn] = useState(false);
  const schedulePicker = useSchedulePicker();

  const selectedPlan = useMemo(
    () => INVESTOR_PLANS.find((plan) => plan.id === selectedPlanId) ?? INVESTOR_PLANS[0],
    [selectedPlanId],
  );

  const estimatedAnnualReturn = useMemo(
    () => calculateEstimatedAnnualReturn(selectedPlan.minimum, selectedPlan.annualRate),
    [selectedPlan],
  );

  const canSubmit =
    schedulePicker.visitDateLabel.trim().length > 0 && schedulePicker.visitTimeLabel.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const preferredSigningAt = createVisitDateTimeISO(
      schedulePicker.committedDate,
      schedulePicker.committedTime,
    );
    onSubmit(selectedPlan, lockIn, preferredSigningAt);
  };

  return (
    <>
      <Modal
        visible={visible && !schedulePicker.activePicker}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <View className="flex-1 justify-end bg-black/40">
          {/* Cap the whole sheet, not just the scroll area, so the sticky footer
              button always sits at a predictable position near the bottom. */}
          <SafeAreaView edges={['bottom']} className="max-h-[90%] rounded-t-[24px] bg-background">
            <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
              <Text className="text-textPrimary text-lg font-black">Request New Investment</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView
              className="px-5"
              contentContainerClassName="pb-4"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              <InvestorPlanPicker selectedPlanId={selectedPlan.id} onSelectPlan={setSelectedPlanId} />

              <InvestorLockInToggle lockIn={lockIn} onToggle={setLockIn} />

              <InvestorScheduleSection
                visitDateLabel={schedulePicker.visitDateLabel}
                visitTimeLabel={schedulePicker.visitTimeLabel}
                onPressDate={schedulePicker.openDatePicker}
                onPressTime={schedulePicker.openTimePicker}
              />

              <InvestorSummaryCard
                plan={selectedPlan}
                lockIn={lockIn}
                estimatedAnnualReturn={estimatedAnnualReturn}
              />

              <InvestorInfoNotice />
            </ScrollView>

            {/* Sticky footer, outside the ScrollView, so the CTA is always reachable
                without scrolling to the very bottom. */}
            <View className="px-5 pt-3 pb-5 border-t border-border">
              <Pressable
                onPress={handleSubmit}
                disabled={submitting || !canSubmit}
                className={`rounded-2xl py-3.5 items-center ${
                  submitting || !canSubmit ? 'bg-border' : 'bg-accent'
                }`}
              >
                <Text className="text-white text-[14px] font-black">
                  {submitting ? 'Submitting...' : `Request ${selectedPlan.label} Plan`}
                </Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      <DateTimePickerModal
        visible={schedulePicker.activePicker}
        draftDate={schedulePicker.draftDate}
        draftTime={schedulePicker.draftTime}
        onChangeDraftDate={schedulePicker.updateDraftDate}
        onChangeDraftTime={schedulePicker.updateDraftTime}
        onConfirm={schedulePicker.confirmPicker}
        onCancel={schedulePicker.cancelPicker}
      />
    </>
  );
}