import { AccountApprovalRequired } from '@/components/helper/account-approval-required';
import { InvestorDashboard } from '@/components/investor/dashboard/investor-dashboard';
import { WelcomeInvestorPage } from '@/components/investor/welcome/welcome-page';
import { useAuth } from '@/context/auth-context';
import { router } from 'expo-router';
import { useState } from 'react';

const USER_STATUS_VERIFIED = 1;
const USER_ROLE_APPROVED_INVESTOR = 1;

export default function Investor() {
  const { user } = useAuth();

  const isVerified = user?.status === USER_STATUS_VERIFIED;
  const isApprovedInvestor = user?.role === USER_ROLE_APPROVED_INVESTOR;
  
  if (!isVerified) {
    return <AccountApprovalRequired />
  }

  if (isApprovedInvestor) {
    return <InvestorDashboard />;
  }

  return <WelcomeInvestorPage onGetStarted={() => router.push('/investor/investor-sign-up')} />;

  // return <SignUpInvestorForm />;
}
