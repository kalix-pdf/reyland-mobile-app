import { HeaderNav, HeaderShell } from '@/components/header';
import { TransactionRow } from '@/components/transcations/transaction-row';
import {
  TransactionTypeCounts,
  TransactionTypeFilter,
  TransactionTypeFilterBar,
} from '@/components/transcations/transaction-type-filter';
import { Colors } from '@/constants/colors';
import { useTransaction } from '@/hooks/transaction/use-transaction';
import type { Transaction } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionsScreen() {
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('all');

  const { transactions, loading, refreshing, error, hasMore, loadMore, refresh, meta } = useTransaction({
    type: typeFilter === 'all' ? undefined : typeFilter,
  });

  const fallbackTypeCounts = useMemo(() => getTransactionTypeCounts(transactions), [transactions]);
  const typeCounts = meta?.typeCounts ?? fallbackTypeCounts;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top', 'left', 'right']}>
      <HeaderShell transparent>
        <HeaderNav title="My Transactions" />
      </HeaderShell>

      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TransactionRow transaction={item} />}
        contentContainerClassName="px-5 pb-10"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <TransactionsHeader
            typeCounts={typeCounts}
            selectedFilter={typeFilter}
            onSelectFilter={setTypeFilter}
          />
        }
        ListEmptyComponent={
          <EmptyTransactionsState
            loading={loading}
            error={error}
            onRetry={refresh}
            filtered={typeFilter !== 'all'}
          />
        }
        ListFooterComponent={
          loading && transactions.length > 0 ? (
            <View className="py-4">
              <ActivityIndicator color={Colors.accent} />
            </View>
          ) : null
        }
        onEndReached={() => {
          if (hasMore && !loading) loadMore();
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.accent} />
        }
      />
    </SafeAreaView>
  );
}

function TransactionsHeader({
  typeCounts,
  selectedFilter,
  onSelectFilter,
}: {
  typeCounts: TransactionTypeCounts;
  selectedFilter: TransactionTypeFilter;
  onSelectFilter: (value: TransactionTypeFilter) => void;
}) {
  return (
    <View className="pt-2">
      <TransactionTypeFilterBar
        selected={selectedFilter}
        onSelect={onSelectFilter}
        counts={typeCounts}
      />
    </View>
  );
}

function EmptyTransactionsState({
  loading,
  error,
  onRetry,
  filtered,
}: {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  filtered: boolean;
}) {
  if (loading) {
    return (
      <View className="items-center rounded-[22px] border border-border bg-surface px-6 py-12">
        <ActivityIndicator color={Colors.accent} />
        <Text className="mt-3 text-[13px] font-semibold text-textSecondary">
          Loading transactions...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center rounded-[22px] border border-errorBorder bg-errorBackground px-6 py-10">
        <View className="mb-3 h-12 w-12 items-center justify-center rounded-[18px] bg-surface">
          <Ionicons name="alert-circle-outline" size={25} color={Colors.error} />
        </View>
        <Text className="text-center text-[14px] font-bold text-error">
          Failed to load transactions.
        </Text>
        <Pressable
          onPress={onRetry}
          className="mt-4 min-h-[40px] items-center justify-center rounded-[14px] bg-accent px-5 active:opacity-80"
        >
          <Text className="text-[13px] font-black text-textOnDark">Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="items-center rounded-[22px] border border-dashed border-border bg-surface px-6 py-12">
      <View className="mb-3 h-14 w-14 items-center justify-center rounded-[20px] bg-tag">
        <Ionicons name="receipt-outline" size={26} color={Colors.accent} />
      </View>

      <Text className="text-center text-[16px] font-black text-textPrimary">
        {filtered ? 'No transactions in this filter' : 'No transactions yet'}
      </Text>

      <Text className="mt-2 text-center text-[13px] leading-5 font-semibold text-textSecondary">
        {filtered
          ? 'Try another transaction type to see more activity.'
          : 'Your purchases, investments, and withdrawals will appear here.'}
      </Text>
    </View>
  );
}

function getTransactionTypeCounts(transactions: Transaction[]): TransactionTypeCounts {
  return transactions.reduce(
    (counts, transaction) => {
      if (transaction.type === 0) counts.purchase += 1;
      if (transaction.type === 1) counts.investment += 1;
      if (transaction.type === 2) counts.withdrawal += 1;

      counts.all += 1;
      return counts;
    },
    { all: 0, purchase: 0, investment: 0, withdrawal: 0 },
  );
}
