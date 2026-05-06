// import { HomeScreen } from "@/components/home/home-screen";
import { useAuth } from "@/context/auth-context";
import { Redirect } from "expo-router";
import { HomeDashboard } from "@/components/home/home-dashboard";

export default function IndexScreen() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <HomeDashboard />;
}
