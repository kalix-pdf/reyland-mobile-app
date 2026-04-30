import { router } from "expo-router";
import { SignUpForm } from "../components/auth/sign-up-form";

export default function SignUpScreen() {
  return (
    <SignUpForm
      onSignUp={async (name, email, password) => {
        console.log("Sign up:", { name, email, password });

        // Temporary mock success
        return true;
      }}
      onLogin={() => router.replace("/login")}
      onGoogleSignUp={() => console.log("Google sign up")}
      onFacebookSignUp={() => console.log("Facebook sign up")}
    />
  );
}
