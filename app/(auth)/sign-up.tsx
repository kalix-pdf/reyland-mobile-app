import { registerUser } from '@/services/auth/auth-register';
import { AuthApiError } from '@/services/auth/auth-shared';
import { router } from 'expo-router';
import { SignUpForm } from '@/components/auth/sign-up-form';

export default function SignUpScreen() {
  const handleSignUp = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const result = await registerUser(name, email, password);

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof AuthApiError) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: false,
        message: 'Something went wrong. Please try again.',
      };
    }
  };

  return (
    <SignUpForm
      onSignUp={handleSignUp}
      onLogin={() => router.replace('/login')}
    />
  );
}
