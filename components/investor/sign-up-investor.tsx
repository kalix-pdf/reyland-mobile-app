import { AuthButton } from '@/components/auth/auth-button';
import { AuthScreen } from '@/components/auth/auth-screen';
import { InvestorDashboard } from '@/components/investor/investor-dashboard';
import { DateTimePickerModal } from '@/components/property-details';
import { useAuth } from '@/context/auth-context';
import { useAppTheme } from '@/context/theme-context';
import { useSchedulePicker } from '@/hooks/property_details/useSchedulePicker';
import { useRefreshControl } from '@/hooks/use-refresh-control';
import { setCachedUser } from '@/services/auth/auth-session';
import { getUserInfo } from '@/services/fetchData/user-info.api';
import { InvestorApiError, requestInvestorAccess } from '@/services/investor/investor.api';
import { createVisitDateTimeISO } from '@/utils/property-details.utils';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, RefreshControl, Switch, Text, View } from 'react-native';

const INVESTOR_BENEFITS = [
  'Submit investor access and contract signing intent in one flow',
  'Choose your target investment range and lock-in preference',
  'Receive contract signing details and next steps through Gmail',
];

type InvestorPlan = {
  id: string;
  code: number;
  range: string;
  label: string;
  annualRate: number;
  minimum: number;
};

const INVESTOR_PLANS: InvestorPlan[] = [
  { id: 'starter', code: 1, range: '100k to 499k', label: 'Starter', annualRate: 15, minimum: 100000 },
  { id: 'growth', code: 2, range: '500k to 999k', label: 'Growth', annualRate: 17, minimum: 500000 },
  { id: 'premier', code: 3, range: '1M to 1.999M', label: 'Premier', annualRate: 20, minimum: 1000000 },
  { id: 'elite', code: 4, range: '2M to 5M', label: 'Elite', annualRate: 24, minimum: 2000000 },
];

function formatPeso(value: number) {
  if (value >= 1000000) {
    return `PHP ${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 2)}M`;
  }

  return `PHP ${Math.round(value / 1000)}k`;
}

