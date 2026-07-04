import { AuthScreen } from '@/components/auth/auth-screen';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import {
  addInvestmentContractSchedule,
  fetchActiveInvestmentContractSchedule,
  InvestmentContractScheduleApiError,
} from '@/services/investment-contract-schedules/investment-contract-schedule.api';
import { createVisitDateTimeISO } from '@/utils/property-details.utils';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  Switch,
  Text,
  View
} from 'react-native';
import { useSchedulePicker } from '../../hooks/property_details/useSchedulePicker';
import { ScheduleContractModal } from './ScheduleContractModal';

type InvestorPlan = {
  id: string;
  code: number;
  range: string;
  label: string;
  annualRate: number;
  minimum: number;
  maximum: number;
};

const INVESTOR_PLANS: InvestorPlan[] = [
  { id: 'starter', code: 1, range: '100k to 499k', label: 'Starter', annualRate: 15, minimum: 100000, maximum: 499000 },
  { id: 'growth', code: 2, range: '500k to 999k', label: 'Growth', annualRate: 17, minimum: 500000, maximum: 999000 },
  { id: 'premier', code: 3, range: '1M to 1.999M', label: 'Premier', annualRate: 20, minimum: 1000000, maximum: 1999000 },
  { id: 'elite', code: 4, range: '2M to 5M', label: 'Elite', annualRate: 24, minimum: 2000000, maximum: 5000000 },
];

function formatPeso(value: number) {
  if (value >= 1000000) {
    return `PHP ${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 2)}M`;
  }

  return `PHP ${Math.round(value / 1000)}k`;
}

