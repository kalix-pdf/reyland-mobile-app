import type { UserRequest } from '@/services/fetchData/requests/request.api';
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

  if (error) return null;

  const isEmpty = previewRequests.length === 0

  return (
    <View className="mx-[18px] mt-[15px] gap-3">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-[21px] font-black tracking-[-0.4px] text-textPrimary">Your Requests</Text>
          <Text className="mt-1 text-[13px] font-semibold text-textMuted">Pending and upcoming activity</Text>
        </View>

        {!isEmpty && (
          <Pressable
            className="flex-row items-center gap-1 py-2"
            style={({ pressed }) => pressed && sharedPressedScale}
            onPress={() => router.push('/requests')}
          >
            <Text className="text-[13px] font-extrabold text-accent">View All</Text>
            <Ionicons name="chevron-forward" size={15} color="#008C4F" />
          </Pressable>
        )}
      </View>

      {isEmpty ? (
        <View className="items-center rounded-[18px] border border-border bg-surface px-5 py-7">
          <Ionicons name="document-text-outline" size={22} color="#9CA3AF" />
          <Text className="mt-2 text-[15px] font-black text-textPrimary">No requests yet</Text>
          <Text className="mt-1 text-[13px] font-semibold text-textMuted text-center">
            Here&apos;s what you can request once you find a property you like.
          </Text>

          <View className="mt-3 gap-1.5 self-stretch">
            <View className="flex-row items-center gap-2">
              <Ionicons name="checkmark-circle" size={16} color="#008C4F" />
              <Text className="text-[13px] font-semibold text-textSecondary">Schedule a site visit</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="checkmark-circle" size={16} color="#008C4F" />
              <Text className="text-[13px] font-semibold text-textSecondary">Send an inquiry to a developer</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="checkmark-circle" size={16} color="#008C4F" />
              <Text className="text-[13px] font-semibold text-textSecondary">Reserve a unit you&apos;re interested in</Text>
            </View>
          </View>

          <Pressable
            className="mt-4 flex-row items-center gap-1 bg-accent px-4 py-2.5 rounded-full"
            style={({ pressed }) => pressed && sharedPressedScale}
            onPress={() => router.push('/(tabs)/discover')}
          >
            <Text className="text-[13px] font-extrabold text-white">Get Started</Text>
            <Ionicons name="chevron-forward" size={15} color="#fff" />
          </Pressable>
        </View>
      ) : (
        previewRequests.map((request) => (
          <UserRequestCard key={request.id} request={request} compact />
        ))
      )}
    </View>
  );
}
