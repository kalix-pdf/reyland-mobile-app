import { INVESTOR_PLANS, InvestorPlan } from '@/constants/investor-plans';
import { useAuth } from '@/context/auth-context';
import { useSchedulePicker } from '@/hooks/property_details/useSchedulePicker';
import { useRefreshControl } from '@/hooks/use-refresh-control';
import { setCachedUser } from '@/services/auth/auth-session';
import { getUserInfo } from '@/services/fetchData/user-info.api';
import { InvestorApiError, requestInvestorAccess } from '@/services/investor/investor.api';
import { calculateEstimatedAnnualReturn } from '@/utils/investor.utils';
import { createVisitDateTimeISO } from '@/utils/property-details.utils';
import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';

const PENDING_APPROVAL_ROLE = 2;

export function useInvestorSignupForm() {
  const { user, setUser } = useAuth();

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(INVESTOR_PLANS[0].id);
  const [lockIn, setLockIn] = useState(false);

  const schedulePicker = useSchedulePicker();
  const isPendingApproval = user?.role === PENDING_APPROVAL_ROLE;

  const selectedPlan: InvestorPlan = useMemo(
    () => INVESTOR_PLANS.find((plan) => plan.id === selectedPlanId) ?? INVESTOR_PLANS[0],
    [selectedPlanId],
  );

  const estimatedAnnualReturn = useMemo(
    () => calculateEstimatedAnnualReturn(selectedPlan.minimum, selectedPlan.annualRate),
    [selectedPlan],
  );

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

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || loading) return;

    try {
      setLoading(true);
      await requestInvestorAccess({
        investment_plan_range: selectedPlan.code,
        is_lock_in: lockIn,
        preferred_signing_at: createVisitDateTimeISO(
          schedulePicker.committedDate,
          schedulePicker.committedTime,
        ),
      });

      Alert.alert(
        'Investor request submitted',
        'Thank you for your interest. Our team will review your investor access request and send contract signing details through Gmail.',
      );
    } catch (error) {
      if (error instanceof InvestorApiError && error.userType !== undefined) {
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
  }, [canSubmit, loading, selectedPlan.code, lockIn, schedulePicker.committedDate, schedulePicker.committedTime]);

  return {
    agreed,
    setAgreed,
    loading,
    lockIn,
    setLockIn,
    selectedPlan,
    setSelectedPlanId,
    estimatedAnnualReturn,
    canSubmit,
    isPendingApproval,
    schedulePicker,
    refreshing,
    onRefresh,
    handleSubmit,
  };
}