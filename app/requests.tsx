import { HeaderNav, HeaderShell } from '@/components/header';
import { ErrorScreen } from '@/components/helper/error-project';
import { UserRequestCard } from '@/components/requests/user-request-card';
import { Colors } from '@/constants/colors';
import { useRequests } from '@/hooks/requests/use-requests';
import type {
  RequestFilter,
  RequestKind,
  UserRequest,
} from '@/services/fetchData/requests/request.api';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type RequestCounts = Record<RequestFilter, number>;

type RequestFilterOption = {
  key: RequestFilter;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const FILTERS: RequestFilterOption[] = [
  { key: 'all', label: 'All', icon: 'apps-outline' },
  { key: 'investment', label: 'Investment', icon: 'trending-up-outline' },
  { key: 'withdrawal', label: 'Withdrawal', icon: 'arrow-down-circle-outline' },
  { key: 'site_visit', label: 'Site Visits', icon: 'calendar-outline' },
  { key: 'inquiry', label: 'Inquiries', icon: 'chatbubble-ellipses-outline' },
];

export default function RequestsScreen() {
  const [filter, setFilter] = useState<RequestFilter>('all');
  const {
    requests,
    allRequests,
    loading,
    refreshing,
    error,
    refresh,
    retry,
  } = useRequests(filter);

  const counts = useMemo(() => getRequestCounts(allRequests), [allRequests]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <HeaderShell transparent>
        <HeaderNav title="My Requests" />
      </HeaderShell>

      <RequestFilterBar
        selected={filter}
        counts={counts}
        onSelect={setFilter}
      />

      <RequestsContent
        requests={requests}
        allRequests={allRequests}
        loading={loading}
        refreshing={refreshing}
        error={error}
        onRefresh={refresh}
        onRetry={retry}
      />
    </SafeAreaView>
  );
}

function RequestFilterBar({
  selected,
  counts,
  onSelect,
}: {
  selected: RequestFilter;
  counts: RequestCounts;
  onSelect: (filter: RequestFilter) => void;
}) {
  return (
    <View className="px-5 pb-3 pt-2">
      <Text className="mb-2 text-[12px] font-black uppercase text-textSecondary">
        Request type
      </Text>

      <View className="flex-row flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <RequestFilterChip
            key={filter.key}
            filter={filter}
            count={counts[filter.key]}
            selected={selected === filter.key}
            onPress={() => onSelect(filter.key)}
          />
        ))}
      </View>
    </View>
  );
}

function RequestFilterChip({
  filter,
  count,
  selected,
  onPress,
}: {
  filter: RequestFilterOption;
  count: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`min-h-[38px] flex-row items-center gap-1.5 rounded-[15px] border px-3 ${
        selected ? 'border-primary bg-primary' : 'border-border bg-surface'
      }`}
    >
      <Ionicons
        name={filter.icon}
        size={14}
        color={selected ? Colors.textOnDark : Colors.accent}
      />

      <Text
        className={`text-[12px] font-black ${
          selected ? 'text-textOnDark' : 'text-textSecondary'
        }`}
      >
        {filter.label}
      </Text>

      <View
        className={`min-w-[22px] rounded-full px-1.5 py-0.5 ${
          selected ? 'bg-textOnDark/15' : 'bg-surfaceMuted'
        }`}
      >
        <Text
          className={`text-center text-[10px] font-black ${
            selected ? 'text-textOnDark' : 'text-textMuted'
          }`}
        >
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

function RequestsContent({
  requests,
  allRequests,
  loading,
  refreshing,
  error,
  onRefresh,
  onRetry,
}: {
  requests: UserRequest[];
  allRequests: UserRequest[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  onRetry: () => void;
}) {
  if (loading && allRequests.length === 0) {
    return <LoadingRequestsState />;
  }

  if (error && allRequests.length === 0) {
    return <ErrorScreen message={error} onRetry={onRetry} />;
  }

  if (!loading && requests.length === 0) {
    return <EmptyRequestsState />;
  }

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item.id}
      contentContainerClassName="gap-3 px-5 pb-8"
      renderItem={({ item }) => <UserRequestCard request={item} />}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.accent}
        />
      }
    />
  );
}

function LoadingRequestsState() {
  return (
    <View className="flex-1 items-center justify-center gap-3">
      <ActivityIndicator size="large" color={Colors.accent} />
      <Text className="text-sm font-semibold text-textSecondary">
        Loading your requests...
      </Text>
    </View>
  );
}

function EmptyRequestsState() {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-tag">
        <Ionicons name="file-tray-outline" size={30} color={Colors.accentDark} />
      </View>

      <Text className="text-center text-[17px] font-black text-textPrimary">
        No requests yet
      </Text>

      <Text className="max-w-[270px] text-center text-sm font-semibold leading-5 text-textMuted">
        Inquiries, site visits, and investment requests will appear here after
        you submit them.
      </Text>
    </View>
  );
}

function getRequestCounts(requests: UserRequest[]): RequestCounts {
  return requests.reduce<RequestCounts>(
    (counts, request) => {
      counts.all += 1;
      counts[request.kind as RequestKind] += 1;
      return counts;
    },
    {
      all: 0,
      investment: 0,
      withdrawal: 0,
      site_visit: 0,
      inquiry: 0,
    },
  );
}
