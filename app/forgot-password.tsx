import { router } from "expo-router";
import { ForgotPasswordForm } from "../components/auth/forgot-password-form";

export default function ForgotPasswordScreen() {
  return (
    <ForgotPasswordForm
      onSubmit={async (email) => {
        console.log("Reset password:", email);
        return true;
      }}
      onLogin={() => router.back()}
    />
  );
}
