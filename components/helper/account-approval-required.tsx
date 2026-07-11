import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/auth-context';
import { getUserInfo } from '@/services/fetchData/user-info.api';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

type AccountApprovalRequiredProps = {
  message?: string;
};

export function AccountApprovalRequired({
  message,
}: AccountApprovalRequiredProps) {
  const { setUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const refreshedUser = await getUserInfo();
      if (refreshedUser.uuid) {
        setUser(refreshedUser);
      }
    } finally {
      setRefreshing(false);
    }
  }, [setUser]);

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="flex-grow justify-center px-6"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={Colors.accent}
          colors={[Colors.accent]}
        />
      }
    >
      <View className="self-center w-full max-w-[420px] items-center">

      <View className="items-center gap-5 mb-5">
        {/* Icon */}
        <View className="w-24 h-24 rounded-[30px] bg-tag items-center justify-center">
          <Ionicons
            name="shield-checkmark"
            size={54}
            color={Colors.accent}
          />
        </View>

        {/* Badge */}
        <View className="px-4 py-2 rounded-full bg-tag">
          <Text className="text-[11px] tracking-[1.2px] uppercase font-black text-accent">
            Pending Approval
          </Text>
        </View>
      </View>

        {/* Title */}
        <Text className="text-[30px] font-black text-textPrimary text-center">
          Were reviewing
        </Text>

        <Text className="text-[30px] font-black text-accent text-center">
          your account
        </Text>

        {/* Description */}
        <Text className="mt-5 text-[15px] leading-7 text-center font-medium text-textSecondary">
          {message ??
            'Your account has been submitted successfully. Our team is currently reviewing your information. Once approved, you will gain full access to browse projects, explore available properties, and submit reservation requests.'}
        </Text>
      </View>
    </ScrollView>
  );
}