export function SignUpInvestorForm() {
  const { colors } = useAppTheme();
  const { user, setUser } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(INVESTOR_PLANS[0].id);
  const [lockIn, setLockIn] = useState(false);

  const userType = user?.role ?? 0;
  const isApproved = userType === 1;
  const isPending = userType === 2;
  const schedulePicker = useSchedulePicker();
  const selectedPlan = useMemo(
    () => INVESTOR_PLANS.find((plan) => plan.id === selectedPlanId) ?? INVESTOR_PLANS[0],
    [selectedPlanId],
  );
  const totalAnnualRate = selectedPlan.annualRate + (lockIn ? 10 : 0);
  const estimatedAnnualReturn = selectedPlan.minimum * (totalAnnualRate / 100);
  const canSubmit =
    agreed &&
    schedulePicker.visitDateLabel.trim().length > 0 &&
    schedulePicker.visitTimeLabel.trim().length > 0;

  const refreshUser = useCallback(async () => {
    const latestUser = await getUserInfo();
    const nextUser = {
      ...latestUser,
      accessToken: latestUser.accessToken || user?.accessToken || '',
    };

    setUser(nextUser);
    await setCachedUser(nextUser);
  }, [setUser, user?.accessToken]);

  const { refreshing, onRefresh } = useRefreshControl(refreshUser);

  if (isApproved) {
    return <InvestorDashboard />;
  }

  const updateLocalUserType = async (nextUserType: number) => {
    if (!user) return;

    const nextUser = { ...user, role: nextUserType };
    setUser(nextUser);
    await setCachedUser(nextUser);
  };

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;

    try {
      setLoading(true);
      const nextUserType = await requestInvestorAccess({
        investment_plan_range: selectedPlan.code,
        is_lock_in: lockIn,
        preferred_signing_at: createVisitDateTimeISO(
          schedulePicker.committedDate,
          schedulePicker.committedTime,
        ),
      });
      await updateLocalUserType(nextUserType);

      Alert.alert(
        'Investor request submitted',
        'Thank you for your interest. Our team will review your investor access request and send contract signing details through Gmail.',
      );
    } catch (error) {
      if (error instanceof InvestorApiError && error.userType !== undefined) {
        await updateLocalUserType(error.userType);

        Alert.alert(
          error.userType === 1 ? 'Investor approved' : 'Investor request submitted',
          error.message,
        );
        return;
      }

      Alert.alert(
        'Unable to submit request',
        error instanceof Error ? error.message : 'Please try again in a moment.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthScreen
        heroTitle={`Investor\nAccess`}
        scrollEnabled
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
      >
      <View className="w-[54px] h-[54px] rounded-[14px] items-center justify-center bg-tag border border-border mb-[18px]">
        <MaterialCommunityIcons name="chart-timeline-variant" size={26} color={colors.accent} />
      </View>

      <Text className="text-2xl leading-[30px] font-black text-textPrimary mb-2">
        Become a Reyland Investor
      </Text>
      <Text className="text-sm leading-[21px] text-textSecondary mb-[22px]">
        {isApproved
          ? 'Your investor access has been approved. You can now use investor features as they become available.'
          : isPending
            ? 'Your investor registration has been submitted. Reyland PH will review your request and approve your access from the admin portal.'
            : 'Sign up for investor access to review opportunities, monitor your portfolio, and receive guided support from Reyland PH.'}
      </Text>

      {isPending ? (
        <View className="rounded-[20px] border border-border bg-surfaceMuted p-4 mb-[18px]">
          <View className="flex-row items-center gap-2.5 mb-2">
            <Ionicons
              name="time-outline"
              size={20}
              color={colors.accent}
            />
            <Text className="text-base font-black text-textPrimary">
              Registration Submitted
            </Text>
          </View>
          <Text className="text-sm leading-[21px] text-textSecondary font-semibold">
            Your request is pending admin approval. Contract signing details will be sent through Gmail after review.
          </Text>
        </View>
      ) : (
        <>
          <View className="gap-3 py-[18px] border-y border-border mb-[18px]">
            {INVESTOR_BENEFITS.map((benefit) => (
              <View key={benefit} className="flex-row items-start gap-2.5">
                <View className="w-[22px] h-[22px] rounded-[11px] items-center justify-center bg-tag mt-px">
                  <Ionicons name="checkmark" size={13} color={colors.accent} />
                </View>
                <Text className="flex-1 text-sm leading-[21px] text-textPrimary font-semibold">
                  {benefit}
                </Text>
              </View>
            ))}
          </View>

          <View className="rounded-[18px] border border-border bg-surfaceMuted p-4 mb-[18px]">
            <View className="flex-row items-center gap-2.5 mb-3">
              <View className="w-8 h-8 rounded-[16px] items-center justify-center bg-tag">
                <Ionicons name="briefcase-outline" size={16} color={colors.accent} />
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-textPrimary text-base font-black">Investment intent</Text>
                <Text className="mt-0.5 text-textSecondary text-xs font-bold">
                  Choose the range to prepare for contract signing.
                </Text>
              </View>
            </View>

            <View className="gap-2.5">
              {INVESTOR_PLANS.map((plan) => {
                const selected = plan.id === selectedPlan.id;
                return (
                  <Pressable
                    key={plan.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setSelectedPlanId(plan.id)}
                    className={`rounded-2xl border p-3 active:opacity-[0.78] ${
                      selected ? 'bg-tag border-accent' : 'bg-background border-border'
                    }`}
                  >
                    <View className="flex-row items-center justify-between gap-3">
                      <View className="flex-1 min-w-0">
                        <Text className="text-textPrimary text-sm font-black">{plan.label}</Text>
                        <Text className="mt-0.5 text-textSecondary text-xs font-bold">{plan.range}</Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-accent text-base font-black">{plan.annualRate}%</Text>
                        <Text className="text-textMuted text-[10px] font-extrabold">per annum</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="rounded-[18px] border border-border bg-surface p-4 mb-[18px]">
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1 min-w-0">
                <Text className="text-textPrimary text-base font-black">3-year lock-in bonus</Text>
                <Text className="mt-1 text-textSecondary text-[13px] leading-[18px] font-semibold">
                  Add 10% to the annual rate when you choose a 3-year lock-in.
                </Text>
              </View>
              <Switch
                value={lockIn}
                onValueChange={setLockIn}
                trackColor={{ false: colors.border, true: colors.accentLight }}
                thumbColor={lockIn ? colors.accent : colors.white}
              />
            </View>
          </View>

          <View className="rounded-[18px] border border-border bg-surfaceMuted p-4 mb-[18px]">
            <View className="flex-row items-center gap-2.5 mb-3">
              <View className="w-8 h-8 rounded-[16px] items-center justify-center bg-tag">
                <Ionicons name="calendar-outline" size={16} color={colors.accent} />
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-textPrimary text-base font-black">Preferred contract signing</Text>
                <Text className="mt-0.5 text-textSecondary text-xs font-bold">
                  Select your preferred Reyland office visit schedule.
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2.5">
              <View className="flex-1 gap-[7px]">
                <Text className="text-textSecondary text-xs font-black">Visit date</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Select contract signing date"
                  onPress={schedulePicker.openDatePicker}
                  className="min-h-[50px] flex-row items-center justify-between gap-2 px-3.5 py-3 rounded-2xl border border-border bg-background active:opacity-[0.78]"
                >
                  <Text
                    className={`flex-1 text-[13px] font-extrabold ${
                      schedulePicker.visitDateLabel ? 'text-textPrimary' : 'text-textMuted'
                    }`}
                    numberOfLines={1}
                  >
                    {schedulePicker.visitDateLabel || 'Select date'}
                  </Text>
                  <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
                </Pressable>
              </View>

              <View className="flex-1 gap-[7px]">
                <Text className="text-textSecondary text-xs font-black">Visit time</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Select contract signing time"
                  onPress={schedulePicker.openTimePicker}
                  className="min-h-[50px] flex-row items-center justify-between gap-2 px-3.5 py-3 rounded-2xl border border-border bg-background active:opacity-[0.78]"
                >
                  <Text
                    className={`flex-1 text-[13px] font-extrabold ${
                      schedulePicker.visitTimeLabel ? 'text-textPrimary' : 'text-textMuted'
                    }`}
                    numberOfLines={1}
                  >
                    {schedulePicker.visitTimeLabel || 'Select time'}
                  </Text>
                  <Ionicons name="time-outline" size={18} color={colors.textMuted} />
                </Pressable>
              </View>
            </View>
          </View>

          <View className="rounded-[18px] bg-primary p-4 mb-[18px]">
            <CombinedSummaryRow label="Selected package" value={selectedPlan.range} />
            <CombinedSummaryRow label="Annual rate" value={`${totalAnnualRate}% per annum`} />
            <CombinedSummaryRow
              label="Lock-in"
              value={lockIn ? '3 years selected' : 'Not selected'}
            />
            <CombinedSummaryRow
              label="Estimate from minimum"
              value={`${formatPeso(estimatedAnnualReturn)} / year`}
              last
            />
          </View>

          <View className="flex-row items-start gap-2.5 rounded-[16px] bg-tag p-3.5 mb-[18px]">
            <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
            <Text className="flex-1 text-tagText text-[12.5px] leading-[18px] font-bold">
              The office visit is for contract signing. The admin will manually record the investment transaction after signing.
            </Text>
          </View>

          <Pressable
            onPress={() => setAgreed((current) => !current)}
            className="flex-row items-start gap-2.5 rounded-xl border border-border bg-surfaceMuted p-3 mb-[18px] active:opacity-65"
            hitSlop={4}
          >
            <View
              className={`w-[19px] h-[19px] rounded-[5px] border-[1.5px] items-center justify-center mt-px ${
                agreed ? 'bg-accent border-accent' : 'border-border'
              }`}
            >
              {agreed ? <Ionicons name="checkmark" size={12} color={colors.white} /> : null}
            </View>
            <Text className="flex-1 text-[12.5px] leading-[18px] text-textSecondary font-semibold">
              I agree to the investor{' '}
              <Text className="text-accent font-extrabold">terms and conditions</Text>,{' '}
              <Text className="text-accent font-extrabold">privacy policy</Text>, and eligibility
              review.
            </Text>
          </Pressable>

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

function CombinedSummaryRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View className={`flex-row items-center justify-between gap-3 py-2 ${last ? '' : 'border-b border-white/15'}`}>
      <Text className="text-white text-xs font-black">{label}</Text>
      <Text className="flex-1 text-right text-white text-[13px] font-black" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