export function InvestorDashboard() {
  const { user } = useAuth();
  const [selectedPlanId, setSelectedPlanId] = useState(INVESTOR_PLANS[0].id);
  const [lockIn, setLockIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkingActiveSchedule, setCheckingActiveSchedule] = useState(false);
  const [hasActiveSchedule, setHasActiveSchedule] = useState(false);
  const [submittingSchedule, setSubmittingSchedule] = useState(false);

  const selectedPlan = useMemo(
    () => INVESTOR_PLANS.find((plan) => plan.id === selectedPlanId) ?? INVESTOR_PLANS[0],
    [selectedPlanId],
  );
  const totalAnnualRate = selectedPlan.annualRate + (lockIn ? 10 : 0);
  const estimatedAnnualReturn = selectedPlan.minimum * (totalAnnualRate / 100);
  const schedulePicker = useSchedulePicker();
  const scheduleDisabled =
    checkingActiveSchedule ||
    hasActiveSchedule ||
    submittingSchedule ||
    schedulePicker.visitDateLabel.trim().length === 0 ||
    schedulePicker.visitTimeLabel.trim().length === 0;

  useEffect(() => {
    let cancelled = false;

    const checkActiveSchedule = async () => {
      if (!user?.uuid) {
        setHasActiveSchedule(false);
        return;
      }

      try {
        setCheckingActiveSchedule(true);
        const activeSchedule = await fetchActiveInvestmentContractSchedule();
        if (!cancelled) setHasActiveSchedule(Boolean(activeSchedule));
      } catch {
        if (!cancelled) setHasActiveSchedule(false);
      } finally {
        if (!cancelled) setCheckingActiveSchedule(false);
      }
    };

    checkActiveSchedule();

    return () => {
      cancelled = true;
    };
  }, [user?.uuid]);

  const handleSubmitInquiry = async () => {
    if (scheduleDisabled) return;

    try {
      setSubmittingSchedule(true);

      await addInvestmentContractSchedule({
        investment_plan_range: selectedPlan.code,
        is_lock_in: lockIn,
        preferred_signing_at: createVisitDateTimeISO(
          schedulePicker.committedDate,
          schedulePicker.committedTime,
        ),
      });

      setHasActiveSchedule(true);
      setModalVisible(false);
      Alert.alert(
        'Contract signing requested',
        'Your preferred contract signing schedule has been submitted. Further details and next steps will be sent through Gmail.',
      );
    } catch (error) {
      if (error instanceof InvestmentContractScheduleApiError && error.statusCode === 409) {
        setHasActiveSchedule(true);
        setModalVisible(false);
        Alert.alert(
          'Schedule already active',
          'You already have an active contract signing schedule request. Our team will contact you soon.',
        );
        return;
      }

      Alert.alert(
        'Unable to request schedule',
        error instanceof Error ? error.message : 'Please try again in a moment.',
      );
    } finally {
      setSubmittingSchedule(false);
    }
  };

  return (
    <AuthScreen
      heroTitle={`Investor\nDesk`}
      scrollEnabled
      heroContent={
        <View className="gap-3 pb-16">
          <View className="w-[54px] h-[54px] rounded-[16px] items-center justify-center bg-white/10 border border-white/20">
            <MaterialCommunityIcons name="finance" size={28} color={Colors.white} />
          </View>
          <View>
            <Text className="text-white text-[30px] leading-[33px] font-black">Investor Desk</Text>
            <Text className="mt-2 text-white/76 text-sm leading-[20px] font-semibold">
              Choose a package and schedule your office visit before the transaction.
            </Text>
          </View>
        </View>
      }
    >
      <View className="flex-row items-center justify-between gap-3 mb-4">
        <View className="flex-1 min-w-0">
          <Text className="text-2xl leading-[30px] font-black text-textPrimary">Contract Scheduling</Text>
          <Text className="mt-1 text-sm leading-[20px] text-textSecondary font-semibold">
            Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}. Pick a target range and schedule your Reyland office visit.
          </Text>
        </View>
        <View className="w-[44px] h-[44px] rounded-[22px] items-center justify-center bg-tag">
          <Ionicons name="checkmark-circle-outline" size={22} color={Colors.accent} />
        </View>
      </View>

      <View className="rounded-[18px] border border-border bg-surfaceMuted p-4 mb-4">
        <View className="flex-row items-start gap-3">
          <View className="w-9 h-9 rounded-[18px] items-center justify-center bg-tag">
            <Ionicons name="business-outline" size={18} color={Colors.accent} />
          </View>
          <View className="flex-1 min-w-0">
            <Text className="text-textPrimary text-base font-black">Office visit required</Text>
            <Text className="mt-1 text-textSecondary text-[13px] leading-[19px] font-semibold">
              The investor must visit the Reyland office for contract signing before the admin manually records the investment transaction.
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-textPrimary text-lg font-black mb-3">Choose investment range</Text>
      <View className="gap-3 mb-4">
        {INVESTOR_PLANS.map((plan) => {
          const selected = plan.id === selectedPlan.id;
          return (
            <Pressable
              key={plan.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setSelectedPlanId(plan.id)}
              className={`rounded-[18px] border p-4 active:opacity-[0.78] ${
                selected ? 'bg-tag border-accent' : 'bg-surface border-border'
              }`}
            >
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 min-w-0">
                  <Text className="text-textPrimary text-base font-black">{plan.label}</Text>
                  <Text className="mt-1 text-textSecondary text-[13px] font-bold">{plan.range}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-accent text-xl font-black">{plan.annualRate}%</Text>
                  <Text className="text-textMuted text-[11px] font-extrabold">per annum</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="rounded-[18px] border border-border bg-surface p-4 mb-4">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1 min-w-0">
            <Text className="text-textPrimary text-base font-black">3-year lock-in bonus</Text>
            <Text className="mt-1 text-textSecondary text-[13px] leading-[18px] font-semibold">
              Add 10% to the annual rate when the investor chooses a 3-year lock-in.
            </Text>
          </View>
          <Switch
            value={lockIn}
            onValueChange={setLockIn}
            trackColor={{ false: Colors.border, true: Colors.accentLight }}
            thumbColor={lockIn ? Colors.accent : Colors.white}
          />
        </View>
      </View>

      <View className="rounded-[18px] bg-primary p-4 mb-5">
        <View className="flex-row items-center justify-between gap-3 pb-3 border-b border-white/15">
          <Text className="text-white text-xs font-black">Selected package</Text>
          <Text className="text-white text-sm font-black">{selectedPlan.range}</Text>
        </View>
        <View className="flex-row items-center justify-between gap-3 py-3 border-b border-white/15">
          <Text className="text-white text-xs font-black">Annual rate</Text>
          <Text className="text-white text-sm font-black">{totalAnnualRate}% per annum</Text>
        </View>
        <View className="flex-row items-center justify-between gap-3 pt-3">
          <Text className="text-white text-xs font-black">Estimate from minimum</Text>
          <Text className="text-white text-sm font-black">
            {formatPeso(estimatedAnnualReturn)} / year
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: checkingActiveSchedule || hasActiveSchedule }}
        onPress={() => setModalVisible(true)}
        disabled={checkingActiveSchedule || hasActiveSchedule}
        className={`min-h-[52px] rounded-full items-center justify-center mb-2 ${
          checkingActiveSchedule || hasActiveSchedule
            ? 'bg-border opacity-[0.72]'
            : 'bg-accent active:opacity-[0.86]'
        }`}
      >
        <Text
          className={`text-[15px] font-black ${
            checkingActiveSchedule || hasActiveSchedule ? 'text-textMuted' : 'text-textOnDark'
          }`}
        >
          {checkingActiveSchedule
            ? 'CHECKING SCHEDULE...'
            : hasActiveSchedule
              ? 'CONTRACT SIGNING REQUESTED'
              : 'SCHEDULE CONTRACT SIGNING'}
        </Text>
      </Pressable>

      <ScheduleContractModal
        visible={modalVisible}
        userName={user?.name ?? ''}
        userEmail={user?.email ?? ''}
        userPhone={user?.phone ?? ''}
        plan={selectedPlan}
        totalAnnualRate={totalAnnualRate}
        lockIn={lockIn}
        isSubmitDisabled={scheduleDisabled}
        isSubmitting={submittingSchedule}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitInquiry}
        onPressDate={schedulePicker.openDatePicker}
        visitDateLabel={schedulePicker.visitDateLabel}
        visitTimeLabel={schedulePicker.visitTimeLabel}
        onPressTime={schedulePicker.openTimePicker}
        activePicker={schedulePicker.activePicker}
        draftDate={schedulePicker.draftDate}
        draftTime={schedulePicker.draftTime}
        onChangeDraftDate={schedulePicker.updateDraftDate}
        onChangeDraftTime={schedulePicker.updateDraftTime}
        onConfirmPicker={schedulePicker.confirmPicker}
        onCancelPicker={schedulePicker.cancelPicker}
      />
    </AuthScreen>
  );
}
