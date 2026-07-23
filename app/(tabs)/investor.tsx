import { AccountApprovalRequired } from '@/components/helper/account-approval-required';
import { InvestorDashboard } from '@/components/investor/dashboard/investor-dashboard';
import { SignUpInvestorForm } from '@/components/investor/sign-up/sign-up-investor';
import { useAuth } from '@/context/auth-context';

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

  return <SignUpInvestorForm />;
}
