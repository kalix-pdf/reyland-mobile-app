import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useTransaction } from '@/hooks/use-transaction';
import { TransactionRow } from '@/components/transcations/transaction-row';
import { HeaderNav, HeaderShell } from '@/components/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { ErrorScreen } from '@/components/helper/error-project';

export default function TransactionsScreen() {
  const { transactions, loading, refreshing, error, hasMore, loadMore, refresh } = useTransaction();

  return (
    <SafeAreaView
        style={[{ flex: 1, backgroundColor: Colors.background }]}
        edges={['top', 'left', 'right']}>
        <HeaderShell transparent>
            <HeaderNav title='My Transactions'/>
        </HeaderShell>

        {renderContent()}
    </SafeAreaView>
    );

  function renderContent() {
    // Initial loading state (no data yet)
    if (loading && transactions.length === 0) {
        return (
        <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
        </View>
        );
    }

    // Error state
    if (error && transactions.length === 0) {
        return <ErrorScreen message='Failed to load Transactions' onRetry={refresh} />
    }

    // Empty state — fetch succeeded but no transactions
    if (!loading && transactions.length === 0) {
        return (
        <View className="flex-1 items-center justify-center px-6">
            <Text className="text-gray-500 text-center">
            No transactions yet.
            </Text>
        </View>
        );
    }
    // Data state
    return (
        <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TransactionRow transaction={item} />}
        onEndReached={() => {
            if (hasMore) loadMore();
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={Colors.accent} />
        }
        ListFooterComponent={
            loading && transactions.length > 0 ? (
            <ActivityIndicator className="my-4" />
            ) : null
        }
        />
    );
  }
}
