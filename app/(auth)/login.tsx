import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/context/auth-context';
import { Redirect, router } from 'expo-router';

export default function LoginScreen() {
  const { login, user } = useAuth();

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <LoginForm
      onLogin={async (email, password) => {
        const result = await login(email, password);

        if (result.success) {
          router.replace('/(tabs)');
        }

        return result;
      }}
      onCreateAccount={() => router.replace('/sign-up')}
      onForgotPassword={() => router.push('/forgot-password')}
    />
  );
}
