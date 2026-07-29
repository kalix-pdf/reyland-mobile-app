import type { UserRequest } from '@/services/requests/request.api';
import { sharedPressedScale } from '@/styles/shared-primitives';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { UserRequestCard } from './user-request-card';

type HomeRequestsPreviewProps = {
  activeRequests: UserRequest[];
  loading: boolean;
  error: string | null;
};

export function HomeRequestsPreview({ activeRequests, loading, error }: HomeRequestsPreviewProps) {
  const previewRequests = activeRequests.slice(0, 2);

  if (loading) {
    return (
      <View className="mx-[18px] mt-[15px] rounded-[18px] border border-border bg-surface p-4">
        <View className="flex-row items-center gap-2">
          <ActivityIndicator size="small" />
          <Text className="text-[13px] font-semibold text-textSecondary">Checking your requests...</Text>
        </View>
      </View>
    );
  }

  if (error || previewRequests.length === 0) return null;

  return (
    <View className="mx-[18px] mt-[15px] gap-3">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-[21px] font-black tracking-[-0.4px] text-textPrimary">Your Requests</Text>
          <Text className="mt-1 text-[13px] font-semibold text-textMuted">Pending and upcoming activity</Text>
        </View>

        <Pressable
          className="flex-row items-center gap-1 py-2"
          style={({ pressed }) => pressed && sharedPressedScale}
          onPress={() => router.push('/requests')}
        >
          <Text className="text-[13px] font-extrabold text-accent">View All</Text>
          <Ionicons name="chevron-forward" size={15} color="#008C4F" />
        </Pressable>
      </View>

      {previewRequests.map((request) => (
        <UserRequestCard key={request.id} request={request} compact />
      ))}
    </View>
  );
}
