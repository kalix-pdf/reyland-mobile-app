import { HomeScreen } from "@/components/home/home-screen";
import { useAuth } from "@/context/auth-context";
import { Redirect } from "expo-router";

export default function DiscoverScreen() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/" />;
  }

  return <HomeScreen />;
}
