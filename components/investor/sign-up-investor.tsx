import { AuthButton } from '@/components/auth/auth-button';
import { AuthScreen } from '@/components/auth/auth-screen';
import { useAuth } from '@/context/auth-context';
import { useAppTheme } from '@/context/theme-context';
import { useRefreshControl } from '@/hooks/use-refresh-control';
import { setCachedUser } from '@/services/auth/auth-session';
import { getUserInfo } from '@/services/fetchData/user-info.api';
import { InvestorApiError, requestInvestorAccess } from '@/services/investor/investor.api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, RefreshControl, Text, View } from 'react-native';

const INVESTOR_BENEFITS = [
  'Access curated Reyland property opportunities',
  'Track portfolio growth and investment activity',
  'Receive investor updates and onboarding support',
];

export function SignUpInvestorForm() {
  const { colors } = useAppTheme();
  const { user, setUser } = useAuth();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const userType = user?.role ?? 0;
  const isApproved = userType === 1;
  const isPending = userType === 2;

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

  const updateLocalUserType = async (nextUserType: number) => {
    if (!user) return;

    const nextUser = { ...user, role: nextUserType };
    setUser(nextUser);
    await setCachedUser(nextUser);
  };

  const handleSubmit = async () => {
    if (!agreed || loading) return;

    try {
      setLoading(true);
      const nextUserType = await requestInvestorAccess();
      await updateLocalUserType(nextUserType);

      Alert.alert(
        'Investor request submitted',
        'Thank you for your interest. Our team will review your investor access request.',
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

      {isPending || isApproved ? (
        <View className="rounded-[20px] border border-border bg-surfaceMuted p-4 mb-[18px]">
          <View className="flex-row items-center gap-2.5 mb-2">
            <Ionicons
              name={isApproved ? 'checkmark-circle-outline' : 'time-outline'}
              size={20}
              color={colors.accent}
            />
            <Text className="text-base font-black text-textPrimary">
              {isApproved ? 'Investor Approved' : 'Registration Submitted'}
            </Text>
          </View>
          <Text className="text-sm leading-[21px] text-textSecondary font-semibold">
            {isApproved
              ? 'Your account is marked as an approved investor.'
              : 'Your request is pending admin approval.'}
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
            title="SIGN UP AS INVESTOR"
            loadingTitle="Submitting..."
            loading={loading}
            disabled={!agreed}
            onPress={handleSubmit}
          />
        </>
      )}
    </AuthScreen>
  );
}
