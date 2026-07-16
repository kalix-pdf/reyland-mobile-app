import { HeaderNav, HeaderShell } from '@/components/header';
import { ErrorScreen } from '@/components/helper/error-project';
import { PaymentRecordsList } from '@/components/transcations/payment-record-list';
import { Colors } from '@/constants/colors';
import { usePaymentHistory } from '@/hooks/use-transaction';
import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentRecordsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const transactionId = Number(id);

  const { payments, summary, contract, loading, error, refresh, refreshing } = usePaymentHistory(transactionId);

  function renderContent() {
    if (loading || refreshing) {
      return (
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="large" color="#1F2937" />
        </View>
      );
    }
  
    if (error) {
      return <ErrorScreen message='Unable to load Payment History.' onRetry={refresh}/>
    }

    return <PaymentRecordsList payments={payments} summary={summary} contract={contract} />
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
