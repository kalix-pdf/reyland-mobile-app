import { LoginForm } from "@/components/profile/login-form";
import { ViewProfile } from "@/components/profile/profile-view";
import { useAuth } from "@/context/auth-context";

export default function ProfileScreen() {
  const { user, login, logout } = useAuth();

  return user ? <ViewProfile user={user} onLogout={logout} /> : <LoginForm onLogin={login} />;
}
