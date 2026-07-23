import { AuthButton } from '@/components/auth/auth-button';
import { AuthScreen } from '@/components/auth/auth-screen';
import { DateTimePickerModal } from '@/components/property-details';
import { useAppTheme } from '@/context/theme-context';
import { useInvestorSignupForm } from '@/hooks/investment/use-investor-signup-form';
import React from 'react';
import { RefreshControl, Text } from 'react-native';
import { InvestorBenefitsList } from './investor-benefits-list';
import { InvestorInfoNotice } from './investor-info-notice';
import { InvestorLockInToggle } from './investor-lock-in-toggle';
import { InvestorPendingNotice } from './investor-pending-notice';
import { InvestorPlanPicker } from './investor-plan-picker';
import { InvestorScheduleSection } from './investor-schedule-section';
import { InvestorSummaryCard } from './investor-summary-card';
import { InvestorTermsAgreement } from './investor-terms-agreement';

export function SignUpInvestorForm() {
  const { colors } = useAppTheme();
  const { agreed, setAgreed, loading, lockIn, setLockIn, selectedPlan,
    setSelectedPlanId, estimatedAnnualReturn, canSubmit, isPendingApproval, schedulePicker,
    refreshing, onRefresh, handleSubmit } = useInvestorSignupForm();

  return (
    <>
      <AuthScreen
        heroTitle="Reyland Investor"
        scrollEnabled
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
        <Text className="text-2xl leading-[30px] font-black text-textPrimary mb-2">
          Become a Reyland Investor
        </Text>
        <Text className="leading-[21px] text-textSecondary mb-[22px]">
          {isPendingApproval
            ? 'Your investor registration has been submitted. Reyland PH will review your request and approve your access from the admin portal.'
            : 'Sign up for investor access to review opportunities, monitor your portfolio, and receive guided support from Reyland PH.'}
        </Text>

        {isPendingApproval ? (
          <InvestorPendingNotice />
        ) : (
          <>
            <InvestorBenefitsList />

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

            <InvestorTermsAgreement agreed={agreed} onToggle={() => setAgreed((current) => !current)} />

            <AuthButton
              title="SUBMIT INVESTOR REQUEST"
              loadingTitle="Submitting..."
              loading={loading}
              disabled={!canSubmit}
              onPress={handleSubmit}
            />
          </>
        )}
      </AuthScreen>

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