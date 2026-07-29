import { HeaderNav, HeaderShell } from '@/components/header';
import { ErrorScreen } from '@/components/helper/error-project';
import { UserRequestCard } from '@/components/requests/user-request-card';
import { Colors } from '@/constants/colors';
import { useRequests } from '@/hooks/use-requests';
import type { RequestFilter } from '@/services/requests/request.api';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FILTERS: { key: RequestFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'investment', label: 'Investment' },
  { key: 'site_visit', label: 'Site Visits' },
  { key: 'inquiry', label: 'Inquiries' },
];

export default function RequestsScreen() {
  const [filter, setFilter] = useState<RequestFilter>('all');
  const { requests, allRequests, loading, refreshing, error, refresh, retry } = useRequests(filter);

  const counts = useMemo(
    () => ({
      all: allRequests.length,
      investment: allRequests.filter((request) => request.kind === 'investment').length,
      site_visit: allRequests.filter((request) => request.kind === 'site_visit').length,
      inquiry: allRequests.filter((request) => request.kind === 'inquiry').length,
    }),
    [allRequests],
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <HeaderShell transparent>
        <HeaderNav title="My Requests" />
      </HeaderShell>

      <View className="px-5 pt-2 pb-3">
        <View className="flex-row flex-wrap gap-2">
          {FILTERS.map((item) => {
            const selected = filter === item.key;

            return (
              <Pressable
                key={item.key}
                onPress={() => setFilter(item.key)}
                className={`px-3.5 py-2 rounded-full border ${
                  selected ? 'bg-primary border-primary' : 'bg-surface border-border'
                }`}
              >
                <Text className={`text-[12px] font-black ${selected ? 'text-white' : 'text-textSecondary'}`}>
                  {item.label} {counts[item.key] > 0 ? counts[item.key] : ''}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {renderContent()}
    </SafeAreaView>
  );

  function renderContent() {
    if (loading && allRequests.length === 0) {
      return (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text className="text-sm font-semibold text-textSecondary">Loading your requests...</Text>
        </View>
      );
    }

    if (error && allRequests.length === 0) {
      return <ErrorScreen message={error} onRetry={retry} />;
    }

    if (!loading && requests.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-8 gap-3">
          <View className="w-16 h-16 rounded-full bg-tag items-center justify-center">
            <Ionicons name="file-tray-outline" size={30} color={Colors.accentDark} />
          </View>
          <Text className="text-[17px] font-black text-textPrimary text-center">No requests yet</Text>
          <Text className="text-sm leading-5 font-semibold text-textMuted text-center max-w-[270px]">
            Inquiries, site visits, and investment requests will appear here after you submit them.
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pb-8 gap-3"
        renderItem={({ item }) => <UserRequestCard request={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.accent} />}
      />
    );
  }
}
