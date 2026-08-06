import { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useTransaction } from '@/hooks/transaction/use-transaction';
import { TransactionRow } from '@/components/transcations/transaction-row';
import { TransactionTypeFilterBar, TransactionTypeFilter } from '@/components/transcations/transaction-type-filter';
import { HeaderNav, HeaderShell } from '@/components/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { ErrorScreen } from '@/components/helper/error-project';

export default function TransactionsScreen() {
  const [typeFilter, setTypeFilter] = useState<TransactionTypeFilter>('all');

  const { transactions, loading, refreshing, error, hasMore, loadMore, refresh } = useTransaction({
    type: typeFilter === 'all' ? undefined : typeFilter,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top', 'left', 'right']}>
      <HeaderShell transparent>
        <HeaderNav title="My Transactions" />
      </HeaderShell>

      <TransactionTypeFilterBar selected={typeFilter} onSelect={setTypeFilter} />

      {renderContent()}
    </SafeAreaView>
  );

  function renderContent() {
    if (loading && transactions.length === 0) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (error && transactions.length === 0) {
      return <ErrorScreen message="Failed to load Transactions" onRetry={refresh} />;
    }

    if (!loading && transactions.length === 0) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-textSecondary text-center">No transactions yet.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TransactionRow transaction={item} />}
        onEndReached={() => {
          if (hasMore) loadMore();
        }}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.accent} />}
        ListFooterComponent={loading && transactions.length > 0 ? <ActivityIndicator className="my-4" /> : null}
      />
    );
  }
}