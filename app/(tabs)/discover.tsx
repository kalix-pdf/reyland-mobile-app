import { useAuth } from "@/context/auth-context";
import { Redirect } from "expo-router";
import { PropertiesScreen } from "@/components/home/properties";

export default function DiscoverScreen() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/" />;
  }

  return <PropertiesScreen />;
}
