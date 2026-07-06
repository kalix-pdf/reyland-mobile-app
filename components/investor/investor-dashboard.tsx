import { AuthScreen } from '@/components/auth/auth-screen';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Text,
  View
} from 'react-native';
export function InvestorDashboard() {

  return (
    <AuthScreen
      heroTitle={`Investor\nDesk`}
      scrollEnabled
    >

      <View className="rounded-[18px] border border-border bg-surfaceMuted p-4 mb-4">
        <View className="flex-row items-start gap-3">
          <View className="w-9 h-9 rounded-[18px] items-center justify-center bg-tag">
            <Ionicons name="bed-outline" size={30} color={Colors.accent} />
          </View>
          <View className="flex-1 min-w-0">
            <Text className="text-textPrimary text-lg font-black">APPROVED KA NA!</Text>
            <Text className="mt-1 text-textSecondary text-[13px] leading-[19px] font-semibold">
              Bukas na natin gawin ito.
            </Text>
          </View>

        </View>
        </View>


      <View className="rounded-[18px] border border-border bg-red-100 p-4 mb-4">
        <View className="flex-row items-start gap-3">
          <View className="w-9 h-9 rounded-[18px] items-center justify-center bg-red-50">
            <Ionicons name="book-outline" size={30} color={Colors.error} />
          </View>

          <View className="flex-1 min-w-0">
            <Text className="text-textPrimary text-lg font-black">MAGBAYAD NA KAYO SA THESIS!</Text>
            <Text className="mt-1 text-textSecondary text-[13px] leading-[19px] font-semibold">
              Wala nang pambayad sa print.
            </Text>
          </View>
      </View>
      </View>

    </AuthScreen>
  );
}
