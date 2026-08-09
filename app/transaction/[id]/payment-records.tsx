import { HeaderNav, HeaderShell } from '@/components/header';
import { ErrorScreen } from '@/components/helper/error-project';
import { PaymentRecordsList } from '@/components/transcations/payment-record-list';
import { Colors } from '@/constants/colors';
import { usePaymentHistory } from '@/hooks/transaction/use-transaction';
import { Transaction } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function StatementSkeleton() {
  return (
    <View className="flex-1 items-center justify-center bg-background py-24">
      <ActivityIndicator size="small" color={Colors.accent} />
      <Text className="text-textMuted text-xs mt-3">Loading statement…</Text>
    </View>
  );
}

export default function PaymentRecordsScreen() {
  const { id, transaction: transactionParam } = useLocalSearchParams<{
    id: string;
    transaction?: string;
  }>();
  const transactionId = Number(id);

  const transaction: Transaction | undefined = transactionParam
    ? JSON.parse(transactionParam)
    : undefined;

  const { payments, summary, contract, loading, error, refresh, refreshing } = usePaymentHistory(transactionId);

  function renderContent() {
    if (loading) {
      return <StatementSkeleton/>
    }
  
    if (error) {
      return <ErrorScreen message='Unable to load Payment History.' onRetry={refresh}/>
    }
    if (!transaction) {
      return <ErrorScreen message='Transaction not found.' onRetry={refresh}/>
    }

    return (
      <PaymentRecordsList
        transaction={transaction}
        payments={payments}
        summary={summary}
        contract={contract}
        refreshing={refreshing}
        onRefresh={refresh}
      />
    )
  }

  return (
      <SafeAreaView
          style={[{ flex: 1, backgroundColor: Colors.surface }]}
          edges={['top', 'left', 'right']}>
          <HeaderShell transparent>
              <HeaderNav title='My Transactions'/>
          </HeaderShell>
  
          {renderContent()}
      </SafeAreaView>
      );
}
