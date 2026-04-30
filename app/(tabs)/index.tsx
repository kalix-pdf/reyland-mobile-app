import { HomeScreen as SharedHomeScreen } from "@/components/home/home-screen";
import { useAuth } from "@/context/auth-context";
import { Redirect } from "expo-router";

export default function HomeScreen() {
  const { user } = useAuth();
  if (!user) {
    return <Redirect href="/" />;
  }

  return <SharedHomeScreen />;
}
