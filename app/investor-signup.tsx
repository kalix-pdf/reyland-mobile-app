import { SignUpInvestorForm } from '@/components/investor/sign-up-investor';
import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';

export default function InvestorSignupScreen() {
  const { user } = useAuth();

  if (user?.role === 1) {
    return <Redirect href="/(tabs)" />;
  }

  return <SignUpInvestorForm />;
}
